const appError=require('../../helper/appError');
const catchAsync=require('../../helper/catchAsync');
const AssignmentCommitModel=require('../../models/operationExecution/assignmentCommitModel')
const AssignmentModel=require('../../models/operationExecution/assignmentModel')
const PhasePageModel=require('../../models/operationExecution/phasePageModel')
const CampaignPlanModel=require('../../models/operationExecution/campaignPlanModel')

exports.createAssComm=catchAsync(async (req,res,next)=>{
    const {ass_id,likes,comments,reach,engagement,link,snapshot,campaignId,phase_id,execute} = req.body

    const data={
        ass_id,likes,comments,reach,engagement,campaignId,phase_id,link,snapshot
    }

    let result
    let result2
    let camp
    let phase
    if(execute){

         result2=await AssignmentModel.findOneAndUpdate({ass_id},{ass_status:'executed',isExecuted:true},{new:true})
        camp= await CampaignPlanModel.findOneAndUpdate({campaignId:result2.campaignId,p_id:result2.p_id},{isExecuted:true},{new:true})
         phase=await PhasePageModel.findOneAndUpdate({campaignId:result2.campaignId,p_id:result2.p_id,phase_id:result2.phase_id},{isExecuted:true},{new:true})
    }else{
        result=await AssignmentCommitModel.create(data)
         result2=await AssignmentModel.findOneAndUpdate({ass_id},{ass_status:'pending',isExecuted:true},{new:true})
         camp=await CampaignPlanModel.findOneAndUpdate({campaignId:result2.campaignId,p_id:result2.p_id},{isExecuted:true},{new:true})
         phase=await PhasePageModel.findOneAndUpdate({campaignId:result2.campaignId,p_id:result2.p_id,phase_id:result2.phase_id},{isExecuted:true},{new:true})
        
    }



    res.status(200).json({
        data: {result,result2,camp,phase}
    })
})



exports.getAssCommitAssId=catchAsync(async (req,res,next) => {
    const assid=req.params.id
    const result=await AssignmentCommitModel.find({ass_id:assid})
    res.status(200).json(
        {
            data: result
        }
    )
})


exports.getAllAssComm=catchAsync(async (req,res,next) => {
    const phase_id=req.params.id
    const result=await AssignmentCommitModel.findOne({phase_id})
    res.status(200).json({
        data: result
    })
})

exports.updateSingleCommitment=catchAsync(async (req,res,next) => {
    const comm_id=req.params.id
    //validation is remaining here
    const result=await AssignmentCommitModel.findOneAndUpdate({comm_id},req.body,{new:true})
    res.status(200).json({
        data:result
    })
})