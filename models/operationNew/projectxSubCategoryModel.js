const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const projectxSubCategorySchema = new mongoose.Schema({
  sub_category_id: {
    type: Number,
    required: false,
    unique: true,
  },
  category_id: {
    type: Number,
    required: true,
  },
  sub_category_name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
});

projectxSubCategorySchema.pre('save', async function (next) {
  if (!this.sub_category_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'sub_category_id': -1 } });

    if (lastAgency && lastAgency.sub_category_id) {
      this.sub_category_id = lastAgency.sub_category_id + 1;
    } else {
      this.sub_category_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model(
  "projectxSubcategoryModel",
  projectxSubCategorySchema
);
