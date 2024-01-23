const registerCamapign = require("../models/registerCamapignModel");
const constant = require("../common/constant.js");
const response = require("../common/response");
const vari = require('../variables.js');
const {storage} = require('../common/uploadFile.js')
const catchAsync = require('../helper/catchAsync.js')

exports.addRegisterCampaign = catchAsync(async (req, res) => {
  
    const { brand_id, brnad_dt,captions,hashtags, industry,goal,agency,commitment, status, stage, detailing, exeCmpId } =req.body;
    // const excel_file = req.file.filename ?? "";

    let parsedCommitment = JSON.parse(commitment);
    const Obj = new registerCamapign({
      brand_id,
      brnad_dt,
      status,
      // excel_path: excel_file,
      commitment: parsedCommitment,
      stage,
      detailing,
      exeCmpId,
      captions,
      hashtags,
      industry,
      goal,
      agency

    });

    if(req.file){
      const bucketName = vari.BUCKET_NAME;
      const bucket = storage.bucket(bucketName);
      const blob = bucket.file(req.file.originalname);
      Obj.excel_path = blob.name;
      const blobStream = blob.createWriteStream();
      blobStream.on("finish", () => { 
        // res.status(200).send("Success") 
      });
      blobStream.end(req.file.buffer);
    }

    const savedRegisterCampaign = await Obj.save();
    res.status(200).json({ data: savedRegisterCampaign, status: 200 });
    // res.status(200).json({ data: savedRegisterCampaign, status: 200 });
  
  }
)
exports.getRegisterCampaigns = async (req, res) => {
  try {
    const campaigns = await registerCamapign.find();

    if (campaigns.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: constant.NO_RECORD_FOUND });
    } else {
      const url = `${constant.base_url}`;
      const dataWithFileUrls = campaigns.map((item) => ({
        ...item.toObject(),
        download_excel_file: item.excel_path ? url + item.excel_path : "",
      }));
      return res.status(200).send({ success: true, data: dataWithFileUrls });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting all Campaigns" });
  }
};

exports.getSingleRegisterCampign=async(req,res,next) => {
  try {
  
    const campaign=await  registerCamapign.findById(req.params.id)
    if (!campaign) {
      res
        .status(200)
        .send({ success: true, data: [], message: constant.NO_RECORD_FOUND });
    } 
    return res.status(200).send({ success: true, data: campaign });
  } catch (err) {
    res
    .status(500)
    .send({ error: err.message, message: "Error getting all Campaigns" });
  }
}

exports.editRegisterCampaign = async (req, res) => {
  try {
    const editRegisterCampaignObj = await registerCamapign.findOneAndUpdate(
      { register_campaign_id: parseInt(req.body.register_campaign_id) }, // Filter condition
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!editRegisterCampaignObj) {
      return res
        .status(200)
        .send({ success: false, message: constant.NO_RECORD_FOUND });
    }

    return res
      .status(200)
      .send({ success: true, data: editRegisterCampaignObj });
  } catch (err) {
    res
      .status(500)
      .send({
        error: err.message,
        message: "Error updating RegisterCampaign details",
      });
  }
};

exports.deleteRegisterCmp = async (req, res) => {
  const id = parseInt(req.params.id);
  const condition = { register_campaign_id: id };
  try {
    const result = await registerCamapign.deleteOne(condition);
    if (result.deletedCount === 1) {
      return response.returnTrue(
        200,
        req,
        res,
        `Register campaign with ID ${id} deleted successfully`,
        {}
      );
    } else {
      return response.returnFalse(
        200,
        req,
        res,
        `Register campaign with ID ${id} not found`,
        {}
      );
    }
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};
