const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const paymentMethodSchema = new Schema(
    {
        payMethod_name: {
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
        // created_date_time: {
        //   type: Date,
        //   default: Date.now,
        // },
        // last_updated_date: {
        //   type: Date,
        //   default: Date.now,
        // },
    },
    {
        timestamps: true,
    }
);
const paymentMethodModel = mongoose.model("Pms2PaymentMethodModel", paymentMethodSchema);
module.exports = paymentMethodModel;
