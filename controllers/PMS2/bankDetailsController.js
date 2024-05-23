const bankDetailsModel = require("../../models/PMS2/bankDetailsModel");
const constant = require("../../common/constant");
const response = require("../../common/response");
const mongoose = require("mongoose");

exports.createBankDetails = async (req, res) => {
    try {
        const { vendor_id, bank_name, account_type, registered_number, account_number, ifcs, upi_id, created_by } = req.body;
        const addBankDetails = bankDetailsModel({
            vendor_id,
            bank_name,
            account_type,
            account_number,
            registered_number,
            ifcs,
            upi_id,
            created_by,
        });
        const bankDetailsSaved = await addBankDetails.save();
        if (!bankDetailsSaved) {
            return response.returnFalse(
                500,
                req,
                res,
                `Oop's "Something went wrong while saving bank details data.`,
                {}
            );
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Bank details added successfully!",
            bankDetailsSaved
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

exports.getBankDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const getbankDetailsData = await bankDetailsModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!getbankDetailsData) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Bank details retrieve successfully!",
            getbankDetailsData
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllBankDetails = async (req, res) => {
    try {
        const bankDetailsList = await bankDetailsModel.find({
            status: { $ne: constant.DELETED },
        });
        if (bankDetailsList?.length <= 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Bank details list retrive successfully!",
            bankDetailsList
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.updateBankDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { vendor_id, bank_name, account_type, registered_number, account_number, ifcs, upi_id, updated_by } = req.body;

        const editBankDetails = await bankDetailsModel.findOne({ _id: id });
        if (!editBankDetails) {
            return response.returnFalse(200, req, res, `Bank detail ID invalid, please check.`);
        }
        const updateResult = await bankDetailsModel.updateOne(
            { _id: editBankDetails.id },
            {
                $set: {
                    vendor_id,
                    bank_name,
                    account_type,
                    account_number,
                    ifcs,
                    upi_id,
                    updated_by,
                },
            }
        );

        if (updateResult.matchedCount === 0) {
            return response.returnTrue(500, req, res, `Bank details failed successfully.`);
        } else if (updateResult.modifiedCount === 0) {
            return response.returnFalse(200, req, res, `Bank details are not updated.`);
        } else {
            return response.returnTrue(200, req, res, `Bank details updated successfully.`);
        }
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.deleteBankDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const bankDetailDelete = await bankDetailsModel.findOneAndUpdate(
            { _id: id, status: { $ne: constant.DELETED } },
            {
                $set: {
                    status: constant.DELETED,
                },
            },
            { new: true }
        );
        if (!bankDetailDelete) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            `Bank detail deleted successfully! ${id}`,
            bankDetailDelete
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllBankDetails = async (req, res) => {
    try {
        // Find all bank details that are not deleted
        const bankDetails = await bankDetailsModel.find({ status: { $ne: constant.DELETED } });

        if (!bankDetails) {
            return response.returnFalse(200, req, res, 'No Records Found', {});
        }

        return response.returnTrue(200, req, res, 'Bank details retrieved successfully!', bankDetails);
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getBankDetailsByVendorId = async (req, res) => {
    try {
        const { id } = req.params;
        const getbankDetailsData = await bankDetailsModel.aggregate([
            {
                $match: {
                    vendor_id: mongoose.Types.ObjectId(id),
                    status: { $ne: constant.DELETED },
                }
            }]);
        if (!getbankDetailsData) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Bank details by vendor id fetched successfully!",
            getbankDetailsData
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};
