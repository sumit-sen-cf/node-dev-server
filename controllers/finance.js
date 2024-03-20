const constant = require("../common/constant.js");
const attendanceModel = require("../models/attendanceModel.js");
const financeModel = require("../models/financeModel.js");
const vari = require("../variables.js");
const ExcelJS = require('exceljs');
const { storage } = require('../common/uploadFile.js')

exports.addFinance = async (req, res) => {
  try {
    const checkDuplicacy = await financeModel.findOne({ attendence_id: req.body.attendence_id })
    if (checkDuplicacy) {
      return res.status(409).send({
        data: [],
        message: "finance already added for this attendance",
      });
    }
    const simc = new financeModel({
      status_: req.body.status_,
      reason: req.body.reason,
      remark: req.body.remark,
      // screenshot: req.file?.filename,
      attendence_id: req.body.attendence_id,
      reference_no: req.body.reference_no,
      amount: req.body.amount,
      pay_date: req.body.pay_date,
      utr: req.body.utr
    });

    if (req.file) {
      const bucketName = vari.BUCKET_NAME;
      const bucket = storage.bucket(bucketName);
      const blob = bucket.file(req.file.originalname);
      simc.screenshot = blob.name;
      const blobStream = blob.createWriteStream();
      blobStream.on("finish", () => {
        // res.status(200).send("Success") 
      });
      blobStream.end(req.file.buffer);
    }

    const simv = await simc.save();

    await attendanceModel.findOneAndUpdate(
      { attendence_id: parseInt(req.body.attendence_id) },
      { attendence_status_flow: 'Pending From Finance' },
      { new: true }
    );
    res.send({ simv, status: 200 });
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, sms: "This finance cannot be created" });
  }
};

exports.getFinances = async (req, res) => {
  try {
    const financeImagesBaseUrl = vari.IMAGE_URL;
    const simc = await financeModel.aggregate([
      {
        $lookup: {
          from: "attendancemodels",
          localField: "attendence_id",
          foreignField: "attendence_id",
          as: "attendence_data",
        },
      },
      //   {
      //     $unwind:  "$attendence_data"
      //   },
      {
        $unwind: {
          path: "$attendence_data",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "attendence_data.user_id",
          foreignField: "user_id",
          as: "user_data",
        },
      },
      {
        $unwind: {
          path: "$user_data",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "departmentmodels",
          localField: "attendence_data.dept",
          foreignField: "dept_id",
          as: "dept_data",
        },
      },
      {
        $unwind: {
          path: "$dept_data",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "billingheadermodels",
          localField: "attendence_data.dept",
          foreignField: "dept_id",
          as: "billing_header_data",
        },
      },
      {
        $unwind: {
          path: "$billing_header_data",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          id: 1,
          status_: 1,
          reason: 1,
          screenshot: 1,
          date: 1,
          remark: 1,
          attendence_id: 1,
          reference_no: 1,
          amount: 1,
          pay_date: 1,
          utr: 1,
          dept: "$attendence_data.dept",
          user_id: "$attendence_data.user_id",
          noOfabsent: "$attendence_data.noOfabsent",
          year: "$attendence_data.year",
          Creation_date: "$attendence_data.Creation_date",
          Created_by: "$attendence_data.Created_by",
          Last_updated_by: "$attendence_data.Last_updated_by",
          Last_updated_date: "$attendence_data.Last_updated_date",
          month: "$attendence_data.month",
          bonus: "$attendence_data.bonus",
          total_salary: "$attendence_data.total_salary",
          net_salary: "$attendence_data.net_salary",
          tds_deduction: "$attendence_data.tds_deduction",
          user_name: "$attendence_data.user_name",
          toPay: "$attendence_data.toPay",
          sendToFinance: "$attendence_data.sendToFinance",
          attendence_generated: "$attendence_data.attendence_generated",
          //   attendence_mastcol: null,
          attendence_status: "$attendence_data.attendence_status",
          salary_status: "$attendence_data.salary_status",
          salary_deduction: "$attendence_data.salary_deduction",
          salary: "$attendence_data.salary",
          invoice_template_no: "$user_data.invoice_template_no",
          dept_name: "$dept_data.dept_name",
          image_url: { $concat: [financeImagesBaseUrl, "$screenshot"] },
          digital_signature_image: "$user_data.digital_signature_image",
          attendence_status_flow: "$attendence_data.attendence_status_flow",
          user_email_id: "$user_data.user_email_id",
          user_contact_no: "$user_data.user_contact_no",
          permanent_address: "$user_data.permanent_address",
          permanent_city: "$user_data.permanent_city",
          permanent_state: "$user_data.permanent_state",
          permanent_pin_code: "$user_data.permanent_pin_code",
          invoiceNo: "$attendence_data.invoiceNo",
          billing_header_id: "$billing_header_data.billingheader_id",
          billing_header_name: "$billing_header_data.billing_header_name",
          bank_name: "$user_data.bank_name",
          ifsc_code: "$user_data.ifsc_code",
          account_no: "$user_data.account_no",
          pan_no: "$user_data.pan_no",
          beneficiary_name: "$user_data.beneficiary"
        },
      },
      {
        $group: {
          _id: "$id",
          data: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$data" }
      }
    ]);
    if (!simc) {
      res.status(500).send({ success: false });
    }
    res.status(200).send(simc);
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, sms: "Error getting all finances" });
  }
};

