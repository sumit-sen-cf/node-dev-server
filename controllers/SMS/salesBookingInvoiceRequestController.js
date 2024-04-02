const salesBookingInvoiceRequestModel = require("../../models/SMS/salesBookingInvoiceRequestModel");
const vari = require("../../variables.js");
const { storage } = require('../../common/uploadFile.js');
const multer = require("multer");
const mongoose = require("mongoose");
const { message } = require("../../common/message")

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "invoice_file", maxCount: 1 }
]);

/**
 * Api is to used for the sales_booking_invoice_request data add in the DB collection.
 */

exports.createSalesBookingInvoiceRequest = [
    upload, async (req, res) => {
        try {
            const checkDuplicacy = await salesBookingInvoiceRequestModel.findOne({ vendorMast_name: req.body.vendorMast_name });
            if (checkDuplicacy) {
                return res.status(403).json({
                    status: 403,
                    message: "PMS vendore-mast alredy exist!",
                });
            }
            const { sale_booking_id, invoice_type_id, invoice_particular_id, po_number, invoice_remark,
                invoice_number, invoice_date, party_name, invoice_requested_date, invoice_uploaded_date, invoice_creation_status,
                invoice_action_reason, request_by, created_by, last_updated_by } = req.body;
            const addSalesBookingInvoiceRequestData = new salesBookingInvoiceRequestModel({
                sale_booking_id: sale_booking_id,
                invoice_type_id: invoice_type_id,
                invoice_particular_id: invoice_particular_id,
                po_number: po_number,
                invoice_remark: invoice_remark,
                invoice_number: invoice_number,
                invoice_date: invoice_date,
                party_name: party_name,
                invoice_requested_date: invoice_requested_date,
                invoice_uploaded_date: invoice_uploaded_date,
                invoice_creation_status: invoice_creation_status,
                invoice_action_reason: invoice_action_reason,
                request_by: request_by,
                created_by: created_by,
                last_updated_by: last_updated_by
            });
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            if (req.files.invoice_file && req.files.invoice_file[0].originalname) {
                const blob1 = bucket.file(req.files.invoice_file[0].originalname);
                addSalesBookingInvoiceRequestData.invoice_file = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => {
                });
                blobStream1.end(req.files.invoice_file[0].buffer);
            }
            await addSalesBookingInvoiceRequestData.save();
            return res.status(200).json({
                status: 200,
                message: "Sales booking invoice request data added successfully!",
                data: addSalesBookingInvoiceRequestData,
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message ? error.message : message.ERROR_MESSAGE,
            });
        }
    }];

/**
 * Api is to used for the sales sales_booking_invoice_request data get_ByID in the DB collection.
 */

