const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const guardianModel = new mongoose.Schema({
    guardian_id: {
        type: Number,
        required: false,
    },
    user_id: {
        type: Number,
        required: false,
    },
    guardian_name: {
        type: String,
        required: true,
        unique: true,
    },
    guardian_contact: {
        type: Number,
        required: false,
        default: 0
    },
    guardian_address: {
        type: String,
        required: false,
        default: ""
    },
    relation_with_guardian: {
        type: String,
        required: false,
        default: ""
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

guardianModel.pre('save', async function (next) {
    if (!this.guardian_id) {
      const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'guardian_id': -1 } });
  
      if (lastAgency && lastAgency.guardian_id) {
        this.guardian_id = lastAgency.guardian_id + 1;
      } else {
        this.guardian_id = 1;
      }
    }
    next();
});

module.exports = mongoose.model(
    "guardianModel",
    guardianModel
);