exports.getWFHFinancialYearData = async (req, res) => {
  try {
    const financeImagesBaseUrl = vari.IMAGE_URL;
    const findfinanceDate = await attendanceModel.find({}).select({ user_id: 1, Creation_date: 1, total_salary: 1, month: 1, year: 1, user_name: 1 });
    const findfinanceMonth = findfinanceDate[0].Creation_date.getUTCMonth() + 1;
    const financeYear = findfinanceDate[0].Creation_date.getUTCFullYear();
    let startDate;
    if (findfinanceMonth >= 4) {
      startDate = new Date(`${financeYear}-04-01T06:00:00.000+00:00`);
    } else {
      startDate = new Date(`${financeYear - 1}-04-01T06:00:00.000+00:00`);
    }
    const endDate = new Date(`${financeYear}-03-31T06:00:00.000+00:00`);

    const simc = await attendanceModel.aggregate([
      {
        $match: {
          "Creation_date": { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { user_id: "$user_id", year: "$year" },
          total_salary: { $sum: "$total_salary" },
          data: { $push: "$$ROOT" }
        }
      },
      {
        $unwind: "$data"
      },
      {
        $addFields: {
          "data.total_sal_in_FY": "$total_salary"
        }
      },
      {
        $group: {
          _id: "$data.user_id",
          total_toPay: { $sum: "$data.total_salary" },
          dept: { $first: "$data.dept" },
          user_name: { $first: "$data.user_name" }
        }
      },
      {
        $project: {
          _id: 0,
          user_id: "$_id",
          dept: 1,
          total_toPay: 1,
          user_name: 1
        }
      }
    ]);

    if (!simc || simc.length === 0) {
      return res.status(404).send({ success: false, message: "No data found between the given dates" });
    }

    res.status(200).send(simc);
  } catch (err) {
    res.status(500).send({ error: err.message, sms: "Error getting all finances" });
  }
};



exports.editFinance = async (req, res) => {
  try {
    const editsim = await financeModel.findOneAndUpdate(
      { id: req.body.id },
      {
        status_: req.body.status_,
        reason: req.body.reason,
        attendence_id: req.body.attendence_id,
        remark: req.body.remark,
        screenshot: req.file?.originalname,
        reference_no: req.body.reference_no,
        amount: req.body.amount,
        pay_date: req.body.pay_date,
        utr: req.body.utr
      },
      { new: true }
    );

    if (req.file) {
      const bucketName = vari.BUCKET_NAME;
      const bucket = storage.bucket(bucketName);
      const blob = bucket.file(req.file.originalname);
      editsim.screenshot = blob.name;
      const blobStream = blob.createWriteStream();
      blobStream.on("finish", () => {
        editsim.save();
        // res.status(200).send("Success") 
      });
      blobStream.end(req.file.buffer);
    }

    await attendanceModel.findOneAndUpdate(
      { attendence_id: parseInt(req.body.attendence_id) },
      { attendence_status_flow: 'Proceeded to bank' },
      { new: true }
    );
    if (!editsim) {
      res.status(500).send({ success: false });
    }
    res.status(200).send({ success: true, data: editsim });
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, sms: "Error updating finance details" });
  }
};

