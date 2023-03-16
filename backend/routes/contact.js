const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");


router.post("/send", (req, res, next) => {
    sendEmail(req.body.email, req.body.name, req.body.message);
    res.status(200).json({
        message: "Email Sent Successfully"
    })
    });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fahadzahidd24@gmail.com',
      pass: 'hjjknztuvdtrymat'
    }
  });
  
  function sendEmail(toEmail, subject, body) {
    const mailOptions = {
      from: 'fahadzahidd24@gmail.com',
      to: toEmail,
      subject: subject,
      text: body
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }






module.exports = router