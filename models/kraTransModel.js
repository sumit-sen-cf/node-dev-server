const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const kraTransModel = new mongoose.Schema({
    kraTrans_id: {
        type: Number,
        required: false,
        unique: true
    },
    user_to_id: {
        type: Number,
        required: true
    },
    user_from_id: {
        type: Number,
        required: true
    },
    job_responsibility_id: {
        type: Number,
        required: true
    },
    remark: {
        type: String,
        required: false,
        default: ""
    },
    Created_date: {
        type: Date,
        default: Date.now,
    },
    Created_by: {
        type: Number,
        required: false,
    },
    Last_updated_by: {
        type: Number,
        required: false,
    },
    Last_updated_date: {
        type: Date
    }
});

kraTransModel.pre('save', async function (next) {
    if (!this.kraTrans_id) {
      const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'kraTrans_id': -1 } });
  
      if (lastAgency && lastAgency.kraTrans_id) {
        this.kraTrans_id = lastAgency.kraTrans_id + 1;
      } else {
        this.kraTrans_id = 1;
      }
    }
    next();
});

module.exports = mongoose.model(
    "kraTransModel",
    kraTransModel
);
