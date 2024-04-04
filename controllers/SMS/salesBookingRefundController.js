const multer = require("multer");
const vari = require("../../variables.js");
const { storage } = require('../../common/uploadFile.js');
const salesBookingRefundModel = require("../../models/SMS/salesBookingRefundModel.js");
const mongoose = require("mongoose");

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "refund_files", maxCount: 1 }
]);

/**
 * Api is to used for the sales_booking_refund data add in the DB collection. 
 */
exports.createSalesBookingRefund = [
    upload, async (req, res) => {
        try {
            const { sale_booking_id, refund_amount, manager_refund_status, manager_refund_date, finance_refund_status,
                finance_refund_date, remarks, managed_by, created_by, last_updated_by } = req.body;
            const addSalesBookingRefund = new salesBookingRefundModel({
                sale_booking_id: sale_booking_id,
                refund_amount: refund_amount,
                manager_refund_status: manager_refund_status,
                manager_refund_date: manager_refund_date,
                finance_refund_status: finance_refund_status,
                finance_refund_date: finance_refund_date,
                remarks: remarks,
                managed_by: managed_by,
                created_by: created_by,
                last_updated_by: last_updated_by
            });
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);
            if (req.files.refund_files && req.files.refund_files[0].originalname) {
                const blob2 = bucket.file(req.files.refund_files[0].originalname);
                addSalesBookingRefund.refund_files = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                });
                blobStream2.end(req.files.refund_files[0].buffer);
            }
            await addSalesBookingRefund.save();
            return res.status(200).json({
                status: 200,
                message: "Sales booking refund data added successfully!",
                data: addSalesBookingRefund,
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message ? error.message : message.ERROR_MESSAGE,
            });
        }
    }];


/**
 * Api is to used for the sales_booking_refund data get_by_ID in the DB collection.
 */
