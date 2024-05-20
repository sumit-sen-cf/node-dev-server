const constant = require("../../common/constant");
const response = require("../../common/response");
const payCycleModel = require("../../models/PMS2/payCycleModel");

exports.addPayCycle = async (req, res) => {
  try {
    const { cycle_name, description, created_by } = req.body;
    const savingObj = payCycleModel({
      cycle_name,
      description,
      created_by,
    });
    const savedObj = await savingObj.save();
    if (!savedObj) {
      return response.returnFalse(
        500,
        req,
        res,
        `Oop's Something went wrong while saving pay cycle data.`,
        {}
      );
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Successfully Saved pay cycle Data",
      savedObj
    );
  } catch (error) {
    return response.returnFalse(500, req, res, `${error.message}`, {});
  }
};

exports.getSinglePayCycleDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const payCycleDetail = await payCycleModel.findOne({
      _id: id,
      status: { $ne: constant.DELETED },
    });
    if (!payCycleDetail) {
      return response.returnFalse(200, req, res, `No Record Found`, {});
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Successfully Fetch Pay cycle Data",
      payCycleDetail
    );
  } catch (error) {
    return response.returnFalse(500, req, res, `${error.message}`, {});
  }
};

exports.getAllPayCycleDetails = async (req, res) => {
  try {
    const payCycleDetails = await payCycleModel.find({
      status: { $ne: constant.DELETED },
    });
    if (payCycleDetails?.length <= 0) {
      return response.returnFalse(200, req, res, `No Record Found`, []);
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Successfully Fetch Pay Cycle Details",
      payCycleDetails
    );
  } catch (error) {
    return response.returnFalse(500, req, res, `${error.message}`, {});
  }
};

exports.updateSinglePayCycleDetails = async (req, res) => {
  try {
    const { id } = req.body;
    const payCycleDetail = await payCycleModel.findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true }
    );
    if (!payCycleDetail) {
      return response.returnFalse(200, req, res, `No Record Found`, {});
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Successfully Update Pay Cycle Data",
      payCycleDetail
    );
  } catch (error) {
    return response.returnFalse(500, req, res, `${error.message}`, {});
  }
};

exports.deletePayCycleDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const payCycleDetailDeleted = await payCycleModel.findOneAndUpdate(
      { _id: id, status: { $ne: constant.DELETED } },
      {
        $set: {
          status: constant.DELETED,
        },
      },
      { new: true }
    );
    if (!payCycleDetailDeleted) {
      return response.returnFalse(200, req, res, `No Record Found`, {});
    }
    return response.returnTrue(
      200,
      req,
      res,
      `Successfully Delete Pay Cycle Data for id ${id}`,
      payCycleDetailDeleted
    );
  } catch (error) {
    return response.returnFalse(500, req, res, `${error.message}`, {});
  }
};
