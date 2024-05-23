const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const accountDocumentOverviewSchema = new mongoose.Schema({
    account_id: {
        type: Number,
        required: true,
    },
    document_master_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "accountDocumentMasterModel",
    },
    document_image_upload: {
        type: String,
        require: true,
    },
    document_no: {
        type: String,
        required: true,
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

module.exports = mongoose.model("accountDocumentOverviewModel", accountDocumentOverviewSchema);