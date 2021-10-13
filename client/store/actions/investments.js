
export const SET_INVESTMENTS = "SET INVESTMENTS";

export const ADD_INVESTMENT = "ADD INVESTMENT";

export const fetchInvestments = () => {
  return async (dispatch, getState) => {

    const token = getState().auth.token;
    const userId = getState().auth.userId;

    try {
      const response = await fetch(
        `https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/users/${userId}/investments.json?auth=${token}`
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const loadedInvestments = [];

      for (const key in resData) {

        loadedInvestments.push({
          key,
          category: resData[key].category,
          amount: parseInt(resData[key].amount),
          shareValue: resData[key].shareValue,
        });

      }
      dispatch({
        type: SET_INVESTMENTS,
        investments: loadedInvestments,
      });
    } catch (err) {
      throw err;
    }
  };
};
export const addInvestment = (category, amount, shareValue) => {
  return async (dispatch, getState) => {
    amount = parseInt(amount);
    shareValue = parseInt(shareValue);
    console.log(
      "amount= ",
      amount,
      "category= ",
      category,
      "sharevalue= ",
      shareValue
    );
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    const accounts = getState().accounts.accounts;
  
    let affectedBank = null;

    for (var bankAccountIndex in accounts) {
      if (accounts[bankAccountIndex].amount > amount * shareValue) {
        affectedBank = accounts[bankAccountIndex];
        break;
      }
    }

    if (affectedBank == null) {

      throw new Error(
        "The amount is too big to be processed to any of the opened bank accounts"
      );
    }

    const remainedFundsBank =
      parseInt(affectedBank.amount) - amount * shareValue;
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
    var dateTime = new Date().toLocaleString();
    let sendDataToNode = dateTime.split(" ");
    let InvestmentMoment =
      sendDataToNode[0] +
      sendDataToNode[1] +
      sendDataToNode[2] +
      sendDataToNode[4];
    console.log(InvestmentMoment);
    const response = await fetch(
      `https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/users/${userId}/investments.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          amount,
          shareValue,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    const resData = await response.json();
    dispatch({
      type: ADD_INVESTMENT,
      investmentData: {
        id: resData.name,
        category,
        shareValue,
        amount,
      },
    });
  };
};
