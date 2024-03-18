const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const customerContactSchema = new mongoose.Schema({
    customer_type_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "customertype"
    },
    closed_by: {
        type: Number,
        required: false,  //user_id
    },
    contact_name: {
        type: String,
        required: true,
    },
    contact_no: {
        type: Number,
        required: true,
    },
    alternative_contact_no: {
        type: Number,
        required: false,
    },
    email_Id: {
        type: String,
        required: false,
    },
    department: {
        type: String,
        required: false,
    },
    designation: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    created_date_time: {
        type: Date,
        default: Date.now,
    },
    created_by: {
        type: Number,
        required: false,
        default: 0,
    },
    last_updated_date: {
        type: Date,
        default: Date.now,
    },
    last_updated_by: {
        type: Number,
        required: false,
        default: 0
    }
});

module.exports = mongoose.model("customercontact", customerContactSchema);