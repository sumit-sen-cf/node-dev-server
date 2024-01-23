const appError = require('../../../helper/appError');
const catchAsync = require('../../../helper/catchAsync');
const AgencyMaster=require('../../../models/operationExecution/campaignMasters/agencyMaster')



exports.createAgency=catchAsync(async (req,res,next) => {
    let {name,mobile,alternateMobile,email,city,instagram,remark}=req.body

    name=name?.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const exist=await AgencyMaster.findOne({name})
    if(exist){
        next(new appError(403,"Agency already exists"))
        
    }
   
    const data={name,mobile,alternateMobile,email,city,instagram,remark}
    const result=await AgencyMaster.create(data)
    res.status(200).json({
        result
    })
})

exports.getAllAgency=catchAsync(async (req,res,next)=>{
    const result=await AgencyMaster.find({})
    res.status(200).json({
        result
    })
})

exports.updateAgency=catchAsync(async (req,res,next)=>{
    const id=req.params.id
    let {name,mobile,alternateMobile,email,city,instagram,remark}=req.body

    name=name?.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const exist=await AgencyMaster.findOne({name})
    if(exist){
        next(new appError(403,"Agency already exists"))
        
    }

    const data={name,mobile,alternateMobile,email,city,instagram,remark}
    const result=await AgencyMaster.findByIdAndUpdate(id,data,{
        new:true
    })
    res.status(200).json({
        result
    })

})

exports.getSingleAgency=catchAsync(async (req,res,next) => {
    const id = req.params.id
    const result=await AgencyMaster.findById(id)
    if(!result){
        res.status(404).json({
            message:'No Agency'
        })
    }
    res.status(200).json({
        result
    })
})

exports.deleteAgency=catchAsync(async (req,res,next) => {
    const id = req.params.id
    const result=await AgencyMaster.findByIdAndDelete(id)
    res.status(202).json({
        result
    })
})