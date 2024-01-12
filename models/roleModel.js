const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const roleModel = new mongoose.Schema({
  role_id: {
    type: Number,
    required: false,
  },
  Role_name: {
    type: String,
    required: false,
    unique: true,
    default: "",
  },
  Remarks: {
    type: String,
    required: false,
    default: "",
  },
  Creation_date: {
    type: Date,
    default: Date.now,
  },
  Last_update_date: {
    type: Date,
    default: Date.now,
  },
  Created_by: {
    type: Number,
    required: false,
    default: 0,
  },
  Last_updated_by: {
    type: Number,
    required: false,
    default: 0,
  },
});

roleModel.pre('save', async function (next) {
  if (!this.role_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'role_id': -1 } });

    if (lastAgency && lastAgency.role_id) {
      this.role_id = lastAgency.role_id + 1;
    } else {
      this.role_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("roleModel", roleModel);
