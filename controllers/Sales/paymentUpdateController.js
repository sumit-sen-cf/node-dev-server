const mongoose = require("mongoose");
const multer = require("multer");
const vari = require("../../variables.js");
const { message } = require("../../common/message.js")
const { storage } = require('../../common/uploadFile.js');
const paymentUpdateModel = require("../../models/Sales/paymentUpdateModel.js");
const salesBookingModel = require("../../models/Sales/salesBookingModel.js");
const { uploadImage, deleteImage } = require("../../common/uploadImage.js");
const response = require("../../common/response.js");
const constant = require("../../common/constant.js");

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "payment_screenshot", maxCount: 1 }
]);

/**
 * Api is to used for the payment_update data add in the DB collection.
 */
exports.createPaymentUpdate = [
    upload, async (req, res) => {
        try {
            const { payment_date, sale_booking_id, account_id, payment_amount, payment_mode, payment_detail_id,
                payment_ref_no, payment_approval_status, action_reason, remarks, created_by } = req.body;

            //object Prepare for DB collection
            const addSalesBookingPayment = new paymentUpdateModel({
                payment_date: payment_date,
                sale_booking_id: sale_booking_id,
                account_id: account_id,
                payment_amount: payment_amount,
                payment_mode: payment_mode,
                payment_detail_id: payment_detail_id,
                payment_ref_no: payment_ref_no,
                payment_approval_status: payment_approval_status,
                action_reason: action_reason,
                remarks: remarks,
                created_by: created_by,
            });

            // Define the image fields 
            const imageFields = {
                payment_screenshot: 'PaymentScreenshots',
            };
            for (const [field] of Object.entries(imageFields)) {            //itreates 
                if (req.files[field] && req.files[field][0]) {
                    addSalesBookingPayment[field] = await uploadImage(req.files[field][0], "SalesPaymentUpdateFiles");
                }
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
            // Return a success response with the updated record details
            return response.returnTrue(200, req, res, "Sales record service created successfully", addSalesBookingPayment);
        } catch (err) {
            // Return an error response in case of any exceptions
            return response.returnFalse(500, req, res, err.message, {});
        }
    }];


/**
 * Api is to used for the sales_booking_payment data get_by_ID in the DB collection.
 */
exports.getPaymentUpdateDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const paymentUpdateDetail = await paymentUpdateModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!paymentUpdateDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Payment update details retrive successfully!",
            paymentUpdateDetail
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the update_sales_booking_payment data get_by_ID in the DB collection.
 */
exports.updatePaymentDeatil = [
    upload, async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = {
                payment_date: req.body.payment_date,
                sale_booking_id: req.body.sale_booking_id,
                account_id: req.body.account_id,
                payment_amount: req.body.payment_amount,
                payment_mode: req.body.payment_mode,
                payment_detail_id: req.body.payment_detail_id,
                payment_ref_no: req.body.payment_ref_no,
                payment_approval_status: req.body.payment_approval_status,
                action_reason: req.body.action_reason,
                remarks: req.body.remarks,
                updated_by: req.body.updated_by,
            };

            // Fetch the old document and update it
            const editPaymentUpdatedDetail = await paymentUpdateModel.findByIdAndUpdate({ _id: id }, updateData, { new: true });

            if (!editPaymentUpdatedDetail) {
                return response.returnFalse(404, req, res, `Payment updated data not found`, {});
            }

            // Define the image fields 
            const imageFields = {
                payment_screenshot: 'PaymentScreenshots',
            };

            // Remove old images not present in new data and upload new images
            for (const [fieldName] of Object.entries(imageFields)) {
                if (req.files && req.files[fieldName] && req.files[fieldName][0]) {

                    // Delete old image if present
                    if (editPaymentUpdatedDetail[fieldName]) {
                        await deleteImage(`SalesPaymentUpdateFiles/${editPaymentUpdatedDetail[fieldName]}`);
                    }
                    // Upload new image
                    editPaymentUpdatedDetail[fieldName] = await uploadImage(req.files[fieldName][0], "SalesPaymentUpdateFiles");
                }
            }
            // Save the updated document with the new image URLs
            await editPaymentUpdatedDetail.save();

            return response.returnTrue(200, req, res, "Payment updated data updated successfully!", editPaymentUpdatedDetail);
        } catch (error) {
            return response.returnFalse(500, req, res, `${error.message}`, {});
        }
    }]


