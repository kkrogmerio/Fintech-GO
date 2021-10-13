var express = require("express");
var router = express.Router();
var transactionsTimeline = { "11ap2021": 4000, "12ap2021": 6000 };
router.post("/sendTransactionMoment", (req, res) => {
  var { transactionMoment, amount } = req.body;
  console.log(transactionMoment, amount);
  if (transactionsTimeline[transactionMoment] == null)
    transactionsTimeline[transactionMoment] = parseInt(amount);
  else transactionsTimeline[transactionMoment] += parseInt(amount);
  return res.json({
    transacionsTimeline: transactionsTimeline,
    message: `Request executed successfully`,
  });
});
router.get("/fetchDailyTransactions", (req, res) => {
  return res.json({
    transactionsTimeline,
  });
});
module.exports = router;
