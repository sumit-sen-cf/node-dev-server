const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-auto-increment');

const designationModel = new mongoose.Schema({
    desi_id: {
        type: Number,
        required: false
    },
    dept_id: {
        type: Number,
        required: false,
        default: 0
    },
    sub_dept_id: {
        type: Number,
        required: false,
        default: 0
    },
    desi_name: {
        type: String,
        required: false,
        unique: true,
        default: ""
    },
    remark: {
        type: String,
        required: false,
        default: ""
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    last_updated_at: {
        type: Date,
        default: ""
    },
    last_updated_by: {
        type: Number,
        required: false,
        default: 0
    },
    created_by: {
        type: Number,
        required: false,
        default: 0
    }
});

designationModel.pre('save', async function (next) {
    if (!this.desi_id) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'desi_id': -1 } });

        if (lastAgency && lastAgency.desi_id) {
            this.desi_id = lastAgency.desi_id + 1;
        } else {
            this.desi_id = 1;
        }
    }
    next();
});

module.exports = mongoose.model('designationModel', designationModel);