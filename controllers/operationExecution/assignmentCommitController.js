const appError=require('../../helper/appError');
const catchAsync=require('../../helper/catchAsync');
const AssignmentCommitModel=require('../../models/operationExecution/assignmentCommitModel')
const AssignmentModel=require('../../models/operationExecution/assignmentModel')

exports.createAssComm=catchAsync(async (req,res,next)=>{
    const {ass_id,likes,comments,reach,engagement,link,snapshot,campaignId,phase_id} = req.body

    const data={
        ass_id,likes,comments,reach,engagement,campaignId,phase_id,link,snapshot
    }

    const result=await AssignmentCommitModel.create(data)
    const result2=await AssignmentModel.findOneAndUpdate({ass_id},{ass_status:'pending'},{new:true})

    res.status(200).json({
        data: {result,result2}
    })
})
exports.getAllAssComm=catchAsync(async (req,res,next) => {
    const phase_id=req.params.id
    const result=await AssignmentCommitModel.findOne({phase_id})
    res.status(200).json({
        data: result
    })
})

exports.update=catchAsync(async (req,res,next) => {
    const phase_id=req.params.id
    //validation is remaining here
    const result=await AssignmentCommitModel.findOneAndUpdate({phase_id},req.body,{new:true})
    res.status(200).json({
        data:result
    })
})