const registerCamapign = require("../models/registerCamapignModel");
const constant = require("../common/constant.js");
const response = require("../common/response");
const vari = require('../variables.js');
const { storage } = require('../common/uploadFile.js')
const catchAsync = require('../helper/catchAsync.js')
const AssignmentModel = require('../models/operationExecution/assignmentModel.js')
const AssignmentCommitModel = require('../models/operationExecution/assignmentCommitModel.js')
const campaignPhaseModel = require('../models/operationExecution/campaignPhaseModel.js')
const campaignPlanModel = require('../models/operationExecution/campaignPlanModel.js')
const PageDeleteRecordModel = require('../models/operationExecution/pageDeleteRecordModel.js')
const pageReplacementRecordModel = require('../models/operationExecution/pageReplacementRecordModel.js')
const PhaseCommitmentModel = require('../models/operationExecution/phaseCommitmentModel.js')
const PhasePageModel = require('../models/operationExecution/phasePageModel.js')
const PreAssignmentModel=require('../models/operationExecution/preAssignmentModel.js')


exports.addRegisterCampaign = catchAsync(async (req, res) => {

  const { brand_id, brnad_dt, captions, hashtags, industry, goal, agency, commitment, status, stage, detailing, exeCmpId } = req.body;
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

  if (req.file) {
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

exports.getSingleRegisterCampign = async (req, res, next) => {
  try {

    const campaign = await registerCamapign.findById(req.params.id)
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

exports.deleteRegisterCmp = catchAsync(async (req, res) => {
  const campaignId = req.params.id
  //to delete campaign first we need to delete the document which is referencing it 

  //1.deleting the assignment and commit

  await AssignmentModel.deleteMany({ campaignId })
  await AssignmentCommitModel.deleteMany({ campaignId })
  await campaignPhaseModel.deleteMany({ campaignId })
  await campaignPlanModel.deleteMany({ campaignId })
  await PageDeleteRecordModel.deleteMany({ campaignId })
  await pageReplacementRecordModel.deleteMany({ campaignId })
  await PhaseCommitmentModel.deleteMany({ campaignId })
  await PhasePageModel.deleteMany({ campaignId })
  // await PreAssignmentModel.deleteMany({ campaignId })
  const campaignDelete = await registerCamapign.findByIdAndDelete(campaignId)


  res.status(200).json({
    message: "success",
    campaignDelete
  })

})
