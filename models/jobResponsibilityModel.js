const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-auto-increment');

const jobResponsibilityModel = new mongoose.Schema({
    Job_res_id:{
        type: Number,
        required: false
    },
    user_id: { 
        type: Number,
        required: true,
        default: 0,
    },
    sjob_responsibility: {
        type: String,
        required: false,
        default: ""
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    Creation_date: {
        type: Date,
        default: Date.now
    },
    Last_updated_date: {
        type: Date,
        default: Date.now
    },
    Last_updated_by: {
        type: Number,
        required: false
    },
    Created_by: {
        type: Number,
        required: false,
        default: 0
    }
});

jobResponsibilityModel.pre('save', async function (next) {
    if (!this.Job_res_id) {
      const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'Job_res_id': -1 } });
  
      if (lastAgency && lastAgency.Job_res_id) {
        this.Job_res_id = lastAgency.Job_res_id + 1;
      } else {
        this.Job_res_id = 1;
      }
    }
    next();
});

module.exports = mongoose.model('jobResponsibilityModel', jobResponsibilityModel);