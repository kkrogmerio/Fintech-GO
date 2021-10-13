import Transaction from "../../models/transaction";
export const SET_TRANSACTIONS = "SET TRANSACTIONS";
export const SET_TRANSACTIONS_TIMELINE = "SET_TRANSACTIONS_TIMELINE";
export const ADD_TRANSACTION = "ADD TRANSACTION";

export const fetchTransactions = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    try {
      const response = await fetch(
        `https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/users/${userId}/transactions.json?auth=${token}`
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const loadedTransactions = [];
      const loadedTransactionsMoment = {};
      for (const key in resData) {
        if (loadedTransactionsMoment[resData[key].transactionMoment] == null)
          loadedTransactionsMoment[resData[key].transactionMoment] = parseInt(
            resData[key].amount
          );
        else
          loadedTransactionsMoment[resData[key].transactionMoment] += parseInt(
            resData[key].amount
          );
        loadedTransactions.push(
          new Transaction(
            key,
            resData[key].title,
            parseInt(resData[key].amount),
            resData[key].dateTime,
            resData[key].transactionMoment
          )
        );
      }

      dispatch({
        type: SET_TRANSACTIONS_TIMELINE,
        transactionsTimeline: loadedTransactionsMoment,
      });
      dispatch({
        type: SET_TRANSACTIONS,
        transactions: loadedTransactions,
      });
    } catch (err) {
      throw err;
    }
  };
};
export const addTransaction = (title, amount) => {
  return async (dispatch, getState) => {
    amount = parseInt(amount);
    var dateTime = new Date().toLocaleString();
    let sendDataToNode = dateTime.split(" ");
    let transactionMoment =
      sendDataToNode[0] +
      sendDataToNode[1] +
      sendDataToNode[2] +
      sendDataToNode[4];
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    const accounts = getState().accounts.accounts;
    const dailyMaximum = getState().deepProfile.spendingLimits;
    const totalDailyTransactions = getState()
      .transactions.transactions.filter(
        (ie) => ie.transactionMoment === transactionMoment
      )
      .map((ie) => ie.amount)
      .reduce((acc, cv) => acc + cv, 0);
    if (totalDailyTransactions + amount > dailyMaximum)
      throw new Error(
        "The transaction could not occur because would exceed your daily spending limit"
      );
    let affectedBank = null;

    for (var bankAccountIndex in accounts) {
      console.log(accounts[bankAccountIndex], amount);
      if (accounts[bankAccountIndex].amount > amount) {
        affectedBank = accounts[bankAccountIndex];
        break;
      }
    }
    if (affectedBank == null) {
      throw new Error(
        "The amount is too big to be processed to any of the opened bank accounts"
      );
    }
    const remainedFundsBank = parseInt(affectedBank.amount) - amount;
    await fetch(
      `https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/users/${userId}/accounts/${affectedBank.id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: remainedFundsBank,
        }),
      }
    );

    console.log(transactionMoment);
    const response = await fetch(
      `https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/users/${userId}/transactions.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          amount,
          dateTime,
          transactionMoment,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.json();
    dispatch({
      type: ADD_TRANSACTION,
      transactionData: {
        id: resData.name,
        title,
        amount,
        dateTime,
        transactionMoment,
      },
    });
  };
};
