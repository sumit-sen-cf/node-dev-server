const { default: mongoose } = require("mongoose");

// const commitmentModel = new mongoose.Schema({
//   key: {
//     type: String,
//     required: true,
//   },
//   value: {
//     type: Number,
//     required: true,
//   },
// });

const opCampaignModel = new mongoose.Schema({
  // operation code start
  campaign_id: {
    type: Number,
    unique: true,
  },
  pre_brand_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "brandmodels"
  },
  pre_campaign_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "execampaignmodels"
  },
  pre_industry_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "industrymasters"
  },
  pre_agency_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "agencymasters"
  },
  pre_goal_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "goalmasters"
  },
  hash_tag: {
    type: String,
    default: "",
  },
  campaign_close_by: {
    type: Number,
    required: false
  },
  commitments: [{
    selectValue: Number,
    textValue: String
  }],
  details: {
    type: String,
    required: false
  },
  captions: {
    type: String,
    required: false
  },
  updated_date: {
    type: Date,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  // operation code start

  // bhushan code start
  sale_booking_execution_id: {
    type: String
  },
  sale_booking_id: {
    type: String
  },
  start_date: {
    type: String
  },
  end_date: {
    type: String
  },
  summary: {
    type: String
  },
  remarks: {
    type: String
  },
  created_by: {
    type: String
  },
  creation_date: {
    type: String
  },
  last_updated_date: {
    type: String
  },
  sale_booking_date: {
    type: String
  },
  campaign_amount: {
    type: String
  },
  execution_date: {
    type: String
  },
  execution_remark: {
    type: String
  },
  execution_done_by: {
    type: String
  },
  cust_name: {
    type: String
  },
  loggedin_user_id: {
    type: Number
  },
  execution_status: {
    type: Number
  },
  payment_update_id: {
    type: Number
  },
  payment_type: {
    type: String
  },
  status_desc: {
    type: String
  },
  invoice_creation_status: {
    type: String
  },
  manager_approval: {
    type: String
  },
  invoice_particular: {
    type: String
  },
  payment_status_show: {
    type: String
  },
  sales_executive_name: {
    type: String
  },
  page_ids: {
    type: String
  },
  service_id: {
    type: String
  },
  service_name: {
    type: String
  },
  execution_excel: {
    type: String
  },
  total_paid_amount: {
    type: Number
  },
  credit_approval_amount: {
    type: Number
  },
  credit_approval_date: {
    type: String
  },
  credit_approval_by: {
    type: String
  },
  campaign_amount_without_gst: {
    type: Number
  },
  execution_time: {
    type: String
  },
  execution_date_time: {
    type: String
  },
  execution_sent_date: {
    type: String
  },
  execution_pause: {
    type: String
  },
  customer_created_date: {
    type: String
  },
  gst_status: {
    type: String
  },
  booking_created_date: {
    type: String
  },
  booking_last_updated_date: {
    type: String
  },
  record_service_amount: {
    type: String
  },
  record_service_created_date: {
    type: String
  },
  last_payment_date: {
    type: String
  },
  manager_name: {
    type: String
  },
  execution_token: {
    type: String
  },
  brand_name: {
    type: String
  },
  record_service_campaign_name: {
    type: String
  },
  id: {
    type: Number
  },
  // bhushan code end

  // sumit schema start
  // campaign_name: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  // campaign_image: {
  //   type: String,
  //   required:false,
  //   default: "",
  // },
  // user_id: {
  //   type: Number,
  // },
  // agency_id: {
  //   type: Number,
  //   required: true,
  //   default: 0,
  // },
  // status:{
  //   type:String,
  //   enum:['active', 'inactive']
  // },
  // updated_by: {
  //   type: Number,
  // },
  // brand_id: {
  //   type: Number,
  // }
  // sumit schema end
});

opCampaignModel.pre("save", async function (next) {
  if (!this.campaign_id) {
    const lastObj = await this.constructor.findOne({}, {}, { sort: { campaign_id: -1 } });
    if (lastObj && lastObj.campaign_id) {
      this.campaign_id = lastObj.campaign_id + 1;
    } else {
      this.campaign_id = 1;
    }
  }
  next();
});
module.exports = mongoose.model("opCampaignModel", opCampaignModel);