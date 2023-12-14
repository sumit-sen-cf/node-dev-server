const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const hashTagSchema = new mongoose.Schema({
  hash_tag_id: {
    type: Number,
    required: true,
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
  },


});

AutoIncrement.initialize(mongoose.connection);
hashTagSchema.plugin(AutoIncrement.plugin, {
  model: "hashTagModel",
  field: "hash_tag_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("hashTagModel", hashTagSchema);
