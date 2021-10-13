const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config({
path: "./config.env",
});
app.use(express.static("public"));
app.use(bodyParser.json());
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    }));
}
const connectDB = require("./helpers/db");
connectDB();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content- Type, Accept");
  next();
});


const mailRouter = require("./route/api/sendMail");
const getUserData=require("./route/api/getUserData");
const transactions = require("./route/api/transactions");
const getAlertPrediction = require("./route/api/getAlertPrediction");
// getUserData.updateFinanceData();

app.use("/api", getAlertPrediction);
app.use('/api',mailRouter);
app.use('/api', getUserData.router);
app.use("/api", transactions);
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`listening on port  ${PORT}`);
});