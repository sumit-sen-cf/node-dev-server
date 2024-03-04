const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const razorpayPaymentModel = new mongoose.Schema({
    amount: {
        type: Number,
        required: false,
    },
    order_id: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    }
});


module.exports = mongoose.model(
    "razorpayPaymentModel",
    razorpayPaymentModel
);
