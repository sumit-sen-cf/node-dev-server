const appError=require('../../helper/appError');
const catchAsync=require('../../helper/catchAsync');
const AssignmentCommitModel=require('../../models/operationExecution/assignmentCommitModel')
const AssignmentModel=require('../../models/operationExecution/assignmentModel')

exports.createAssComm=catchAsync(async (req,res,next)=>{
    const {ass_id,likes,comments,reach,engagement,link,snapshot,campaignId,phase_id,execute} = req.body

    const data={
        ass_id,likes,comments,reach,engagement,campaignId,phase_id,link,snapshot
    }

    let result
    let result2
    if(execute){

         result2=await AssignmentModel.findOneAndUpdate({ass_id},{ass_status:'executed'},{new:true})
    }else{
        result=await AssignmentCommitModel.create(data)
         result2=await AssignmentModel.findOneAndUpdate({ass_id},{ass_status:'pending'},{new:true})
        
    }



    res.status(200).json({
        data: {result,result2}
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