const multer = require("multer");
const response = require("../../common/response.js");
const constant = require("../../common/constant.js");
const { uploadImage, deleteImage } = require("../../common/uploadImage.js");
const { getIncentiveAmountRecordServiceWise } = require("../../helper/functions.js");
const invoiceRequestModel = require("../../models/Sales/invoiceRequestModel.js");

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "purchase_order_upload", maxCount: 10 },
    { name: "invoice_file", maxCount: 10 },
]);

exports.createInvoiceRequest = [
    upload, async (req, res) => {
        try {
            const addInvoiceRequest = new invoiceRequestModel({
                sale_booking_id: req.body.sale_booking_id,
                invoice_type_id: req.body.invoice_type_id,
                invoice_particular_id: req.body.invoice_particular_id,
                purchase_order_number: req.body.purchase_order_number,
                invoice_creation_status: "pending",
                invoice_action_reason: req.body.invoice_action_reason,
                created_by: req.body.created_by,
            });
            // Define the image fields 
            const imageFields = {
                purchase_order_upload: 'purchaseUploadFile',
            };
            for (const [field] of Object.entries(imageFields)) {            //itreates 
                if (req.files[field] && req.files[field][0]) {
                    addInvoiceRequest[field] = await uploadImage(req.files[field][0], "InvoiceRequestFiles");
                }
            }
            await addInvoiceRequest.save();
            // Return a success response with the updated record details
            return response.returnTrue(200, req, res, "Invoice Request created successfully", addInvoiceRequest);

        } catch (err) {
            // Return an error response in case of any exceptions
            return response.returnFalse(500, req, res, err.message, {});
        }
    }];

