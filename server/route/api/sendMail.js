const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const sgMail = require("@sendgrid/mail");
const JWT=require('expo-jwt');
const key = "shh";
sgMail.setApiKey(process.env.MAIL_KEY);
router.post('/sendMail', (req, res) => {
  
    email=req.body.mymail;
    console.log(email);
    
    myToken=(JWT.default.encode({mail:email},key,{algorithm:'none'}));
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: `${email}`,
      subject: "Request activation link",
      html: `
            <h2>Please use this token to execute your Request</h2>
            <h1>${myToken}</h1>
            `,
    };
        sgMail
          .send(emailData)
          .then(() => {
            console.log("Message sent");
          })
          .catch((error) => {
            console.log(error.response.body);
          });

})
router.post('/mailVerif', (req, res)=>{
    var { email,token } = req.body; 

    console.log(JWT.default.decode(token, key));
    if (JWT.default.decode(token, key).mail === email)
      return res.json({
        message: `Request executed successfully`,
      });
    else
      {
        return res.status(400).json({
        message: `Wrong token id`,
      });}

    
})
module.exports = router;

