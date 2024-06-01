const { message } = require("../../common/message")
const mongoose = require("mongoose");
const salesPaymentModeModel = require("../../models/Sales/paymentModeModels");
const response = require("../../common/response");
const paymentModeModels = require("../../models/Sales/paymentModeModels");

/**
 * Api is to used for the sales_payment_mode data add in the DB collection.
 */
exports.createPaymentmode = async (req, res) => {
    try {
        const { payment_mode_name, created_by } = req.body;
        const addPayementMode = await salesPaymentModeModel.create({
            payment_mode_name: payment_mode_name,
            created_by: created_by,
        });
        return response.returnTrue(
            200,
            req,
            res,
            "Payment Details Created Successfully",
            addPayementMode
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the sales_payment_mode data get_ByID in the DB collection.
 */
exports.getPaymentModeDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const paymentModeDetails = await salesPaymentModeModel.findOne({
            _id: id,
        });
        if (!paymentModeDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Payment mode details retrive successfully!",
            paymentModeDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};


/**
 * Api is to used for the sales_payment_mode data update in the DB collection.
 */
exports.updatePaymentMode = async (req, res) => {
    try {
        const { id } = req.params;
        const { payment_mode_name, updated_by } = req.body;

        const paymentModeUpdated = await paymentModeModels.findByIdAndUpdate({ _id: id }, {
            $set: {
                payment_mode_name,
                updated_by
            },
        }, { new: true }
        );
        return response.returnTrue(
            200,
            req,
            res,
            "Payment mode update successfully!",
            paymentModeUpdated
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the sales_payment_mode data get_list in the DB collection.
 */
exports.getPaymentModeList = async (req, res) => {
    try {
        const page = req.query?.page ? parseInt(req.query.page) : null;
        const limit = req.query?.limit ? parseInt(req.query.limit) : null;
        const skip = (page && limit) ? (page - 1) * limit : 0;

        const paymentModeList = await salesPaymentModeModel.find().skip(skip).limit(limit);
        const paymentModeCount = await salesPaymentModeModel.countDocuments();

        if (paymentModeList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Payment mode list retrieved successfully!",
            paymentModeList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + paymentModeList.length : paymentModeList.length,
                total_records: paymentModeCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(paymentModeCount / limit) : 1,
            }
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the sales_payment_mode data delete in the DB collection.
 */
exports.deletePaymentMode = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const paymentModeDelete = await salesPaymentModeModel.findOne({ _id: id });
        if (!paymentModeDelete) {
            return res.status(404).json({
                status: 404,
                message: "Data not found!",
            });
        }
        await salesPaymentModeModel.deleteOne({ _id: id });
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Payment details deleted successfully!",
            paymentModeDelete,
        );

    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};