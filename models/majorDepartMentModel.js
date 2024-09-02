const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const majorDepartmentModel = new mongoose.Schema({
    m_dept_id: {
        type: Number,
        required: false,
    },
    m_dept_name: {
        type: String,
        required: false,
        unique: true,
        default: "",
    },
    dept_id: {
        type: Number,
        required: false,
    },
    Remarks: {
        type: String,
        required: false,
        default: "",
    },
    Creation_date: {
        type: Date,
        default: Date.now,
    },
    Created_by: {
        type: Number,
        required: false,
        default: 0,
    },
    Last_updated_by: {
        type: Number,
        default: 0
    },
    Last_updated_date: {
        type: Date,
        default: 0
    },
});

majorDepartmentModel.pre('save', async function (next) {
    if (!this.m_dept_id) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'm_dept_id': -1 } });

        if (lastAgency && lastAgency.m_dept_id) {
            this.m_dept_id = lastAgency.m_dept_id + 1;
        } else {
            this.m_dept_id = 1;
        }
    }
    next();
});

module.exports = mongoose.model("majorDepartmentModel", majorDepartmentModel);
