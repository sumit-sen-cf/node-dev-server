const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesRoleAssignedPate = new Schema({
    user_role: {
        type: Number,                           //user - role_id
        required: false
    },
    financial_year_setup_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "financialYearSetup"
    },
    badge_id: {
        type: Schema.Types.ObjectId,
        required: false,
        //    ref : "salesBadges"
    },
    rate_min: {
        type: Number,
        require: false
    },
    rate_max: {
        type: Number,
        require: false
    },
    managed_by: {
        type: Number,
        required: false
    },
    created_by: {
        type: Number,
        required: true,
        default: 0,
    },
    last_updated_by: {
        type: Number,
        required: false,
        default: 0
    }
},
    { timestamps: true },
);
module.exports = mongoose.model('salesRoleAssignedPate', salesRoleAssignedPate);