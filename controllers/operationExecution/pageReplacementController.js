const appError=require('../../helper/appError');
const catchAsync=require('../../helper/catchAsync');
const pageReplacementRecordModel=require('../../models/operationExecution/pageReplacementRecordModel')

exports.createReplacementPlan=catchAsync(async (req, res, next) =>{
    const {planName,
        campaign_id,
        campaign_name,
        replacement_request_by,
        newPage_id,
        oldPage_id,
            
    }=req.body
})