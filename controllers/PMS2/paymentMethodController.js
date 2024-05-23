const constant = require("../../common/constant");
const response = require("../../common/response");
const paymentMethodModel = require("../../models/PMS2/paymentMethodModel");

exports.addPaymentMethod = async (req, res) => {
    try {
        const { payMethod_name, description, created_by } = req.body;
        const savingObj = paymentMethodModel({
            payMethod_name,
            description,
            created_by,
        });
        const savedObj = await savingObj.save();
        if (!savedObj) {
            return response.returnFalse(
                500,
                req,
                res,
                `Oop's Something went wrong while saving  payment method data.`,
                {}
            );
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Saved  payment method Data",
            savedObj
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getSinglePaymentMethodDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const paymentMethodDetail = await paymentMethodModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!paymentMethodDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch  Payment Method Data",
            paymentMethodDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllPaymentMethodDetails = async (req, res) => {
    try {
        const paymentMethodDetails = await paymentMethodModel.find({
            status: { $ne: constant.DELETED },
        });
        if (paymentMethodDetails?.length <= 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch  Payment Method Details",
            paymentMethodDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.updateSinglePaymentMethodDetails = async (req, res) => {
    try {
        const { id } = req.body;
        const paymentMethodDetail = await paymentMethodModel.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true }
        );
        if (!paymentMethodDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Update  Payment Method Data",
            paymentMethodDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.deletePaymentMethodDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const paymentMethodDetailDeleted = await paymentMethodModel.findOneAndUpdate(
            { _id: id, status: { $ne: constant.DELETED } },
            {
                $set: {
                    status: constant.DELETED,
                },
            },
            { new: true }
        );
        if (!paymentMethodDetailDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            `Successfully Delete  Payment Method Data for id ${id}`,
            paymentMethodDetailDeleted
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllPaymentMethodDeletedData = async (req, res) => {
    try {
        const paymentMethodData = await paymentMethodModel.find({ status: constant.DELETED });
        if (!paymentMethodData) {
            return response.returnFalse(200, req, res, 'No Records Found', {});
        }

        return response.returnTrue(200, req, res, 'Payment method retrieved successfully!', paymentMethodData);
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};