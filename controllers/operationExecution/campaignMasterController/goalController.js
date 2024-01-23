const appError = require('../../../helper/appError');
const catchAsync = require('../../../helper/catchAsync');
const goalMaster=require('../../../models/operationExecution/campaignMasters/goalMaster')

exports.createGoal=catchAsync(async (req,res,next) => {
    let {name,description}=req.body

    name=name?.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const exist=await goalMaster.findOne({name})
    if(exist){
        next(new appError(403,"goal already exists"))
    }
   
    const data={name,description}
    const result=await goalMaster.create(data)
    res.status(200).json({
        result
    })
})

exports.getAllGoal=catchAsync(async (req,res,next)=>{
    const result=await goalMaster.find({})
    res.status(200).json({
        result
    })
})

exports.updateGoal=catchAsync(async (req,res,next)=>{
    const id=req.params.id
    let {name,description}=req.body

    name=name?.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const exist=await goalMaster.findOne({name})
    if(exist){
        next(new appError(403,"goal already exists"))
    }

    const data={name,description}
    const result=await goalMaster.findByIdAndUpdate(id,data,{
        new:true
    })
    res.status(200).json({
        result
    })

})

exports.getSingleGoal=catchAsync(async (req,res,next) => {
    const id = req.params.id
    const result=await goalMaster.findById(id)
    if(!result){
        res.status(404).json({
            message:'No Goal'
        })
    }
    res.status(200).json({
        result
    })
})

exports.deleteGoal=catchAsync(async (req,res,next) => {
    const id = req.params.id
    const result=await goalMaster.findByIdAndDelete(id)
    res.status(202).json({
        result
    })
})