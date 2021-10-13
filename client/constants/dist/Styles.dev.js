"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.imageProfileStyle = exports.horizontalLine = exports.profilePreviewStyle = exports.tabStyle = exports.drawerStyle = void 0;

var _reactNative = require("react-native");

var _Colors = _interopRequireDefault(require("./Colors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var drawerStyle = {
  width: _reactNative.Dimensions.get("window").width * 0.7,
  borderTopRightRadius: 30,
  borderBottomRightRadius: 30,
  fontSize: 34,
  backgroundColor: _Colors["default"].navigationColor
};
exports.drawerStyle = drawerStyle;
var tabStyle = {
  backgroundColor: _Colors["default"].navigationColor
};
exports.tabStyle = tabStyle;
var profilePreviewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center'
};
exports.profilePreviewStyle = profilePreviewStyle;
var horizontalLine = {
  marginVertical: 40,
  backgroundColor: "black",
  height: 2,
  flex: 1
};
exports.horizontalLine = horizontalLine;
var imageProfileStyle = {
  width: 120,
  height: 120,
  borderRadius: 60,
  marginBottom: 15,
  backgroundColor: "#ccc",
  borderColor: _Colors["default"].primary,
  borderWidth: 1
};
exports.imageProfileStyle = imageProfileStyle;