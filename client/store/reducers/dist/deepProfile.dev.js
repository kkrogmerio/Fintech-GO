"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _auth = require("../actions/auth");

var _order = _interopRequireDefault(require("../../models/order"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var initialState = {};

var _default = function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _auth.SET_PROFILE:
      return {
        profile: action.profile
      };

    case _auth.CREATE_PROFILE:
      var newOrder = new _order["default"](action.profileData.name, action.profileData.profilePic, action.profileData.birthday);
      console.log(action.profileData + "FFFFFFFFFFFFFFFFFFFFFFF");
      return {
        profile: action.profileData
      };
  }

  return state;
};

exports["default"] = _default;