exports.getSalesBookingInvoiceRequest = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const salesBookingInvoiceRequestData = await salesBookingInvoiceRequestModel.aggregate([
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
                $project: {
                    sale_booking_id: 1,
                    invoice_type_id: 1,
                    invoice_particular_id: 1,
                    po_number: 1,
                    invoice_remark: 1,
                    invoice_number: 1,
                    invoice_date: 1,
                    party_name: 1,
                    invoice_requested_date: 1,
                    invoice_uploaded_date: 1,
                    invoice_creation_status: 1,
                    invoice_action_reason: 1,
                    requested_by: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    invoice_file: {
                        $concat: [imageUrl, "$invoice_file"],
                    },
                },
            },
        ])
        if (salesBookingInvoiceRequestData) {
            return res.status(200).json({
                status: 200,
                message: "Sales booking invoice request details successfully!",
                data: salesBookingInvoiceRequestData,
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
 * Api is to used for the update_sales_booking_invoice_request data update_by_ID in the DB collection.
 */
exports.updateSalesBookingInvoiceRequest = [
    upload, async (req, res) => {
        try {
            const { id } = req.params;
            const { sale_booking_id, invoice_type_id, invoice_particular_id, po_number, invoice_remark,
                invoice_number, invoice_date, party_name, invoice_requested_date, invoice_uploaded_date, invoice_creation_status,
                invoice_action_reason, request_by, created_by, last_updated_by } = req.body;
            const salesBookingInvoiceRequestData = await salesBookingInvoiceRequestModel.findOne({ _id: id });
            if (!salesBookingInvoiceRequestData) {
                return res.send("Invalid sales_booking_invoice_request Id...");
            }
            if (req.files) {
                salesBookingInvoiceRequestData.image = req.files["invoice_file"] ? req.files["invoice_file"][0].filename : salesBookingInvoiceRequestData.image;
            }
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            if (req.files?.invoice_file && req.files?.invoice_file[0].originalname) {
                const blob1 = bucket.file(req.files.invoice_file[0].originalname);
                salesBookingInvoiceRequestData.invoice_file = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => {
                });
                blobStream1.end(req.files.invoice_file[0].buffer);
            }
            await salesBookingInvoiceRequestData.save();
            const salesBookingInvoiceRequestUpdatedData = await salesBookingInvoiceRequestModel.findOneAndUpdate({ _id: id }, {
                $set: {
                    sale_booking_id,
                    invoice_type_id,
                    invoice_particular_id,
                    po_number,
                    invoice_remark,
                    invoice_number,
                    invoice_date,
                    party_name,
                    invoice_requested_date,
                    invoice_uploaded_date,
                    invoice_creation_status,
                    invoice_action_reason,
                    request_by,
                    created_by,
                    last_updated_by
                },
            },
                { new: true }
            );
            return res.status(200).json({
                message: "Sales booking invoice request details data updated successfully!",
                data: salesBookingInvoiceRequestUpdatedData,
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message ? error.message : message.ERROR_MESSAGE,
            });
        }
    }]


/**
 * Api is to used for the sales_booking_invoice_request_list data get_by_ID in the DB collection.
*/
exports.salesBookingInvoiceRequestList = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const salesBookingInvoiceRequestListData = await salesBookingInvoiceRequestModel.aggregate([
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
                $lookup: {
                    from: "salesinvoicetypes",
                    localField: "invoice_type_id",
                    foreignField: "_id",
                    as: "salesinvoicetype",
                },
            },
            {
                $unwind: {
                    path: "$salesinvoicetype",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "salesinvoiceparticulars",
                    localField: "invoice_particular_id",
                    foreignField: "_id",
                    as: "salesinvoiceparticular",
                },
            },
            {
                $unwind: {
                    path: "$salesinvoiceparticular",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    sale_booking_id: 1,
                    invoice_type_id: 1,
                    invoice_particular_id: 1,
                    po_number: 1,
                    invoice_remark: 1,
                    invoice_number: 1,
                    invoice_date: 1,
                    party_name: 1,
                    invoice_requested_date: 1,
                    invoice_uploaded_date: 1,
                    invoice_creation_status: 1,
                    invoice_action_reason: 1,
                    requested_by: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    invoice_file: {
                        $concat: [imageUrl, "$invoice_file"],
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
                    },
                    salesinvoicetypes: {
                        _id: "$salesinvoicetype._id",
                        invoice_type_name: "$salesinvoicetype.invoice_type_name"
                    },
                    salesinvoiceparticulars: {
                        _id: "$salesinvoiceparticular._id",
                        invoice_particular_name: "$salesinvoiceparticular.invoice_particular_name",
                        remarks: "$salesinvoiceparticular.remarks",
                        managed_by: "$salesinvoiceparticular.managed_by",

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
        if (salesBookingInvoiceRequestListData) {
            return res.status(200).json({
                status: 200,
                message: "Sales booking invoice request details list successfully!",
                data: salesBookingInvoiceRequestListData,
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
 * Api is to used for the sales_booking_invoice_request data delete in the DB collection.
 */
exports.deleteSalesBookingInvoiceRequest = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const salesBookingInvoiceRequestDelete = await salesBookingInvoiceRequestModel.findOne({ _id: id });
        if (!salesBookingInvoiceRequestDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await salesBookingInvoiceRequestModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Sales booking invoice request data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};