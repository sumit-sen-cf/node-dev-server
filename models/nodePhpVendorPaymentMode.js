const mongoose = require('mongoose');
// var options = {
//     timestamps: {
//         createdAt: 'created_on',
//         updatedAt: 'updated_on'
//     },
// };
const nodePhpVendorPaymentMode = new mongoose.Schema({
    payment_mode: {
        type: String,
        required: false
    },
    created_by: {
        type: Number,
        // required: false,
        default: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('nodePhpVendorPaymentMode', nodePhpVendorPaymentMode);