exports.getInvoiceRequestData = async (req, res) => {
    try {
        const { id } = req.params;
        const invoiceRequestDetail = await invoiceRequestModel.find({
            sale_booking_id: id,
            status: { $ne: constant.DELETED },
        });
        if (!invoiceRequestDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Invoice Request details retrive successfully!",
            invoiceRequestDetail
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the reocrd_service_master data delete in the DB collection.
 */
exports.deleteInvoiceRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const invoiceRequestDeleted = await invoiceRequestModel.findOneAndUpdate({
            _id: id, status: { $ne: constant.DELETED }
        }, {
            $set: {
                status: constant.DELETED,
            },
        },
            { new: true }
        );
        if (!invoiceRequestDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            `Invoice Request deleted successfully id ${id}`,
            invoiceRequestDeleted
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}


exports.updateInvoiceUploadedByFinance = [
    upload, async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = {
                invoice_type_id: req.body.invoice_type_id,
                invoice_number: req.body.invoice_number,
                party_name: req.body.party_name,
                invoice_uploaded_date: req.body.invoice_uploaded_date,
                invoice_creation_status: "uploaded",
                updated_by: req.body.updated_by,
            };

            // Fetch the old document and update it
            const updatedInvoiceRequestData = await invoiceRequestModel.findOneAndUpdate({
                _id: id
            },
                updateData, {
                new: true
            });

            if (!updatedInvoiceRequestData) {
                return response.returnFalse(404, req, res, `Invoice Request data not found`, {});
            }

            // Define the image fields 
            const imageFields = {
                invoice_file: 'purchaseUploadFile',
            };

            // Remove old images not present in new data and upload new images
            for (const [fieldName] of Object.entries(imageFields)) {
                if (req.files && req.files[fieldName] && req.files[fieldName][0]) {

                    // Delete old image if present
                    if (updatedInvoiceRequestData[fieldName]) {
                        await deleteImage(`InvoiceRequestFiles/${updatedInvoiceRequestData[fieldName]}`);
                    }
                    // Upload new image
                    updatedInvoiceRequestData[fieldName] = await uploadImage(req.files[fieldName][0], "InvoiceRequestFiles");
                }
            }
            // Save the updated document with the new image URLs
            await updatedInvoiceRequestData.save();

            // Return a success response with the updated record details
            return response.returnTrue(
                200,
                req,
                res,
                "Invoice Request data updated by finance successfully!",
                updatedInvoiceRequestData
            );
        } catch (error) {
            // Return an error response in case of any exceptions
            return response.returnFalse(500, req, res, `${error.message}`, {});
        }
    }];

exports.invoiceRejectedStatusUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        // Fetch the old document and update it
        const updatedInvoiceRequestData = await invoiceRequestModel.findOneAndUpdate({
            _id: id
        }, {
            $set: {
                invoice_creation_status: "rejected",
                invoice_action_reason: req.body.invoice_action_reason
            }
        }, {
            new: true
        });
        if (!updatedInvoiceRequestData) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(200, req, res,
            "Invoice Request Rejected",
            updatedInvoiceRequestData
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};


exports.getInvoiceRequestDataList = async (req, res) => {
    try {
        let matchCondition = {};
        //check if the status is available.
        if (req.query?.status) {
            matchCondition = {
                invoice_creation_status: req.query.status
            }
        }
        //check if the invoice type id is available.
        if (req.query?.invoice_type_id) {
            matchCondition["invoice_type_id"] = req.query.invoice_type_id;
        }

        //check if the invoice type id is available.
        if (req.query?.sale_booking_id) {
            matchCondition["sale_booking_id"] = Number(req.query.sale_booking_id);
        }

        if (req.query?.userId) {
            matchQuery["created_by"] = Number(req.query.userId);
        }

        const invoiceRequestData = await invoiceRequestModel.aggregate([{
            $match: matchCondition
        }, {
            $lookup: {
                from: "salesbookingmodels",
                localField: "sale_booking_id",
                foreignField: "sale_booking_id",
                as: "saleData",
            }
        }, {
            $unwind: {
                path: "$saleData",
                preserveNullAndEmptyArrays: true,
            }
        },
        {
            $lookup: {
                from: "accountmastermodels",
                localField: "saleData.account_id",
                foreignField: "account_id",
                as: "accountData",
            }
        }, {
            $unwind: {
                path: "$accountData",
                preserveNullAndEmptyArrays: true,
            }
        },
        {
            $lookup: {
                from: "salesinvoiceparticularmodels",
                localField: "invoice_particular_id",
                foreignField: "_id",
                as: "invoiceData",
            }
        }, {
            $unwind: {
                path: "$invoiceData",
                preserveNullAndEmptyArrays: true,
            }
        },
        {
            $project: {
                sale_booking_id: 1,
                invoice_type_id: 1,
                invoice_particular_id: 1,
                purchase_order_number: 1,
                invoice_file_url: {
                    $cond: {
                        if: { $ne: ["$invoice_file", ""] },
                        then: {
                            $concat: [
                                constant.GCP_INVOICE_REQUEST_URL,
                                "/",
                                "$invoice_file",
                            ],
                        },
                        else: "$invoice_file",
                    },
                },
                invoice_number: 1,
                party_name: 1,
                invoice_uploaded_date: 1,
                invoice_creation_status: 1,
                invoice_action_reason: 1,
                created_by: 1,
                createdAt: 1,
                updatedAt: 1,
                purchase_order_upload_url: {
                    $cond: {
                        if: { $ne: ["$purchase_order_upload", ""] },
                        then: {
                            $concat: [
                                constant.GCP_INVOICE_REQUEST_URL,
                                "/",
                                "$purchase_order_upload",
                            ],
                        },
                        else: "$purchase_order_upload",
                    },
                },
                saleData: {
                    sale_booking_id: "$saleData.sale_booking_id",
                    campaign_name: "$saleData.campaign_name",
                    sale_booking_date: "$saleData.sale_booking_date",
                    invoice_requested_date: "$saleData.invoice_requested_date",
                    account_name: "$accountData.account_name",
                    invoice_particular_name: "$invoiceData.invoice_particular_name",
                    campaign_amount: "$saleData.campaign_amount",
                    base_amount: "$saleData.base_amount",
                    gst_amount: "$saleData.gst_amount",
                }
            }
        }]);
        if (!invoiceRequestData) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(200, req, res,
            "Invoice Request Data Fetched successfully",
            invoiceRequestData
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};