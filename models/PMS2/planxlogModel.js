const mongoose = require("mongoose");

// plan_status = open , close
//plan_saved = false:drafted,true:saved

const planxlogModel = new mongoose.Schema({
    plan_name: {
        type: String,
        required: false,
    },
    cost_price: {
        type: Number,
        required: false,
        default: 0
    },
    selling_price: {
        type: Number,
        required: false,
        default: 0
    },
    no_of_pages: {
        type: Number,
        required: false,
        default: 0
    },
    post_count: {
        type: Number,
        required: false,
        default: 0
    },
    story_count: {
        type: Number,
        required: false,
        default: 0
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    sales_executive_id: {
        type: Number,
        required: false,
        default: 0
    },
    account_id: {
        type: mongoose.Types.ObjectId,
        ref: "accountmastermodels",
        required: false
    },
    duplicate_planx_id: {
        type: mongoose.Types.ObjectId,
        ref: "planxlogmodels",
        required: false
    },
    brand_id: {
        type: mongoose.Types.ObjectId,
        ref: "accountbrandmodels",
        required: false
    },
    brief: {
        type: String,
        required: false,
        default: ""
    },
    plan_status: {
        type: String,
        required: false,
        default: "open"
    },
    plan_saved: {
        type: Boolean,
        required: false,
        default: false
    },
    created_by: {
        type: Number,
        required: false,
        default: 0,
    },
    last_updated_by: {
        type: Number,
        required: false,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("planxlogModel", planxlogModel);
