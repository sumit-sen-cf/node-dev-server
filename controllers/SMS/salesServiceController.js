const salesServiceModel = require("../../models/SMS/salesServiceModel");
const { message } = require("../../common/message")
const mongoose = require("mongoose");

/**
 * Api is to used for the sales_service data add in the DB collection.
 */
exports.createSalesService = async (req, res) => {
    try {
        const { service_name, post_type, is_excel_upload, remarks, created_by, last_updated_by } = req.body;
        const addSalesServiceDetails = new salesServiceModel({
            service_name: service_name,
            post_type: post_type,
            is_excel_upload: is_excel_upload,
            remarks: remarks,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addSalesServiceDetails.save();
        return res.status(200).json({
            status: 200,
            message: "Sales service data added successfully!",
            data: addSalesServiceDetails,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};