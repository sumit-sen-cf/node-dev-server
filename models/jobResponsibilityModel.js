const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');

const jobResponsibilityModel = new mongoose.Schema({
    Job_res_id:{
        type: Number,
        required: true
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

AutoIncrement.initialize(mongoose.connection);
jobResponsibilityModel.plugin(
    AutoIncrement.plugin, 
    { model: 'jobResponsibilityModels', field: 'Job_res_id', startAt: 1, incrementBy: 1 }
);

module.exports = mongoose.model('jobResponsibilityModel', jobResponsibilityModel);