const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const hashTagSchema = new mongoose.Schema({
  hash_tag_id: {
    type: Number,
    required: false,
    unique: true,
  },
  hash_tag: {
    type: String,
    lowercase: true,
    trim: true,
    default: "",
  },
  tag: {
    type: String,
    default: "",
  },
  campaign_id: {
    type: Number
  }
});

hashTagSchema.pre('save', async function (next) {
  if (!this.hash_tag_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'hash_tag_id': -1 } });

    if (lastAgency && lastAgency.hash_tag_id) {
      this.hash_tag_id = lastAgency.hash_tag_id + 1;
    } else {
      this.hash_tag_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("hashTagModel", hashTagSchema);
