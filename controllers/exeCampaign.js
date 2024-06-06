const constant = require("../common/constant.js");
const response = require("../common/response.js");
const { uploadImage } = require("../common/uploadImage.js");
const exeCampaignSchema = require("../models/executionCampaignModel.js");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage()
}).fields([
  { name: "exe_campaign_image", maxCount: 10 }
]);

exports.addExeCampaign = [
  upload,
  async (req, res) => {
    try {
      const { exe_campaign_id, exe_campaign_name, exe_hash_tag, brand_id, user_id, agency_id, created_by } = req.body
      const exeCampaignAdded = new exeCampaignSchema({
        exe_campaign_id,
        exe_campaign_name,
        exe_hash_tag,
        brand_id,
        user_id,
        agency_id,
        created_by
      });
      // Define the image fields 
      const imageFields = {
        exe_campaign_image: 'ExeCampaignImages',
      };
      for (const [field] of Object.entries(imageFields)) {    //itreates 
        if (req.files[field] && req.files[field][0]) {
          exeCampaignAdded[field] = await uploadImage(req.files[field][0], "ExeCampaignImages");
        }
      }
      await exeCampaignAdded.save();
      return response.returnTrue(
        200,
        req,
        res,
        "Execution campaign created successfully",
        exeCampaignAdded
      );
    } catch (err) {
      return response.returnFalse(500, req, res, err.message, {});
    }
  }];

exports.getExeCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const exeCampaignDetails = await exeCampaignSchema.findOne({
      _id: id,
      status: { $ne: constant.DELETED }
    });
    if (exeCampaignDetails) {
      return response.returnFalse(200, req, res, `No Record Found`, {});
    }
    // Return a success response with the updated record details
    return response.returnTrue(
      200,
      req,
      res,
      "Execution campaign details retrive successfully!",
      exeCampaignDetails
    );
  } catch (error) {
    // Return an error response in case of any exceptions
    return response.returnFalse(500, req, res, `${error.message}`, {});
  }
};

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
