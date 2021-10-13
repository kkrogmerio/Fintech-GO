const express = require("express");
const router = express.Router();
const csv = require("csv-parser");
const fs = require("fs");
const tf = require("@tensorflow/tfjs");
const getModel = (inputUnit, inputShape, outputUnit) => {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      units: inputUnit,
      inputShape: [inputShape],
      activation: "sigmoid",
    })
  );
  model.add(
    tf.layers.dense({
      units: outputUnit,
    })
  );
  model.compile({
    loss: "meanSquaredError",
    optimizer: "sgd",
  });
  return model;
};
router.post("/getAlertPrediction", async (req, res) => {
  const { bankAccounts, salary } = req.body;

  let trainData = [];
  let trainResult = [];
  await fs
    .createReadStream("./helpers/reportingUsersData.csv")
    .pipe(csv())
    .on("data", (row) => {
      if (row.Succeeded == "YES") {
        trainData.push([parseInt(row.Bank_Accounts), parseInt(row.Salary)]);
        trainResult.push([parseInt(row.Daily_Expenses)]);
      }
    })
    .on("end", () => {
      console.log("CSV file successfully processed");
      const xs = tf.tensor2d(trainData);
      const ys = tf.tensor2d(trainResult);
      const model = getModel(
        trainData.length,
        2,
        1
      );
      model
        .fit(xs, ys, {
          epochs: 1000,
        })
        .then(() => {
          const dataToPredict = tf.tensor2d([[bankAccounts, salary]]);
          const prediction = model.predict(dataToPredict);
          prediction.print();
          let predictionResult = parseInt(prediction.dataSync());
          return res.json({ predictionResult });
        });
    });
});
module.exports = router;
