const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const brandSubCategoryModel = new mongoose.Schema({
  brandSubCategory_id: {
    type: Number,
    required: false,
  },
  brandSubCategory_name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  brandCategory_id: {
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
  },
});

brandSubCategoryModel.pre('save', async function (next) {
  if (!this.brandSubCategory_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'brandSubCategory_id': -1 } });

    if (lastAgency && lastAgency.brandSubCategory_id) {
      this.brandSubCategory_id = lastAgency.brandSubCategory_id + 1;
    } else {
      this.brandSubCategory_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("brandSubCategoryModel", brandSubCategoryModel);
