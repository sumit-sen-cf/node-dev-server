const { message } = require("../../common/message")
const mongoose = require("mongoose");
const autoIncentiveCalculationModel = require("../../models/Sales/autoIncentiveCalculationModel");
const response = require("../../common/response");
const constant = require("../../common/constant");

/**
 * Api is to used for the auto_incentive_calculation data add in the DB collection.
 */
exports.createAutoIncentiveCalculation = async (req, res) => {
    try {
        const { month_year, sales_executive_id, campaign_amount, paid_amount, incentive_amount, earned_incentive, unearned_incentive,
            created_by, } = req.body;
        const addAutoIncentiveCalculation = await autoIncentiveCalculationModel.create({
            month_year,
            sales_executive_id,
            campaign_amount,
            paid_amount,
            incentive_amount,
            earned_incentive,
            unearned_incentive,
            created_by,
        });
        return response.returnTrue(200, req, res,
            "Auto incentive data added successfully!",
            addAutoIncentiveCalculation
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

/**
 * Api is to used for the auto_incentive_calculation data get_ByID in the DB collection.
 */
exports.getAutoIncentiveCalculationDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const autoIncentiveCalculationDetails = await autoIncentiveCalculationModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED }
        });
        if (!autoIncentiveCalculationDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Auto incentive calculation details retrive successfully!",
            autoIncentiveCalculationDetails
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};
/**
 * Api is to used for the auto_incentive_calculation data update in the DB collection.
 */
exports.updateAutoIncentiveCalculation = async (req, res) => {
    try {
        const { id } = req.params;
        const { month_year, sales_executive_id, campaign_amount, paid_amount, incentive_amount, earned_incentive, unearned_incentive,
            updated_by } = req.body;

        // Extract the id from request parameters
        const updateAutoIncentiveCalculation = await autoIncentiveCalculationModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                month_year,
                sales_executive_id,
                campaign_amount,
                paid_amount,
                incentive_amount,
                earned_incentive,
                unearned_incentive,
                updated_by
            },
        }, { new: true }
        );
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Auto incentive calculation update successfully!",
            updateAutoIncentiveCalculation
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the auto_incentive_calculation data get_list in the DB collection.
 */
exports.getAutoIncentiveCalculationList = async (req, res) => {
    try {
        // Extract page and limit from query parameters, default to null if not provided
        const page = req.query?.page ? parseInt(req.query.page) : null;
        const limit = req.query?.limit ? parseInt(req.query.limit) : null;
        const sort = { createdAt: -1 };

        // Calculate the number of records to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;

        // Retrieve the list of records with pagination applied
        const autoIncentiveCalculationList = await autoIncentiveCalculationModel.find({
            status: { $ne: constant.DELETED }
        }).skip(skip).limit(limit).sort(sort);

        // Get the total count of records in the collection
        const autoIncentiveCalculationCount = await autoIncentiveCalculationModel.countDocuments();

        // If no records are found, return a response indicating no records found
        if (autoIncentiveCalculationList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of records and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Auto incentive calculation list retrieved successfully!",
            autoIncentiveCalculationList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + autoIncentiveCalculationList.length : autoIncentiveCalculationList.length,
                total_records: autoIncentiveCalculationCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(autoIncentiveCalculationCount / limit) : 1,
            }
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    };
};
/**
 * Api is to used for the auto_incentive_calculation data delete in the DB collection.
 */
exports.deleteAutoIncentiveCalculation = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;

        // Attempt to find and update the record with the given id and status not equal to DELETED
        const autoIncentiveCalculationDeleted = await autoIncentiveCalculationModel.findOneAndUpdate(
            {
                _id: id,
                status: { $ne: constant.DELETED }
            },{
                $set: {
                    // Update the status to DELETED
                    status: constant.DELETED,
                },
            },
            { new: true }
        );
        // If no record is found or updated, return a response indicating no record found
        if (!autoIncentiveCalculationDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            `Auto incentive calculation deleted succesfully! for id ${id}`,
            autoIncentiveCalculationDeleted
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    };

};

exports.autoIncentiveCalculationData = async (req, res) => {
    try {
        const { id } = req.params;
        const autoIncentiveCalculationDetails = await autoIncentiveCalculationModel.find({
            sales_executive_id: id,
            status: { $ne: constant.DELETED }
        });
        if (!autoIncentiveCalculationDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(200, req, res,
            "Auto incentive calculation data retrieved",
            autoIncentiveCalculationDetails
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}