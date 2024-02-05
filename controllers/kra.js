const userModel = require('../models/userModel.js');
const kraTransModel = require('../models/kraTransModel.js');
const jobResponsibilityModel = require("../models/jobResponsibilityModel.js");
const vari = require("../variables");

exports.addKra = async (req, res) => {
  try {
    const krac = new kraTransModel({
      user_to_id: parseInt(req.body.user_to_id),
      user_from_id: parseInt(req.body.user_from_id),
      job_responsibility_id: parseInt(req.body.job_responsibility_id),
      remark: req.body.remark,
      Created_by: parseInt(req.body.created_by),
      Job_res_id: parseInt(req.body.Job_res_id)
    })

    const krav = await krac.save();
    const kraTrans = await jobResponsibilityModel.updateOne(
      { Job_res_id: parseInt(req.body.Job_res_id) },
      { $set: { user_id: parseInt(req.body.user_to_id) } }
    );
    res.status(200).send(krav);
  } catch (err) {
    res.status(500).send({ error: err, sms: 'This kra cannot be created' })
  }
};


exports.getJobResponById = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const ImageUrl = `${vari.IMAGE_URL}`;
    const userJobResponsi = await jobResponsibilityModel.aggregate([
      {
        $match: { user_id: parseInt(user_id) },
      },
      {
        $lookup: {
          from: 'usermodels',
          localField: 'user_id',
          foreignField: 'user_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "departmentmodels",
          localField: "user.dept_id",
          foreignField: "dept_id",
          as: "department",
        },
      },
      {
        $unwind: {
          path: "$department",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          user_id: 1,
          Job_res_id: "$Job_res_id",
          description: "$description",
          user_name: "$user.user_name",
          user_email_id: "$user.user_email_id",
          department_name: "$department.dept_name",
          sjob_responsibility: "$sjob_responsibility",
          UID: { $concat: [ImageUrl, '$UID'] },
          pan: { $concat: [ImageUrl, '$pan'] },
          highest_upload: { $concat: [ImageUrl, '$highest_upload'] },
          other_upload: { $concat: [ImageUrl, '$other_upload'] },
        }
      },
    ]);
    res.status(200).send(userJobResponsi);
  } catch (error) {
    res.status(500).send({ error: err.message, sms: 'Error getting all kras' })
  }
}


exports.getKras = async (req, res) => {
  try {
    const kraData = await KraTransModel.aggregate([
      {
        $lookup: {
          from: "user_mast",
          localField: "user_to_id",
          foreignField: "user_id",
          as: "user_to_info",
        },
      },
      {
        $lookup: {
          from: "user_mast",
          localField: "user_from_id",
          foreignField: "user_id",
          as: "user_from_info",
        },
      },
      {
        $project: {
          _id: 1,
          user_to_id: 1,
          user_from_id: 1,
          job_responsibility_id: 1,
          remark: 1,
          Created_by: 1,
          Job_res_id: 1,
          user_to_name: "$user_to_info.user_name",
          user_from_name: "$user_from_info.user_name",
        },
      },
    ]);

    res.send({ data: kraData });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }


}