"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addOrder = exports.fetchOrders = exports.SET_ORDERS = exports.ADD_ORDER = void 0;

var _order = _interopRequireDefault(require("../../models/order"));

var _env = _interopRequireDefault(require("../../env"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ADD_ORDER = 'ADD_ORDER';
exports.ADD_ORDER = ADD_ORDER;
var SET_ORDERS = 'SET_ORDERS';
exports.SET_ORDERS = SET_ORDERS;

var fetchOrders = function fetchOrders() {
  return function _callee(dispatch, getState) {
    var userId, response, resData, loadedOrders, key;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            userId = getState().auth.userId;
            _context.prev = 1;
            _context.next = 4;
            return regeneratorRuntime.awrap(fetch("https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/orders/".concat(userId, ".json")));

          case 4:
            response = _context.sent;

            if (response.ok) {
              _context.next = 7;
              break;
            }

            throw new Error('Something went wrong!');

          case 7:
            _context.next = 9;
            return regeneratorRuntime.awrap(response.json());

          case 9:
            resData = _context.sent;
            loadedOrders = [];

            for (key in resData) {
              loadedOrders.push(new _order["default"](key, resData[key].cartItems, resData[key].totalAmount, new Date(resData[key].date)));
            }

            dispatch({
              type: SET_ORDERS,
              orders: loadedOrders
            });
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](1);
            throw _context.t0;

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 15]]);
  };
};

exports.fetchOrders = fetchOrders;

var addOrder = function addOrder(cartItems, totalAmount) {
  return function _callee2(dispatch, getState) {
    var token, userId, date, response, resData, pushTokenToServer, notifSent, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, cartItem;

    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            token = getState().auth.token;
            userId = getState().auth.userId;
            date = new Date();
            _context2.next = 5;
            return regeneratorRuntime.awrap(fetch("https://first-rn-app-4c8c9-default-rtdb.firebaseio.com/orders/".concat(userId, ".json?auth=").concat(token), {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                cartItems: cartItems,
                totalAmount: totalAmount,
                date: date.toISOString()
              })
            }));

          case 5:
            response = _context2.sent;

            if (response.ok) {
              _context2.next = 8;
              break;
            }

            throw new Error('Something went wrong!');

          case 8:
            _context2.next = 10;
            return regeneratorRuntime.awrap(response.json());

          case 10:
            resData = _context2.sent;
            pushTokenToServer = [];
            notifSent = false;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 16;

            for (_iterator = cartItems[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              cartItem = _step.value;
              pushTokenToServer.push({
                token: cartItem.productPushToken,
                title: cartItem.productTitle
              });
            }

            _context2.next = 24;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2["catch"](16);
            _didIteratorError = true;
            _iteratorError = _context2.t0;

          case 24:
            _context2.prev = 24;
            _context2.prev = 25;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 27:
            _context2.prev = 27;

            if (!_didIteratorError) {
              _context2.next = 30;
              break;
            }

            throw _iteratorError;

          case 30:
            return _context2.finish(27);

          case 31:
            return _context2.finish(24);

          case 32:
            console.log(pushTokenToServer);

            _axios["default"].post("".concat(_env["default"].REACT_APP_API_URL, "/sendToSellers"), pushTokenToServer).then(function (res) {
              notifSent = true;
              console.log('brrr');
            })["catch"](function (err) {
              console.log(err);
            });

            console.log("".concat(_env["default"].REACT_APP_API_URL, "/sendToSellers"));
            dispatch({
              type: ADD_ORDER,
              orderData: {
                id: resData.name,
                items: cartItems,
                amount: totalAmount,
                date: date,
                sentNotifications: notifSent
              }
            });

          case 36:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[16, 20, 24, 32], [25,, 27, 31]]);
  };
};

exports.addOrder = addOrder;