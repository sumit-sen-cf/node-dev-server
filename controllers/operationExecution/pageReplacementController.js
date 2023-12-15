const appError = require('../../helper/appError');
const catchAsync = require('../../helper/catchAsync');
const pageReplacementRecordModel = require('../../models/operationExecution/pageReplacementRecordModel')
const CampaignPlanModel = require('../../models/operationExecution/campaignPlanModel')
const CampaignPhaseModel = require('../../models/operationExecution/campaignPhaseModel')
const PhasePageModel = require('../../models/operationExecution/phasePageModel')
const AssignmentModel=require('../../models/operationExecution/assignmentModel')

exports.createReplacementPlan = catchAsync(async (req, res, next) => {
    //????validation check if request is already made

    
    //1.changes at plan level
    const { planName,
        campaignId,
        
        replacement_request_by,
        page,
        oldPage_id,
        newPage_id,
        campaignName,
        replacement_stage
        
    } = req.body
    
    const validation=await pageReplacementRecordModel.findOne({campaignId,
        
        replacement_request_by,
        page,
        oldPage_id,
        newPage_id,
        campaignName})

        if(validation){
            return next(new appError(404,"replacement request already made"))
        }
    
    const newPageData = {
        planName,
        campaignId,
        replacement_status:'active',
        campaignName,
        postRemaining: page.postPerPage,
        ...page

    }

    const newPage=await CampaignPlanModel.create(newPageData)
    const dataReplacement =
    {
        replacement_stage,
        planName,
        campaignId,
        campaignName,
        replacement_request_by,
        newPage_id,
        oldPage_id,
    }

    const replacementRecord = await pageReplacementRecordModel.create(dataReplacement)

    const oldPageUpdate=await CampaignPlanModel.findOneAndUpdate({"p_id":oldPage_id,"campaignId":campaignId},{
        replacement_status:'pending',
        replacement_stage,
        replacement_id:replacementRecord._id,
    },{new:true})

  
   

    const allPhases = await CampaignPhaseModel.find({ campaignId: campaignId })
    
    for (let i = 0; i < allPhases.length; i++) {
          //2. effect at phase level

        const pageExist = await PhasePageModel.findOneAndUpdate({ phase_id: allPhases[i].phase_id, p_id: oldPage_id },
            {replacement_status:"pending",
            replacement_stage,
            replacement_id:replacementRecord._id},{new:true})

            //3. at assignment level

        const assignmentExist = await AssignmentModel.findOneAndUpdate({ phase_id: allPhases[i].phase_id, p_id: oldPage_id },
            {replacement_status:"pending",
            replacement_stage,
            replacement_id:replacementRecord._id},{new:true})

        // }
        console.log(assignmentExist)
    }

    res.status(200).json({
        data: {
            
            newPage,replacementRecord,oldPageUpdate
        }
    })

    
   

})

exports.getSingleRecord=catchAsync(async (req,res,next) => {
    const id=req.params.id
    const result=await pageReplacementRecordModel.findById(id)
    res.status(200).json({
        data:result
    })
})
exports.createReplacementPhase=catchAsync(async (req,res,next) =>{

})