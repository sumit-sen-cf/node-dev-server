const appError = require('../../helper/appError');
const catchAsync = require('../../helper/catchAsync');
const planExecutionModel=require('../../models/operationExecution/planExecutionModel')

exports.createX=catchAsync(async (req,res,next) => {
    const data=await planExecutionModel.create({name:req.body.name})
    res.status(200).json({
        result:data
    })
})