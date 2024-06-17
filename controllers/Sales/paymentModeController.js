const mongoose = require("mongoose");
const salesPaymentModeModel = require("../../models/Sales/paymentModeModels");
const response = require("../../common/response");
const paymentModeModels = require("../../models/Sales/paymentModeModels");
const constant = require("../../common/constant");

/**
 * Api is to used for the sales_payment_mode data add in the DB collection.
 */
exports.createPaymentmode = async (req, res) => {
    try {
        const { payment_mode_name, created_by } = req.body;
        const addPayementMode = await salesPaymentModeModel.create({
            payment_mode_name: payment_mode_name,
            created_by: created_by,
        });
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Payment mode Created Successfully",
            addPayementMode
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the sales_payment_mode data get_ByID in the DB collection.
 */
exports.getPaymentModeDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const paymentModeDetails = await salesPaymentModeModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED }
        });
        if (!paymentModeDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Payment mode details retrive successfully!",
            paymentModeDetails
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the sales_payment_mode data update in the DB collection.
 */
exports.updatePaymentMode = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;
        const { payment_mode_name, updated_by } = req.body;

        const paymentModeUpdated = await paymentModeModels.findByIdAndUpdate({ _id: id }, {
            $set: {
                payment_mode_name,
                updated_by
            },
        }, { new: true }
        );
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Payment mode update successfully!",
            paymentModeUpdated
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the sales_payment_mode data get_list in the DB collection.
 */
exports.getPaymentModeList = async (req, res) => {
    try {
        // Extract page and limit from query parameters, default to null if not provided
        const page = req.query?.page ? parseInt(req.query.page) : null;
        const limit = req.query?.limit ? parseInt(req.query.limit) : null;
        const sort = { createdAt: -1 };

        // Calculate the number of records to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;

        // Retrieve the list of records with pagination applied
        const paymentModeList = await salesPaymentModeModel.find().skip(skip).limit(limit).sort(sort);

        // Get the total count of records in the collection
        const paymentModeCount = await salesPaymentModeModel.countDocuments();

        // If no records are found, return a response indicating no records found
        if (paymentModeList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of records and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Payment mode list retrieved successfully!",
            paymentModeList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + paymentModeList.length : paymentModeList.length,
                total_records: paymentModeCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(paymentModeCount / limit) : 1,
            }
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the sales_payment_mode data delete in the DB collection.
 */
exports.deletePaymentMode = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;

        // Attempt to find and update the record with the given id and status not equal to DELETED
        const paymentModeDeleted = await salesPaymentModeModel.findOneAndUpdate(
            {
                _id: id,
                status: { $ne: constant.DELETED }
            },
            {
                $set: {
                    // Update the status to DELETED
                    status: constant.DELETED,
                },
            },
            { new: true }
        );
        // If no record is found or updated, return a response indicating no record found
        if (!paymentModeDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            `Payment mode deleted succesfully! for id ${id}`,
            paymentModeDeleted
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};