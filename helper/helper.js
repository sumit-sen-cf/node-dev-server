// modules
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
const puppeteer = require("puppeteer");

//db models
const designationModel = require("../models/designationModel.js");
const userModel = require("../models/userModel.js");
const attendanceModel = require("../models/attendanceModel.js");
const { base_url } = require("../common/constant.js");
const constant = require("../common/constant.js");
const notificationModel = require("../models/notificationModel.js");
const departmentModel = require("../models/departmentModel.js");
const vari = require("../variables.js");
const { storage } = require('../common/uploadFile.js')

module.exports = {
  /**
   * Generates a PDF for the offer letter based on the provided employee data.
   * @param {object} empData - The employee data object.
   * @returns {Promise<void>} - A promise that resolves when the PDF is generated.
   */
  generateOfferLaterPdf: async (empData) => {
    try {
      const designationData = await designationModel.findOne(
        { desi_id: empData?.user_designation },
        "desi_name"
      );

      const reportToData = await userModel.findOne(
        { user_id: empData?.Report_L1 },
        "user_name"
      );

      const templatePath = path.join(
        __dirname,
        "../templates/offerLetterTemplate.ejs"
      );
      const template = await fs.promises.readFile(templatePath, "utf-8");

      const startDate = empData?.joining_date_extend || empData?.joining_date;
      const isJoiningDateExtended = empData.joining_date_extend !== null;

      // Generate Pdf file name
      let pdfFileName = isJoiningDateExtended
        ? `${empData?.user_name} Extend`
        : empData?.user_name;
      let digitalSignature;
      if (empData?.digital_signature_image) {
        pdfFileName += " Signed";
        digitalSignature = `${constant.base_url}/${empData?.digital_signature_image}`;
        var currentDate = new Date();
        var formattedDateTime = currentDate.toLocaleString();
        const sms = new notificationModel({
          user_id: empData?.user_id,
          notification_title: "Candidate has accepted offer letter",
          notification_message: `${empData?.user_name} has been loggedin on ${formattedDateTime}`,
          created_by: empData?.created_by,
        });
        await sms.save();
      }

      // Formate Date
      const inputDate = new Date(startDate);
      const options = { month: "long", day: "numeric", year: "numeric" };
      const formattedStartDate = new Intl.DateTimeFormat(
        "en-IN",
        options
      ).format(inputDate);
      const formattedOfferLaterDate = new Intl.DateTimeFormat(
        "en-IN",
        options
      ).format(empData?.offer_later_date);
      let formattedOfferLaterAcceptanceDate;
      if (
        empData?.offer_later_acceptance_date &&
        empData?.offer_later_acceptance_date !== ""
      ) {
        formattedOfferLaterAcceptanceDate = new Intl.DateTimeFormat(
          "en-IN",
          options
        ).format(empData?.offer_later_acceptance_date);
      }

      //Pass data into template
      const html = ejs.render(template, {
        empName: empData?.user_name,
        permanentAddress: empData?.permanent_address,
        dateOfCreation: formattedOfferLaterDate,
        designation: designationData?.desi_name,
        reportTo: reportToData?.user_name,
        startDate: formattedStartDate,
        ctc: empData?.ctc,
        digitalSignature: digitalSignature ?? "",
        offerLaterAcceptanceDate: formattedOfferLaterAcceptanceDate ?? "",
      });

      //Save pdf at mention path
      // const outputPath = path.join(
      //   __dirname,
      //   `../uploads/offerLetterPdf/${pdfFileName} Offer Letter.pdf`
      // );

      const remoteFilePath = `offerLetterPdf/${pdfFileName} Offer Letter.pdf`;

      // Generate PDF with Puppeteer
      // const browser = await puppeteer.launch({ headless: "true" });  // For Localhsot
      const browser = await puppeteer.launch({
        headless: "true",
        // executablePath: "/usr/bin/chromium",
      });
      const page = await browser.newPage();
      await page.setContent(html);
      // await page.pdf({ path: outputPath, format: "A4" });
      const pdfBuffer = await page.pdf({ format: "A4" });
      await browser.close();

      const bucketName = vari.BUCKET_NAME;
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(remoteFilePath);
      await file.save(pdfBuffer, {
        contentType: 'application/pdf',
        gzip: false
      });

      await userModel.findOneAndUpdate(
        { user_id: empData?.user_id },
        {
          $set: {
            offer_later_pdf_url: `${vari.IMAGE_URL}${remoteFilePath}`,
          },
        }
      );
    } catch (error) {
      console.log("PDF GENERATE ERR FOR OFFER LATER:", error.message);
    }
  },

  /**
   * Formats the given number of seconds into a human-readable string representation
   * that includes the number of days, hours, minutes, and seconds.
   * @param {number} seconds - The number of seconds to format.
   * @returns {string} A formatted string representation of the given number of seconds.
   */
  formateSecoundTime: (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    const hrs = Math.floor(seconds / 3600);
    seconds -= hrs * 3600;
    const mnts = Math.floor(seconds / 60);
    seconds -= mnts * 60;
    return `${days} days, ${hrs} hours, ${mnts} minutes, and ${seconds} seconds`;
  },

  generateEmpId: async (dept_id) => {
    const latestUser = await userModel.findOne().sort({ user_id: -1 });
    const latestUserId = latestUser.user_id + 1;

    const departmentData = await departmentModel.findOne({ dept_id: dept_id });
    const shortName = departmentData.short_name;
    const jobTypeSuffix = latestUser.job_type === "WFHD" ? "H" : "O";

    return `CF/${shortName}/${jobTypeSuffix}/${latestUserId}`
  },


  /**
   * Removes a file from the specified folder.
   * @param {string} filename - The name of the file to be removed.
   * @param {string} foldername - The name of the folder containing the file.
   * @returns {Object} - An object with the status and message of the operation.
   */
  fileRemove: (filename, foldername) => {
    const folder = path.join(__dirname, foldername);
    const fileName = filename;

    if (fileName) {
      const filePath = path.join(folder, fileName);
      fs.unlink(filePath, (err) => {
        if (err) {
          return {
            status: false,
            msg: err.message,
          };
        }
      });
    }
  },
  /**
   * Generates the next invoice number for a given user.
   * @param {string} userId - The ID of the user for whom the invoice number is being generated.
   * @returns {Promise<string>} - A promise that resolves to the next invoice number.
   */
  // createNextInvoiceNumber: async (userId) => {
  //   const latestEntry = await attendanceModel
  //     .findOne()
  //     .sort({ _id: -1 })
  //     .exec();

  //   let nextIncrement = 1; // Start with 1 if there are no entries yet
  //   if (latestEntry && latestEntry.invoiceNo) {
  //     const parts = latestEntry.invoiceNo.split("/");
  //     const lastIncrement = parseInt(parts[2], 10);
  //     if (!isNaN(lastIncrement)) {
  //       nextIncrement = lastIncrement + 1;
  //     }
  //   }

  //   // Construct the new invoiceNo
  //   const date = new Date();
  //   const year = date.getFullYear().toString().substring(2); // Get last two digits of the year
  //   const month = date
  //     .toLocaleString("default", { month: "short" })
  //     .toUpperCase(); // Get the month abbreviation
  //   const monthYear = `${month}${year}`;

  //   return `${monthYear}/${userId}/${nextIncrement}`;
  // },

  createNextInvoiceNumber: async (userId, month, year) => {
    const latestEntry = await attendanceModel
      .findOne()
      .sort({ _id: -1 })
      .exec();

    // console.log("dddddddddd", latestEntry)
    let nextIncrement = 1;
    if (latestEntry && latestEntry.invoiceNo) {
      const parts = latestEntry.invoiceNo.split("/");
      const lastIncrement = parseInt(parts[2], 10);
      if (!isNaN(lastIncrement)) {
        nextIncrement = lastIncrement + 1;
      }
    }

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = monthNames.findIndex(name => name.toLowerCase() === month.toLowerCase());
    const monthNumber = ("0" + (monthIndex + 1)).slice(-2);

    const monthYear = `${monthNumber}${year}`;

    // const extractMonth = month.slice(0, 3);
    // const monthYear = `${extractMonth}${year}`;

    return `${userId}/${monthYear}/${nextIncrement}`;
  },


  /**
   * Generates a random password consisting of 6 alphanumeric characters.
   * @returns {string} - The randomly generated password.
   */
  generateRandomPassword: () => {
    const randomString = Math.random().toString(36).slice(-6);
    return randomString;
  },
  /**
   * Generates a random One-Time Password (OTP) consisting of 6 digits.
   * @returns {string} - The randomly generated OTP.
   */
  generateRandomOTP: () => {
    // Generate a random number between 100000 and 999999
    const randomOTP = Math.floor(100000 + Math.random() * 900000);
    return randomOTP.toString();
  },
  /**
   * Generates the expiry time for a one-time password (OTP) in milliseconds.
   * @returns {number} The expiry time for the OTP in milliseconds.
   */
  generateOtpExpiryTime: () => {
    // Get the current time in milliseconds
    var currentTime = new Date().getTime();
    // Calculate the expiry time (10 minutes = 600,000 milliseconds)
    var expiryTime = currentTime + 600000;
    return expiryTime;
  },
};
