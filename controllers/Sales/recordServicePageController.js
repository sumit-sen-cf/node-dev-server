const mongoose = require("mongoose");
const vari = require("../../variables.js");
const recordServicePagesModel = require("../../models/Sales/recordServicePageModel.js");
const response = require("../../common/response.js");
const constant = require("../../common/constant.js");

/**
 * Api is to used for the record_service_page data add in the DB collection.
 */
exports.createRecordServicePage = async (req, res) => {
    try {
        const { record_service_id, sale_booking_id, sales_service_master_id, page_master_id, page_post_type, page_rate, page_sale_rate,
            remarks, sale_executive_id, created_by } = req.body;

        const recordServicePageAdded = await recordServicePagesModel.create({
            record_service_id: record_service_id,
            sale_booking_id: sale_booking_id,
            sales_service_master_id: sales_service_master_id,
            page_master_id: page_master_id,
            page_post_type: page_post_type,
            page_rate: page_rate,
            page_sale_rate: page_sale_rate,
            sale_executive_id: sale_executive_id,
            remarks: remarks,
            created_by: created_by,
        });
        return res.response.returnTrue(
            200,
            req,
            res,
            "Record service page data added successfully!",
            recordServicePageAdded,
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};


exports.getRecordServicePagesDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const recordServicePagesDetails = await recordServicePagesModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!recordServicePagesDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Record service master details retrive successfully!",
            recordServicePagesDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the record_service_page data update in the DB collection.
 */
exports.updateRecordServicePage = async (req, res) => {
    try {

        const { id } = req.params;
        const { record_service_master_id, sale_booking_id, sales_service_master_id, pageMast_id, page_post_type, page_rate, page_sale_rate,
            remarks, sale_executive_id, updated_by } = req.body;

        const recprdServicePageUpdated = await recordServicePagesModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                record_service_master_id,
                sale_booking_id,
                sales_service_master_id,
                pageMast_id,
                page_post_type,
                page_rate,
                page_sale_rate,
                sale_executive_id,
                remarks,
                updated_by
            },
        }, { new: true }
        );
        return response.returnTrue(
            200,
            req,
            res,
            "Record service page update successfully!",
            recprdServicePageUpdated
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};


/**
 * Api is to used for the record_service_page data get_List in the DB collection.
 */
exports.getRecordServicePageList = async (req, res) => {
    try {
        // Extract page and limit from query parameters, default to null if not provided
        const page = req.query?.page ? parseInt(req.query.page) : null;
        const limit = req.query?.limit ? parseInt(req.query.limit) : null;

        // Calculate the number of records to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;

        // Retrieve the list of records with pagination applied
        const recordServicePageList = await recordServicePagesModel.find().skip(skip).limit(limit);

        // Get the total count of records in the collection
        const recordServicePageCount = await recordServicePagesModel.countDocuments();

        // If no records are found, return a response indicating no records found
        if (recordServicePageList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of records and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Record service list retrieved successfully!",
            recordServicePageList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + recordServicePageList.length : recordServicePageList.length,
                total_records: recordServicePageCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(recordServicePageCount / limit) : 1,
            }
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the reocrd_service_page data delete in the DB collection.
 */
exports.deleteRecordServicePage = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;

        // Attempt to find and update the record with the given id and status not equal to DELETED
        const recordServicePageDeleted = await recordServicePagesModel.findOneAndUpdate(
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
        if (!recordServicePageDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            `Record service deleted succesfully! for id ${id}`,
            recordServicePageDeleted
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};