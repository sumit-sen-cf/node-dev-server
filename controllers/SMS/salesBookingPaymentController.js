const { message } = require("../../common/message")
const mongoose = require("mongoose");
const salesBookingPaymentModel = require("../../models/SMS/salesBookingPaymentModel");
const multer = require("multer");
const vari = require("../../variables.js");
const { storage } = require('../../common/uploadFile.js');
const salesBooking = require("../../models/SMS/salesBooking.js");

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "payment_screenshot", maxCount: 1 }
]);

/**
 * Api is to used for the sales_booking_payment data add in the DB collection.
 */
exports.createSalesBookingPayment = [
    upload, async (req, res) => {
        try {
            const { payment_date, sale_booking_id, customer_id, payment_amount, payment_mode, payment_detail_id,
                payment_ref_no, payment_approval_status, action_reason, managed_by,
                remarks, created_by, last_updated_by } = req.body;
            const addSalesBookingPayment = new salesBookingPaymentModel({
                payment_date: payment_date,
                sale_booking_id: sale_booking_id,
                customer_id: customer_id,
                payment_amount: payment_amount,
                payment_mode: payment_mode,
                payment_detail_id: payment_detail_id,
                payment_ref_no: payment_ref_no,
                payment_approval_status: payment_approval_status,
                action_reason: action_reason,
                remarks: remarks,
                managed_by: managed_by,
                created_by: created_by,
                last_updated_by: last_updated_by
            });
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);
            if (req.files.payment_screenshot && req.files.payment_screenshot[0].originalname) {
                const blob2 = bucket.file(req.files.payment_screenshot[0].originalname);
                addSalesBookingPayment.payment_screenshot = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                });
                blobStream2.end(req.files.payment_screenshot[0].buffer);
            }
            await addSalesBookingPayment.save();
            return res.status(200).json({
                status: 200,
                message: "Sales booking payment data added successfully!",
                data: addSalesBookingPayment,
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message ? error.message : message.ERROR_MESSAGE,
            });
        }
    }];


/**
 * Api is to used for the sales_booking_payment data get_by_ID in the DB collection.
 */
