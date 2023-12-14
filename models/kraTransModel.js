const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const kraTransModel = new mongoose.Schema({
    kraTrans_id: {
        type: Number,
        required: true,
        unique: true
    },
    user_to_id: {
        type: Number,
        required: true
    },
    user_from_id: {
        type: Number,
        required: true
    },
    job_responsibility_id: {
        type: Number,
        required: true
    },
    remark: {
        type: String,
        required: false,
        default: ""
    },
    Created_date: {
        type: Date,
        default: Date.now,
    },
    Created_by: {
        type: Number,
        required: false,
    },
    Last_updated_by: {
        type: Number,
        required: false,
    },
    Last_updated_date: {
        type: Date
    }
});

AutoIncrement.initialize(mongoose.connection);
kraTransModel.plugin(AutoIncrement.plugin, {
    model: "kraTransModels",
    field: "kraTrans_id",
    startAt: 1,
    incrementBy: 1,
});
module.exports = mongoose.model(
    "kraTransModel",
    kraTransModel
);
