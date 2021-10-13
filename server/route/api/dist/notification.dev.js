

var express = require("express");

var fetch = require("node-fetch");

var router = express.Router();
router.post('/sendToSellers', function (req, res) {
  console.log("RRRRRRRRRRffffff");
  var cartItems = req.body.pushTokenToServer;
  console.log(cartItems); // console.log(cartItems.pushTokenToServer[0]);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = cartItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var cartItem = _step.value;
      var pushToken = cartItem.token;
      console.log(pushToken);
      var x = fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: pushToken,
          title: "Order was placed!",
          body: cartItem.title
        })
      });
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
});
module.exports = router;