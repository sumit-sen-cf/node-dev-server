const appError = require('../../../helper/appError');
const catchAsync = require('../../../helper/catchAsync');
const ServiceMaster=require('../../../models/operationExecution/campaignMasters/serviceMaster')

exports.createService=catchAsync(async (req,res,next) => {
    let {name,description}=req.body

    name=name?.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const exist=await ServiceMaster.findOne({name})
    if(exist){
        next(new appError(403,"Service already exists"))
    }
   
    const data={name,description}
    const result=await ServiceMaster.create(data)
    res.status(200).json({
        result
    })
})

exports.getAllService=catchAsync(async (req,res,next)=>{
    const result=await ServiceMaster.find({})
    res.status(200).json({
        result
    })
})

exports.updateService=catchAsync(async (req,res,next)=>{
    const id=req.params.id
    let {name,description}=req.body

    name=name?.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const exist=await ServiceMaster.findOne({name})
    if(exist){
        next(new appError(403,"Service already exists"))
    }

    const data={name,description}
    const result=await ServiceMaster.findByIdAndUpdate(id,data,{
        new:true
    })
    res.status(200).json({
        result
    })

})

exports.getSingleService=catchAsync(async (req,res,next) => {
    const id = req.params.id
    const result=await ServiceMaster.findById(id)
    if(!result){
        res.status(404).json({
            message:'No Service'
        })
    }
    res.status(200).json({
        result
    })
})

exports.deleteService=catchAsync(async (req,res,next) => {
    const id = req.params.id
    const result=await ServiceMaster.findByIdAndDelete(id)
    res.status(202).json({
        result
    })
})