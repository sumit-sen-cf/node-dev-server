const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const brandMajorCategoryModel = new mongoose.Schema({
    brandMajorCategory_id: {
        type: Number,
        required: true,
    },
    brandMajorCategory_name: {
        type: String,
        required: true,
        unique: true,
    },
    brand_id: {
        type: Number,
        required: true,
    },
    created_by: {
        type: Number,
        required: true,
    },
    created_date: {
        type: Date,
        default: Date.now,
    }
});

AutoIncrement.initialize(mongoose.connection);
brandMajorCategoryModel.plugin(AutoIncrement.plugin, {
    model: "brandMajorCategoryModels",
    field: "brandMajorCategory_id",
    startAt: 1,
    incrementBy: 1,
});
module.exports = mongoose.model(
    "brandMajorCategoryModel",
    brandMajorCategoryModel
);
