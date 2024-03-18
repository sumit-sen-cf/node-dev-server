const catchAsync = require('../../../helper/catchAsync')
const appError = require('../../../helper/appError')
const TempPlanModel = require('../../../models/operationExecution/tempPlan/tempPlanModel.js')
const TempPlanPagesModel = require('../../../models/operationExecution/tempPlan/tempPlanPages.js')
const ExpertiseModel = require('../../../models/operationExecution/expertiseModel.js')
const TempAssignmentModel = require('../../../models/operationExecution/tempPlan/tempAssignmentModel.js')
const TempExecutionModel = require('../../../models/operationExecution/tempPlan/tempExecutionModel.js')

exports.createTempPlan = catchAsync(async (req, res, next) => {
    const { planName, campaignId, campaignName, pages } = req.body

    //first create a plan

    const planData = { planName, campaignId, campaignName }

    const planResponse = await TempPlanModel.create(planData)


    for (const page of pages) {

        const planPagesData = {
            plan: planResponse._id,
            campaignId,
            ...page
        }
        //second create plan pages that we have to loop through the pages we got from the req.body

        const planPageResponse = await TempPlanPagesModel.create(planPagesData)

        //third create assignment based on the category we recieve from the pages

        //first find expert associated with the given category 

        const availableExperts = await ExpertiseModel.find({ 'area_of_expertise.category': { $in: [`${page.cat_name}`] } })


        //assigned the available expertee their respective task

        for (const expert of availableExperts) {

            const expertData = {
                plan: planResponse._id,
                campaignId,
                page: planPageResponse._id,
                ass_to: expert._id
            }

            await TempAssignmentModel.create(expertData)

        }

        //fourth creating the pending execution task  both for Post and Story

        if (page.postPerPage) {
            for (let i = 0; i < String(page.postPerPage); i++) {
                const executionData = {
                    plan: planResponse._id,
                    campaignId,
                    page: planPageResponse._id,
                    commitType: 'post'
                }

                await TempExecutionModel.create(executionData)
            }
        }

        if (page.storyPerPage) {
            for (let i = 0; i < String(page.storyPerPage); i++) {
                const executionData = {
                    plan: planResponse._id,
                    campaignId,
                    page: planPageResponse._id,
                    commitType: 'story'
                }

                await TempExecutionModel.create(executionData)
            }
        }
    }

    const assignments=await TempAssignmentModel.find({plan:planResponse._id})
    const planPage=await TempPlanPagesModel.find({plan:planResponse._id})
    const execution=await TempExecutionModel.find({plan:planResponse._id})
    res.status(200).json({
        planResponse,
        planPage,
        assignments,
        execution
    })

})


exports.getAllPlan=catchAsync(async (req,res,next) => {

})

exports.deletePlan=catchAsync(async (req,res,next) => {
    
})