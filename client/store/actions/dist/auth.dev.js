"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logout = exports.login = exports.signup = exports.googleLogin = exports.fbLogin = exports.resetPassword = exports.recoverPassword = exports.sendMail = exports.verifyMail = exports.lrg = exports.authenticate = exports.setDidTryAL = exports.SET_DID_TRY_AL = exports.LOGOUT = exports.AUTHENTICATE = exports.CREATE_PROFILE = exports.SET_PROFILE = void 0;

var _asyncStorage = _interopRequireDefault(require("@react-native-community/async-storage"));

var Facebook = _interopRequireWildcard(require("expo-facebook"));

var Google = _interopRequireWildcard(require("expo-google-app-auth"));

var _env = _interopRequireDefault(require("../../env"));

var Firebase = _interopRequireWildcard(require("firebase"));

var _axios = _interopRequireDefault(require("axios"));

var _profile = require("./profile");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var SET_PROFILE = "SET_PROFILE";
exports.SET_PROFILE = SET_PROFILE;
var CREATE_PROFILE = "CREATE_PROFILE";
exports.CREATE_PROFILE = CREATE_PROFILE;
var AUTHENTICATE = "AUTHENTICATE";
exports.AUTHENTICATE = AUTHENTICATE;
var LOGOUT = "LOGOUT";
exports.LOGOUT = LOGOUT;
var SET_DID_TRY_AL = "SET_DID_TRY_AL";
exports.SET_DID_TRY_AL = SET_DID_TRY_AL;
var timer;

var setDidTryAL = function setDidTryAL() {
  return {
    type: SET_DID_TRY_AL
  };
};

exports.setDidTryAL = setDidTryAL;

var authenticate = function authenticate(userId, token, expiryTime) {
  return function (dispatch) {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({
      type: AUTHENTICATE,
      userId: userId,
      token: token
    });
  };
};

exports.authenticate = authenticate;

var lrg = function lrg() {
  dispatch({
    TYPE: CREATE_PROFILE
  });
};

exports.lrg = lrg;

function generatePassword() {
  var length = 6,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "B1a";

  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }

  return retVal;
}

var verifyMail = function verifyMail(token, email) {
  return _axios["default"].post("".concat(_env["default"].REACT_APP_API_URL, "/mailVerif"), {
    token: token,
    email: email
  }).then(function (res) {
    return true;
  })["catch"](function (err) {
    return false;
  });
};

exports.verifyMail = verifyMail;

var sendMail = function sendMail(mail) {
  var isTaken, mymail;
  return regeneratorRuntime.async(function sendMail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(mail);
          _context.next = 3;
          return regeneratorRuntime.awrap(Firebase.auth().fetchSignInMethodsForEmail(mail).then(function (providers) {
            isTaken = providers[0];
            console.log('brrrr');
          })["catch"](function (err) {
            console.log(err);
          }));

        case 3:
          if (!isTaken) {
            _context.next = 6;
            break;
          }

          console.log('brrrrrr');
          throw new Error("This email is taken");

        case 6:
          mymail = mail;

          _axios["default"].post("".concat(_env["default"].REACT_APP_API_URL, "/sendMail"), {
            mymail: mymail
          }).then(function (res) {
            return true;
          })["catch"](function (err) {
            throw err;
          });

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.sendMail = sendMail;

var recoverPassword = function recoverPassword(email) {
  var response, errorResData, message;
  return regeneratorRuntime.async(function recoverPassword$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log('sakfkkfaskfaso');
          _context2.next = 3;
          return regeneratorRuntime.awrap(fetch("https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDikkGDxRDmTEhxO9xOnLhroq1-_2nuDV4", // "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDikkGDxRDmTEhxO9xOnLhroq1-_2nuDV4",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: email,
              requestType: "PASSWORD_RESET"
            })
          }));

        case 3:
          response = _context2.sent;

          if (response.ok) {
            _context2.next = 10;
            break;
          }

          _context2.next = 7;
          return regeneratorRuntime.awrap(response.json());

        case 7:
          errorResData = _context2.sent;
          message = errorResData.error.message;
          throw new Error(message);

        case 10:
          return _context2.abrupt("return", true);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.recoverPassword = recoverPassword;

var resetPassword = function resetPassword(newPassword, oobCode) {
  var response, errorResData, message;
  return regeneratorRuntime.async(function resetPassword$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(fetch("https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=AIzaSyDikkGDxRDmTEhxO9xOnLhroq1-_2nuDV4", // "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDikkGDxRDmTEhxO9xOnLhroq1-_2nuDV4",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              newPassword: newPassword,
              oobCode: oobCode
            })
          }));

        case 2:
          response = _context3.sent;

          if (response.ok) {
            _context3.next = 9;
            break;
          }

          _context3.next = 6;
          return regeneratorRuntime.awrap(response.json());

        case 6:
          errorResData = _context3.sent;
          message = errorResData.error.message;
          throw new Error(message);

        case 9:
          return _context3.abrupt("return", true);

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.resetPassword = resetPassword;

