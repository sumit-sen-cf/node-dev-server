const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const mentionSchema = new mongoose.Schema({
  mentionId: {
    type: Number,
    required: false,
    unique: true,
  },
  mention: {
    type: String,
    lowercase: true,
    trim: true,
    default: "",
  },
  createdBy: {
    type: Number,
    default:0
  },
  createdAt: {
    type: Date,
    default:Date.now()
  },
  status: {
    type: Number
  },
});

mentionSchema.pre('save', async function (next) {
  if (!this.mentionId) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'mentionId': -1 } });

    if (lastAgency && lastAgency.mentionId) {
      this.mentionId = lastAgency.mentionId + 1;
    } else {
      this.mentionId = 1;
    }
  }
  next();
});

module.exports = mongoose.model("mentionModel", mentionSchema);