/**
 * Api is to used for the sales_booking_payment_list data get_by_ID in the DB collection.
*/
exports.paymentUpdateList = async (req, res) => {
    try {
        const page = (req.query?.page && parseInt(req.query.page)) || null;
        const limit = (req.query?.limit && parseInt(req.query.limit)) || null;
        const skip = (page && limit) ? (page - 1) * limit : 0;

        let addFieldsObj = {
            $addFields: {
                payment_screenshot_url: {
                    $cond: {
                        if: { $ne: ["$payment_screenshot", ""] },
                        then: {
                            $concat: [
                                constant.GCP_SALES_PAYMENT_UPDATE_FOLDER_URL,
                                "/",
                                "$payment_screenshot",
                            ],
                        },
                        else: "$payment_screenshot",
                    },
                },
            },
        };
        const pipeline = [addFieldsObj];

        if (page && limit) {
            pipeline.push(
                { $skip: skip },
                { $limit: limit }
            );
        }

        paymentUpdateList = await paymentUpdateModel.aggregate(pipeline);
        const paymentUpdateCount = await paymentUpdateModel.countDocuments(addFieldsObj);

        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Sales booking list retreive successfully!",
            paymentUpdateList,
            {
                start_record: skip + 1,
                end_record: skip + paymentUpdateList.length,
                total_records: paymentUpdateCount,
                current_page: page || 1,
                total_page: (page && limit) ? Math.ceil(paymentUpdateCount / limit) : 1,
            }
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

/**
 * Api is to used for the delete_sales_booking_payment_list data get_by_ID in the DB collection.
*/
exports.deleteBookingPaymentDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const paymentUpdatedDataDeleted = await paymentUpdateModel.findOneAndUpdate({
            _id: id, status: { $ne: constant.DELETED }
        },
            {
                $set: {
                    status: constant.DELETED,
                },
            },
            { new: true }
        );
        if (!paymentUpdatedDataDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            `Record service deleted successfully id ${id}`,
            paymentUpdatedDataDeleted
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

/**
 * Api is to used for the sales_booking_payment_list Rejected data from the DB collection.
 */
exports.salesBookingPaymentStatusDetailsList = async (req, res) => {
    try {
        let matchCondition = {
            status: {
                $ne: constant.DELETED
            }
        }
        if (req.query?.status) {
            matchCondition["payment_approval_status"] = req.query.status
        }
        const salesBookingPaymentListData = await paymentUpdateModel.aggregate([{
            $match: matchCondition
        }, {
            $project: {
                payment_date: 1,
                sale_booking_id: 1,
                account_id: 1,
                payment_amount: 1,
                payment_mode: 1,
                payment_detail_id: 1,
                payment_ref_no: 1,
                payment_approval_status: 1,
                action_reason: 1,
                remarks: 1,
                created_by: 1,
                payment_screenshot: {
                    $concat: [
                        constant.GCP_SALES_PAYMENT_UPDATE_FOLDER_URL,
                        "/",
                        "$payment_screenshot",
                    ],
                },
            }
        }]);
        if (salesBookingPaymentListData.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of exectuion and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Sales booking payment details list fetch successfully!",
            salesBookingPaymentListData,
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

exports.updatePaymentAndSaleData = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            payment_amount: req.body.payment_amount,
            payment_approval_status: req.body.payment_approval_status,
            action_reason: req.body.action_reason,
        };
        // Fetch the old document and update it
        const editPaymentUpdatedDetail = await paymentUpdateModel.findByIdAndUpdate({ _id: id }, updateData, { new: true });
        if (!editPaymentUpdatedDetail) {
            return response.returnFalse(404, req, res, `Payment updated data not found`, {});
        }
        const data = await editPaymentUpdatedDetail.save();
        const saleBookingId = data.sale_booking_id;
        const findSaleData = await salesBookingModel.findOne({ sale_booking_id: saleBookingId });
        const totalRequestedAmount = findSaleData.requested_amount + parseInt(req.body.requested_amount);
        const updatedSaleBooking = await salesBookingModel.findOneAndUpdate(
            { sale_booking_id: saleBookingId },
            { requested_amount: totalRequestedAmount },
            { new: true }
        );
        if (!updatedSaleBooking) {
            return response.returnFalse(404, req, res, `Sale booking not found`, {});
        }
        return response.returnTrue(200, req, res, "Payment and sale booking data updated successfully!", {
            paymentUpdate: editPaymentUpdatedDetail,
            saleBooking: updatedSaleBooking
        });
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}