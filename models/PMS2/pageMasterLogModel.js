const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageMasterLogSchema = new Schema({
    page_id: {
        type: mongoose.Types.ObjectId,
        ref: "pageMasterModel",
        required: true
    },
    before_update_page_data: {
        type: Schema.Types.Mixed,
        required: true
    },
    after_update_page_data: {
        type: Schema.Types.Mixed,
        required: true
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});
const pageMasterLogModel = mongoose.model('pageMasterLogModel', pageMasterLogSchema);

module.exports = pageMasterLogModel;
