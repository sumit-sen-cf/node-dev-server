const response = require("../common/response.js");
const familyModel = require("../models/familyModel.js");

exports.addFamily = async (req, res) => {
  try {
    const family = new familyModel({
      user_id : req.body.user_id,  
      name: req.body.name,
      DOB : req.body.DOB,
      relation : req.body.relation,
      contact: req.body.contact,
      occupation : req.body.occupation,
      annual_income : req.body.annual_income
    });
    const simv = await family.save();
    return response.returnTrue(
      200,
      req,
      res,
      "Family Person Created Successfully",
      simv
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.getFamilys = async (req, res) => {
  try {
    const families = await familyModel.find();
    if (!families) {
      return response.returnFalse(200, req, res, "No Reord Found...", []);
    }
    res.status(200).send(families)
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.getSingleFamily = async (req, res) => {
  try {
    const singlefamily = await familyModel.findOne({
      family_id: parseInt(req.params.family_id),
    });
    if (!singlefamily) {
      return response.returnFalse(200, req, res, "No Reord Found...", {});
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Family Person Data Fetch Successfully",
      singlefamily
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.editFamily = async (req, res) => {
  try {
    const editFamily = await familyModel.findOneAndUpdate(
      { family_id: parseInt(req.body.family_id) },
      {
        user_id : req.body.user_id,  
        name: req.body.name,
        DOB : req.body.DOB,
        relation : req.body.relation,
        contact: req.body.contact,
        occupation : req.body.occupation,
        annual_income : req.body.annual_income
      },
      { new: true }
    );
    if (!editFamily) {
      return response.returnFalse(
        200,
        req,
        res,
        "No Reord Found With This Family Id",
        {}
      );
    }
    return response.returnTrue(200, req, res, "Updation Successfully", editFamily);
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.deleteFamily = async (req, res) => {
  familyModel.deleteOne({ family_id: req.params.family_id }).then(item => {
    if (item) {
      return res.status(200).json({ success: true, message: 'Family Person deleted' })
    } else {
      return res.status(404).json({ success: false, message: 'Family Person not found' })
    }
  }).catch(err => {
    return res.status(400).json({ success: false, message: err })
  })
};