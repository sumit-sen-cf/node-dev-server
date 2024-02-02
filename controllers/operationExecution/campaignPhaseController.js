const CampaignPhaseModel = require('../../models/operationExecution/campaignPhaseModel')
const PhaseCommitmentModel = require('../../models/operationExecution/phaseCommitmentModel')
const PhasePageModel = require('../../models/operationExecution/phasePageModel')

const appError = require('../../helper/appError');
const catchAsync = require('../../helper/catchAsync');
const campaignPlanModel = require('../../models/operationExecution/campaignPlanModel');
const campaignPhaseModel = require('../../models/operationExecution/campaignPhaseModel');
const AssignmentModel = require('../../models/operationExecution/assignmentModel');
const response = require('../../common/response');
const PageDeleteRecordModel = require('../../models/operationExecution/pageDeleteRecordModel.js')

const preAssignmentModel=require('../../models/operationExecution/preAssignmentModel.js')
const AssignmentCommitModel = require('../../models/operationExecution/assignmentCommitModel.js')



const pageReplacementRecordModel = require('../../models/operationExecution/pageReplacementRecordModel.js')

// in phase we have done the parent refrencing. here parent is campaign phase , 
// phasepages and phase commitments are refrencing towards the parent campaign phase  

exports.createPhase = catchAsync(async (req, res, next) => {
  const { phaseName, campaignName, planName, description, campaignId, startDate, endDate, pages, commitment } = req.body
  let phaseData = { phaseName, campaignName, planName, description, campaignId, startDate, endDate }
  //first we will create the campaign phase 
  const phaseResult = await CampaignPhaseModel.create(phaseData)

  //now we will create the phase pages which will be refrencing towards the parent campaign phase
  for (i = 0; i < pages.length; i++) {
    let { _id, ...rest } = pages[i]
    let pageData = { ...rest, phase_id: phaseResult.phase_id, phaseName, campaignId, planName, campaignName }

    const pageResult = await PhasePageModel.create(pageData)
  }

  //now we will create the commitment associated with the current phase 

  for (i = 0; i < commitment.length; i++) {

    let commitmentData = {
      ...commitment[i], phase_id: phaseResult.phase_id, phaseName, campaignName, planName, campaignId
    }

    const commitmentResult = await PhaseCommitmentModel.create(commitmentData)
  }

  //now we have to update in the plan and udate with the remaining pages

  pages.forEach(async page => {
    const result = await campaignPlanModel.findOneAndUpdate({ plan_id: page.plan_id }, { postRemaining: page.postRemaining, storyRemaining: page.storyRemaining }, { new: true })

  })


  //sending response
  const page = await PhasePageModel.find({ phaseId: phaseResult._id })
  const comm = await PhaseCommitmentModel.find({ phaseId: phaseResult._id })
  res.send({ data: { phaseResult, page, comm }, status: 200 });


})


exports.getAllPhase = catchAsync(async (req, res, next) => {
  //first find all the phase details

  const allPhase = await CampaignPhaseModel.find({ campaignId: req.params.id})


  const result = await Promise.all(
    allPhase.map(async (phase) => {
      const getPages = await PhasePageModel.find({ phase_id: phase.phase_id,delete_status:'inactive' });
      const getComm = await PhaseCommitmentModel.find({ phase_id: phase.phase_id });
      return { ...phase.toObject(), pages: getPages, commitment: getComm };
    })
  );

  res.status(200).json({ result });



})

exports.getSinglePhase = catchAsync(async (req, res, next) => {
  id = req.params.id;
  const phase = await campaignPhaseModel.findOne({ phase_id: id });
  const getPages = await PhasePageModel.find({ phase_id: id,delete_status:'inactive' });
  const getComm = await PhaseCommitmentModel.find({ phase_id: id });

  res.send({ data: { ...phase, pages: getPages, commitment: getComm }, status: 200 })
})

exports.updateBulk = catchAsync(async (req, res, next) => {
  //i need phase id
  //on basis of phaseid i will fetch all the pages associated with the phase
  //in the body i will have list of more pages
  //1. pages that are already in the plan
  //2. pages that are not in the plan
  //1.check if pages are not in the plan
  //get all the plan detail
  //find the subtraction of incoming pages and already existed pages.

  //if there is data in subtraction array ,then alson find the common 
  //add them to the plan 
  //else nothin
  //2.check if there is page which is not in the phase 
  //on basis of phaseid i will fetch all the pages associated with the phase

})

exports.updatePhase = catchAsync(async (req, res, next) => {
  const { campaignId, p_id, phase_id } = req.body
  const filter1 = { campaignId, p_id, phase_id };
  const filter2 = { campaignId, p_id };

  // const options1  = {
  //   new: true, // Return the modified document rather than the original
  //   upsert: true, // If the document does not exist, insert a new one
  // };
  const options2 = {
    new: true, // Return the modified document rather than the original
  };

  const result = await PhasePageModel.findOneAndUpdate(filter1, req.body, options2);
  if (!result) {
    const data = new PhasePageModel({
      ...req.body
    });
    const savedData = await data.save();
    if (!savedData) {
      return next(new appError(200, "Something went wrong while creating phase page model ."))
    }

  }

  const result2 = await campaignPlanModel.findOneAndUpdate(filter2, { ...req.body, updatedFrom: "Phase" }, options2);
  if (!result2) {
    const data = new campaignPlanModel({
      ...req.body
    });
    const savedData = await data.save();
    if (!savedData) {
      return next(new appError(200, "Something went wrong while creating plan."))
    }
  }
  const result3 = await AssignmentModel.findOneAndUpdate(filter1, { ...req.body, updatedFrom: "Phase" }, options2);


  return response.returnTrue(200, req, res, "Updation Operation Successfully.")
})

exports.deleteEntirePhase = catchAsync(async (req, res, next) => {
  const phase_id = req.params.id
  await AssignmentModel.deleteMany({ phase_id })
  await AssignmentCommitModel.deleteMany({ phase_id })
  await campaignPhaseModel.deleteMany({ phase_id })


  await PhaseCommitmentModel.deleteMany({ phase_id })
  await PhasePageModel.deleteMany({ phase_id })

  res.status(200).json({
    message: "success"
  })

})
exports.deleteSinglePage = catchAsync(async (req, res, next) => {
  const { page, deletion_request_by } = req.body

  const DataForDeleteRecord = {
    plan_id: page?.plan_id,
    plan_name: page?.plan_name,
    campaignId: page?.campaignId,
    campaignName: page?.campaignName,
    deletion_request_by,
    deleted_page: page?.p_id,
    deletion_stage: "plan",
    page_name: page?.page_name,
    phase_id: page?.phase_id,
  }

  const deleteRecord = await PageDeleteRecordModel.create(DataForDeleteRecord)
  const data = { delete_id: deleteRecord._id, delete_status: "active" }
  const option = { new: true }

  const updatePhasePage = await PhasePageModel.findOneAndUpdate({ campaignId: page.campaignId, plan_id: page.plan_id, p_id: page.p_id, phase_id: page.phase_id }, data, option)
  const updateAssignment = await AssignmentModel.findOneAndUpdate({ campaignId: page.campaignId, plan_id: page.plan_id, p_id: page.p_id, phase_id: page.phase_id }, data, option)
  const deletePreAssignment=await preAssignmentModel.deleteMany({campaignId:page.campaignId,phase_id: page.phase_id })
  res.status(200).json({
    updatePhasePage,
    updateAssignment
  })


})