exports.getSalesBookingRefundDetail = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const salesBookingRefundData = await salesBookingRefundModel.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(req.params.id) },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "last_updated_by",
                    foreignField: "user_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    sale_booking_id: 1,
                    refund_amount: 1,
                    manager_refund_status: 1,
                    manager_refund_date: 1,
                    finance_refund_status: 1,
                    finance_refund_date: 1,
                    remarks: 1,
                    managed_by: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    refund_files: {
                        $concat: [imageUrl, "$refund_files"],
                    },
                },
            },
        ])
        if (salesBookingRefundData) {
            return res.status(200).json({
                status: 200,
                message: "Sales booking invoice details successfully!",
                data: salesBookingRefundData,
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
 * Api is to used for the update_sales_booking_refund data update_by_ID in the DB collection.
 */
exports.updateSalesBookingRefund = [
    upload, async (req, res) => {
        try {
            const { id } = req.params;
            const { sale_booking_id, refund_amount, manager_refund_status, manager_refund_date, finance_refund_status,
                finance_refund_date, remarks, managed_by, created_by, last_updated_by } = req.body;
            const salesBookingRefundData = await salesBookingRefundModel.findOne({ _id: id });
            if (!salesBookingRefundData) {
                return res.send("Invalid sales_booking_refund Id...");
            }
            if (req.files) {
                salesBookingRefundData.image = req.files["refund_files"] ? req.files["refund_files"][0].filename : salesBookingRefundData.image;
            }
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            if (req.files?.refund_files && req.files?.refund_files[0].originalname) {
                const blob1 = bucket.file(req.files.refund_files[0].originalname);
                salesBookingRefundData.refund_files = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => {
                });
                blobStream1.end(req.files.refund_files[0].buffer);
            }
            await salesBookingRefundData.save();
            const salesBookingRequestUpdated = await salesBookingRefundModel.findOneAndUpdate({ _id: id }, {
                $set: {
                    sale_booking_id,
                    refund_amount,
                    manager_refund_status,
                    manager_refund_date,
                    finance_refund_status,
                    finance_refund_date,
                    remarks,
                    managed_by,
                    created_by,
                    last_updated_by
                },
            },
                { new: true }
            );
            return res.status(200).json({
                message: "Sales booking refund request details data updated successfully!",
                data: salesBookingRequestUpdated,
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message ? error.message : message.ERROR_MESSAGE,
            });
        }
    }]

/**
 * Api is to used for the sales_booking_refund_request_list data get_by_ID in the DB collection.
*/
exports.salesBookingRefundList = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const salesBookingRefundList = await salesBookingRefundModel.aggregate([
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "salesbookings",
                    localField: "sale_booking_id",
                    foreignField: "sale_booking_id",
                    as: "salesbooking",
                },
            },
            {
                $unwind: {
                    path: "$salesbooking",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    sale_booking_id: 1,
                    refund_amount: 1,
                    manager_refund_status: 1,
                    manager_refund_date: 1,
                    finance_refund_status: 1,
                    finance_refund_date: 1,
                    remarks: 1,
                    managed_by: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    refund_files: {
                        $concat: [imageUrl, "$refund_files"],
                    },
                    Sales_Booking: {
                        sales_booking_id: "$salesbooking.sale_booking_id",
                        sale_booking_date: "$salesbooking.sale_booking_date",
                        campaign_amount: "$salesbooking.campaign_amount",
                        base_amount: "$salesbooking.base_amount",
                        gst_amount: "$salesbooking.gst_amount",
                        description: "$salesbooking.description",
                        credit_approval_status: "$salesbooking.credit_approval_status",
                        reason_credit_approval: "$salesbooking.reason_credit_approval",
                        balance_payment_ondate: "$salesbooking.balance_payment_ondate",
                        gst_status: "$salesbooking.gst_status",
                        tds_status: "$salesbooking.tds_status",
                        Booking_close_date: "$salesbooking.Booking_close_date",
                        tds_verified_amount: "$salesbooking.tds_verified_amount",
                        tds_verified_remark: "$salesbooking.tds_verified_remark",
                        booking_remarks: "$salesbooking.booking_remarks",
                        incentive_status: "$salesbooking.incentive_status",
                        payment_credit_status: "$salesbooking.payment_credit_status",
                        booking_status: "$salesbooking.booking_status",
                        incentive_sharing_user_id: "$salesbooking.incentive_sharing_user_id",
                        incentive_sharing_percent: "$salesbooking.incentive_sharing_percent",
                        bad_debt: "$salesbooking.bad_debt",
                        bad_debt_reason: "$salesbooking.bad_debt_reason",
                        no_badge_achivement: "$salesbooking.no_badge_achivement",
                        old_sale_booking_id: "$salesbooking.old_sale_booking_id",
                        sale_booking_type: "$salesbooking.sale_booking_type",
                        service_taken_amount: "$salesbooking.service_taken_amount",
                        get_incentive_status: "$salesbooking.get_incentive_status",
                        incentive_amount: "$salesbooking.incentive_amount",
                        earned_incentive_amount: "$salesbooking.earned_incentive_amount",
                        unearned_incentive_amount: "$salesbooking.unearned_incentive_amount",
                        payment_type: "$salesbooking.payment_type",
                        created_by: "$salesbooking.created_by",
                        managed_by: "$salesbooking.managed_by",
                        last_updated_by: "$salesbooking.last_updated_by",
                        creation_date: "$salesbooking.creation_date",
                        last_updated_date: "$salesbooking.last_updated_date"
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    data: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: "$data" }
            }

        ])
        if (salesBookingRefundList) {
            return res.status(200).json({
                status: 200,
                message: "Sales booking refund request details list successfully!",
                data: salesBookingRefundList,
            });
        }
        return res.status(404).json({
            status: 404,
            message: message.DATA_NOT_FOUND,
        });
    } catch (error) {
        {
            return res.status(500).json({
                status: 500,
                message: error.message ? error.message : message.ERROR_MESSAGE,
            });
        }
    }
}

/**
 * Api is to used for the sales_booking_refund_request data delete in the DB collection.
 */
exports.deleteSalesBookingRefund = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const salesBookingRefundDelete = await salesBookingRefundModel.findOne({ _id: id });
        if (!salesBookingRefundDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await salesBookingRefundModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Sales booking refund request data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};