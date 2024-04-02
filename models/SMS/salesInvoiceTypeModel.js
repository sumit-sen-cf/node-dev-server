const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesInvoiceType = new Schema({
    invoice_type_name: {
        type: String,
        required: false,
    },
},
    { timestamps: true },
);
module.exports = mongoose.model('salesInvoiceType', salesInvoiceType);