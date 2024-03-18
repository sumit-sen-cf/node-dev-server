const mongoose=require('mongoose');

const tempExecutionSchema=new mongoose.Schema({

    plan:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"TempPlanSchema",
        required:[true,"Plan id is Required"]
    },
    campaignId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"registerCampaignModel"
    },
    page:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'TempPlanPagesModel',
        required:[true,"Page id is Required"]
    },
    shortCode:String,
    link:{
        type:'String',
        // required: [true,'link is required']
    },
    ass_to:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:""
    },
    commitType:{
        type:'String',
        enum:['story','post']
    },
    imageLink:{
        type:'String',
    },
    likes:{
        type:'Number',
        default: 0,
    },
    engagement:{
        type:'Number',
        default: 0,
    },
    post_type:{
        type:String,
    },
    comments:{
        type:Array,
        default: [],
    },
    comment_count:{
        type:Number,
    },
    reach:{
        type:'Number',
        default: 0,
    },
    verification_status:{
        type:String,
        default:'pending',
        enum:['verified','pending']
    },
    hashTag:{
        type:String,
    },
    views:{
        type:Number,
        default:0,
    },
    caption:{
        type:String,
    },
    posted_date:{
        type:Date,
    },
    owner:{
        type: mongoose.Schema.Types.Mixed
    },
    video_url:String

})

tempExecutionSchema.pre(/^find/, async function (next) {
  
    this.populate({
      path: 'page'
    })
    next()
  })

module.exports =mongoose.model('TempExecutionModel',tempExecutionSchema)