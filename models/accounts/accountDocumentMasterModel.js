const { default: mongoose } = require("mongoose");

const accountDocMasterSchema = new mongoose.Schema({
    document_name: {
        type: String,
        required: true,
        unique: true
    },
    is_visible: {
        type: Boolean,
        required: true,
        default: false
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

module.exports = mongoose.model("accountDocumentMasterModel", accountDocMasterSchema);