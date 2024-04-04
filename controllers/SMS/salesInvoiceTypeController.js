const salesInvoiceTypeModel = require("../../models/SMS/salesInvoiceTypeModel");
const { message } = require("../../common/message")
const mongoose = require("mongoose");

/**
 * Api is to used for the sales_invoice_type data add in the DB collection.
 */
exports.createSalesInvoiceType = async (req, res) => {
    try {
        const { invoice_type_name } = req.body;
        const addSalesInvoiceType = new salesInvoiceTypeModel({
            invoice_type_name: invoice_type_name,
        });
        await addSalesInvoiceType.save();
        return res.status(200).json({
            status: 200,
            message: "Sales invoice type data added successfully!",
            data: addSalesInvoiceType,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the sales sales_invoice_type data get_ByID in the DB collection.
 */
exports.getSalesInvoiceType = async (req, res) => {
    try {
        const salesInvoiceTypeData = await salesInvoiceTypeModel.aggregate([
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
                    invoice_type_name: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (salesInvoiceTypeData) {
            return res.status(200).json({ 
                status: 200,
                message: "Sales invoice type details successfully!",
                data: salesInvoiceTypeData,
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
 * Api is to used for the update_sales_invoice_type data update in the DB collection.
 */
exports.updateSalesInvoiceType = async (req, res) => {
    try {
        const { id } = req.params;
        const { invoice_type_name } = req.body;
        const salesInvoiceTypeData = await salesInvoiceTypeModel.findOne({ _id: id });
        if (!salesInvoiceTypeData) {
            return res.send("Invalid sales_invoice_type Id...");
        }
        await salesInvoiceTypeData.save();
        const saleInvoiceTypeUpdated = await salesInvoiceTypeModel.findOneAndUpdate({ _id: id }, {
            $set: {
                invoice_type_name,
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "Sales invoice type data updated successfully!",
            data: saleInvoiceTypeUpdated,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the sales_invoice_type data get_list in the DB collection.
 */
exports.getSalesInvoiceTypeList = async (req, res) => {
    try {
        const salesInvoiceTypeListData = await salesInvoiceTypeModel.find()
        if (salesInvoiceTypeListData) {
            return res.status(200).json({
                status: 200,
                message: "Sales invoice type list successfully!",
                data: salesInvoiceTypeListData,
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
 * Api is to used for the sales_invoice_type data delete in the DB collection.
 */
exports.deleteSalesInvoiceType = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const salesInvoiceTypeDelete = await salesInvoiceTypeModel.findOne({ _id: id });
        if (!salesInvoiceTypeDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await salesInvoiceTypeModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Sales invoice type data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};
