const mongoose=require('mongoose');

const tempPlanSchema=new mongoose.Schema({
    planName:{
        type:String,
        require:[true,"Plan Name is required"]
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    campaignId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"registerCampaignModel"
    },
    campaignName:{
        type:String,
        required:[true,"Campign Name is required"]
    }
})  

tempPlanSchema.pre(/^find/, async function (next) {
    this.populate({
      path: 'campaignId'
    })
  
  
  
    next()
  })

module.exports =mongoose.model('TempPlanSchema',
tempPlanSchema)