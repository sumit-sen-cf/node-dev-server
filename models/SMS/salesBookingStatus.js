const mongoose = require('mongoose');

const salesBookingStatus = new mongoose.Schema({
    status_id: {
        type: Number,
        required: false,
    },
    status_name: {
        type: String,
        required: false,
    },
    status_desc: {
        type: String,
        required: false,
    },
    status_type: {
        type: String,
        enum: ['booking', 'execution'],//0=booking, 1=execution
    },
    status_order: {
        type: Number,
        required: false,
    },
}, {
    timestamps: true
});

salesBookingStatus.pre('save', async function (next) {
    if (!this.status_id) {
        const salesBookingData = await this.constructor.findOne({}, {}, { sort: { 'status_id': -1 } });

        if (salesBookingData && salesBookingData.status_id) {
            this.status_id = salesBookingData.status_id + 1;
        } else {
            this.status_id = 1;
        }
    }
    next();
});

module.exports = mongoose.model('salesBookingStatus', salesBookingStatus);