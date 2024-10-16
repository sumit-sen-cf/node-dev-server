const { required } = require("joi");
const { default: mongoose } = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const pms2PageSubCatModel = new mongoose.Schema({
    page_sub_category_id: {
        type: Number,
        required: false
    },
    page_sub_category: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
        default: "",
    },
    state: {
        type: String,
        required: false,
        default: "",
    },
    created_by: {
        type: Number,
        required: true,
        default: 0,
    },
    last_updated_by: {
        type: Number,
        reqxuired: false,
        default: 0,
    },
    status: {
        type: Number,
        required: false,
        default: constant?.ACTIVE,
    },
}, {
    timestamps: true
});

pms2PageSubCatModel.pre('save', async function (next) {
    if (!this.page_sub_category_id) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'page_sub_category_id': -1 } });

        if (lastAgency && lastAgency.page_sub_category_id) {
            this.page_sub_category_id = lastAgency.page_sub_category_id + 1;
        } else {
            this.page_sub_category_id = 1;
        }
    }
    next();
});

module.exports = mongoose.model("pms2PageSubCatModel", pms2PageSubCatModel);