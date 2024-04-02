const salesInvoiceParticularModel = require("../../models/SMS/salesInvoiceParticularModel");
const { message } = require("../../common/message")
const mongoose = require("mongoose");


/**
 * Api is to used for the add_sales_invoice_particular data add in the DB collection.
 */
exports.createSalesInvoiceParticular = async (req, res) => {
    try {
        const checkDuplicacy = await salesInvoiceParticularModel.findOne({ invoice_particular_name: req.body.invoice_particular_name });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "Sales invoice_name data alredy exist!",
            });
        }
        const { invoice_particular_name, remarks, managed_by, created_by,last_updated_by } = req.body;
        const addSalesInvoiceParticular = new salesInvoiceParticularModel({
            invoice_particular_name: invoice_particular_name,
            remarks: remarks,
            managed_by: managed_by,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addSalesInvoiceParticular.save();
        return res.status(200).json({
            status: 200,
            message: "Sales invoice particular data added successfully!",
            data: addSalesInvoiceParticular,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
}

/**
 * Api is to used for the sales sales_invoice_particular data get_ByID in the DB collection.
 */
exports.getSalesInvoiceParticular = async (req, res) => {
    try {
        const salesInvoiceParticularData = await salesInvoiceParticularModel.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(req.params.id) },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    invoice_particular_name: 1,
                    remarks: 1,
                    managed_by: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (salesInvoiceParticularData) {
            return res.status(200).json({ 
                status: 200,
                message: "Sales invoice particular details successfully!",
                data: salesInvoiceParticularData,
            });
        }
        return res.status(404).json({
            status: 404,
            message: message.DATA_NOT_FOUND,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the update_sales_invoice_particular data update in the DB collection.
 */
exports.updateSalesInvoiceParticular = async (req, res) => {
    try {
        const { id } = req.params;
        const { invoice_particular_name, remarks, managed_by, created_by,last_updated_by } = req.body;
        const salesInvoiceParticularDetailData = await salesInvoiceParticularModel.findOne({ _id: id });
        if (!salesInvoiceParticularDetailData) {
            return res.send("Invalid sales_invoice_particular Id...");
        }
        await salesInvoiceParticularDetailData.save();
        const saleInvoiceParticularUpdatedData = await salesInvoiceParticularModel.findOneAndUpdate({ _id: id }, {
            $set: {
                invoice_particular_name,
                remarks,
                managed_by,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "Sales invoice particular data updated successfully!",
            data: saleInvoiceParticularUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the sales_invoice_particular data get_list in the DB collection.
 */
exports.getSalesInvoiceParticularList = async (req, res) => {
    try {
        const salesInvoiceParticularListData = await salesInvoiceParticularModel.aggregate([
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    invoice_particular_name: 1,
                    remarks: 1,
                    managed_by: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (salesInvoiceParticularListData) {
            return res.status(200).json({
                status: 200,
                message: "Sales invoice particular list successfully!",
                data: salesInvoiceParticularListData,
            });
        }
        return res.status(404).json({
            status: 404,
            message: message.DATA_NOT_FOUND,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the sales_invoice_particular data delete in the DB collection.
 */
exports.deleteSalesInvoiceParticular = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const salesInvoiceParticularDataDelete = await salesInvoiceParticularModel.findOne({ _id: id });
        if (!salesInvoiceParticularDataDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await salesInvoiceParticularModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Sales invoice particular data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};
