const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constant = require("../../common/constant");

const accountDepartmentSchema = new mongoose.Schema({
    department_name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    created_by: {
        type: Number,
        required: false,
    },
    updated_by: {
        type: Number,
        required: false,
    },
    status: {
        type: Number,
        required: false,
        default: constant?.ACTIVE,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("accountDepartmentModel", accountDepartmentSchema);