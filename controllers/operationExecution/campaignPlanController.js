const CampaignPlanModel = require('../../models/operationExecution/campaignPlanModel')
const appError = require('../../helper/appError');
const catchAsync = require('../../helper/catchAsync');

const PhasePageModel = require('../../models/operationExecution/phasePageModel')
const AssignmentModel = require('../../models/operationExecution/assignmentModel');
const response = require('../../common/response');

const AssignmentCommitModel = require('../../models/operationExecution/assignmentCommitModel.js')
const campaignPhaseModel = require('../../models/operationExecution/campaignPhaseModel.js')

const PageDeleteRecordModel = require('../../models/operationExecution/pageDeleteRecordModel.js')
const pageReplacementRecordModel = require('../../models/operationExecution/pageReplacementRecordModel.js')
const PhaseCommitmentModel = require('../../models/operationExecution/phaseCommitmentModel.js')
const CampaignPhaseModel=require('../../models/operationExecution/campaignPhaseModel.js')




exports.createPlan = catchAsync(async (req, res, next) => {
    //will receive array of objects(pages),campaignId,vendor,campaignName,pageName
    
    const { pages, campaignId, campaignName, planName } = req.body

    for(let i = 0; i < pages.length; i++) {
       if(!pages[i].postPerPage || !pages[i].storyPerPage){
            next(new appError(500,"all pages should contain storyPerPage and postPerPage"))
        }
    }
    for (let i = 0; i < pages.length; i++) {

        
        let data = {
            planName,
            campaignId,

            campaignName,
            postRemaining: pages[i].postPerPage,
            storyRemaining: pages[i].storyPerPage,
            ...pages[i]

        }
       
        const result = await CampaignPlanModel.create(data)


    }

    const doc = await CampaignPlanModel.find({ campaignId: campaignId })
    res.send({ data: doc, status: 200 });
    //validation is remaining

})
//to get all plan 
exports.getPlan = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const result = await CampaignPlanModel.find({ campaignId: id,delete_status:"inactive" })
    if (!result) {
        return next(new appError(404, "plans not found"))
    }
    res.send({ data: result, status: 200 })
})
exports.getSinglePlan = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const result = await CampaignPlanModel.find({ plan_id: id })
    if (!result) {
        return next(new appError(404, "plan not found"))
    }
    res.send({ data: result, status: 200 })
})

//update plan

exports.updateBulk = catchAsync(async (req, res, next) => {
    const { pages, campaignId, campaignName, planName } = req.body
    const allPlan = await campaignPlanModel.find({ campaignId })
    //pages to add will give the new pages that has been added to the existing pln
    const pagesToAdd = pages.filter(
        (item) => !allPlan.some((selectedItem) => selectedItem.p_id === item.p_id)
    );

    //this will find the old pages that needed to be updated
    const oldPages = pages.filter(
        (item) => allPlan.some((selectedItem) => selectedItem.p_id === item.p_id)
    );

    //updating each page one by one
    oldPages.forEach(async page => {
        const result = await CampaignPlanModel.findOneAndUpdate({ plan_id: page.plan_id }, { postPerPage: page.postPerPage })
    })

    //now we have to loop through the pages to add in order to add them to the plan 
    pagesToAdd.forEach(async page => {
        let data = {
            planName,
            campaignId,

            campaignName,
            postRemaining: page.postPerPage,
            ...page

        }

        const result = await CampaignPlanModel.create(data)
    });
    const updatedPlan = await campaignPlanModel.find({ campaignId })
    res.send({ data: updatedPlan, status: 200 });
})

exports.singlePlanUpdate = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    //validation is remaining
    const result = await CampaignPlanModel.findOneAndUpdate({ plan_id: id }, req.body, { new: true })
    res.send({ data: result, status: 200 })

})
exports.updatePlan = catchAsync(async (req, res, next) => {
    const { campaignId, p_id,postPerPage,storyPerPage } = req.body
    const filter = { campaignId, p_id };
    const data={postPerPage,storyPerPage,postRemaining:postPerPage,storyRemaining:storyPerPage}

    const phaseExist=await CampaignPhaseModel.find({campaignId})
    if(phaseExist.length>0) {
        return next(new appError(200, "Can't update , phase already Exist"))
    }

    // const options1  = {
    //   new: true, // Return the modified document rather than the original
    //   upsert: true, // If the document does not exist, insert a new one
    // };
    const options2 = {
        new: true, // Return the modified document rather than the original
    };

    const result = await CampaignPlanModel.findOneAndUpdate(filter,data, options2);
    if (!result) {
        const data = new CampaignPlanModel({
            ...req.body
        });
        const savedData = await data.save();
        if (!savedData) {
            return next(new appError(200, "No Record Found For Respective CampaignId and P_id (page id ) in Plan model."))
        }
    }

    const result2 = await PhasePageModel.findOneAndUpdate(filter, { ...data, updatedFrom: "Plan" }, options2);
    const result3 = await AssignmentModel.findOneAndUpdate(filter, { ...data, updatedFrom: "Plan" }, options2);

    return response.returnTrue(200, req, res, "Updation Operation Successfully.")


})

exports.deleteSinglePlan=catchAsync(async (req,res,next) => {
    const {page,deletion_request_by}=req.body

    const DataForDeleteRecord={
        plan_id:page?.plan_id,
        plan_name:page?.plan_name,
        campaignId:page?.campaignId,
        campaignName:page?.campaignName,
        deletion_request_by,
        deleted_page:page?.p_id,
        deletion_stage:"plan",
        page_name:page?.page_name,
    }

    const deleteRecord=await PageDeleteRecordModel.create(DataForDeleteRecord)
    const data={delete_id:deleteRecord._id,delete_status:"active"}
    const option={new:true}
    const updatePlan=await CampaignPlanModel.findOneAndUpdate({campaignId:page.campaignId,plan_id:page.plan_id,p_id:page.p_id},data,option)
    const updateAssignment=await AssignmentModel.findOneAndUpdate({campaignId:page.campaignId,plan_id:page.plan_id,p_id:page.p_id},data,option)
    const updatePhasePage=await PhasePageModel.findOneAndUpdate({campaignId:page.campaignId,plan_id:page.plan_id,p_id:page.p_id},data,option)
    res.status(200).json({
        updatePlan,
        
        updatePhasePage,
        updateAssignment
    })


    
})

exports.deleteEntirePlan = catchAsync(async (req, res, next) => {
    const campaignId = req.params.id

    await AssignmentModel.deleteMany({ campaignId })
    await AssignmentCommitModel.deleteMany({ campaignId })
    await campaignPhaseModel.deleteMany({ campaignId })
    await CampaignPlanModel.deleteMany({ campaignId })
    await PageDeleteRecordModel.deleteMany({ campaignId })
    await pageReplacementRecordModel.deleteMany({ campaignId })
    await PhaseCommitmentModel.deleteMany({ campaignId })
    await PhasePageModel.deleteMany({ campaignId })


    res.status(200).json({
        message: "success"
    })
})
