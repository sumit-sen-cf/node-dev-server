const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tmsTaskJourney = new Schema(
    {
        sub_status_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "tmsSubStatusMast"
        },
        // task_id: {
        //     type: Number,
        //     required: false
        // },
        journey_type: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        attachments: {
            type: String,
            default: ""
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
    });
const tmsTaskJourneyModel = mongoose.model("tmsTaskJourney", tmsTaskJourney);
module.exports = tmsTaskJourneyModel;