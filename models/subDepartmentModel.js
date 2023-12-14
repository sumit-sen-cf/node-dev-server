const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');

const subDepartmentModel = new mongoose.Schema({
    id:{
        type: Number,
        required: true
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

AutoIncrement.initialize(mongoose.connection);
subDepartmentModel.plugin(
    AutoIncrement.plugin, 
    { model: 'subDepartmentModels', field: 'id', startAt: 1, incrementBy: 1 }
);

module.exports = mongoose.model('subDepartmentModel', subDepartmentModel);