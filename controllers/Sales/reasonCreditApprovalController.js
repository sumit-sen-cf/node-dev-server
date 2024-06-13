const response = require("../../common/response");
const constant = require("../../common/constant");
const saleReasonCreditApprovalModel = require("../../models/Sales/reasonCreditApprovalModel")

/**
 * Api is to used for the reason_credit_approval data add in the DB collection.
 */
exports.createReasonCreaditApproval = async (req, res) => {
    try {
        const { reason, day_count, reason_order, reason_type, created_by } = req.body;
        const addReasonCreditApproval = await saleReasonCreditApprovalModel.create({
            reason: reason,
            day_count: day_count,
            reason_order: reason_order,
            reason_type: reason_type,
            created_by: created_by
        });
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Reason credit approval created successfully",
            addReasonCreditApproval
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};
/**
 * Api is to used for the reason_credit_approval data get_by_ID in the DB collection.
 */
exports.getReasonCreditApprovalDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const reasonCreditApprovalDetails = await saleReasonCreditApprovalModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!reasonCreditApprovalDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Reason credit approval details retreive successfully!",
            reasonCreditApprovalDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};
/**
 * Api is to used for the reason_credit_approval data update in the DB collection.
 */
exports.updateReasonCreditApproval = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;
        const { reason, day_count, reason_order, reason_type, updated_by } = req.body;
        const reasonCreditApprovalUpdated = await saleReasonCreditApprovalModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                reason,
                day_count,
                reason_order,
                reason_type,
                updated_by
            },
        }, { new: true }
        );
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Reason credit approval update successfully!",
            reasonCreditApprovalUpdated
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};
/**
 * Api is to used for the reason_credit_approval data get_list in the DB collection.
 */
exports.getReasonCreditApprovalList = async (req, res) => {
    try {
        // Extract page and limit from query parameters, default to null if not provided
        const page = req.query?.page ? parseInt(req.query.page) : null;
        const limit = req.query?.limit ? parseInt(req.query.limit) : null;
        // Calculate the number of records to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;
        // Retrieve the list of records with pagination applied
        const reasonCreditApprovalList = await saleReasonCreditApprovalModel.find().skip(skip).limit(limit);
        // Get the total count of records in the collection
        const reasonCreditApprovalCount = await saleReasonCreditApprovalModel.countDocuments();
        // If no records are found, return a response indicating no records found
        if (reasonCreditApprovalList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of records and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Reason credit approval list retrieved successfully!",
            reasonCreditApprovalList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + reasonCreditApprovalList.length : reasonCreditApprovalList.length,
                total_records: reasonCreditApprovalCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(reasonCreditApprovalCount / limit) : 1,
            }
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};
/**
 * Api is to used for the reason_credit_approval data delete in the DB collection.
 */
exports.deleteReasonCreditApproval = async (req, res) => {
    try {
        const { id } = req.params;
        const reasonCreditApprovalDeleted = await saleReasonCreditApprovalModel.findOneAndUpdate({
            _id: id, status: { $ne: constant.DELETED }
        },
            {
                $set: {
                    status: constant.DELETED,
                },
            },
            { new: true }
        );
        if (reasonCreditApprovalDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            `Reason credit approval deleted successfully id ${id}`,
            reasonCreditApprovalDeleted
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};