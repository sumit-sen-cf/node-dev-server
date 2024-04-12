const { message } = require("../../common/message")
const mongoose = require("mongoose");
const salesIncentiveSettelmentGstModel = require("../../models/SMS/salesIncentiveSettelmentGstModel");

/**
 * Api is to used for the sales_insentive_settelment_gst data add in the DB collection.
 */
exports.createSalesIncentiveSettelmentGst = async (req, res) => {
    try {
        const { sale_booking_id, sales_executive_id, sale_booking_date, record_service_amount, incentive_amount, maximum_incentive_amount, earning_status,
            settlement_status } = req.body;
        const addSalesIncentiveSettelmentGst = new salesIncentiveSettelmentGstModel({
            sale_booking_id: sale_booking_id,
            sales_executive_id: sales_executive_id,
            sale_booking_date: sale_booking_date,
            record_service_amount: record_service_amount,
            incentive_amount: incentive_amount,
            maximum_incentive_amount: maximum_incentive_amount,
            earning_status: earning_status,
            settlement_status: settlement_status,
        });
        await addSalesIncentiveSettelmentGst.save();
        return res.status(200).json({
            status: 200,
            message: "Sales incentive settelment gst details data added successfully!",
            data: addSalesIncentiveSettelmentGst,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};