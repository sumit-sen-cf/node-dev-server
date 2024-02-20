const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const financeModel = new mongoose.Schema({
    id: {
        type: Number,
        required: false
    },
    status_: {
        type: Number,
        required: false,
        default: 0,
    },
    reason: {
        type: String,
        required: false,
        default: ""
    },
    remark: {
        type: String,
        required: false,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now
    },
    screenshot: {
        type: String,
        required: false,
        default: ""
    },
    attendence_id: {
        type: Number,
        required: true
    },
    reference_no: {
        type: Number,
        required: false,
        default: 0
    },
    amount: {
        type: Number,
        default: 0
    },
    pay_date: {
        type: Date,
        default: ""
    },
    utr: {
        type: String,
        required: false,
        default: ""
    }
});

financeModel.pre('save', async function (next) {
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

module.exports = mongoose.model('financeModel', financeModel);