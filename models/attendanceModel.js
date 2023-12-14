const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');

const attendanceModel = new mongoose.Schema({
    attendence_id:{
        type: Number,
        required: true
    },
    dept:{
        type: Number,
        required: true
    },
    user_id:{
        type: Number,
        required: false,
        default: 0
    },
    noOfabsent:{
        type: Number,
        required: false
    },
    year:{
        type: Number,
        required: true,
        default: ""
    },
    remark:{
        type: String,
        required: false,
        default: ""
    },
    Creation_date:{
        type: Date,
        required: false,
        default: Date.now
    },
    Created_by:{
        type: Number,
        required: false,
        default:0
    },
    Last_updated_by:{
        type: Number,
        required: false,
        default:""
    },
    Last_updated_date:{
        type: Date,
        required: false,
        default: Date.now
    },
    month:{
        type: String,
        required: true,
        default: ""
    },
    bonus:{
        type: Number,
        required: false
    },
    total_salary:{
        type: Number,
        required: false
    },
    net_salary:{
        type: Number,
        required: false
    },
    tds_deduction:{
        type: Number,
        required: false
    },
    user_name:{
        type: String,
        default: "",
        required: false
    },
    toPay:{
        type: Number,
        required: false
    },
    attendence_generated:{
        type: Number,
        required: false,
        default:0
    },
    attendence_status:{
        type: Number,
        required: false,
        default:0
    },
    salary_status:{
        type: Number,
        required: false,
        default:0
    },
    salary_deduction:{
        type: Number,
        required: false,
        default:0
    },
    salary:{
        type: Number,
        required: false,
        default:0
    },
    sendToFinance:{
        type: Number,
        required: false,
        default: 0
    },
    invoiceNo:{
        type: String,
        default: ""
    }
});

AutoIncrement.initialize(mongoose.connection);
attendanceModel.plugin(
    AutoIncrement.plugin, 
    { model: 'attendanceModels', field: 'attendence_id', startAt: 1, incrementBy: 1 }
);

module.exports = mongoose.model('attendanceModel', attendanceModel);