exports.editFinanceUtr = async (req, res) => {
  try {
    const editsim = await financeModel.findOneAndUpdate(
      { id: req.body.id },
      {
        attendence_id: req.body.attendence_id,
        utr: req.body.utr
      }
    );

    await attendanceModel.findOneAndUpdate(
      { attendence_id: req.body.attendence_id },
      { attendence_status_flow: 'Payment Released' },
      { new: true }
    );
    if (!editsim) {
      return res.status(500).send({ success: false });
    }
    res.status(200).send({ success: true, data: editsim });
  } catch (err) {
    return res
      .status(500)
      .send({ error: err.message, sms: "Error updating finance details" });
  }
};

exports.deleteFinance = async (req, res) => {
  financeModel
    .deleteOne({ id: req.params.id })
    .then((item) => {
      if (item) {
        return res
          .status(200)
          .json({ success: true, message: "finance deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "finance not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, message: err });
    });
};

exports.setUtrData = async (req, res) => {
  try {
    const { month, year, dept_id } = req.body;
    const excel = req.file;
    if (!excel) {
      return res.status(400).json({ success: false, message: 'Excel file is required.' });
    }
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(excel.buffer);
    const worksheet = workbook.worksheets[0];
    const utrData = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        if (rowNumber > 1) {
          const attendence_id = row.getCell('K').value;
          const utr = row.getCell('L').value;
          utrData.push({ attendence_id, utr });
        }
      }
    });
    for (const data of utrData) {
      const { attendence_id, utr } = data;
      await financeModel.updateOne({ attendence_id }, { utr });
      await attendanceModel.findOneAndUpdate(
        { attendence_id: attendence_id },
        { attendence_status_flow: 'Payment Released' },
        { new: true }
      );
      if (utr === '') {
        await attendanceModel.findOneAndUpdate(
          { attendence_id: attendence_id },
          { attendence_status_flow: 'Payment Failed' },
          { new: true }
        );
      }
    }
    return res.status(200).json({ success: true, message: 'UTR data updated successfully.' });
  } catch (err) {
    console.error('Error in setUtrData:', err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.getWFHDTDSUsers = async (req, res) => {
  try {
    const { month, year, dept_id } = req.body;
    const simc = await attendanceModel.aggregate([
      {
        $match: {
          dept: dept_id,
          month: month,
          year: year,
          tds_deduction: { $ne: 0 }
        }
      },
      {
        $lookup: {
          from: "departmentmodels",
          localField: "dept",
          foreignField: "dept_id",
          as: "dept_data",
        },
      },
      {
        $unwind: {
          path: "$dept_data",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          dept: 1,
          user_id: 1,
          dept_name: "$dept_data.dept_name",
          user_name: 1,
          month: 1,
          year: 1,
          tds_deduction: 1,
          toPay: 1,
        },
      },
    ]);

    if (!simc || simc.length === 0) {
      return res.status(404).json({ success: false, message: 'No data found.', data: [] });
    }

    return res.status(200).json(simc);
  } catch (err) {
    console.error('Error in getWFHDTDSUsers:', err);
    return res.status(500).json({ success: false, message: 'Error getting all data.', error: err.message });
  }
};