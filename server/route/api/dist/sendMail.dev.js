"use strict";

var express = require("express");

var fetch = require("node-fetch");

var router = express.Router();

var sgMail = require("@sendgrid/mail");

var JWT = require('expo-jwt');

var key = "shh";
sgMail.setApiKey(process.env.MAIL_KEY);
router.post('/sendMail', function (req, res) {
  console.log('intram no');
  email = req.body.mymail;
  console.log(email);
  myToken = JWT["default"].encode({
    mail: email
  }, key, {
    algorithm: 'none'
  });
  var emailData = {
    from: process.env.EMAIL_FROM,
    to: {
      email: email
    },
    subject: 'Account activation link',
    html: "\n            <h2>Please use this token to activate your account</h2>\n            <h1>".concat(myToken, "d</h1>\n\n            ")
  };
  sgMail.send(emailData).then(function () {
    console.log("Message sent");
  })["catch"](function (error) {
    console.log(error.response.body); // console.log(error.response.body.errors[0].message)
  }); // sgMail.send(emailData).then((sent) => {
  //   return res
  //     .json({
  //       message: `Email has been sent to ${email}`,
  //     })
  //     .catch((err) => {
  //       console.log('reeeeeeeeeeeeeeeeeeeeeeeeee');
  //       return res.status(400).json({
  //         error: err,
  //       });
  //     });
  // });
  // console.log('jereeeeeeeeeeeee')
  // return;
});
router.post('/mailVerif', function (req, res) {
  var _req$body = req.body,
      token = _req$body.token,
      email = _req$body.email;
  console.log('verifffiasfsiiasf+" "',token);
  if (JWT["default"].decode(token, key).mail === email) return res.json({
    message: "Account created succesfully"
  });else {
    console.log('hereeeeee');
    return res.status(400).json({
      message: "Wrong token id"
    });
  }
});
module.exports = router;