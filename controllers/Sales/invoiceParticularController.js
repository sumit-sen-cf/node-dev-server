const { message } = require("../../common/message")
const mongoose = require("mongoose");
const invoiceParticularModel = require("../../models/Sales/invoiceParticularModel");
const response = require("../../common/response");
const constant = require("../../common/constant");

/**
 * Api is to used for the add_sales_invoice_particular data add in the DB collection.
 */
exports.createSalesInvoiceParticular = async (req, res) => {
    try {
        const { invoice_particular_name, remarks, created_by } = req.body;
        const addInvoiceParticular = await invoiceParticularModel.create({
            invoice_particular_name,
            remarks,
            created_by
        });
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Sales invoice particular added successfully!",
            addInvoiceParticular
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

/**
 * Api is to used for the sales sales_invoice_particular data get_ByID in the DB collection.
 */
exports.getInvoiceParticularDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const invoiceParticuarDetails = await invoiceParticularModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED }
        });
        if (!invoiceParticuarDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Sales invoice particular details retrive successfully!",
            invoiceParticuarDetails
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the update_sales_invoice_particular data update in the DB collection.
 */
exports.updateInvoiceParticular = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;
        const { invoice_particular_name, remarks, updated_by } = req.body;

        const invoicePArticularUpdated = await invoiceParticularModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                invoice_particular_name,
                remarks,
                updated_by
            },
        }, { new: true }
        );
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Sales invoice particular update successfully!",
            invoicePArticularUpdated
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the sales_invoice_particular data get_list in the DB collection.
 */
exports.getInvoiceParticularList = async (req, res) => {
    try {
        // Extract page and limit from query parameters, default to null if not provided
        const page = req.query?.page ? parseInt(req.query.page) : null;
        const limit = req.query?.limit ? parseInt(req.query.limit) : null;
        const sort = { createdAt: -1 };

        // Calculate the number of records to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;

        // Retrieve the list of records with pagination applied
        const invoiceParticularList = await invoiceParticularModel.find().skip(skip).limit(limit).sort(sort);

        // Get the total count of records in the collection
        const invoicePArticularCount = await invoiceParticularModel.countDocuments();

        // If no records are found, return a response indicating no records found
        if (invoiceParticularList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of records and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Sales invoice particular list retrieved successfully!",
            invoiceParticularList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + invoiceParticularList.length : invoiceParticularList.length,
                total_records: invoicePArticularCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(invoicePArticularCount / limit) : 1,
            }
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the sales_invoice_particular data delete in the DB collection.
 */
exports.deleteInvoiceParticular = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;
        // Attempt to find and update the record with the given id and status not equal to DELETED
        const invoiceParticularDeleted = await invoiceParticularModel.findOneAndUpdate({
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
        if (!invoiceParticularDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            `Sales invoice particular deleted succesfully! for id ${id}`,
            invoiceParticularDeleted
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};
