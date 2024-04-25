const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const brandSchema = new mongoose.Schema({
  brand_id: {
    type: Number,
    required: false,
    unique: true,
  },
  brand_name: {
    type: String,
    lowercase: true,
    trim: true,
  },
  category_id: {
    type: Number,
    required: false,
    default: 0,
  },
  sub_category_id: {
    type: Number,
    required: false,
  },
  platform: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  website: {
    type: String,
    required: false,
    default: "",
  },
  major_category: {
    type: String,
    required: false,
    default: "",
  },
  user_id: {
    type: Number,
    required: false,
  },
  updated_at: {
    type: Date,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

brandSchema.pre('save', async function (next) {
  if (!this.brand_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'brand_id': -1 } });

    if (lastAgency && lastAgency.brand_id) {
      this.brand_id = lastAgency.brand_id + 1;
    } else {
      this.brand_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("brandModel", brandSchema);
