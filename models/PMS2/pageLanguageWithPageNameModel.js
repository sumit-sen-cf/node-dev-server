const mongoose = require("mongoose");

const pageLanguageWithPageNameModel = new mongoose.Schema({
    page_id: {
        type: mongoose.Types.ObjectId,
        ref: "pageMasterModel",
        required: false
    },
    page_language_id: {
        type: mongoose.Types.ObjectId,
        ref: "pageLanguageModel",
        required: false
    },
    page_name: {
        type: String,
        required: false
    },
    created_by: {
        type: Number,
        required: false,
        default: 0,
    },
    last_updated_by: {
        type: Number,
        required: false,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("pageLanguageWithPageNameModel", pageLanguageWithPageNameModel);
