const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-auto-increment');

const deptDesiAuthModel = new mongoose.Schema({
    dept_desi_auth_id: {
        type: Number,
        required: false
    },
    dept_id: {
        type: Number,
        required: false
    },
    desi_id: {
        type: Number,
        required: false
    },
    obj_id: {
        type: Number,
        required: false
    },
    insert: {
        type: Number,
        required: false,
        default: 0
    },
    view: {
        type: Number,
        required: false,
        default: 0
    },
    update: {
        type: Number,
        required: false,
        default: 0
    },
    delete_flag: {
        type: Number,
        required: false,
        default: 0
    },
    creation_date: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: Number,
        required: false,
        default: 0
    },
    Last_updated_date: {
        type: Date,
        default: Date.now
    },
    Last_updated_by: {
        type: Number,
        required: false,
        default: 0
    }
});

deptDesiAuthModel.pre('save', async function (next) {
    if (!this.dept_desi_auth_id) {
      const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'dept_desi_auth_id': -1 } });
  
      if (lastAgency && lastAgency.dept_desi_auth_id) {
        this.dept_desi_auth_id = lastAgency.dept_desi_auth_id + 1;
      } else {
        this.dept_desi_auth_id = 1;
      }
    }
    next();
});

module.exports = mongoose.model('deptDesiAuthModel', deptDesiAuthModel);