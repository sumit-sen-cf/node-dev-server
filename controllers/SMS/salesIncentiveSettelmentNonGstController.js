const salesIncentiveSettlementNonGstModel = require("../../models/SMS/salesIncentiveSettlementNonGstModel");
const { message } = require("../../common/message")
const mongoose = require("mongoose");

/**
 * Api is to used for the sales_insentive_settelment_non_gst data add in the DB collection.
 */

exports.createSalesIncentiveSettelmentNonGst = async (req, res) => {
    try {
        const { sales_executive_id, sale_booking_id, sale_booking_date, record_service_amount, incentive_amount, earning_status } = req.body;
        const addSalesIncentiveSettelmentNonGstData = new salesIncentiveSettlementNonGstModel({
            sales_executive_id: sales_executive_id,
            sale_booking_date: sale_booking_date,
            sale_booking_id: sale_booking_id,
            record_service_amount: record_service_amount,
            incentive_amount: incentive_amount,
            earning_status: earning_status,
        });
        await addSalesIncentiveSettelmentNonGstData.save();
        return res.status(200).json({
            status: 200,
            message: "Sales incentive settelment non gst details data added successfully!",
            data: addSalesIncentiveSettelmentNonGstData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the sales_insentive_settelment_non_gst data getBy-Id in the DB collection.
 */
exports.getSalesIncentiveSettelmentNonGstDetail = async (req, res) => {
    try {
        const salesNonGstData = await salesIncentiveSettlementNonGstModel.findOne({
            _id: req.params.id
        });
        if (salesNonGstData) {
            return res.status(200).json({
                status: 200,
                message: "Sales incentive settelment non gst details successfully!",
                data: salesNonGstData,
            });
        }
        return res.status(404).json({
            status: 404,
            message: message.DATA_NOT_FOUND,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the sales_insentive_settelment_non_gst data update in the DB collection.
 */
exports.updateSalesIncentiveNonGst = async (req, res) => {
    try {
        const { id } = req.params;
        const { sales_executive_id, sale_booking_date, sale_booking_id, record_service_amount, incentive_amount, earning_status, } = req.body;
        const salesIncentiveSettelmentNonGstData = await salesIncentiveSettlementNonGstModel.findOne({ _id: id });
        if (!salesIncentiveSettelmentNonGstData) {
            return res.send("Invalid page sales_incentive_settelment_non_gst Id...");
        }
        await salesIncentiveSettelmentNonGstData.save();
        const salesIncentiveSettelmentNonGstUpdate = await salesIncentiveSettlementNonGstModel.findOneAndUpdate({ _id: id }, {
            $set: {
                sales_executive_id,
                sale_booking_date,
                sale_booking_id,
                record_service_amount,
                incentive_amount,
                earning_status,
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "Sales incentive settelment non gst updated successfully!",
            data: salesIncentiveSettelmentNonGstUpdate,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

exports.getSalesIncentiveSettelmentNonGstList = async (req, res) => {
    try {
        const salesIncentiveSettelmentNonGstData = await salesIncentiveSettlementNonGstModel.find();
        if (salesIncentiveSettelmentNonGstData) {
            return res.status(200).json({
                status: 200,
                message: "Sales incentive settelment non gst list successfully!",
                data: salesIncentiveSettelmentNonGstData,
            });
        }
        return res.status(404).json({
            status: 404,
            message: message.DATA_NOT_FOUND,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};
/**
 * Api is to used for the sales_insentive_settelment_non_gst data delete 
 * 
 * in the DB collection.
 */
exports.deleteSalesIncentiveSettelmentNonGst = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const salesIncentiveSettelmentNonGstDelete = await salesIncentiveSettlementNonGstModel.findOne({ _id: id });
        if (!salesIncentiveSettelmentNonGstDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await salesIncentiveSettlementNonGstModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Sales brand data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};