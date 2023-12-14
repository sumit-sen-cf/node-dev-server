const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const instaBrandSchema = new mongoose.Schema({
  instaBrandId: {
    type: Number,
    required: true,
    unique: true,
  },
  instaBrandName: {
    type: String,
    required: true,
    unique: true,
  },
  brandCategoryId: {
    type: Number,
    required: false,
  },
  brandCategoryName: {
    type: String,
    required: false,
  },
  brand_image: {
    type: String,
    required: false,
    default : ""
  },
  brandSubCategoryId: {
    type: Number,
    required: false,
  },
  brandSubCategoryName: {
    type: String,
    required: false,
  },
  igUserName: {
    type: String,
    default: "",
  },
  whatsApp: {
    type: String,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
  majorCategory: {
    type: String,
    default: "",
  },
  userId: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: false,
    default : 0
  },
  campaign_count: {
    type: Number,
    required: false,
    default :0
  },
  post_count: {
    type: Number,
    required: false,
    default :0
  },
  simillar_brand_id: {
    type: Number,
    required: false,
    default :0
  },
  temp2: {
    type: Number,
    required: false,
    default :0
  },
  temp3: {
    type: String,
    required: false,
    default :""
  },
  youtube: {
    type: String,
    required: false,
    default :""
  },

  updatedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

AutoIncrement.initialize(mongoose.connection);
instaBrandSchema.plugin(AutoIncrement.plugin, {
  model: "instaBrand",
  field: "instaBrandId",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("instaBrand", instaBrandSchema);
