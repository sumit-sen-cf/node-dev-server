const response = require("../common/response.js");
const educationModel = require("../models/educationModel.js");
const userModel = require("../models/userModel.js");

exports.addEducation = async (req, res) => {
  try {
    const latestUser = await userModel.findOne({}, { user_id: 1 }).sort({ user_id: -1 });
    const incrementedUser = latestUser.user_id + 1;
    const education = new educationModel({
      user_id: incrementedUser,
      institute_name: req.body.institute_name,
      from_year: req.body.from_year,
      to_year: req.body.to_year,
      percentage: req.body.percentage,
      stream: req.body.stream,
      specialization: req.body.specialization,
      title: req.body.title
    });

    const simv = await education.save();
    return response.returnTrue(
      200,
      req,
      res,
      "education Person Created Successfully",
      simv
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.getEducations = async (req, res) => {
  try {
    const educations = await educationModel.find();
    if (!educations) {
      return response.returnFalse(200, req, res, "No Reord Found...", []);
    }
    res.status(200).send(educations)
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.getSingleEducation = async (req, res) => {
  try {
    const singleeducation = await educationModel.findOne({
      user_id: parseInt(req.params.user_id),
    });
    if (!singleeducation) {
      return response.returnFalse(200, req, res, "No Reord Found...", {});
    }
    return response.returnTrue(
      200,
      req,
      res,
      "education Data Fetch Successfully",
      singleeducation
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.editEducation = async (req, res) => {
  try {
    const editeducation = await educationModel.findOneAndUpdate(
      { education_id: parseInt(req.body.education_id) },
      {
        user_id: req.body.user_id,
        institute_name: req.body.institute_name,
        from_year: req.body.from_year,
        to_year: req.body.to_year,
        percentage: req.body.percentage,
        stream: req.body.stream,
        specialization: req.body.specialization,
        title: req.body.title
      },
      { new: true }
    );
    if (!editeducation) {
      return response.returnFalse(
        200,
        req,
        res,
        "No Reord Found With This education Id",
        {}
      );
    }
    return response.returnTrue(200, req, res, "Updation Successfully", editeducation);
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.deleteEducation = async (req, res) => {
  educationModel.deleteOne({ education_id: req.params.id }).then(item => {
    if (item) {
      return res.status(200).json({ success: true, message: 'education Person deleted' })
    } else {
      return res.status(404).json({ success: false, message: 'education Person not found' })
    }
  }).catch(err => {
    return res.status(400).json({ success: false, message: err })
  })
};