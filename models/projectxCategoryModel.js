const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const projectxCategorySchema = new mongoose.Schema({
  category_id: {
    type: Number,
    required: false,
    unique: true,
  },
  brand_id: {
    type: Number,
    required: true,
    default: 0,
  },
  category_name: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    default: "",
  },
});

projectxCategorySchema.pre('save', async function (next) {
  if (!this.category_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'category_id': -1 } });

    if (lastAgency && lastAgency.category_id) {
      this.category_id = lastAgency.category_id + 1;
    } else {
      this.category_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model(
  "projectxCategoryModel",
  projectxCategorySchema
);
