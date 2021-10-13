import Account from "../../models/account";
export const DELETE_ACCOUNT = "DELETE_ACCOUNT";
export const CREATE_ACCOUNT = "CREATE_ACCOUNT";
export const UPDATE_ACCOUNT = "UPDATE_ACCOUNT";
export const SET_ACCOUNTS = "SET_ACCOUNTS";
export const OPEN_FIRST_ACCOUNT = "OPEN_FIRST_ACCOUNT";
import { mainBankName } from "../../env";
export const fetchAccounts = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    try {
      const response = await fetch(
        `https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/users/${userId}/accounts.json?auth=${token}`
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const loadedAccounts = [];

      for (const key in resData) {
        loadedAccounts.push(
          new Account(key, resData[key].bank, resData[key].amount)
        );
      }

      dispatch({
        type: SET_ACCOUNTS,
        accounts: loadedAccounts,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteAccount = (accountId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const userId = getState().auth.userId;
    const response = await fetch(
      `https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/users/${userId}/accounts/${accountId}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    dispatch({ type: DELETE_ACCOUNT, pid: accountId });
  };
};
export const openFirstAccount = (bank, amount) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/users/${userId}/accounts.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bank: bank,
          amount: amount,
        }),
      }
    );
    if (!response.ok) {
      console.log(response.toString());
      throw new Error("Something went wrong!");
    }
    const resData = await response.json();
    dispatch({
      type: OPEN_FIRST_ACCOUNT,
      accountData: {
        id: resData.name,
        bank,
        amount,
      },
    });
  };
};
export const addAccount = (bank, amount) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    const mainBank = getState().accounts.accounts.find(
      (account) => account.bank === mainBankName
    );
    if (mainBank.amount < amount)
      throw new Error("Insufficient funds in your main bank account");
    const response = await fetch(
      `https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/users/${userId}/accounts.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bank: bank,
          amount: amount,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    const resData = await response.json();
    const remainedFundsMainBank = parseInt(mainBank.amount) - parseInt(amount);
    const updateMainBankAcc = await fetch(
      `https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/users/${userId}/accounts/${mainBank.id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: remainedFundsMainBank,
        }),
      }
    );
    if (!updateMainBankAcc.ok) {
      throw new Error("Something went wrong!");
    }
    dispatch({
      type: CREATE_ACCOUNT,
      accountData: {
        id: resData.name,
        bank,
        amount,
      },
    });
  };
};

export const updateAccount = (id, amount) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const targetBank = getState().accounts.accounts.find(
      (account) => account.id === id
    );
    const mainBank = getState().accounts.accounts.find(
      (account) => account.bank === "BCR"
    );
    if (mainBank.amount < amount)
      throw new Error("Insufficient funds in your main bank account");
    if (amount < 0 && Math.abs(amount) > targetBank.amount)
      throw new Error("Insufficient funds to withdraw");
    
    const newAmount = parseInt(targetBank.amount) + parseInt(amount);
    const response = await fetch(
      `https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/users/${userId}/accounts/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: newAmount,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const remainedFundsMainBank = mainBank.amount - parseInt(amount);
    const updateMainBankAcc = await fetch(
      `https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/users/${userId}/accounts/${mainBank.id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: remainedFundsMainBank,
        }),
      }
    );
    if (!updateMainBankAcc.ok) {
      throw new Error("Something went wrong!");
    }
    dispatch({
      type: UPDATE_ACCOUNT,
      id: id,
      amount: amount,
    });
  };
};
