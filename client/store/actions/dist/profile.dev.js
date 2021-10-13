"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchProfile = exports.CREATE_PROFILE = exports.SET_PROFILE = void 0;
var SET_PROFILE = "SET_PROFILE";
exports.SET_PROFILE = SET_PROFILE;
var CREATE_PROFILE = "CREATE_PROFILE";
exports.CREATE_PROFILE = CREATE_PROFILE;

var fetchProfile = function fetchProfile() {
  return function _callee(dispatch, getState) {
    var userId, response2, resData2, resData3, key;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("INTRU BAAAAAAAAAAAAAAAAAAAAA FETCHHHHH");
            userId = getState().auth.userId;
            _context.next = 4;
            return regeneratorRuntime.awrap(fetch("https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/profiles/".concat(userId, ".json")));

          case 4:
            response2 = _context.sent;
            console.log("GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");

            if (response2.ok) {
              _context.next = 8;
              break;
            }

            throw new Error("Something went wrong in profile!");

          case 8:
            _context.next = 10;
            return regeneratorRuntime.awrap(response2.json());

          case 10:
            resData2 = _context.sent;

            for (key in resData2) {
              resData3 = resData2[key];
            }

            console.log(resData3.userName + "HEREEEEEEEEEEEEEEEE");
            dispatch({
              type: CREATE_PROFILE,
              profileData: {
                userName: resData3.userName,
                profilePic: resData3.profilePic,
                birthday: resData3.birthday
              }
            });

          case 14:
          case "end":
            return _context.stop();
        }
      }
    });
  };
};

exports.fetchProfile = fetchProfile;