const appError = require('../../helper/appError');
const catchAsync = require('../../helper/catchAsync');
const DirectPlanModel=require('../../models/operationExecution/directPlanCreation')

exports.createX=catchAsync(async (req,res,next) => {
let {planName,pages}=req.body
planName=planName.charAt(0).toUpperCase()+planName.slice(1).toLowerCase()

if(pages.length==0){
    next(new appError(500,"there are no pages in the plan"))
}
    
const isPlanNameExist=await DirectPlanModel.findOne({planName:planName})
if(isPlanNameExist){

    next(new appError(500,"Plan Name already exists"))
}
    for(const page of pages) {
        if(!page.postPerPage && !page.storyPerPage){
            next(new appError(500,"postPerPage and storyPerPage is required"))
        }
    }
    const data=await DirectPlanModel.create({planName,pages})
    res.status(200).json({
        result:data
    })
})

exports.getAllPlans=catchAsync(async (req,res,next) => {
    const data=await DirectPlanModel.find({})
    res.status(200).json({
        result:data
    })
})

exports.getSinglePlan=catchAsync(async (req,res,next) => {
    const id=req.params.id
    const data=await DirectPlanModel.findOne({_id:id})
    res.status(200).json({
        result:data
    })
})

exports.updateSinglePlan=catchAsync(async (req,res,next) => {
    const id=req.params.id
    const data=await DirectPlanModel.findByIdAndUpdate(id,req.body,{new:true})
    res.status(200).json({
        result:data
    })

})

exports.deleteSinglePlan=catchAsync(async (req,res,next) => {
    const id=req.params.id
    const data=await DirectPlanModel.findByIdAndDelete(id)
    res.status(202).json({
        result:data
    })
})