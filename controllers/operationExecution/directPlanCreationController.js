const appError = require('../../helper/appError');
const catchAsync = require('../../helper/catchAsync');
const DirectPlanModel=require('../../models/operationExecution/directPlanCreation')

exports.createX=catchAsync(async (req,res,next) => {

    const pages=req.body.pages
    for(const page of pages) {
        if(!page.postPerPage && !page.storyPerPage){
            next(new appError(500,"postPerPage and storyPerPage is required"))
        }
    }
    const data=await DirectPlanModel.create(req.body)
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