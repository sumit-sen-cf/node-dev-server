const { message } = require("../../common/message")
const mongoose = require("mongoose");
const salesIncentiveSettledNonGstSbModel = require("../../models/SMS/salesIncentiveSettledNonGstSbModel");
const { json } = require("body-parser");

/**
 * Api is to used for the sales_incentive_settled_non_gst_sb data add in the DB collection.
 */
exports.createSalesIncentiveSettledNonGstSb = async (req, res) => {
    try {
        const { sale_booking_id, sales_incentive_settlement_gst_id, sales_executive_id, sale_booking_date, record_service_amount, incentive_amount,
            earning_status, gst_sale_booking_id } = req.body;
        const addSalesIncentiveSetteledNonGstSb = new salesIncentiveSettledNonGstSbModel({
            sale_booking_id: sale_booking_id,
            sales_incentive_settlement_gst_id: sales_incentive_settlement_gst_id,
            sales_executive_id: sales_executive_id,
            sale_booking_date: sale_booking_date,
            record_service_amount: record_service_amount,
            incentive_amount: incentive_amount,
            earning_status: earning_status,
            gst_sale_booking_id: gst_sale_booking_id
        });
        await addSalesIncentiveSetteledNonGstSb.save();
        return res.status(200).json({
            status: 200,
            message: "Sales incentive settled non gst sb data add successfully!",
            data: addSalesIncentiveSetteledNonGstSb,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the sales_incentive_settled_non_gst_sb data get_ByID in the DB collection.
 */
exports.getSalesSettledNonGstSbDetails = async (req, res) => {
    try {
        const salesSettledNonGstSbDetails = await salesIncentiveSettledNonGstSbModel.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(req.params.id) },
            }, {
                $lookup: {
                    from: "usermodels",
                    localField: "sales_executive_id",
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
                    sales_incentive_settlement_gst_id: 1,
                    sales_executive_id_name: "$user.user_name",
                    sales_executive_id: 1,
                    sale_booking_date: 1,
                    record_service_amount: 1,
                    incentive_amount: 1,
                    earning_status: 1,
                    gst_sale_booking_id: 1,
                },
            },
        ])
        if (salesSettledNonGstSbDetails) {
            return res.status(200).json({
                status: 200,
                message: "Sales settled non gstsb Details data successfully!",
                data: salesSettledNonGstSbDetails,
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
 * Api is to used for the sales_incentive_settled_non_gst_sb data update_ByID in the DB collection.
 */
exports.updateSalesIncentiveSettelmentNonGstSb = async (req, res) => {
    try {
        const { id } = req.params;
        const { sale_booking_id, sales_incentive_settlement_gst_id, sales_executive_id, sale_booking_date, record_service_amount, incentive_amount,
            earning_status, gst_sale_booking_id } = req.body;
        const salesIncentiveSettelmentNonGstSbData = await salesIncentiveSettledNonGstSbModel.findOne({ _id: id })
        if (!salesIncentiveSettelmentNonGstSbData) {
            return res.send("Invalid sales_incentive_settelment_non_gst_sb id!")
        }
        await salesIncentiveSettelmentNonGstSbData.save();
        const salesIncentiveSettelmentNonGstSbUpdate = await salesIncentiveSettledNonGstSbModel.findOneAndUpdate({ _id: id }, {
            $set: {
                sale_booking_id,
                sales_incentive_settlement_gst_id,
                sales_executive_id,
                sale_booking_date,
                record_service_amount,
                incentive_amount,
                earning_status,
                gst_sale_booking_id
            }
        }, { new: true }
        )
        return res.status(200).json({
            status: 200,
            message: "Sales incentive settled non gst sb data update successfully!",
            data: salesIncentiveSettelmentNonGstSbUpdate
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,

        })
    }
}

/**
 * Api is to used for the sales_incentive_settled_non_gst_sb data get_list in the DB collection.
 */
exports.salesIncentiveSettledNonGstSbList = async (req, res) => {
    try {
        const salesIncentiveSettledNonGstSbListData = await salesIncentiveSettledNonGstSbModel.aggregate([
            {
                $lookup: {
                    from: "salesbookings",
                    localField: "sale_booking_id",
                    foreignField: "sale_booking_id",
                    as: "salesbooking",
                }
            }, {
                $unwind: {
                    path: "$salesbooking",
                    preserveNullAndEmptyArrays: true,
                }
            }, {
                $project: {
                    sale_booking_id: 1,
                    sales_incentive_settlement_gst_id: 1,
                    sales_executive_id_name: "$user.user_name",
                    sales_executive_id: 1,
                    sale_booking_date: 1,
                    record_service_amount: 1,
                    incentive_amount: 1,
                    earning_status: 1,
                    gst_sale_booking_id: 1,
                    Sales_Booking: "$salesbooking"
                }
            }, {
                $group: {
                    _id: "$_id",
                    data: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: "$data" }
            }
        ])
        if (salesIncentiveSettledNonGstSbListData) {
            return res.status(200).json({
                status: 200,
                message: "Sales incentive settled non gst sb data list successfully!",
                data: salesIncentiveSettledNonGstSbListData,
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
        })
    }
}

/**
 * Api is to used for the sales_incentive_settled_non_gst_sb data delete in the DB collection.
 */
exports.deleteSalesIncentiveSetteledNonGstSb = async (req, res) => {
    try {
        const salesIncentiveSettelmentNonGstSbData = await salesIncentiveSettledNonGstSbModel.findOne({ _id: id })
        if (!salesIncentiveSettelmentNonGstSbData) {
            return res.status(404).json({
                status: 404,
                message: "Data not found!"
            })
        }
        await salesBookingPaymentModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Sales incentive settled non gst sb data deleted successfully!",
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        })
    }
}