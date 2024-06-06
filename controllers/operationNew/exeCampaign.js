const response = require("../common/response.js");
const exeCampaignSchema = require("../models/executionCampaignModel.js");

exports.getExeCampaigns = async (req, res) => {
  try {
    const exeCmp = await exeCampaignSchema.find();

    if (exeCmp.length === 0) {
      return response.returnFalse(200, req, res, "No Record Found !", {});
    } else {
      return response.returnTrue(
        200,
        req,
        res,
        "Data Fetched Successfully.",
        exeCmp
      );
    }
  } catch (err) {
    return response.returnTrue(500, req, res, err.message, {});
  }
};

exports.addExeCampaign = async (req, res) => {
  try {
    let check = await exeCampaignSchema.findOne({
      exeCmpName: req.body?.exeCmpName.toLowerCase().trim(),
    });
    if (check) {
      return response.returnFalse(
        200,
        req,
        res,
        "Execution camapaign name must be unique",
        {}
      );
    }
    const exeCampaignObj = new exeCampaignSchema({
      ...req.body,
    });
    const savedExeCampaign = await exeCampaignObj.save();
    return response.returnTrue(
      200,
      req,
      res,
      "Execution campaign created successfully",
      savedExeCampaign
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.getExeCampaignById = async (req, res) => {
  try {
    const exeCampaign = await exeCampaignSchema.findOne({
      exeCmpId: parseInt(req.params.id),
    });
    if (!exeCampaign) {
      return response.returnFalse(200, req, res, "No Record Found !", {});
    } else {
      return response.returnTrue(
        200,
        req,
        res,
        "Data Fetched Successfully.",
        exeCampaign
      );
    }
  } catch (err) {
    return response.returnTrue(500, req, res, err.message, {});
  }
};

exports.editExeCampaign = async (req, res) => {
  try {
    let check = await exeCampaignSchema.findOne({
      exeCmpName: req.body?.exeCmpName.toLowerCase().trim(),
      exeCmpId: { $ne: req.body?.exeCmpId },
    });
    if (check) {
      return response.returnFalse(
        200,
        req,
        res,
        "Execution camapaign name must be unique",
        {}
      );
    }
    const editExeCampaignObj = await exeCampaignSchema.findOneAndUpdate(
      { exeCmpId: parseInt(req.body.exeCmpId) }, // Filter condition
      {
        ...req.body,
        updated_date: Date.now(),
      },
      { new: true }
    );

    if (!editExeCampaignObj) {
      return response.returnFalse(
        200,
        req,
        res,
        "No Record Found with this exeCmpId.",
        {}
      );
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Data Update Successfully.",
      editExeCampaignObj
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.deleteExeCampaign = async (req, res) => {
  const id = parseInt(req.params.id);
  const condition = { exeCmpId: id };
  try {
    const result = await exeCampaignSchema.deleteOne(condition);
    if (result.deletedCount === 1) {
      return response.returnTrue(
        200,
        req,
        res,
        `Execution campaign with ID ${id} deleted successfully`,
        {}
      );
    } else {
      return response.returnFalse(
        200,
        req,
        res,
        `Execution campaign with ID ${id} not found`,
        {}
      );
    }
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};
