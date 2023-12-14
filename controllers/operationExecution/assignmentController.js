const response = require('../../common/response');
const appError=require('../../helper/appError');
const catchAsync=require('../../helper/catchAsync');
const AssignmentModel=require('../../models/operationExecution/assignmentModel')
const campaignPlanModel = require('../../models/operationExecution/campaignPlanModel');
const PhasePageModel = require('../../models/operationExecution/phasePageModel')

exports.createAssignment=catchAsync(async (req,res,next) => {
    const {ass_to,ass_by,page,ass_status}=req.body
    let { _id, ...rest } = page
    const data={
        ass_by,
        ass_to,
        ass_status,
        ...rest
    }
    const result=await AssignmentModel.create(data)
    res.status(200).json({
        data:result
    })
})

exports.getAllAssignmentToExpertee=catchAsync(async (req,res,next) => {
    const id=req.params.id
    const result=await AssignmentModel.find({ass_to:id})
    // if(!result) {
    //     return next(new appError(404,"assignment not found"))
    // }
    res.status(200).json({
        data:result
    })
})
exports.getSingleAssignment=catchAsync(async (req,res,next) => {
    const id=req.params.id
    const result=await AssignmentModel.find({ass_id:id})
    if(!result) {
        return next(new appError(404,"assignment not found"))
    }
    res.status(200).json({
        data:result
    })
})
exports.updateAssignment = catchAsync(async (req,res,next)=>{
    const { campaignId, p_id, phase_id} = req.body
    const filter1 = { campaignId, p_id, phase_id };
    const filter2 = { campaignId, p_id };

    // const options1  = {
    //   new: true, // Return the modified document rather than the original
    //   upsert: true, // If the document does not exist, insert a new one
    // };
    const options2  = {
      new: true, // Return the modified document rather than the original
    };
    
    const result = await AssignmentModel.findOneAndUpdate(filter1, req.body, options2);
    if(!result) {
        const data = new AssignmentModel({
            ...req.body
          });
          const savedData = await data.save();
          if(!savedData) {
              return next(new appError(200,"Something went wrong while creating AssignmentModel data."))
          }
        
    }

    const result2 = await campaignPlanModel.findOneAndUpdate(filter2, {...req.body, updatedFrom : "Assignment"}, options2);
    if(!result2) {
        const data = new campaignPlanModel({
            ...req.body
          });
          const savedData = await data.save();
          if(!savedData) {
              return next(new appError(200,"Something went wrong while creating plan data."))
          }

    }
    const result3 = await PhasePageModel.findOneAndUpdate(filter1, {...req.body, updatedFrom : "Assignment"}, options2);

   return response.returnTrue(200,req,res,"Updation Operation Successfully.")
})
exports.deleteAssignment=catchAsync(async (req,res,next) => {

})