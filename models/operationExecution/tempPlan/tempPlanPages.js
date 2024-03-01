const mongoose=require('mongoose');

const tempPlanPagesSchema=mongoose.Schema({
    plan:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"TempPlanSchema",
        required:[true,"Plan is Required"]
    },
    campaignId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"registerCampaignModel"
    },
    vendor_id: {
        type: String,
        // required:[true,"vendor is required"]
    },
    p_id: {
        type: String,
        required: [true, "page id is required."]
    },
    postPerPage: {
        type: String,
        required: [true, 'post per page is required']
    },

    storyPerPage: {
        type: Number,
        required: [true, "story per page is required`"]
    },
 
 
    page_name: {
        type: String,
        // required:[true,"campaign id is required"]
    },
    cat_name: {
        type: String,
        // required:[true,"campaign id is required"]
    },
    platform: {
        type: String,
        // required:[true,"campaign id is required"]
    },
    follower_count: {
        type: String,
        // required:[true,"campaign id is required"]
    },
    page_link: {
        type: String,
        // required:[true,"campaign id is required"]
    },

})



tempPlanPagesSchema.pre(/^find/, async function (next) {
    this.populate({
      path: 'plan'
    })
    next()
  })


module.exports=mongoose.model('TempPlanPagesModel',tempPlanPagesSchema)