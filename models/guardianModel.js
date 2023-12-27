const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const guardianModel = new mongoose.Schema({
    guardian_id: {
        type: Number,
        required: true,
    },
    user_id: {
        type: Number,
        required: false,
    },
    guardian_name: {
        type: String,
        required: true,
        unique: true,
    },
    contact: {
        type: Number,
        required: false,
        default: 0
    },
    address: {
        type: String,
        required: false,
        default: ""
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

AutoIncrement.initialize(mongoose.connection);
guardianModel.plugin(AutoIncrement.plugin, {
    model: "guardianModels",
    field: "guardian_id",
    startAt: 1,
    incrementBy: 1,
});
module.exports = mongoose.model(
    "guardianModel",
    guardianModel
);
