const nodemailer = require('nodemailer')

exports.contact = (req, res, next) => {
    sendEmail(req.body.email, req.body.name, req.body.message);
    res.status(200).json({
        message: "Email Sent Successfully"
    })
}

exports.otp = (req, res, next) => {
    sendEmail(req.body.email, "OTP", req.body.otp);
    res.status(200).json({
        message: "OTP Sent Successfully"
    })
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fahadzahidd24@gmail.com',
      pass: 'hjjknztuvdtrymat'
    }
  });
  
  function sendEmail(toEmail, subject, body) {
    let body_string = body.toString();
    const mailOptions = {
      from: 'fahadzahidd24@gmail.com',
      to: toEmail,
      subject: subject,
      text: body_string
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }