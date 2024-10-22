const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const userPreviousYearExperienceModel = new mongoose.Schema({
    user_experience_id: {
        type: Number,
        required: false,
    },
    user_id: {
        type: Number,
        required: false,
    },
    name_of_organization: {
        type: String,
        required: false,
        default: ""
    },
    period_of_service_from: {
        type: String,
        required: false,
        default: "",
    },
    period_of_service_to: {
        type: String,
        required: false,
        default: "",
    },
    designation: {
        type: String,
        required: false,
        default: "",
    },
    gross_salary: {
        type: Number,
        required: false,
        default: 0,
    },
    manager_name: {
        type: String,
        required: false,
        default: "",
    },
    manager_email_id: {
        type: String,
        required: false,
        default: "",
    },
    manager_phone: {
        type: Number,
        required: false,
        default: 0
    },
    hr_name: {
        type: String,
        required: false,
        default: "",
    },
    hr_email_id: {
        type: String,
        required: false,
        default: "",
    },
    hr_phone: {
        type: Number,
        required: false,
        default: 0
    },
    creation_date: {
        type: Date,
        default: Date.now,
    },
    created_by: {
        type: Number,
        required: false,
        default: 0,
    },
    last_updated_by: {
        type: Number,
        default: 0
    },
    last_updated_date: {
        type: Date,
        default: 0
    }
});

userPreviousYearExperienceModel.pre('save', async function (next) {
    if (!this.user_experience_id) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'user_experience_id': -1 } });

        if (lastAgency && lastAgency.user_experience_id) {
            this.user_experience_id = lastAgency.user_experience_id + 1;
        } else {
            this.user_experience_id = 1;
        }
    }
    next();
});

module.exports = mongoose.model("userPreviousYearExperienceModel", userPreviousYearExperienceModel);
