const campaginSchema = require("../models/campaignModel.js");

exports.getCampaigns = async (req, res) => {
  try {
    const campaign = await campaginSchema.find();

    if (campaign.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      res.status(200).send({ success: true, data: campaign });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err, message: "Error getting all Campaigns" });
  }
};

exports.addCampaign = async (req, res) => {
  try {
    const { campaign_name, hash_tag, user_id, agency_id,brand_id, campaign_image } = req.body;

    const campaignObj = new campaginSchema({
      campaign_name,
      hash_tag,
      user_id,
      agency_id,
      brand_id,
      campaign_image
    });
    const savedcampaign = await campaignObj.save();
    res.send({ data: savedcampaign, status: 200 });
  } catch (err) {
    res
      .status(500)
      .send({ error: err, message: "This campaign cannot be created" });
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await campaginSchema.findOne({
      campaign_id: parseInt(req.params.id),
    });
    if (!campaign) {
      return res
        .status(200)
        .send({ success: false, data: {}, message: "No Record found" });
    } else {
      res.status(200).send({ data: campaign });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err, message: "Error getting campaign details" });
  }
};

exports.editCampaign = async (req, res) => {
  try {
    const {
      campaign_id,
      campaign_name,
      hash_tag,
      user_id,
      agency_id,
      updated_by,
      brand_id,
      campaign_image
    } = req.body;

    const editCampaignObj = await campaginSchema.findOneAndUpdate(
      { campaign_id: parseInt(campaign_id) }, // Filter condition
      {
        campaign_name,
        hash_tag,
        user_id,
        agency_id,
        updated_by,
        updated_date: Date.now(),
        brand_id,
        campaign_image
      },
      { new: true }
    );

    if (!editCampaignObj) {
      return res
        .status(200)
        .send({ success: false, message: "Campaign not found" });
    }

    return res.status(200).send({ success: true, data: editCampaignObj });
  } catch (err) {
    res
      .status(500)
      .send({ error: err, message: "Error updating campaign details" });
  }
};

exports.deleteCampaign = async (req, res) => {
  const id = parseInt(req.params.id);
  const condition = { campaign_id: id };
  try {
    const result = await campagingitSchema.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `Campaign with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `Campaign with ID ${id} not found`,
      });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: err });
  }
};
