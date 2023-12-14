const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const brandCategoryModel = new mongoose.Schema({
    brandCategory_id: {
        type: Number,
        required: true,
    },
    brandCategory_name: {
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
brandCategoryModel.plugin(AutoIncrement.plugin, {
    model: "brandCategoryModels",
    field: "brandCategory_id",
    startAt: 1,
    incrementBy: 1,
});
module.exports = mongoose.model(
    "brandCategoryModel",
    brandCategoryModel
);
