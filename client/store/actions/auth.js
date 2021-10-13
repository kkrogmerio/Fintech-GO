import AsyncStorage from "@react-native-community/async-storage";
import * as Facebook from "expo-facebook";
import * as Google from "expo-google-app-auth";
import * as GoogleSignIn from "expo-google-sign-in";
import * as accountActions from "./accounts";
export const SET_PROFILE = "SET_PROFILE";
export const CREATE_PROFILE = "CREATE_PROFILE";
import ENV from "../../env";
import * as Firebase from "firebase";
import axios from "axios";
import { fetchProfile } from "./profile";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
export const SET_DID_TRY_AL = "SET_DID_TRY_AL";
export const UPDATE_EMAIL = "UPDATE_EMAIL";
export const UPDATE_PASSWORD = "UPDATE_PASSWORD";
const NULL = "NULL";
let timer;
export const setDidTryAL = () => {
  return { type: SET_DID_TRY_AL };
};
export const authenticate = (userId, token, expiryTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

export const verifyMail = (email, token) => {
  return axios
    .post(`${ENV.REACT_APP_API_URL}/mailVerif`, { token, email })
    .then((res) => {
      return true;
    })
    .catch((err) => {
      return false;
    });
};
export const changeMail = (email) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.token;

    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDKDyRvJa4zncRbMWQaPtYHkVik6uIHKCc",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: userId,
          email: email,
        }),
      }
    );
    if (!response.ok) {
      const errorResData = await response.json();
      const message = errorResData.error.message;

      throw new Error(message);
    }
    dispatch({
      type: UPDATE_EMAIL,
      email: email,
    });
  };
};
export const changePassword = (password) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.token;
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDKDyRvJa4zncRbMWQaPtYHkVik6uIHKCc",
     
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: userId,
          password: password,
        }),
      }
    );
    if (!response.ok) {
      const errorResData = await response.json();
      const message = errorResData.error.message;

      throw new Error(message);
    }
    dispatch({ type: NULL });
  };
};

export const sendMail = async (mail, forRegister) => {
  var isTaken;
  if (forRegister == true) {
    await Firebase.auth()
      .fetchSignInMethodsForEmail(mail)
      .then((providers) => {
        isTaken = providers[0];

      })
      .catch((err) => {
        console.log(err);
      });
    if (isTaken) {
      console.log("brrrrrr");
      throw new Error("This email is taken");
    }
  }
  let mymail = mail;
  axios
    .post(`${ENV.REACT_APP_API_URL}/sendMail`, { mymail })
    .then((res) => {
      return true;
    })
    .catch((err) => {
      throw err;
    });
};

export const recoverPassword = async (email) => {
  const response = await fetch(
    "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDKDyRvJa4zncRbMWQaPtYHkVik6uIHKCc",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        requestType: "PASSWORD_RESET",
      }),
    }
  );
  if (!response.ok) {
    const errorResData = await response.json();
    const message = errorResData.error.message;

    throw new Error(message);
  }
  return true;
};
export const resetPassword = async (newPassword, oobCode) => {
  const response = await fetch(
    "https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=AIzaSyDKDyRvJa4zncRbMWQaPtYHkVik6uIHKCc",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPassword: newPassword,
        oobCode: oobCode,
      }),
    }
  );
  if (!response.ok) {
    const errorResData = await response.json();
    const message = errorResData.error.message;

    throw new Error(message);
  }
  return true;
};

export const fbLogin = () => {
  return async (dispatch) => {
    try {
      await Facebook.initializeAsync({
        appId: "845294616345396",
      });
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"],
      });

      if (type === "success") {
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture,email`
        );
        const fbData = await response.json();
        try {
          await dispatch(
            signup(
              fbData.email,
              fbData.name + fbData.id,
              fbData.name,
              fbData.picture.data.url,
              null
            )
          );
        } catch (err) {
          console.log(err.message);
          await dispatch(login(fbData.email, fbData.name + fbData.id));
        }
      } else {
        console.log("login failed");
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };
};
export const googleLogin = () => {
  return async (dispatch) => {
    await GoogleSignIn.initAsync({
      androidClientId: `897191747084-ke9dbffoasaqs2est8dv5jhl69g9uf0s.apps.googleusercontent.com`,
      androidStandaloneAppClientId: `897191747084-ke9dbffoasaqs2est8dv5jhl69g9uf0s.apps.googleusercontent.com`,
    });
    // const { type, accessToken, user } = await Google.logInAsync({
    //   androidClientId: `897191747084-ke9dbffoasaqs2est8dv5jhl69g9uf0s.apps.googleusercontent.com`,
    //   androidStandaloneAppClientId: `897191747084-ke9dbffoasaqs2est8dv5jhl69g9uf0s.apps.googleusercontent.com`,
    // });
    await GoogleSignIn.askForPlayServicesAsync();
    const { type, user } = await GoogleSignIn.signInAsync();
    if (type === "success") {
      try {
        await dispatch(
          signup(
            user.email,
            "R1a" + user.name + user.id,
            user.name,
            user.photoUrl,
            null
          )
        );
      } catch {
        await dispatch(login(user.email, "R1a" + user.name + user.id));
      }
    } else {
      console.log("login failed");
    }
  };
};

export const signup = (email, password, userName, profilePic, birthday) => {
  let salary = Math.floor(Math.random() * 10000) + 1000;
  let bankAccount = Math.floor(Math.random() * 1000000) + 100000;
  return async (dispatch) => {
    let message;
    if (
      !(
        /[a-z]+/.test(password) &&
        /[A-Z]+/.test(password) &&
        /\d+/.test(password) &&
        password.length >= 8
      )
    ) {
      message =
        "Your password needs Upper and lower case letters, numbers and a minimum 8 chars";
      throw new Error(message);
    }
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDKDyRvJa4zncRbMWQaPtYHkVik6uIHKCc",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );
    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      message = "Something went wrong!";
      if (errorId === "EMAIL_EXISTS") {
        message = "This email exists already!";
      }
      throw new Error(errorId);
    }
    const resData = await response.json();
    dispatch({
      type: CREATE_PROFILE,
      profileData: {
        email: email,
        salary: salary,
        bankAccount: bankAccount,
        name: userName,
        profilePic: profilePic,
        birthday: birthday,
        spendingLimits: "Infinity",
      },
    });

    const response2 = await fetch(
      `https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/users/${resData.localId}/profiles.json?auth=${resData.idToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          salary: salary,
          bankAccount: bankAccount,
          userName: userName ? userName : "",
          profilePic: profilePic ? profilePic : "",
          birthday: birthday ? birthday : "",
          spendingLimits: "Infinity",
        }),
      }
    );
    if (!response2.ok) {
      throw new Error("Something went wrong in profile!");
    }
        dispatch(
          authenticate(
            resData.localId,
            resData.idToken,
            parseInt(resData.expiresIn) * 1000
          )
        );
        const expirationDate = new Date(
          new Date().getTime() + parseInt(resData.expiresIn) * 1000
        );
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    dispatch(accountActions.openFirstAccount("BCR", bankAccount));
  };
};


export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDKDyRvJa4zncRbMWQaPtYHkVik6uIHKCc",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = "Something went wrong!";
      if (errorId === "EMAIL_NOT_FOUND") {
        message = "This email could not be found!";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "This password is not valid!";
      }
      throw new Error(message);
    }
    const resData = await response.json();
    dispatch(fetchProfile());
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};
