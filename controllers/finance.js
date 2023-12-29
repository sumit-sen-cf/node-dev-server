const constant = require("../common/constant.js");
const attendanceModel = require("../models/attendanceModel.js");
const financeModel = require("../models/financeModel.js");

exports.addFinance = async (req, res) => {
  try {
    const simc = new financeModel({
      status_: req.body.status_,
      reason: req.body.reason,
      remark: req.body.remark,
      screenshot: req.file?.filename,
      attendence_id: req.body.attendence_id,
      reference_no: req.body.reference_no,
      amount: req.body.amount,
      pay_date: req.body.pay_date,
    });
    const simv = await simc.save();

    await attendanceModel.findOneAndUpdate(
      { attendence_id: parseInt(req.body.attendence_id) },
      { attendence_status_flow: 'sent to finance' },
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
    const financeImagesBaseUrl = "http://44.211.225.140:8000/user_images/";
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
          digital_signature_image: "$user_data.digital_signature_image"
        },
      },
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

exports.editFinance = async (req, res) => {
  try {
    const editsim = await financeModel.findOneAndUpdate(
      { id: req.body.id },
      {
        status_: req.body.status_,
        reason: req.body.reason,
        attendence_id: req.body.attendence_id,
        remark: req.body.remark,
        screenshot: req?.file?.filename,
        reference_no: req.body.reference_no,
        amount: req.body.amount,
        pay_date: req.body.pay_date,
      },
      { new: true }
    );

    await attendanceModel.findOneAndUpdate(
      { attendence_id: parseInt(req.body.attendence_id) },
      { attendence_status_flow: 'invoice received' },
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
