const { default: mongoose } = require("mongoose");

const accountTypeSchema = new mongoose.Schema({
    account_type_name: {
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
        required: true,
    },
    updated_by: {
        type: Number,
        required: false,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("accountTypeModel", accountTypeSchema);