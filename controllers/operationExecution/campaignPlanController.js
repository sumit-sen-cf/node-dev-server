const CampaignPlanModel = require('../../models/operationExecution/campaignPlanModel')
const appError=require('../../helper/appError');
const catchAsync=require('../../helper/catchAsync');
const campaignPlanModel = require('../../models/operationExecution/campaignPlanModel');
const PhasePageModel = require('../../models/operationExecution/phasePageModel')
const AssignmentModel=require('../../models/operationExecution/assignmentModel');
const response = require('../../common/response');

exports.createPlan=catchAsync(async (req,res,next) => {
    //will receive array of objects(pages),campaignId,vendor,campaignName,pageName
    console.log("hit")
    const {pages,campaignId,campaignName,planName}=req.body
    for(let i=0;i<pages.length;i++){
        let data={
            planName,
            campaignId,
            
            campaignName,
            postRemaining:pages[i].postPerPage,
           ...pages[i]

        }
        const result=await CampaignPlanModel.create(data)
  
        
    }

    const doc=await CampaignPlanModel.find({campaignId: campaignId})
    res.send({ data: doc, status: 200 });
    //validation is remaining

})
//to get all plan 
exports.getPlan=catchAsync(async (req,res,next) => {
    const id=req.params.id
    const result=await CampaignPlanModel.find({campaignId: id})
    if(!result) {
        return next(new appError(404,"plans not found"))
    }
    res.send({ data: result, status: 200})
})
exports.getSinglePlan=catchAsync(async (req,res,next) => {
    const id=req.params.id
    const result=await CampaignPlanModel.find({plan_id: id})
    if(!result) {
        return next(new appError(404,"plan not found"))
    }
    res.send({ data: result, status: 200})
})

//update plan

exports.updateBulk=catchAsync(async (req,res,next) => {
    const {pages,campaignId,campaignName,planName}=req.body
    const allPlan=await campaignPlanModel.find({campaignId})
    //pages to add will give the new pages that has been added to the existing pln
    const pagesToAdd = pages.filter(
        (item) => !allPlan.some((selectedItem) => selectedItem.p_id === item.p_id)
      );
    
      //this will find the old pages that needed to be updated
    const oldPages=pages.filter(
        (item) => allPlan.some((selectedItem) => selectedItem.p_id === item.p_id)
      );

      //updating each page one by one
    oldPages.forEach(async page=>{
        const result=await CampaignPlanModel.findOneAndUpdate({plan_id: page.plan_id},{postPerPage:page.postPerPage})
    })

      //now we have to loop through the pages to add in order to add them to the plan 
        pagesToAdd.forEach(async page => {
            let data={
                planName,
                campaignId,
                
                campaignName,
                postRemaining:page.postPerPage,
               ...page
    
            }

            const result=await CampaignPlanModel.create(data)
        });
        const updatedPlan=await campaignPlanModel.find({campaignId})
      res.send({ data: updatedPlan, status: 200 });
})

exports.singlePlanUpdate=catchAsync(async (req,res,next) => {
    const id=req.params.id;
    //validation is remaining
    const result = await campaignPlanModel.findOneAndUpdate({plan_id:id},req.body,{new:true})
    res.send({ data: result, status: 200})

})
exports.updatePlan = catchAsync(async (req,res,next) => {
    const { campaignId, p_id} = req.body
    const filter = { campaignId, p_id };

    // const options1  = {
    //   new: true, // Return the modified document rather than the original
    //   upsert: true, // If the document does not exist, insert a new one
    // };
    const options2  = {
      new: true, // Return the modified document rather than the original
    };
    
    const result = await campaignPlanModel.findOneAndUpdate(filter, req.body, options2);
    if(!result) {
    const data = new campaignPlanModel({
        ...req.body
      });
      const savedData = await data.save();
      if(!savedData) {
          return next(new appError(200,"No Record Found For Respective CampaignId and P_id (page id ) in Plan model."))
      }
    }

    const result2 = await PhasePageModel.findOneAndUpdate(filter, {...req.body, updatedFrom : "Plan"}, options2);
    const result3 = await AssignmentModel.findOneAndUpdate(filter, {...req.body, updatedFrom : "Plan"}, options2);

   return response.returnTrue(200,req,res,"Updation Operation Successfully.")


})
