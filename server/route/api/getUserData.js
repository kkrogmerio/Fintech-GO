const express = require("express");
const router = express.Router();
const FinanceData = require("../../models/mockFinanceData");
const axios = require("axios");
router.get("/getUserData", (req, res) => {
  let salary = Math.floor(Math.random() * (10000 - 1000)) + 1000;
  let bankAccount = Math.floor(Math.random() * (1000000 - 100000)) + 100000;
  res.json({
    salary,
    bankAccount,
    bank: "BCR",
  });
});
function newStockValue2(lastValue) {
  var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
  return (
    lastValue +
    Math.floor((lastValue * Math.floor(Math.random() * 10) * plusOrMinus) / 100)
  );
}

newStockValue=async() => {
  let response = await axios.get(
    "http://feeds.financialcontent.com/JSQuote?Ticker=AAMC"
  );
  responseString = JSON.stringify(response.data);
  delimitedResponse = responseString
    .substr(responseString.indexOf("Last"))
    .substr(6);

  var realEstateValue = delimitedResponse.substr(
    0,
    delimitedResponse.indexOf(",")
  );
  response = await axios.get(
    "https://feeds.financialcontent.com/JSQuote?Ticker=COIN"
  );

  responseString = JSON.stringify(response.data);
  delimitedResponse = responseString
    .substr(responseString.indexOf("Last"))
    .substr(6);
  var cryptoValue = delimitedResponse.substr(0, delimitedResponse.indexOf(","));
  // return parseFloat(parseFloat(stockValue).toFixed(2));
   response = await axios.get(
     "http://feeds.financialcontent.com/JSQuote?Ticker=GOOG");
  responseString = JSON.stringify(response.data);
  delimitedResponse = responseString
    .substr(responseString.indexOf("Last"))
    .substr(6);
  var stockValue = delimitedResponse.substr(0, delimitedResponse.indexOf(","));
    // console.log(realEstateValue,cryptoValue,stockValue);
    return [
      parseFloat(parseFloat(realEstateValue).toFixed(2)),
      parseFloat(parseFloat(cryptoValue).toFixed(2)),
      parseFloat(parseFloat(stockValue).toFixed(2)),
    ];
  
};
function updateFinanceData() {
  setInterval(async()=> {
    let fetchedDataValues=await newStockValue();
    // console.log(fetchedDataValues[0],fetchedDataValues[1],fetchedDataValues[2]);
    FinanceData.findOne({
      category: "Real Estate",
    }).exec((err, portfolio) => {
      if (portfolio) {
        portfolio.variations.push(fetchedDataValues[0]);
        portfolio.save((err, user) => {
          if (err) {
            console.log(err);
          }
        });
        console.log(portfolio.variations);
      } else {
        portfolio = new FinanceData({
          category: "Real Estate",
          variations: fetchedDataValues[0],
        });
        portfolio.save();
      }
    });
    FinanceData.findOne({
      category: "Crypto",
    }).exec((err, portfolio) => {
      if (portfolio) {
        portfolio.variations.push(fetchedDataValues[1]);
        console.log(portfolio.variations);
        portfolio.save((err, user) => {
          if (err) {
            console.log(err);
          }
        });
      } else {
        portfolio = new FinanceData({
          category: "Crypto",
          variations: fetchedDataValues[1],
        });
        console.log(portfolio.variations);
        portfolio.save();
      }
    });
    FinanceData.findOne({
      category: "Stocks",
    }).exec((err, portfolio) => {
      if (portfolio) {
        portfolio.variations.push(
          fetchedDataValues[2]
        );
        console.log(portfolio.variations);
        portfolio.save((err, user) => {
          if (err) {
            console.log(err);
          }
        });
      } else {
        portfolio = new FinanceData({
          category: "Stocks",
          variations: fetchedDataValues[2],
        });
        portfolio.save();
      }
    });
  }, 300100);
}
const numOfShares = (category, investments) => {
  let foundInvestments = investments.filter((ie) => ie.title === category);

  if (foundInvestments == undefined) return 0;
  else {
    return foundInvestments
      .map((ie) => ie.amount)
      .reduce((acc, cval) => acc + cval, 0);
  }
};
router.post("/convertToPortfolioData", (req, res) => {
    console.log("RRRRRRRRRR");
  let { investments } = req.body;
  console.log(investments);

  let realEstate;
  let crypto;
  let stocks;
  FinanceData.findOne({
    category: "Crypto",
  }).exec((err, portfolio) => {
    if (portfolio) {
      portfolio.totalShares = numOfShares("Crypto", investments);
      portfolio.totalInvestments = investments
        .filter((ie) => ie.title === "Crypto")
        .map((ie) => ie.amount * ie.shareValue)
        .reduce((acc, cval) => acc + cval, 0);
      console.log(portfolio.variations);
      console.log("REEEEEEEEEE");
      crypto = {
        variations: portfolio.variations,
        category: portfolio.category,
        totalShares: portfolio.totalShares,
        totalInvestments: portfolio.totalInvestments,
        currentValue: portfolio.variations[portfolio.variations.length - 1],
      };
      FinanceData.findOne({
        category: "Real Estate",
      }).exec((err, portfolio) => {
        if (portfolio) {
          portfolio.totalShares = numOfShares("Real Estate", investments);
          portfolio.totalInvestments = investments
            .filter((ie) => ie.title === "Real Estate")
            .map((ie) => ie.amount * ie.shareValue)
            .reduce((acc, cval) => acc + cval, 0);

          realEstate = {
            variations: portfolio.variations,
            category: portfolio.category,
            totalInvestments: portfolio.totalInvestments,
            totalShares: portfolio.totalShares,
            currentValue: portfolio.variations[portfolio.variations.length - 1],
          };
          FinanceData.findOne({
            category: "Stocks",
          }).exec((err, portfolio) => {
            if (portfolio) {
              portfolio.totalShares = numOfShares("Stocks", investments);
              portfolio.totalInvestments = investments
                .filter((ie) => ie.title === "Stocks")
                .map((ie) => ie.amount * ie.shareValue)
                .reduce((acc, cval) => acc + cval, 0);
              stocks = {
                variations: portfolio.variations,
                category: portfolio.category,
                totalInvestments: portfolio.totalInvestments,
                totalShares: portfolio.totalShares,
                currentValue:
                  portfolio.variations[portfolio.variations.length - 1],
              };

              let currentFundsValue = [realEstate, crypto, stocks];
              let mockTypeInvestments = [
                {
                  name: currentFundsValue[0].category,
                  volume: currentFundsValue[0].totalShares,
                  color: "#ff8711",
                  legendFontColor: "white",
                  legendFontSize: 15,
                },

                {
                  name: currentFundsValue[1].category,
                  volume: currentFundsValue[1].totalShares,
                  color: "#ffd38d",
                  legendFontColor: "white",
                  legendFontSize: 15,
                },
                {
                  name: currentFundsValue[2].category,
                  volume: currentFundsValue[2].totalShares,
                  color: "#9ed764",
                  legendFontColor: "white",
                  legendFontSize: 15,
                },
              ];
              return res.json({
                mockTypeInvestments,
                investmentsData: currentFundsValue,
              });
            }
          });
        }
      });
    }
  });
});
module.exports = { router, updateFinanceData };
