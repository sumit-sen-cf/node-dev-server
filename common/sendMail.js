var nodemailer = require("nodemailer");

var transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "onboarding@creativefuel.io",
    pass: "gakatoehtvscfjep",
  },
});

const mail = (subject, html, email) => {
  let mailOptions = {
    from: "onboarding@creativefuel.io",
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
