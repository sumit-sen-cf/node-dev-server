var nodemailer = require("nodemailer");
const constant = require("./constant");


var transportForAlert = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: constant.CONST_MAIL_USER_FOR_ALERT,
      pass: constant.CONST_MAIL_PASS_FOR_ALERT
  }
  });
  
  const mailForAlert = (subject, html, email) => {
    let mailOptions = {
      from:  constant.CONST_MAIL_USER_FOR_ALERT,
      to: email,
      subject: subject,
      html: html,
    };
    transportForAlert.sendMail(mailOptions, function (error, info) {
      if (error) console.log(error);
  
      return info;
    });
  };
  

module.exports = mailForAlert;