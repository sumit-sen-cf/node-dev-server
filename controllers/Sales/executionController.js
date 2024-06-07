const mongoose = require("mongoose");
const executionModel = require("../../models/Sales/executionModel");
const constant = require("../../common/constant");
const response = require("../../common/response");

/**
 * Api is to used for the sales_booking_execution data add in the DB collection.
 */
exports.createExecution = async (req, res) => {
    try {
        const { sale_booking_id, record_service_id, start_date, end_date, execution_status, execution_time, execution_date,
            execution_excel, execution_done_by, execution_remark, commitment, execution_sent_date, created_by } = req.body;
        const addSalesBookingExecution = await executionModel.create({
            sale_booking_id: sale_booking_id,
            record_service_id: record_service_id,
            start_date: start_date,
            end_date: end_date,
            execution_status: execution_status,
            execution_time: execution_time,
            execution_date: execution_date,
            execution_excel: execution_excel,
            execution_done_by: execution_done_by,
            execution_remark: execution_remark,
            commitment: commitment,
            execution_sent_date: execution_sent_date,
            created_by: created_by,
        });
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Sales booking execution created successfully",
            addSalesBookingExecution
        );

    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
* Api is to used for the sales_booking_execution data get_ByID in the DB collection.
*/
exports.getExecutionDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const executionDetail = await executionModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!executionDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Execution details retrive successfully!",
            executionDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the sales_booking_execution data update_By-Id in the DB collection.
 */
exports.updateExecutionDetial = async (req, res) => {
    try {
        const { id } = req.params;
        const { sale_booking_id, record_service_id, start_date, end_date, execution_status, execution_time, execution_date,
            execution_excel, execution_done_by, execution_remark, commitment, execution_sent_date, updated_by } = req.body;

        const executionUpdated = await executionModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                sale_booking_id,
                record_service_id,
                start_date,
                end_date,
                execution_status,
                execution_time,
                execution_date,
                execution_excel,
                execution_done_by,
                execution_remark,
                commitment,
                execution_sent_date,
                updated_by
            },
        }, { new: true }
        );
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Execution detail update successfully!",
            executionUpdated
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the sales_booking_execution data get_list in the DB collection.
 */
exports.getExcutionList = async (req, res) => {
    try {
        // Extract page and limit from query parameters, default to null if not provided
        const page = req.query?.page ? parseInt(req.query.page) : null;
        const limit = req.query?.limit ? parseInt(req.query.limit) : null;

        // Calculate the number of exectuion to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;

        // Retrieve the list of exectuion with pagination applied
        const executionList = await executionModel.find().skip(skip).limit(limit);

        // Get the total count of exectuion in the collection
        const executionCount = await executionModel.countDocuments();

        // If no exectuion are found, return a response indicating no exectuion found
        if (executionList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of exectuion and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Execution list retrieved successfully!",
            executionList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + executionList.length : executionList.length,
                total_records: executionCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(executionCount / limit) : 1,
            }
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the sales_booking_execution data delete_By-Id in the DB collection.
 */
exports.deleteExecution = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;

        // Attempt to find and update the record with the given id and status not equal to DELETED
        const executionDeleted = await executionModel.findOneAndUpdate(
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
            // Return the updated document
            { new: true }
        );
        // If no record is found or updated, return a response indicating no record found
        if (!executionDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            `Sales booking execution deleted succesfully! for id ${id}`,
            executionDeleted
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};