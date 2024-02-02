const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const campaignPlanSchema = new mongoose.Schema({
    planName: {
        type: String,
        required: [true, "plan name is required."]
    },
    plan_id: {
        type: Number,
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
    postRemaining: {
        type: String,
        default: this.postPerPage
    },
    storyPerPage: {
        type: Number,
        required: [true, "story per page is required`"]
    },
    storyRemaining: {
        type: Number,
        default: this.storyPerPage
    },
    campaignName: {
        type: String,
        required: [true, "campign name is required"]
    },
    campaignId: {
        type: String,
        required: [true, "campaign id is required"]
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

    createdAt: {
        type: Date,
        default: Date.now()
    },
    modifiedAt: {
        type: Date
    },
    modifiedBy: {
        type: String,
        default: "user"
    },
    replacement_status: {
        type: String,
        default: 'inactive',
        enum: ['active', 'inactive', 'replaced', 'replacement', 'pending', 'rejected']
    },
    delete_id:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'pageDeleteRecordModel',
    },
    delete_status: {
        type: String,
        default: 'inactive',
        enum: ['active', 'inactive']
    },
    replaced_by: {
        type: String,
        default: 'N/A'
    },
    replaced_with: {
        type: String,
        default: 'N/A',
    },
    replacement_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'pageReplacementRecordModel',

    },
    isExecuted:{
        type:Boolean,
        default: false,
    }

});

campaignPlanSchema.pre('save', async function (next) {
    if (!this.plan_id) {
      const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'plan_id': -1 } });
  
      if (lastAgency && lastAgency.plan_id) {
        this.plan_id = lastAgency.plan_id + 1;
      } else {
        this.plan_id = 1;
      }
    }
    next();
});

campaignPlanSchema.pre(/^find/, async function (next) {
    this.populate({
        path: 'replacement_id',

    })

    this.populate({
        path:'delete_id'
    })

    next()
})
module.exports = mongoose.model(
    "CampaignPlanModel",
    campaignPlanSchema
);
