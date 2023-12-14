const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const financeModel = new mongoose.Schema({
    id:{
        type: Number,
        required: true
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
    date:{
        type: Date,
        default: Date.now
    },
    screenshot:{
        type: String,
        required: false,
        default:""
    },
    attendence_id:{
        type: Number,
        required: true
    },
    reference_no:{
        type: Number,
        required: false,
        default:0
    },
    amount:{
        type:Number,
        default:0
    },
    pay_date:{
        type: Date,
        default:""
    }
});

AutoIncrement.initialize(mongoose.connection);
financeModel.plugin(
    AutoIncrement.plugin, 
    { model: 'financeModels', field: 'id', startAt: 1, incrementBy: 1 }
);

module.exports = mongoose.model('financeModel', financeModel);