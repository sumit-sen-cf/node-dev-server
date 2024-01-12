const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const brandMajorCategoryModel = new mongoose.Schema({
    brandMajorCategory_id: {
        type: Number,
        required: false,
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

brandMajorCategoryModel.pre('save', async function (next) {
    if (!this.brandMajorCategory_id) {
      const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'brandMajorCategory_id': -1 } });
  
      if (lastAgency && lastAgency.brandMajorCategory_id) {
        this.brandMajorCategory_id = lastAgency.brandMajorCategory_id + 1;
      } else {
        this.brandMajorCategory_id = 1;
      }
    }
    next();
});

module.exports = mongoose.model(
    "brandMajorCategoryModel",
    brandMajorCategoryModel
);
