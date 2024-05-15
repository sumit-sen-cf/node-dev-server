const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const accountPocSchema = new mongoose.Schema({
    account_id: {
        type: Number,
        required: true,
    },
    contact_name: {
        type: String,
        required: true,
    },
    contact_no: {
        type: Number,
        required: true,
        unique: true
    },
    alternative_contact_no: {
        type: Number,
        required: false,
    },
    email: {
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
    created_by: {
        type: Number,
        required: false,
    },
    updated_by: {
        type: Number,
        required: false,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("accountPocModel", accountPocSchema);