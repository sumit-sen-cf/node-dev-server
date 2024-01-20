const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-auto-increment');

const attendanceModel = new mongoose.Schema({
    attendence_id: {
        type: Number,
        required: false
    },
    dept: {
        type: Number,
        required: true
    },
    user_id: {
        type: Number,
        required: false,
        default: 0
    },
    noOfabsent: {
        type: Number,
        required: false
    },
    year: {
        type: Number,
        required: true,
        default: ""
    },
    remark: {
        type: String,
        required: false,
        default: ""
    },
    Creation_date: {
        type: Date,
        required: false,
        default: Date.now
    },
    Created_by: {
        type: Number,
        required: false,
        default: 0
    },
    Last_updated_by: {
        type: Number,
        required: false,
        default: ""
    },
    Last_updated_date: {
        type: Date,
        required: false,
        default: Date.now
    },
    month: {
        type: String,
        required: true,
        default: ""
    },
    bonus: {
        type: Number,
        required: false
    },
    total_salary: {
        type: Number,
        required: false,
        default: 0
    },
    net_salary: {
        type: Number,
        required: false,
        default: 0
    },
    tds_deduction: {
        type: Number,
        required: false,
        default: 0
    },
    user_name: {
        type: String,
        default: "",
        required: false
    },
    toPay: {
        type: Number,
        required: false,
        default: 0
    },
    attendence_generated: {
        type: Number,
        required: false,
        default: 0
    },
    attendence_status: {
        type: Number,
        required: false,
        default: 0
    },
    salary_status: {
        type: Number,
        required: false,
        default: 0
    },
    salary_deduction: {
        type: Number,
        required: false,
        default: 0
    },
    salary: {
        type: Number,
        required: false,
        default: 0
    },
    sendToFinance: {
        type: Number,
        required: false,
        default: 0
    },
    invoiceNo: {
        type: String,
        default: ""
    },
    attendence_status_flow: {
        type: String,
        default: "attendance pending",
        required: false
    },
    disputed_reason: {
        type: String,
        default: ""
    },
    disputed_date: {
        type: String,
        default: ""
    }
});

// attendanceModel.pre('save', async function (next) {
//     if (!this.attendence_id) {
//         const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'attendence_id': -1 } });

//         if (lastAgency && lastAgency.attendence_id) {
//             this.attendence_id = lastAgency.attendence_id + 1;
//         } else {
//             this.attendence_id = 1;
//         }
//     }
//     next();
// });

module.exports = mongoose.model('attendanceModel', attendanceModel);