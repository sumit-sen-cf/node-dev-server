const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const customerDocumentSchema = new mongoose.Schema({
    customer_id: {
        type: Number,
        required: true,
    },
    doc_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "docmast",
    },
    doc_upload: {
        type: String,
        require: true,
    },
    doc_no: {
        type: Number,
        required: true,
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

module.exports = mongoose.model("customerdocument", customerDocumentSchema);