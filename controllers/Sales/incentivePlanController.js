const constant = require("../../common/constant");
const response = require("../../common/response");
const incentivePlanModel = require("../../models/Sales/incentivePlanModel");
const mongoose = require("mongoose");

/**
 * Api is to used for the incentive_plan data add in the DB collection.
 */
exports.createIncentivePlan = async (req, res) => {
    try {
        const { sales_service_id, incentive_type, value, remarks, created_by } = req.body;
        const addIncentivePlanDetails = await incentivePlanModel.create({
            sales_service_id,
            incentive_type,
            value,
            remarks,
            created_by,
        });
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Incentive plan Created Successfully!",
            addIncentivePlanDetails
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return res.status(500).json({
            error: error.message,
            message: 'Internal Server Error,Please try again later!'
        });
    }
};

/**
 * Api is to used for the incentive_plan data get_ByID in the DB collection.
 */
exports.getIncentivePlanDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const incentivePlanDetails = await incentivePlanModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED }
        });
        if (!incentivePlanDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }

        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Incentive plan details retreive Successfully!",
            incentivePlanDetails
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return res.status(500).json({
            error: error.message,
            message: 'Internal Server Error,Please try again later!'
        });
    }
};
/**
 * Api is to used for the incentive_plan data update in the DB collection.
 */
exports.updateIncentivePlan = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;
        const { sales_service_id, incentive_type, value, remarks, updated_by } = req.body;

        const incentivePlanUpdated = await incentivePlanModel.findByIdAndUpdate({
            _id: id
        }, {
            $set: {
                sales_service_id,
                incentive_type,
                value,
                remarks,
                updated_by
            },
        }, {
            new: true
        });
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Incentive plan update successfully!",
            incentivePlanUpdated
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return res.status(500).json({
            error: error.message,
            message: 'Internal Server Error,Please try again later!'
        });
    };
};


/**
 * Api is to used for the incentive_plan data get_list in the DB collection.
 */
exports.getIncentivePlanList = async (req, res) => {
    try {
        // Extract page and limit from query parameters, default to null if not provided
        const page = req.query?.page ? parseInt(req.query.page) : null;
        const limit = req.query?.limit ? parseInt(req.query.limit) : null;

        // Calculate the number of records to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;

        // Retrieve the list of records with pagination applied
        const incentivePlanList = await incentivePlanModel.find().skip(skip).limit(limit);

        // Get the total count of records in the collection
        const incentivePlanCount = await incentivePlanModel.countDocuments();

        // If no records are found, return a response indicating no records found
        if (incentivePlanList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of records and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Incentive plan list retrieved successfully!",
            incentivePlanList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + incentivePlanList.length : incentivePlanList.length,
                total_records: incentivePlanCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(incentivePlanCount / limit) : 1,
            }
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return res.status(500).json({
            error: error.message,
            message: 'Internal Server Error,Please try again later!'
        });
    };
};

/**
 * Api is to used for the incentive_plan data delete in the DB collection.
 */
exports.deleteIncentivePlan = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;

        // Attempt to find and update the record with the given id and status not equal to DELETED
        const incentivePlanDeleted = await incentivePlanModel.findOneAndUpdate(
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
        if (!incentivePlanDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            `Incentive plan deleted succesfully! for id ${id}`,
            incentivePlanDeleted
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return res.status(500).json({
            error: error.message,
            message: 'Internal Server Error,Please try again later!'
        });
    };
};