var fbLogin = function fbLogin() {
  return function _callee(dispatch) {
    var _ref, type, token, response, fbData, message;

    return regeneratorRuntime.async(function _callee$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log("intrusi");
            _context4.prev = 1;
            _context4.next = 4;
            return regeneratorRuntime.awrap(Facebook.initializeAsync({
              appId: "439842100676848"
            }));

          case 4:
            _context4.next = 6;
            return regeneratorRuntime.awrap(Facebook.logInWithReadPermissionsAsync({
              permissions: ["public_profile", "email"]
            }));

          case 6:
            _ref = _context4.sent;
            type = _ref.type;
            token = _ref.token;

            if (!(type === "success")) {
              _context4.next = 30;
              break;
            }

            _context4.next = 12;
            return regeneratorRuntime.awrap(fetch("https://graph.facebook.com/me?access_token=".concat(token, "&fields=id,name,picture,email")));

          case 12:
            response = _context4.sent;
            _context4.next = 15;
            return regeneratorRuntime.awrap(response.json());

          case 15:
            fbData = _context4.sent;
            console.log(fbData.picture.data.url);
            _context4.prev = 17;
            console.log('REGISTERRRRRRRRRRRRRRRRRRR');
            _context4.next = 21;
            return regeneratorRuntime.awrap(dispatch(signup(fbData.email, fbData.name + fbData.id, fbData.name, fbData.picture.data.url, null)));

          case 21:
            _context4.next = 28;
            break;

          case 23:
            _context4.prev = 23;
            _context4.t0 = _context4["catch"](17);
            console.log("LOGINNNNNNNNNNNNNNNNNNNNNNNNN");
            _context4.next = 28;
            return regeneratorRuntime.awrap(dispatch(login(fbData.email, fbData.name + fbData.id)));

          case 28:
            _context4.next = 31;
            break;

          case 30:
            console.log("login failed");

          case 31:
            _context4.next = 37;
            break;

          case 33:
            _context4.prev = 33;
            _context4.t1 = _context4["catch"](1);
            message = _context4.t1.message;
            alert("Facebook Login Error: ".concat(message));

          case 37:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[1, 33], [17, 23]]);
  };
};

exports.fbLogin = fbLogin;

var googleLogin = function googleLogin() {
  return function _callee2(dispatch) {
    var _ref3, type, accessToken, user;

    return regeneratorRuntime.async(function _callee2$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return regeneratorRuntime.awrap(Google.logInAsync({
              androidClientId: "449524956246-nv29ncvdq171ngjadcg2fv1qgmq9u329.apps.googleusercontent.com" // androidStandaloneAppClientId: `449524956246-a0ttsnvrj60put90nmdkepse040u7am7.apps.googleusercontent.com`,

            }));

          case 2:
            _ref3 = _context5.sent;
            type = _ref3.type;
            accessToken = _ref3.accessToken;
            user = _ref3.user;

            if (!(type === "success")) {
              _context5.next = 19;
              break;
            }

            // Then you can use the Google REST API
            // console.log(user);
            console.log("GOOOOOOOGLE" + JSON.stringify(user));
            _context5.prev = 8;
            _context5.next = 11;
            return regeneratorRuntime.awrap(dispatch(signup(user.email, "R1a" + user.name + user.id, user.name, user.photoUrl, null)));

          case 11:
            _context5.next = 17;
            break;

          case 13:
            _context5.prev = 13;
            _context5.t0 = _context5["catch"](8);
            _context5.next = 17;
            return regeneratorRuntime.awrap(dispatch(login(user.email, "R1a" + user.name + user.id)));

          case 17:
            _context5.next = 20;
            break;

          case 19:
            console.log("login failed");

          case 20:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[8, 13]]);
  };
};

exports.googleLogin = googleLogin;

