const designationModel = require('../models/designationModel.js');
const response = require("../common/response.js");
const objModel = require('../models/objModel.js');
const deptDesiAuthModel = require("../models/deptDesiAuthModel.js");

exports.addDesignation = async (req, res) => {
  try {
    const checkDuplicacy = await designationModel.findOne({ desi_name: req.body.desi_name })
    if (checkDuplicacy) {
      return res.status(409).send({
        data: [],
        message: "Designation name already exist",
      });
    }
    const simc = new designationModel({
      desi_name: req.body.desi_name,
      dept_id: req.body.dept_id,
      remark: req.body.remark,
      created_by: req.body.created_by
    })
    const simv = await simc.save();

    //latest desi Id get
    const latestDesiId = (simv && simv.desi_id) ? simv.desi_id : null;

    //get object model all data
    const objectData = await objModel.find();

    //itrate object model data
    for (const object of objectData) {
      const objectId = object.obj_id;

      let insert = 0;
      let view = 0;
      let update = 0;
      let delete_flag = 0;

      const deptDesiAuthData = {
        desi_id: latestDesiId,
        dept_id: req.body.dept_id,
        obj_id: objectId,
        insert: insert,
        view: view,
        update: update,
        delete_flag: delete_flag,
      };

      //data create in deptDesiAuthModel
      await deptDesiAuthModel.create(deptDesiAuthData);
    }
    //response send
    res.send({ simv, status: 200 });
  } catch (err) {
    res.status(500).send({ error: err, sms: 'This designation cannot be created' })
  }
};

exports.getDesignations = async (req, res) => {
  try {
    const simc = await designationModel.aggregate([
      {
        $lookup: {
          from: 'departmentmodels',
          localField: 'dept_id',
          foreignField: 'dept_id',
          as: 'department'
        }
      },
      {
        $unwind: '$department'
      },
      {
        $project: {
          _id: 1,
          department_name: '$department.dept_name',
          desi_name: '$desi_name',
          dept_id: "$dept_id",
          desi_id: "$desi_id",
          _id: "$_id",
          remark: "$remark"
        }
      }
    ]).exec();
    if (!simc) {
      res.status(500).send({ success: false })
    }
    res.status(200).send({ success: true, data: simc })
  } catch (err) {
    res.status(500).send({ error: err, sms: 'Error getting all designations' })
  }
};

exports.getSingleDesignation = async (req, res) => {
  try {
    const singlesim = await designationModel.findOne({
      desi_id: parseInt(req.params.desi_id),
    });
    if (!singlesim) {
      return response.returnFalse(200, req, res, "No Reord Found...", {});
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Designation Data Fetch Successfully",
      singlesim
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.editDesignation = async (req, res) => {
  try {
    const checkDuplicacy = await designationModel.findOne({ desi_name: req.body.desi_name })
    if (checkDuplicacy) {
      return res.status(409).send({
        data: [],
        message: "Designation name already exist",
      });
    }
    const editsim = await designationModel.findOneAndUpdate(
      { desi_id: parseInt(req.body.desi_id) },
      {
        desi_name: req.body.desi_name,
        dept_id: req.body.dept_id,
        remark: req.body.remark,
        last_updated_by: req.body.last_updated_by,
        last_updated_at: req.body.last_updated_at
      },
      { new: true }
    );
    if (!editsim) {
      return response.returnFalse(
        200,
        req,
        res,
        "No Reord Found With This Designation Id",
        {}
      );
    }
    return response.returnTrue(200, req, res, "Updation Successfully", editsim);
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.deleteDesignation = async (req, res) => {
  designationModel.deleteOne({ desi_id: req.params.desi_id }).then(item => {
    if (item) {
      return res.status(200).json({ success: true, message: 'designation deleted' })
    } else {
      return res.status(404).json({ success: false, message: 'designation not found' })
    }
  }).catch(err => {
    return res.status(400).json({ success: false, message: err })
  })
};

exports.getAllDesignationByDeptID = async (req, res) => {
  try {
    const desiData = await designationModel.find({
      dept_id: parseInt(req.params.dept_id),
    });
    if (!desiData) {
      return response.returnFalse(200, req, res, "No Reord Found...", []);
    }
    return response.returnTrue(
      200,
      req,
      res,
      "All Designation Data Fetch By Dept Id Successfully",
      desiData
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};