const { message } = require("../../common/message")
const mongoose = require("mongoose");
const salesPaymentModeModel = require("../../models/Sales/paymentModeModels");

/**
 * Api is to used for the sales_payment_mode data add in the DB collection.
 */
exports.createSalesPaymentmode = async (req, res) => {
    try {
        const { payment_mode_name, created_by } = req.body;
        const addSalesPaymentModeDetails = new salesPaymentModeModel({
            payment_mode_name: payment_mode_name,
            created_by: created_by,
        });
        await addSalesPaymentModeDetails.save();
        return res.status(200).json({
            status: 200,
            message: "Sales payment mode details data added successfully!",
            data: addSalesPaymentModeDetails,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the sales_payment_mode data get_ByID in the DB collection.
 */
exports.getSalesPaymentMode = async (req, res) => {
    try {
        const salesPaymentModeData = await salesPaymentModeModel.aggregate([
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
                $lookup: {
                    from: "usermodels",
                    localField: "managed_by",
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
                    payment_mode_name: 1,
                    created_by: 1,
                    updated_by: 1,
                    managed_by_name: "$user.user_name",
                    created_by_name: "$user.user_name",
                    createdAt: 1,
                    updated_date: 1,
                },
            },
        ])
        if (salesPaymentModeData) {
            return res.status(200).json({
                status: 200,
                message: "Sales payment mode details successfully!",
                data: salesPaymentModeData[0],
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
 * Api is to used for the sales_payment_mode data update in the DB collection.
 */
exports.updateSalesPaymentMode = async (req, res) => {
    try {
        const { id } = req.params;
        const { payment_mode_name, managed_by, updated_by } = req.body;
        const salesPaymentModeData = await salesPaymentModeModel.findOne({ _id: id });
        if (!salesPaymentModeData) {
            return res.send("Invalid sales_payment_mode Id...");
        }
        await salesPaymentModeData.save();
        const salesPaymentModeUpdated = await salesPaymentModeModel.findOneAndUpdate({ _id: id }, {
            $set: {
                payment_mode_name,
                updated_by
            },
        }, {
            new: true
        });
        return res.status(200).json({
            message: "Sales payment mode data updated successfully!",
            data: salesPaymentModeUpdated,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the sales_payment_mode data get_list in the DB collection.
 */
exports.getSalesPaymentModeList = async (req, res) => {
    try {
        const salesPaymentModeListData = await salesPaymentModeModel.aggregate([
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
                $lookup: {
                    from: "usermodels",
                    localField: "managed_by",
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
                    payment_mode_name: 1,
                    managed_by: 1,
                    managed_by_name: "$user.user_name",
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    updated_by: 1,
                },
            },
        ])
        if (salesPaymentModeListData) {
            return res.status(200).json({
                status: 200,
                message: "Sales payment mode details list successfully!",
                data: salesPaymentModeListData,
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
 * Api is to used for the sales_payment_mode data delete in the DB collection.
 */
exports.deleteSalesPaymentMode = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const salesPaymentModeDelete = await salesPaymentModeModel.findOne({ _id: id });
        if (!salesPaymentModeDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await salesPaymentModeModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Sales payment mode data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};