var signup = function signup(email, password, userName, profilePic, birthday) {
  console.log("dialogsaas");
  return function _callee3(dispatch) {
    var message, response, errorResData, errorId, resData, response2, resData2, expirationDate;
    return regeneratorRuntime.async(function _callee3$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            console.log("registerrrrr");

            if (/[a-z]+/.test(password) && /[A-Z]+/.test(password) && /\d+/.test(password) && password.length >= 8) {
              _context6.next = 4;
              break;
            }

            message = "Your password needs Upper and lower case letters, numbers and a minimum 8 chars";
            throw new Error(message);

          case 4:
            _context6.next = 6;
            return regeneratorRuntime.awrap(fetch("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDikkGDxRDmTEhxO9xOnLhroq1-_2nuDV4", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
              })
            }));

          case 6:
            response = _context6.sent;

            if (response.ok) {
              _context6.next = 15;
              break;
            }

            _context6.next = 10;
            return regeneratorRuntime.awrap(response.json());

          case 10:
            errorResData = _context6.sent;
            errorId = errorResData.error.message;
            message = "Something went wrong!";

            if (errorId === "EMAIL_EXISTS") {
              message = "This email exists already!";
            }

            throw new Error(message);

          case 15:
            console.log("is finished");
            _context6.next = 18;
            return regeneratorRuntime.awrap(response.json());

          case 18:
            resData = _context6.sent;
            _context6.next = 21;
            return regeneratorRuntime.awrap(fetch("https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/profiles/".concat(resData.localId, ".json?auth=").concat(resData.idToken), {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                userName: userName ? userName : "",
                profilePic: profilePic ? profilePic : "",
                birthday: birthday ? birthday : ""
              })
            }));

          case 21:
            response2 = _context6.sent;

            if (response2.ok) {
              _context6.next = 24;
              break;
            }

            throw new Error("Something went wrong in profile!");

          case 24:
            _context6.next = 26;
            return regeneratorRuntime.awrap(response2.json());

          case 26:
            resData2 = _context6.sent;
            dispatch({
              type: CREATE_PROFILE,
              profileData: {
                name: userName,
                profilePic: profilePic,
                birthday: birthday
              }
            });
            dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000));
            console.log("elodiaaaaaaaaaaaaaaa");
            expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
            saveDataToStorage(resData.idToken, resData.localId, expirationDate);

          case 32:
          case "end":
            return _context6.stop();
        }
      }
    });
  };
}; // export const fbLogin = () => {
//   console.log('miezureeeee')
//     console.log('intruaaauu')
//     await Facebook.initializeAsync("439842100676848");
//     const { type, token } = await Facebook.logInWithReadPermissionsAsync({
//       permissions: ["public_profile"],
//     });
//     if (type === "success") {
//       // Build Firebase credential with the Facebook access token.
//       const credential = firebase.auth.FacebookAuthProvider.credential(token);
//       console.log(credential);
//       // Sign in with credential from the Facebook user.
//       firebase
//         .auth()
//         .signInWithCredential(credential)
//         .catch((error) => {
//           // Handle Errors here.
//         });
//     }
//   };


exports.signup = signup;

var login = function login(email, password) {
  return function _callee4(dispatch) {
    var response, errorResData, errorId, message, resData, expirationDate;
    return regeneratorRuntime.async(function _callee4$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return regeneratorRuntime.awrap(fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDikkGDxRDmTEhxO9xOnLhroq1-_2nuDV4", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
              })
            }));

          case 2:
            response = _context7.sent;

            if (response.ok) {
              _context7.next = 11;
              break;
            }

            _context7.next = 6;
            return regeneratorRuntime.awrap(response.json());

          case 6:
            errorResData = _context7.sent;
            errorId = errorResData.error.message;
            message = "Something went wrong!";

            if (errorId === "EMAIL_NOT_FOUND") {
              message = "This email could not be found!";
            } else if (errorId === "INVALID_PASSWORD") {
              message = "This password is not valid!";
            }

            throw new Error(message);

          case 11:
            _context7.next = 13;
            return regeneratorRuntime.awrap(response.json());

          case 13:
            resData = _context7.sent;
            console.log('RRRRRRRRRRRRRRRRRRRR');
            dispatch((0, _profile.fetchProfile)());
            expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
            saveDataToStorage(resData.idToken, resData.localId, expirationDate);
            dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000));

          case 19:
          case "end":
            return _context7.stop();
        }
      }
    });
  };
};

exports.login = login;

var logout = function logout() {
  clearLogoutTimer();

  _asyncStorage["default"].removeItem("userData");

  return {
    type: LOGOUT
  };
};

exports.logout = logout;

var clearLogoutTimer = function clearLogoutTimer() {
  if (timer) {
    clearTimeout(timer);
  }
};

var setLogoutTimer = function setLogoutTimer(expirationTime) {
  return function (dispatch) {
    timer = setTimeout(function () {
      dispatch(logout());
    }, expirationTime);
  };
};

var saveDataToStorage = function saveDataToStorage(token, userId, expirationDate) {
  _asyncStorage["default"].setItem("userData", JSON.stringify({
    token: token,
    userId: userId,
    expiryDate: expirationDate.toISOString()
  }));
};