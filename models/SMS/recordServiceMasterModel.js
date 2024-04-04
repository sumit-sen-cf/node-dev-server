const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recordServiceMaster = new Schema({
    sale_booking_id: {
        type: Number,
        required: false,
    },
    sales_service_master_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "salesServiceMaster"
    },
    excel_upload: {
        type: String,
        required: false
    },
    amount: {
        type: Number,
        required: false
    },
    no_of_hours:{
        type:Number,
        required:false
    },
    goal:{
        type:String,
        required:false
    },
    day:{
        type:Number,
        required:false
    },
    quantity:{
        type:Number,
        required:false
    },
    brand_name:{
        type:String,
        required:false
    },
    hashtag:{
        type:String,
        required:false
    },
    individual_amount:{
        type:Number,
        required:false
    },
    start_date:{
        type:Date,
        required:false
    },
    end_date:{
        type:Date,
        required:false
    },
    per_month_amount:{
        type:Number,
        required:false
    },
    no_of_creators:{
        type:Number,
        required:false
    },
    deliverables_info:{
        type:String,
        required:false
    },
    remarks: {
        type: String,
        required: false
    },
    sale_executive_id: {
        type: Number,
        required: false
    },
    created_by: {
        type: Number,
        required: true,
    },
    last_updated_by: {
        type: Number,
        required: false,
    }
},
    { timestamps: true },
);
module.exports = mongoose.model('recordServiceMaster', recordServiceMaster);