const campaignCategoryModel = require("../models/campaignCategoryModel");

exports.addCampaignCategory = async (req, res) => {
  const { campaignCategory_name, campaign_id, created_by } = req.body;
  try {
    let check = await campaignCategoryModel.findOne({
      campaignCategory_name: campaignCategory_name?.toLowerCase().trim(),
      campaign_id: campaign_id && parseInt(campaign_id),
    });
    if (check) {
      return res.status(200).send({
        data: {},
        message:
          "Provided campaign_id and existing campaignCategory_name should be unique.",
      });
    }
    const campaigncategory = new campaignCategoryModel({
      campaignCategory_name,
      campaign_id,
      created_by,
    });
    const savedcampaigncategory = await campaigncategory.save();
    return res.status(200).send({
      data: savedcampaigncategory,
      message: "campaigncategory created success",
    });
  } catch (err) {
    return res.status(500).send({
      error: err.message,
      message: "Error adding campaigncategory to database",
    });
  }
};

exports.getCampaignCategories = async (req, res) => {
  try {
    const campaigncategorydata = await campaignCategoryModel.find();
    if (campaigncategorydata.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      return res.status(200).send({ data: campaigncategorydata });
    }
  } catch (err) {
    return res
      .status(500)
      .send({
        error: err.message,
        message: "Error getting all campaigncategorydata",
      });
  }
};

exports.getCampaignCategoryById = async (req, res) => {
  try {
    const fetchedData = await campaignCategoryModel.findOne({
      campaignCategory_id: parseInt(req.params.id),
    });
    if (!fetchedData) {
      return res
        .status(200)
        .send({ success: false, data: {}, message: "No Record found" });
    } else {
      return res.status(200).send({ data: fetchedData });
    }
  } catch (err) {
    return res.status(500).send({
      error: err.message,
      message: "Error getting campaignCategory details",
    });
  }
};

exports.editCampaignCategory = async (req, res) => {
  try {
    let check = await campaignCategoryModel.findOne({
      campaignCategory_name: req.body?.campaignCategory_name
        ?.toLowerCase()
        .trim(),
      campaign_id: req.body?.campaign_id && parseInt(req.body?.campaign_id),
      campaignCategory_id: { $ne: req.body?.campaignCategory_id },
    });
    if (check) {
      return res.status(200).send({
        data: {},
        message:
          "Provided campaign_id and existing campaignCategeory_name should be unique.",
      });
    }
    const editcampaignCategory = await campaignCategoryModel.findOneAndUpdate(
      { campaignCategory_id: req.body.campaignCategory_id },
      {
        campaignCategory_name: req.body.campaignCategory_name,
        campaign_id: req.body.campaign_id,
        created_by: req.body.created_by,
      },
      { new: true }
    );
    if (!editcampaignCategory) {
      return res.status(500).send( {
        success: false,
        message: "Campaign category not found",
      });
    }
    res.status(200).send({ success: true, data: editcampaignCategory });
  } catch (err) {
    return res.status(500).send({
      error: err.message,
      message: "Error updating the campaignCategory in the database",
    });
  }
};

exports.deleteCampaignCategory = async (req, res) => {
  const id = req.params.id;
  const condition = { campaignCategory_id: id };
  try {
    const result = await campaignCategoryModel.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `campaignCategory with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `campaignCategory with ID ${id} not found`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the campaignCategory",
      error: error.message,
    });
  }
};
