const paymentDetailsModel = require("../../models/Sales/paymentDetailsModel");
const { message } = require("../../common/message")
const mongoose = require("mongoose");
const response = require("../../common/response");

/**
 * Api is to used for the payment_details data add in the DB collection.
 */
exports.createPaymentDetails = async (req, res) => {
    try {
        const { title, details, gst_bank, created_by } = req.body;
        const addPaymentDetails = await paymentDetailsModel.create({
            title: title,
            details: details,
            gst_bank: gst_bank,
            created_by: created_by,
        });
        return response.returnTrue(200, req, res, "Payment Details Created Successfully", addPaymentDetails);
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the payment_details data get_ByID in the DB collection.
 */
exports.getPaymentDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const paymentDetails = await paymentDetailsModel.findOne({
            _id: id,
        });
        if (!paymentDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Payment details retrive successfully!",
            paymentDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the payment_details data update in the DB collection.
 */
exports.updatePaymentDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, details, gst_bank, updated_by } = req.body;

        const paymentDetailsUpdatedData = await paymentDetailsModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                title,
                details,
                gst_bank,
                updated_by
            },
        }, { new: true }
        );
        return response.returnTrue(
            200,
            req,
            res,
            "Payment details update successfully!",
            paymentDetailsUpdatedData
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};


/**
 * Api is to used for the payment_details data get_list in the DB collection.
 */
exports.getPaymentDetailList = async (req, res) => {
    try {
        const page = req.query?.page ? parseInt(req.query.page) : null;
        const limit = req.query?.limit ? parseInt(req.query.limit) : null;
        const skip = (page && limit) ? (page - 1) * limit : 0;

        const paymentDetailsList = await paymentDetailsModel.find().skip(skip).limit(limit);
        const paymentDetailsCount = await paymentDetailsModel.countDocuments();

        if (paymentDetailsList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Payment details list retrieved successfully!",
            paymentDetailsList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + paymentDetailsList.length : paymentDetailsList.length,
                total_records: paymentDetailsCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(paymentDetailsCount / limit) : 1,
            }
        );

    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

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
                message: "Data not found!",
            });
        }
        await paymentDetailsModel.deleteOne({ _id: id });
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Payment details deleted successfully!",
            paymentDetailsDataDelete,
        );

    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};
