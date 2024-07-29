const paymentDetailsModel = require("../../models/Sales/paymentDetailsModel");
const response = require("../../common/response");
const constant = require("../../common/constant");

/**
 * Api is to used for the payment_details data add in the DB collection.
 */
exports.createPaymentDetails = async (req, res) => {
    try {
        const { title, details, gst_bank, created_by, payment_mode_id } = req.body;
        const addPaymentDetails = await paymentDetailsModel.create({
            title: title,
            details: details,
            gst_bank: gst_bank,
            created_by: created_by,
            payment_mode_id: payment_mode_id
        });
        // Return a success response with the updated record details
        return response.returnTrue(200, req, res, "Payment Details Created Successfully", addPaymentDetails);
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the payment_details data get_ByID in the DB collection.
 */
exports.getPaymentDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const paymentDetails = await paymentDetailsModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!paymentDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Payment details retrive successfully!",
            paymentDetails
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the payment_details data update in the DB collection.
 */
exports.updatePaymentDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, details, gst_bank, updated_by, payment_mode_id, is_hide } = req.body;

        const paymentDetailsUpdatedData = await paymentDetailsModel.findByIdAndUpdate({
            _id: id
        }, {
            $set: {
                title,
                details,
                gst_bank,
                updated_by,
                payment_mode_id,
                is_hide
            },
        }, {
            new: true
        });
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Payment details update successfully!",
            paymentDetailsUpdatedData
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};


/**
 * Api is to used for the payment_details data get_list in the DB collection.
 */
exports.getPaymentDetailList = async (req, res) => {
    try {
        // Extract page and limit from query parameters, default to null if not provided
        const page = req.query?.page ? parseInt(req.query.page) : 1;
        const limit = req.query?.limit ? parseInt(req.query.limit) : Number.MAX_SAFE_INTEGER;;
        const sort = { createdAt: -1 };

        // Calculate the number of records to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;

        //match condition obj prepare
        let matchCondition = {
            status: {
                $ne: constant.DELETED
            },
            is_hide: false
        }

        if (req.query?.is_hide && (req.query.is_hide == "true" || true)) {
            matchCondition["is_hide"] = true;
        }

        // Retrieve the list of records with pagination applied
        const paymentDetailsList = await paymentDetailsModel.aggregate([{
            $match: matchCondition
        }, {
            $lookup: {
                from: "salespaymentmodemodels",
                localField: "payment_mode_id",
                foreignField: "_id",
                as: "salesPaymentModeData"
            }
        }, {
            $unwind: {
                path: "$salesPaymentModeData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $project: {
                title: 1,
                details: 1,
                gst_bank: 1,
                is_hide: 1,
                payment_mode_id: 1,
                payment_mode_name: "$salesPaymentModeData.payment_mode_name",
                created_by: 1,
                updated_by: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        }, {
            $sort: sort
        }, {
            $skip: skip
        }, {
            $limit: limit
        }]);

        // Get the total count of records in the collection
        const paymentDetailsCount = await paymentDetailsModel.countDocuments(matchCondition);

        // If no records are found, return a response indicating no records found
        if (paymentDetailsList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of records and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Payment details list retrieved successfully!",
            paymentDetailsList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + paymentDetailsList.length : paymentDetailsList.length,
                total_records: paymentDetailsCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(paymentDetailsCount / limit) : 1,
            }
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

/**
 * Api is to used for the payment_details data delete in the DB collection.
 */
exports.deletePaymentDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const paymentDetailDeleted = await paymentDetailsModel.findOneAndUpdate({
            _id: id,
            status: {
                $ne: constant.DELETED
            }
        }, {
            $set: {
                // Update the status to DELETED
                status: constant.DELETED,
            }
        }, {
            new: true
        });
        if (!paymentDetailDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            `Payment details deleted succesfully! for id ${id}`,
            paymentDetailDeleted
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};