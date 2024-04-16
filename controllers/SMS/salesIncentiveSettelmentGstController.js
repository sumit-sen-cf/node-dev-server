const { message } = require("../../common/message")
const mongoose = require("mongoose");
const salesIncentiveSettelmentGstModel = require("../../models/SMS/salesIncentiveSettelmentGstModel");

/**
 * Api is to used for the sales_insentive_settelment_gst data add in the DB collection.
 */
exports.createSalesIncentiveGst = async (req, res) => {
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

/**
 * Api is to used for the sales_insentive_settelment_gst data getById
 * 
 *  in the DB collection.
 */
exports.getSalesIncentiveSettelmentGst = async (req, res) => {
    try {
        const salesIncentiveSettelmentGstData = await salesIncentiveSettelmentGstModel.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(req.params.id) },
            }, {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            }, {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $project: {
                    sale_booking_id: 1,
                    sales_executive_id: 1,
                    sale_booking_date: 1,
                    record_service_amount: 1,
                    incentive_amount: 1,
                    maximum_incentive_amount: 1,
                    earning_status: 1,
                    settlement_status: 1,
                },
            },
        ])
        if (salesIncentiveSettelmentGstData) {
            return res.status(200).json({
                status: 200,
                message: "Sales incentive settelment gst data successfully!",
                data: salesIncentiveSettelmentGstData,
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
 * Api is to used for the sales_insentive_settelment_gst data update in the DB collection.
 */
exports.updateSalesInsentiveSettelmentGst = async (req, res) => {
    try {
        const { id } = req.params;
        const { sale_booking_id, sales_executive_id, sale_booking_date, record_service_amount, incentive_amount, maximum_incentive_amount, earning_status,
            settlement_status } = req.body;
        const salesIncentiveSettelmentGstData = await salesIncentiveSettelmentGstModel.findOne({ _id: id });
        if (!salesIncentiveSettelmentGstData) {
            return res.send("Invalid sales_insentive_settelment_gst Id...");
        }
        await salesIncentiveSettelmentGstData.save();
        const salesIncentiveSettelmentGstUpdated = await salesIncentiveSettelmentGstModel.findOneAndUpdate({ _id: id }, {
            $set: {
                sale_booking_id,
                sales_executive_id,
                sale_booking_date,
                record_service_amount,
                incentive_amount,
                maximum_incentive_amount,
                earning_status,
                settlement_status
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "Sales incentive settelment gst details data added successfully!",
            data: salesIncentiveSettelmentGstUpdated,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

exports.getSalesIncentiveSettelmentGstList = async (req, res) => {
    try {
        const salesIncentiveSettelmentGstListData = await salesIncentiveSettelmentGstModel.aggregate([
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            },{
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },{
                $project: {
                    sale_booking_id: 1,
                    sales_executive_id: 1,
                    sale_booking_date: 1,
                    record_service_amount: 1,
                    incentive_amount: 1,
                    maximum_incentive_amount: 1,
                    earning_status: 1,
                    settlement_status: 1,
                },
            },
        ])
        if (salesIncentiveSettelmentGstListData) {
            return res.status(200).json({
                status: 200,
                message: "Sales incentive settelment gst details list successfully!",
                data: salesIncentiveSettelmentGstListData,
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
 * Api is to used for the sales_insentive_settelment_gst data delete in the DB collection.
 */
exports.deleteSalesInsentiveSettelmentGst = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const salesInsentiveSettelmentGstDelete = await salesIncentiveSettelmentGstModel.findOne({ _id: id });
        if (!salesInsentiveSettelmentGstDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await salesIncentiveSettelmentGstModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Sales incentive settelment gst data delete successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};