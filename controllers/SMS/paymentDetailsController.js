const paymentDetailsModel = require("../../models/SMS/paymentDetailsModel");
const { message } = require("../../common/message")
const mongoose = require("mongoose");


/**
 * Api is to used for the payment_details data add in the DB collection.
 */
exports.createPaymentDetails = async (req, res) => {
    try {
        const { title, details, gst_bank, managed_by, created_by, last_updated_by } = req.body;
        const addPaymentDetails = new paymentDetailsModel({
            title: title,
            details: details,
            gst_bank: gst_bank,
            managed_by: managed_by,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addPaymentDetails.save();
        return res.status(200).json({
            status: 200,
            message: "Payment details data added successfully!",
            data: addPaymentDetails,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the payment_details data get_ByID in the DB collection.
 */
exports.getPaymentDetails = async (req, res) => {
    try {
        const paymentDetailsData = await paymentDetailsModel.aggregate([
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
                    title: 1,
                    details: 1,
                    gst_bank: 1,
                    managed_by: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (paymentDetailsData) {
            return res.status(200).json({
                status: 200,
                message: "Payment details successfully!",
                data: paymentDetailsData[0],
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
 * Api is to used for the payment_details data update in the DB collection.
 */
exports.updatePaymentDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, details, gst_bank, managed_by, created_by, last_updated_by } = req.body;
        const paymentDetailData = await paymentDetailsModel.findOne({ _id: id });
        if (!paymentDetailData) {
            return res.send("Invalid payment_details Id...");
        }
        await paymentDetailData.save();
        const paymentDetailsUpdatedData = await paymentDetailsModel.findOneAndUpdate({ _id: id }, {
            $set: {
                title,
                details,
                gst_bank,
                managed_by,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "Payment_details data updated successfully!",
            data: paymentDetailsUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};


/**
 * Api is to used for the payment_details data get_list in the DB collection.
 */
exports.getPaymentDetailList = async (req, res) => {
    try {
        const paymentDetailListData = await paymentDetailsModel.aggregate([
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
                    title: 1,
                    details: 1,
                    gst_bank: 1,
                    managed_by: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (paymentDetailListData) {
            return res.status(200).json({
                status: 200,
                message: "Payment details list successfully!",
                data: paymentDetailListData,
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
 * Api is to used for the payment_details data delete in the DB collection.
 */
exports.deletePaymentDetails = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const paymentDetailsDataDelete = await paymentDetailsModel.findOne({ _id: id });
        if (!paymentDetailsDataDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await paymentDetailsModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Payment_details data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};
