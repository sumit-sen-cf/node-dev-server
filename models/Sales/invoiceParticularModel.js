const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const invoiceParticular = new Schema({
    invoice_particular_name: {
        type: String,
        required: true,
    },
    remarks: {
        type: String,
        required: false
    },
    created_by: {
        type: Number,
        required: true,
        default: 0,
    },
    updated_by: {
        type: Number,
        required: false,
    },
    status: {
        type: Number,
        required: false,
        default: constant?.ACTIVE,
    },
},
    { timestamps: true },
);
module.exports = mongoose.model('salesInvoiceParticularModel', invoiceParticular);