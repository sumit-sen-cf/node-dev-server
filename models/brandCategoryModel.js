const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const brandCategoryModel = new mongoose.Schema({
    brandCategory_id: {
        type: Number,
        required: false,
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

brandCategoryModel.pre('save', async function (next) {
    if (!this.brandCategory_id) {
      const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'brandCategory_id': -1 } });
  
      if (lastAgency && lastAgency.brandCategory_id) {
        this.brandCategory_id = lastAgency.brandCategory_id + 1;
      } else {
        this.brandCategory_id = 1;
      }
    }
    next();
});

module.exports = mongoose.model(
    "brandCategoryModel",
    brandCategoryModel
);
