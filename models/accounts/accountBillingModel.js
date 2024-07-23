const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const accountBillingSchema = new mongoose.Schema({
    account_id: {
        type: Number,
        required: true
    },
    deleted: {
        type: Boolean,
        required: false,
        default: false
    },
    how_many_offices: {
        type: Number,
        required: false,
    },
    // connected_office: {
    //     type: String,
    //     required: false,
    // },
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
    connect_billing_pin_code: {
        type: Number,
        required: false
    },
    // head_office: {
    //     type: String,
    //     required: false,
    // },
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
    head_billing_pin_code: {
        type: Number,
        required: false
    },
    social_platforms: {
        type: Array,
        required: false,
    },
    created_by: {
        type: Number,
        required: true,
    },
    updated_by: {
        type: Number,
        required: false,
    }
}, {
    timestamps: true
});


module.exports = mongoose.model("accountBillingModel", accountBillingSchema);