exports.getSalesBookingPaymentDetail = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const salesBookingPaymentData = await salesBookingPaymentModel.aggregate([
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
                    payment_date: 1,
                    sale_booking_id: 1,
                    customer_id: 1,
                    payment_amount: 1,
                    payment_mode: 1,
                    payment_detail_id: 1,
                    payment_ref_no: 1,
                    payment_approval_status: 1,
                    action_reason: 1,
                    remarks: 1,
                    managed_by: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    payment_screenshot: {
                        $concat: [imageUrl, "$payment_screenshot"],
                    },
                },
            },
        ])
        if (salesBookingPaymentData) {
            return res.status(200).json({
                status: 200,
                message: "Sales booking payment details successfully!",
                data: salesBookingPaymentData,
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
 * Api is to used for the update_sales_booking_payment data get_by_ID in the DB collection.
 */
exports.updateSalesBookingPaymentDeatil = [
    upload, async (req, res) => {
        try {
            const { id } = req.params;
            const { payment_date, sale_booking_id, customer_id, payment_amount, payment_mode, payment_detail_id,
                payment_ref_no, payment_approval_status, action_reason, managed_by,
                remarks, created_by, last_updated_by } = req.body;
            const salesBookingPaymentData = await salesBookingPaymentModel.findOne({ _id: id });
            if (!salesBookingPaymentData) {
                return res.send("Invalid sales_booking_payment_details Id...");
            }
            if (req.files) {
                salesBookingPaymentData.image = req.files["payment_screenshot"] ? req.files["payment_screenshot"][0].filename : salesBookingPaymentData.image;
            }
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            if (req.files?.payment_screenshot && req.files?.payment_screenshot[0].originalname) {
                const blob1 = bucket.file(req.files.payment_screenshot[0].originalname);
                salesBookingPaymentData.payment_screenshot = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => {
                });
                blobStream1.end(req.files.payment_screenshot[0].buffer);
            }

            await salesBookingPaymentData.save();
            const salesBookingPaymentUpdatedData = await salesBookingPaymentModel.findOneAndUpdate({ _id: id }, {
                $set: {
                    payment_date,
                    sale_booking_id,
                    customer_id,
                    payment_amount,
                    payment_mode,
                    payment_detail_id,
                    payment_ref_no,
                    payment_approval_status,
                    action_reason,
                    managed_by,
                    remarks,
                    created_by,
                    last_updated_by
                },
            },
                { new: true }
            );
            return res.status(200).json({
                message: "Sales booking payment details data updated successfully!",
                data: salesBookingPaymentUpdatedData,
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message ? error.message : message.ERROR_MESSAGE,
            });
        }
    }]


/**
 * Api is to used for the sales_booking_payment_list data get_by_ID in the DB collection.
*/
exports.salesBookingPaymentDetailsList = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const salesBookingPaymentListData = await salesBookingPaymentModel.aggregate([
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
                    from: "paymentdeatils",
                    localField: "payment_detail_id",
                    foreignField: "_id",
                    as: "paymentdeatil",
                },
            },
            {
                $unwind: {
                    path: "$paymentdeatil",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "customermasts",
                    localField: "customer_id",
                    foreignField: "customer_id",
                    as: "customermast_data",
                },
            },
            {
                $unwind: {
                    path: "$customermast_data",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    payment_date: 1,
                    sale_booking_id: 1,
                    customer_id: 1,
                    payment_amount: 1,
                    payment_mode: 1,
                    payment_detail_id: 1,
                    payment_ref_no: 1,
                    payment_approval_status: 1,
                    action_reason: 1,
                    remarks: 1,
                    managed_by: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    payment_screenshot: {
                        $concat: [imageUrl, "$payment_screenshot"],
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
                    Payment_Deatils: {
                        _id: "$paymentdeatil._id",
                        title: "$paymentdeatil.title",
                        details: "$paymentdeatil.details",
                        gst_bank: "$paymentdeatil.gst_bank",
                        payment_type: "$paymentdeatil.payment_type",
                        managed_by: "$paymentdeatil.managed_by",
                        created_by: "$paymentdeatil.created_by",
                        created_by_name: "$user.user_name",
                        last_updated_by: "$paymentdeatil.last_updated_by",
                    },
                    OPS_CustomerMast_data: {
                        _id: "$customermast_data._id",
                        customermast_id: "$customermast_data.customer_id",
                        customer_id: "$customermast_data.customer_id",
                        account_type_id: "$customermast_data.account_type_id",
                        ownership_id: "$customermast_data.ownership_id",
                        industry_id: "$customermast_data.industry_id",
                        account_owner_id: "$customermast_data.account_owner_id",
                        parent_account_id: "$customermast_data.parent_account_id",
                        company_size: "$customermast_data.company_size",
                        company_email: "$customermast_data.company_email",
                        primary_contact_no: "$customermast_data.primary_contact_no",
                        alternative_no: "$customermast_data.alternative_no",
                        website: "$customermast_data.website",
                        turn_over: "$customermast_data.turn_over",
                        establishment_year: "$customermast_data.establishment_year",
                        employees_Count: "$customermast_data.employees_Count",
                        how_many_offices: "$customermast_data.how_many_offices",
                        company_gst_no: "$customermast_data.company_gst_no",
                        company_pan_no: "$customermast_data.company_pan_no",
                        connected_office: "$customermast_data.connected_office",
                        connect_billing_street: "$customermast_data.connect_billing_street",
                        connect_billing_city: "$customermast_data.connect_billing_city",
                        connect_billing_state: "$customermast_data.connect_billing_state",
                        connect_billing_country: "$customermast_data.connect_billing_country",
                        head_office: "$customermast_data.head_office",
                        head_billing_street: "$customermast_data.head_billing_street",
                        head_billing_city: "$customermast_data.head_billing_city",
                        head_billing_state: "$customermast_data.head_billing_state",
                        head_billing_country: "$customermast_data.head_billing_country",
                        description: "$customermast_data.description",
                        created_by: "$customermast_data.created_by",
                        created_by_name: "$user.user_name",
                        last_updated_by: "$customermast_data.last_updated_by",
                        pan_upload: {
                            $concat: [imageUrl, "$customermast_data.pan_upload"],
                        },
                        gst_upload: {
                            $concat: [imageUrl, "$customermast_data.gst_upload"],
                        },
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
        if (salesBookingPaymentListData) {
            return res.status(200).json({
                status: 200,
                message: "Sales booking payment details list successfully!",
                data: salesBookingPaymentListData,
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
 * Api is to used for the delete_sales_booking_payment_list data get_by_ID in the DB collection.
*/
exports.deleteSalesBookingPaymentDetails = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const salesBookingPaymentDetailsDelete = await salesBookingPaymentModel.findOne({ _id: id });
        if (!salesBookingPaymentDetailsDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await salesBookingPaymentModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Sales booking payment details data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
}


/**
 * Api is to used for the sales_booking_payment_list pending data from the DB collection.
*/
exports.salesBookingPaymentPendingDetailsList = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const salesBookingPaymentListData = await salesBookingPaymentModel.aggregate([{
            $match: {
                payment_approval_status: "pending"
            }
        }, {
            $lookup: {
                from: "usermodels",
                localField: "created_by",
                foreignField: "user_id",
                as: "user",
            }
        }, {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "customermasts",
                localField: "customer_id",
                foreignField: "customer_id",
                as: "customermast_data",
            }
        }, {
            $unwind: {
                path: "$customermast_data",
                preserveNullAndEmptyArrays: true,
            }
        }, {
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
                payment_date: 1,
                sale_booking_id: 1,
                customer_id: 1,
                customer_name: "$customermast_data.customer_name",
                payment_amount: 1,
                payment_mode: 1,
                payment_detail_id: 1,
                payment_ref_no: 1,
                payment_approval_status: 1,
                sale_booking_data: {
                    sales_booking_id: "$salesbooking.sale_booking_id",
                    sale_booking_date: "$salesbooking.sale_booking_date",
                    campaign_amount: "$salesbooking.campaign_amount",
                    base_amount: "$salesbooking.base_amount",
                    created_by: "$salesbooking.created_by",
                    createdAt: "$salesbooking.creation_date",
                },
                action_reason: 1,
                remarks: 1,
                createdAt: 1,
                updatedAt: 1,
                created_by: 1,
                created_by_name: "$user.user_name",
                payment_screenshot: {
                    $concat: [imageUrl, "$payment_screenshot"],
                }
            }
        }]);
        if (salesBookingPaymentListData) {
            return res.status(200).json({
                status: 200,
                message: "Sales booking pending payment details list successfully!",
                data: salesBookingPaymentListData,
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
}

/**
 * Api is to used for the sales_booking_payment_list Rejected data from the DB collection.
*/
exports.salesBookingPaymentRejectedDetailsList = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const salesBookingPaymentListData = await salesBookingPaymentModel.aggregate([{
            $match: {
                payment_approval_status: 'reject'
            }
        }, {
            $lookup: {
                from: "usermodels",
                localField: "created_by",
                foreignField: "user_id",
                as: "user",
            }
        }, {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "customermasts",
                localField: "customer_id",
                foreignField: "customer_id",
                as: "customermast_data",
            }
        }, {
            $unwind: {
                path: "$customermast_data",
                preserveNullAndEmptyArrays: true,
            }
        }, {
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
            $lookup: {
                from: "salespaymentmodes",
                localField: "payment_mode",
                foreignField: "_id",
                as: "salespaymentmodesData",
            },
        }, {
            $unwind: {
                path: "$salespaymentmodesData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "paymentdeatils",
                localField: "payment_detail_id",
                foreignField: "_id",
                as: "paymentdeatil",
            }
        }, {
            $unwind: {
                path: "$paymentdeatil",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $project: {
                payment_date: 1,
                sale_booking_id: 1,
                customer_id: 1,
                customer_name: "$customermast_data.customer_name",
                payment_amount: 1,
                payment_mode: 1,
                payment_mode_name: "$salespaymentmodesData.payment_mode_name",
                payment_detail_id: 1,
                payment_ref_no: 1,
                payment_screenshot: 1,
                payment_approval_status: 1,
                sale_booking_data: {
                    sales_booking_id: "$salesbooking.sale_booking_id",
                    sale_booking_date: "$salesbooking.sale_booking_date",
                    campaign_amount: "$salesbooking.campaign_amount",
                    base_amount: "$salesbooking.base_amount",
                    created_by: "$salesbooking.created_by",
                    createdAt: "$salesbooking.creation_date",
                },
                Payment_Deatils: {
                    _id: "$paymentdeatil._id",
                    title: "$paymentdeatil.title",
                    details: "$paymentdeatil.details",
                    gst_bank: "$paymentdeatil.gst_bank",
                    payment_type: "$paymentdeatil.payment_type",
                    managed_by: "$paymentdeatil.managed_by",
                    created_by: "$paymentdeatil.created_by",
                    created_by_name: "$user.user_name",
                },
                action_reason: 1,
                remarks: 1,
                createdAt: 1,
                updatedAt: 1,
                created_by: 1,
                created_by_name: "$user.user_name",
                payment_screenshot: {
                    $concat: [imageUrl, "$payment_screenshot"],
                }
            }
        }, {
            $group: {
                _id: "$_id",
                data: { $first: "$$ROOT" }
            }
        }, {
            $replaceRoot: { newRoot: "$data" }

        }]);
        if (salesBookingPaymentListData) {
            return res.status(200).json({
                status: 200,
                message: "Sales booking Rejected payment details list fetch successfully!",
                data: salesBookingPaymentListData
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
}