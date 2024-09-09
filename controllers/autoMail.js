const schedule = require('node-schedule');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const userModel = require('../models/userModel');
const fs = require('fs');
const ejs = require('ejs');
const path = require("path");
const axios = require('axios');
const emailTempModel = require("../models/emailTempModel")

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "onboarding@creativefuel.io",
    pass: "qtttmxappybgjbhp",
  },
});

const birthDay = schedule.scheduleJob('0 0 * * *', async () => {
  sendBirthdayEmail();
})

const workAnniversary = schedule.scheduleJob('0 0 * * *', async () => {
  sendWorkAnniversaryEmail();
})

const job0Days = schedule.scheduleJob('0 0 * * *', async () => {
  sendReminderEmail(0);
  // sendWhatsappSms(0);
});

const job1Days = schedule.scheduleJob('0 0 * * *', async () => {
  sendReminderEmail(1);
  // sendWhatsappSms(1);
  sendEmail(1);
});

const job2Days = schedule.scheduleJob('0 0 * * *', async () => {
  sendReminderEmail(2);
  // sendWhatsappSms(2);
});

const job3Days = schedule.scheduleJob('0 0 * * *', async () => {
  sendReminderEmail(3);
  // sendWhatsappSms(3);
});

async function sendWhatsappSms(daysBefore) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + daysBefore);

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}T00:00:00.000+00:00`;

  const users = await userModel.find({ joining_date: formattedDate });

  users.forEach(async (user) => {
    const response = await axios.post(
      "https://backend.api-wa.co/campaign/heyx/api",
      {
        apiKey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ODA0YmMyYTVjOTlmMGYwNmY3Y2QyNSIsIm5hbWUiOiJDcmVhdGl2ZWZ1ZWwiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjQ4MDRiYzJkYzhjZWYwNDViOTY3NTk2IiwiYWN0aXZlUGxhbiI6IkJBU0lDX01PTlRITFkiLCJpYXQiOjE2OTc0NDQ3OTB9.xg686Rd8V4J1PzDA27P1KBho1MTnYwo3X_WB0o0-6qs",
        campaignName:
          daysBefore === 0
            ? "CF_Pre_Onday_new"
            : daysBefore === 1
              ? "CF_Pre_1_days_new"
              : daysBefore === 2
                ? "CF_Pre_2_days_new"
                : daysBefore === 3
                  ? "CF_Pre_3_days_new"
                  : "CF_Pre_Onday_new",
        destination: JSON.stringify(user.PersonalNumber),
        userName: user.user_name,
        templateParams:
          daysBefore === 3
            ? [user.user_name, user.joining_date]
            : [user.user_name]
      }
    );
    if (response.status === 200) {
      console.log("API response", response.data);
    } else {
      console.error("API request failed with status", response.status);
    }
  })
}

// async function sendReminderEmail(daysBefore) {
//   const currentDate = new Date();
//   currentDate.setDate(currentDate.getDate() + daysBefore);
//   const year = currentDate.getFullYear();
//   const month = String(currentDate.getMonth() + 1).padStart(2, '0');
//   const day = String(currentDate.getDate()).padStart(2, '0');
//   const formattedDate = `${year}-${month}-${day}T00:00:00.000+00:00`;

//   const users = await userModel.find({ joining_date: formattedDate });
//   console.log("users", users)

//   users.forEach(async (user) => {
//     const templatePath = path.join(__dirname, `emailtemp${daysBefore}.ejs`);
//     const template = await fs.promises.readFile(templatePath, "utf-8");
//     const name = user.user_name;
//     const html = ejs.render(template, { name });

//     /* dynamic email temp code start */
//     // let contentList = await emailTempModel.findOne({ email_for_id: '65be340cad52cfd11fa27e50', send_email: true })

//     // const filledEmailContent = contentList.email_content.replace("{{user_name}}", user.user_name);

//     // const html = filledEmailContent;

//     // let mailOptions = {
//     //   from: "onboarding@creativefuel.io",
//     //   to: user.user_email_id,
//     //   subject:
//     //     daysBefore === 0
//     //       ? contentList.email_sub
//     //       : daysBefore === 1
//     //         ? contentList.email_sub
//     //         : daysBefore === 2
//     //           ? contentList.email_sub
//     //           : daysBefore === 3
//     //             ? contentList.email_sub
//     //             : "Your Joining Date is Approaching",
//     //   html: html
//     // };
//     /* dynamic email temp code end */

//     let mailOptions = {
//       from: "onboarding@creativefuel.io",

//       to: user.user_email_id,
//       subject:
//         daysBefore === 0
//           ? "Welcome to CreativeFuel! It's almost time."
//           : daysBefore === 1
//             ? "See you tomorrow! With love, CF"
//             : daysBefore === 2
//               ? "Have you geared up yet? #2daystogo!"
//               : daysBefore === 3
//                 ? "Meme Magic in 3 Days:Your First Day is 3 Days Away! 🌟"
//                 : "Your Joining Date is Approaching",
//       html: html
//     };
//     transporter.sendMail(mailOptions, (error, info) => {
//       console.log("info", info);
//       if (error) {
//         console.log('Error sending email:', error);
//       } else {
//         console.log('Reminder email sent:', info.response);
//       }
//     });
//   });
// }

async function sendReminderEmail(daysBefore) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  currentDate.setDate(currentDate.getDate() + daysBefore);
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}T00:00:00.000+00:00`;

  const users = await userModel.find({ joining_date: formattedDate });

  users.forEach(async (user) => {
    const targetDate = new Date(user.joining_date);
    targetDate.setDate(targetDate.getDate() - daysBefore);

    const targetYear = targetDate.getFullYear();
    const targetMonth = String(targetDate.getMonth() + 1).padStart(2, '0');
    const targetDay = String(targetDate.getDate()).padStart(2, '0');
    // const formattedTargetDate = `${targetDay}-${targetMonth}-${targetYear}`;
    const formattedTargetDate = targetDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const templatePath = path.join(__dirname, `emailtemp${daysBefore}.ejs`);
    const template = await fs.promises.readFile(templatePath, "utf-8");
    const name = user.user_name;
    const html = ejs.render(template, { name, formattedTargetDate });

    let mailOptions = {
      from: "onboarding@creativefuel.io",
      to: user.user_email_id,
      subject:
        daysBefore === 0
          ? `⏰ Today's the Day! 🚀 Welcome to Creativefuel, ${name}!`
          : daysBefore === 1
            ? "⏳ 1 Day Left! Get Ready to Rock with CF! 🎉"
            : daysBefore === 2
              ? "Two Days and Counting: Memes, Magic, and You at Creativefuel! 🌟"
              : daysBefore === 3
                ? "Meme Magic in 3 Days: Your First Day is 3 Days Away! 🌟"
                : "Your Joining Date is Approaching",
      html: html
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Reminder email sent:', info.response);
      }
    });
  });
}


