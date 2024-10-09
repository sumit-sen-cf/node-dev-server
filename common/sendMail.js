var nodemailer = require("nodemailer");
const constant = require("./constant");

var transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: constant.EMAIL_ID,
    pass: constant.EMAIL_PASS,
  },
});

const mail = (subject, html, email) => {
  let mailOptions = {
    from: constant.EMAIL_ID,
    to: email,
    subject: subject,
    html: html,
  };
  transport.sendMail(mailOptions, function (error, info) {
    if (error) console.log(error);

    return info;
  });
};

module.exports = mail;
