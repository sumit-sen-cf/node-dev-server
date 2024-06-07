const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const pageStatesSchema = new mongoose.Schema({
    page_master_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "pms2pagemastermodels"
    },
    reach: {
        type: Number,
        required: false,
        default: ""

    },
    impression: {
        type: Number,
        required: false,
        default: ""

    },
    engagement: {
        type: Number,
        required: false,
        default: ""

    },
    story_view: {
        type: Number,
        required: false,
        default: ""

    },
    story_view_date: {
        type: Date,
        default: ""
    },
    stats_for: {
        type: String,
        required: false,
        default: ""
    },
    start_date: {
        type: Date,
        required: false
    },
    end_date: {
        type: Date,
        required: false
    },
    reach_image: {
        type: String,
        required: false,
        default: ""
    },
    impression_image: {
        type: String,
        required: false,
        default: ""
    },
    engagement_image: {
        type: String,
        required: false,
        default: ""
    },
    story_view_image: {
        type: String,
        required: false,
        default: ""
    },
    city1_name: {
        type: String,
        required: false,
        default: ""
    },
    city2_name: {
        type: String,
        required: false,
        default: ""
    },
    city3_name: {
        type: String,
        required: false,
        default: ""
    },
    city4_name: {
        type: String,
        required: false,
        default: ""
    },
    city5_name: {
        type: String,
        required: false,
        default: ""
    },
    percentage_city1_name: {
        type: Number,
        required: false,
        default: ""

    },
    percentage_city2_name: {
        type: Number,
        required: false,
        default: ""

    },
    percentage_city3_name: {
        type: Number,
        required: false,
        default: ""

    },
    percentage_city4_name: {
        type: Number,
        required: false,
        default: ""

    },
    percentage_city5_name: {
        type: Number,
        required: false,
        default: ""

    },
    city_image: {
        type: String,
        required: false,
        default: ""
    },
    male_percent: {
        type: Number,
        required: false,
        default: ""

    },
    female_percent: {
        type: Number,
        required: false,
        default: ""

    },
    Age_13_17_percent: {
        type: Number,
        required: false,
        default: ""

    },
    Age_upload: {
        type: String,
        required: false,
        default: ""
    },
    Age_18_24_percent: {
        type: Number,
        required: false,
        default: ""

    },
    Age_25_34_percent: {
        type: Number,
        required: false,
        default: ""

    },
    Age_35_44_percent: {
        type: Number,
        required: false,
        default: ""

    },
    Age_45_54_percent: {
        type: Number,
        required: false,
        default: ""

    },
    Age_55_64_percent: {
        type: Number,
        required: false,
        default: ""

    },
    Age_65_plus_percent: {
        type: Number,
        required: false,
        default: ""

    },
    //   quater:{
    //     type: String,
    //     required: false,
    //     default: ""
    //   },
    profile_visit: {
        type: Number,
        required: false,
        default: ""

    },
    country1_name: {
        type: String,
        required: false,
        default: ""
    },
    country2_name: {
        type: String,
        required: false,
        default: ""
    },
    country3_name: {
        type: String,
        required: false,
        default: ""
    },
    country4_name: {
        type: String,
        required: false,
        default: ""
    },
    country5_name: {
        type: String,
        required: false,
        default: ""
    },
    percentage_country1_name: {
        type: Number,
        required: false,
        default: ""

    },
    percentage_country2_name: {
        type: Number,
        required: false,
        default: ""

    },
    percentage_country3_name: {
        type: Number,
        required: false,
        default: ""

    },
    percentage_country4_name: {
        type: Number,
        required: false,
        default: ""

    },
    percentage_country5_name: {
        type: Number,
        required: false,
        default: ""

    },
    country_image: {
        type: String,
        required: false,
        default: ""
    },
    //   stats_update_flag: {
    //     type: Boolean,
    //     default: false
    //   },
    created_by: {
        type: Number,
        required: false,
        default: ""
        ,
    },
    last_updated_by: {
        type: Number,
        required: false,
        default: ""
        ,
    },
    status: {
        type: Number,
        required: false,
        default: constant?.ACTIVE,
    },
}, {
    timestamps: true
}
);

module.exports = mongoose.model("Pms2PageStatesModel", pageStatesSchema);