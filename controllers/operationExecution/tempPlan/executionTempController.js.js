const catchAsync = require('../../../helper/catchAsync')
const appError = require('../../../helper/appError')
const TempPlanModel = require('../../../models/operationExecution/tempPlan/tempPlanModel.js')
const TempPlanPagesModel = require('../../../models/operationExecution/tempPlan/tempPlanPages.js')
const ExpertiseModel = require('../../../models/operationExecution/expertiseModel.js')
const TempAssignmentModel = require('../../../models/operationExecution/tempPlan/tempAssignmentModel.js')
const TempExecutionModel = require('../../../models/operationExecution/tempPlan/tempExecutionModel.js')



exports.getAllAssignmetsPlan=catchAsync(async (req,res,next) => {
    const {plan}=req.body
    const allAssignments=await TempAssignmentModel.find({plan})
    res.status(200).json({
        result:allAssignments
    })
})

exports.getAllAssignementBasedOnExpertee=catchAsync(async (req,res,next) => {
    const id=req.params.id
    const mongoose = require('mongoose');

    // const assignments = await TempAssignmentModel.aggregate([
    //     {
    //         $match: {
    //             ass_to: mongoose.Types.ObjectId(id)
    //         }
    //     },
    //     {
    //         $group: {
    //             _id: null,
    //             count: { $sum: 1 },
    //             assignments:{$push:"$$ROOT"}
    //         }
    //     },

    //     {
    //         $lookup:{
    //                         from:"tempassignmentmodels",
    //                         localField:"ass_id",
    //                         foreignField:"ass_id" ,
    //                         as:"commits"
    //         }
    //     },
    //     {
    //         $unwind:'$commits'
    //     },
    //     {
    //         $group:{
    //             _id:'$_id',
    //             assignments:{$first:"$assignments"},
    //             count:{$first:"$count"},
    //             commit:{$push:"$$ROOT"}

    //         }
    //     },
    //     {
    //         $project: {
    //             _id: 0, // Exclude _id field from the result
    //             count: 1, // Include count field
    //             assignments:1,
    //             commit:1
                
    //         }
    //     }
    // ]);
    
    let x=[]
    const assignments=await TempAssignmentModel.find({ass_to:id}).select('page')
    for(const assignment of assignments){
      
        const res=await TempExecutionModel.find({'page':assignment.page._id})
        x.push({assignment:assignment.page,commit:res})
    }
    res.status(200).json({
        result:x
    })
})

exports.getAllExecutionForPlan=catchAsync(async (req,res,next) => {
    const {plan}=req.body
    const allExections=await TempExecutionModel.find({plan})
    res.status(200).json({
        result: allExections
    })
})

exports.updateExecution=catchAsync(async (req,res,next) => {
    const {id,link,imageLink,views,post_type,likes,posted_date,shortCode,engagement,video_url,owner,comments,reach,hashTag,caption}=req.body
    const dataForExection={link,imageLink,likes,engagement,posted_date,shortCode,owner,video_url,comments,reach,views,post_type,hashTag,caption,verification_status:"verified"}
    
    const exist=await TempExecutionModel.findById(id)
    if(exist?.verification_status=="verified"){
        next(new appError(403,"Task is Already verified"))
    }else{

        const response=await TempExecutionModel.findByIdAndUpdate(id,dataForExection,{new:true})
        res.status(200).json({
            result:response
        })
       
    }
})

exports.validateLinkDuplication=catchAsync(async (req,res,next)=>{
    const {link,page}=req.body
  
    const findLink=await TempExecutionModel.findOne({link:link.trim()})
    if(findLink){
        res.status(409).json({
            message:"Duplicate Link"
        })
    }else {
        res.status(200).json({
            message:"Success"
        })
    }

})