export const SET_PROFILE = "SET_PROFILE";
export const CREATE_PROFILE = "CREATE_PROFILE";
export const SET_PROFILE_PIC = "SET_PROFILE_PIC";
export const UPDATE_SPENDING_LIMITS = "UPDATE_SPENDING_LIMITS";
import axios from "axios";
import ENV from "../../env";
export const fetchProfile = () => {
  return async (dispatch, getState) => {
    
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    const response2 = await fetch(
      `https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/users/${userId}/profiles.json?auth=${token}`
    );
    if (!response2.ok) {
      throw new Error("Something went wrong in profile!");
    }

    let resData2 = await response2.json();

    let resData3;
    let profileKey;
    for (const key in resData2) {
      resData3 = resData2[key];
      profileKey = key;
    }
    console.log(resData3);
    dispatch({
      type: CREATE_PROFILE,
      profileData: {
        id: profileKey,
        bankAccount: resData3.bankAccount,
        salary: resData3.salary,
        email: resData3.email,
        userName: resData3.userName,
        profilePic: resData3.profilePic,
        birthday: resData3.birthday,
        spendingLimits:
          resData3.spendingLimits == "Infinity"
            ? Infinity
            : resData3.spendingLimits,
      },
    });
  };
};
export const updateSpendingLimits = (spendingLimits) => {
  return async (dispatch, getState) => {
    spendingLimits = parseInt(spendingLimits);
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const key = getState().deepProfile.id;
    const response = await fetch(
      `https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/users/${userId}/profiles/${key}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spendingLimits,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: UPDATE_SPENDING_LIMITS,
      spendingLimits,
    });
  };
};
export const getLimitExpensesPrediction = () => {
  return async (dispatch, getState) => {
    let bankAccounts = getState()
      .accounts.accounts.map((el) => el.amount)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    let salary = getState().deepProfile.salary;

    axios
      .post(`${ENV.REACT_APP_API_URL}/getAlertPrediction`, {
        bankAccounts,
        salary,
      })
      .then((res) => {
        dispatch({
          type: UPDATE_SPENDING_LIMITS,
          spendingLimits: res.data.predictionResult,
        });
      })
      .catch((err) => {
        console.log(err.message);
        return false;
      });
  };
};
export const updateProfilePicture = (imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const key = getState().deepProfile.id;
    const response = await fetch(
      `https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/users/${userId}/profiles/${key}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profilePic: imageUrl,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: SET_PROFILE_PIC,
      profilePic: imageUrl,
    });
  };
};
export const updateProfile = (salary, birthday) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const key = getState().deepProfile.id;
    const response = await fetch(
      `https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/users/${userId}/profiles/${key}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          salary: salary,
          birthday: birthday,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: SET_PROFILE,
      salary: salary,
      birthday,
    });
  };
};
