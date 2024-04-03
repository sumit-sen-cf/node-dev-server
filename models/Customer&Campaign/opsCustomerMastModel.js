const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const customerMastSchema = new mongoose.Schema({
    customer_id: {
        type: Number,
        required: false
    },
    customer_type_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "customertype"
    },
    account_type_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "accounttype"
    },
    ownership_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "opsownership"
    },
    industry_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "IndustryMaster"
    },
    account_owner_id: {
        type: Number,      //user_id
        required: true,
    },
    customer_name: {
        type: String,
        required: false
    },
    pin_code: {
        type: Number,
        required: false
    },
    gst_address: {
        type: String,
        required: false
    },
    parent_account_id: {
        type: Number,
        required: false,
    },
    company_size: {
        type: String,
        required: false,
    },
    company_email: {
        type: String
    },
    primary_contact_no: {
        type: Number,
    },
    alternative_no: {
        type: Number,
    },
    website: {
        type: String,
        required: false,
    },
    turn_over: {
        type: Number,
        required: false,
    },
    establishment_year: {
        type: Number,
        required: false,
    },
    employees_Count: {
        type: Number,
        required: false,
    },
    how_many_offices: {
        type: Number,
        required: false,
    },
    company_gst_no: {
        type: String,
        required: false,
    },
    company_pan_no: {
        type: String,
        required: false,

    },
    gst_upload: {
        type: String,
        required: false,
    },
    pan_upload: {
        type: String,
        required: false,
    },
    connected_office: {
        type: String,
        required: false,
    },
    connect_billing_street: {
        type: String,
        required: false,
    },
    connect_billing_city: {
        type: String,
        required: false,
    },
    connect_billing_state: {
        type: String,
        required: false,
    },
    connect_billing_country: {
        type: String,
        required: false,
    },
    head_office: {
        type: String,
        required: false,
    },
    head_billing_street: {
        type: String,
        required: false,
    },
    head_billing_city: {
        type: String,
        required: false,
    },
    head_billing_state: {
        type: String,
        required: false,
    },
    head_billing_country: {
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
        required: true,
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
customerMastSchema.pre('save', async function (next) {
    if (!this.customer_id) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'customer_id': -1 } });

        if (lastAgency && lastAgency.customer_id) {
            this.customer_id = lastAgency.customer_id + 1;
        } else {
            this.customer_id = 1;
        }
    }
    next();
});


module.exports = mongoose.model("customerMast", customerMastSchema);