async function sendEmail(daysBefore) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + daysBefore);

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}T00:00:00.000+00:00`;

  const users = await userModel.find({ joining_date: formattedDate });

  users.forEach(async (user) => {
    const templatePath = path.join(__dirname, "templatebeforejoining.ejs");
    const template = await fs.promises.readFile(templatePath, "utf-8");
    const name = user.user_name;
    const joining_date = user.joining_date;
    const html = ejs.render(template, { name, joining_date });
    // /* dynamic email temp code start */
    // let contentList = await emailTempModel.findOne({ email_for_id: '65be340cad52cfd11fa27e50', send_email: true });

    // const filledEmailContent = contentList.email_content
    //   .replace("{{user_name}}", user.user_name)
    //   .replace("{{user_joining_date}}", user.joining_date);

    // const html = filledEmailContent;
    // /* dynamic email temp code end */

    let mailOptions = {
      from: "onboarding@creativefuel.io",
      to: user.user_email_id,
      subject: "Welcome Onboard- Your First Day at Creativefuel!",
      // subject: contentList.email_sub,
      html: html
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Reminder email sent:', info.response);
      }
    });
  });
}

async function sendBirthdayEmail() {
  try {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate());

    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    const users = await userModel.find({
      $expr: {
        $and: [
          { $eq: [{ $dayOfMonth: "$DOB" }, day] },
          { $eq: [{ $month: "$DOB" }, month] }
        ]
      }
    });

    for (const user of users) {
      const templatePath = path.join(__dirname, "birthdayemailtemp.ejs");
      const template = await fs.promises.readFile(templatePath, "utf-8");
      const name = user.user_name;
      const html = ejs.render(template, { name });

      const mailOptions = {
        from: "onboarding@creativefuel.io",
        to: user.user_email_id,
        subject: `Celebrating Your Special Day, ${name} !`,
        html: html
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log('Birthday email sent:', info.response);
        }
      });
    }
  } catch (error) {
    console.error('Error in sendBirthdayEmail:', error);
  }
}

async function sendWorkAnniversaryEmail() {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    const users = await userModel.find({
      $expr: {
        $and: [
          { $eq: [{ $dayOfMonth: "$joining_date" }, currentDay] },
          { $eq: [{ $month: "$joining_date" }, currentMonth] }
        ]
      }
    });

    function getOrdinalSuffix(year) {
      const suffixes = ["th", "st", "nd", "rd"];
      const v = year % 100;
      return year + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    }

    for (const user of users) {
      const joiningYear = user.joining_date.getFullYear();
      const workAnniversaryYears = currentYear - joiningYear;

      const workAnniversaryString = getOrdinalSuffix(workAnniversaryYears);

      const templatePath = path.join(__dirname, "workAnniversaryemailtemp.ejs");
      const template = await fs.promises.readFile(templatePath, "utf-8");
      const name = user.user_name;
      const html = ejs.render(template, { name, workAnniversaryYears: workAnniversaryString });

      const mailOptions = {
        from: "onboarding@creativefuel.io",
        to: user.user_email_id,
        subject: `Creativefuel Congratulates ${name} on  ${workAnniversaryString} Work Anniversary`,
        html: html
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log('Work anniversary email sent:', info.response);
        }
      });
    }
  } catch (error) {
    console.error('Error in sendWorkAnniversaryEmail:', error);
  }
}