const mongoose = require("mongoose");
const multer = require("multer");
const vari = require("../../variables.js");
const { message } = require("../../common/message.js")
const { storage } = require('../../common/uploadFile.js');
const paymentUpdateModel = require("../../models/Sales/paymentUpdateModel.js");
const salesBookingModel = require("../../models/Sales/salesBookingModel.js");

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
                remarks, created_by } = req.body;

            //object Prepare for DB collection
            const addSalesBookingPayment = new paymentUpdateModel({
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

            //get sale booking data
            let saleBookingData = await salesBookingModel.findOne({
                sale_booking_id: sale_booking_id
            });

            //requested amount add in previous pending data in sale booking collection.
            let pendingAmount = saleBookingData.pending_amount + parseInt(payment_amount);

            //pending amount add in sale booking collection.
            await salesBookingModel.updateOne({
                sale_booking_id: sale_booking_id
            }, {
                pending_amount: pendingAmount
            });

            //success response send
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
        const salesBookingPaymentData = await paymentUpdateModel.aggregate([
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
                    localField: "updated_by",
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
                    created_by: 1,
                    updated_by: 1,
                    created_by_name: "$user.user_name",
                    createdAt: 1,
                    updatedAt: 1,
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
                payment_ref_no, payment_approval_status, action_reason,
                remarks, created_by, last_updated_by } = req.body;
            const salesBookingPaymentData = await paymentUpdateModel.findOne({ _id: id });
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
            const salesBookingPaymentUpdatedData = await paymentUpdateModel.findOneAndUpdate({ _id: id }, {
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
                    remarks,
                    created_by,
                    updated_by
                },
            },
                { new: true }
            );

            //get sale booking data
            let saleBookingData = await salesBookingModel.findOne({
                sale_booking_id: sale_booking_id
            });

            //requested amount add in previous pending data in sale booking collection.
            let pendingAmount = saleBookingData.pending_amount + parseInt(payment_amount);

            //pending amount add in sale booking collection.
            await salesBookingModel.updateOne({
                sale_booking_id: sale_booking_id
            }, {
                pending_amount: pendingAmount
            });

            //success response send
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
        const salesBookingPaymentListData = await paymentUpdateModel.aggregate([{
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
                payment_amount: 1,
                payment_mode: 1,
                payment_mode_name: "$salespaymentmodesData.payment_mode_name",
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
                createdAt: 1,
                updatedAt: 1,
                payment_screenshot: {
                    $concat: [imageUrl, "$payment_screenshot"],
                },
                customer_id: 1,
                customer_name: "$customermast_data.customer_name",
                payment_detail_id: 1,
                Payment_Deatils: {
                    _id: "$paymentdeatil._id",
                    title: "$paymentdeatil.title",
                    details: "$paymentdeatil.details",
                    payment_type: "$paymentdeatil.payment_type",
                },
                sales_data: {
                    sales_booking_id: "$salesbooking.sale_booking_id",
                    sale_booking_date: "$salesbooking.sale_booking_date",
                    campaign_amount: "$salesbooking.campaign_amount",
                    paid_amount: "$salesbooking.paid_amount",
                    pending_amount: "$salesbooking.pending_amount"
                }
            }
        }, {
            $group: {
                _id: "$_id",
                data: { $first: "$$ROOT" }
            }
        }, {
            $replaceRoot: { newRoot: "$data" }
        }])
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
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
}

/**
 * Api is to used for the delete_sales_booking_payment_list data get_by_ID in the DB collection.
*/
exports.deleteSalesBookingPaymentDetails = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const salesBookingPaymentDetailsDelete = await paymentUpdateModel.findOne({ _id: id });
        if (!salesBookingPaymentDetailsDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await paymentUpdateModel.deleteOne({ _id: id });
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
        const salesBookingPaymentListData = await paymentUpdateModel.aggregate([{
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
        const salesBookingPaymentListData = await paymentUpdateModel.aggregate([{
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