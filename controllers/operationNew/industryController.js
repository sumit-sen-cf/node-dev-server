const appError = require('../../../helper/appError');
const catchAsync = require('../../../helper/catchAsync');
const IndustryMaster=require('../../../models/operationExecution/campaignMasters/industryMaster')

exports.createIndustry=catchAsync(async (req,res,next) => {
    let {name,description}=req.body

    name=name?.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const exist=await IndustryMaster.findOne({name})
    if(exist){
        next(new appError(403,"industry already exists"))
    }
   
    const data={name,description}
    const result=await IndustryMaster.create(data)
    res.status(200).json({
        result
    })
})

exports.getAllIndustry=catchAsync(async (req,res,next)=>{
    const result=await IndustryMaster.find({})
    res.status(200).json({
        result
    })
})

exports.updateIndustry=catchAsync(async (req,res,next)=>{
    const id=req.params.id
    let {name,description}=req.body

    name=name?.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const exist=await IndustryMaster.findOne({name})
    if(exist){
        next(new appError(403,"industry already exists"))
    }

    const data={name,description}
    const result=await IndustryMaster.findByIdAndUpdate(id,data,{
        new:true
    })
    res.status(200).json({
        result
    })

})

exports.getSingleIndustry=catchAsync(async (req,res,next) => {
    const id = req.params.id
    const result=await IndustryMaster.findById(id)
    if(!result){
        res.status(404).json({
            message:'No Goal'
        })
    }
    res.status(200).json({
        result
    })
})

exports.deleteIndustry=catchAsync(async (req,res,next) => {
    const id = req.params.id
    const result=await IndustryMaster.findByIdAndDelete(id)
    res.status(202).json({
        result
    })
})