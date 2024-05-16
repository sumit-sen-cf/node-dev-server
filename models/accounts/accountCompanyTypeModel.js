const { default: mongoose } = require("mongoose");

const accountCompanyTypeSchema = new mongoose.Schema({
    company_type_name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false,
    },
    created_by: {
        type: Number,
        required: true
    },
    updated_by: {
        type: Number,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("accountCompanyTypeModel", accountCompanyTypeSchema);