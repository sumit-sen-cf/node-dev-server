const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-auto-increment');

const subDepartmentModel = new mongoose.Schema({
    id:{
        type: Number,
        required: false
    },
    sub_dept_name: { 
        type: String,
        required: false,
        unique:true,
        default: ""
    },
    dept_id: {
        type: Number,
        required: true
    },
    remark: {
        type: String,
        required: false,
        default: ""
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: Number,
        required: false,
        default: 0
    },
    last_updated_at: {
        type: Date
    },
    last_updated_by: {
        type: Number
    }
});

subDepartmentModel.pre('save', async function (next) {
    if (!this.id) {
      const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'id': -1 } });
  
      if (lastAgency && lastAgency.id) {
        this.id = lastAgency.id + 1;
      } else {
        this.id = 1;
      }
    }
    next();
});

module.exports = mongoose.model('subDepartmentModel', subDepartmentModel);