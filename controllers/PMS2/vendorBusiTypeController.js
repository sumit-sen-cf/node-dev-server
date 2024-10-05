const constant = require("../../common/constant");
const response = require("../../common/response");
const vendorBusiTypeModel = require("../../models/PMS2/vendorBusiTypeModel");

exports.addVendorBusinessType = async (req, res) => {
    try {
        const { busi_type_name, description, created_by } = req.body;
        const savingObj = vendorBusiTypeModel({
            busi_type_name,
            description,
            created_by,
        });
        const savedObj = await savingObj.save();
        if (!savedObj) {
            return response.returnFalse(
                500,
                req,
                res,
                `Oop's Something went wrong while saving vendor type data.`,
                {}
            );
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Saved Vendor business Type Data",
            savedObj
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getSingleVendorBusiTypeDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const typeDetail = await vendorBusiTypeModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!typeDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch Vendor business Type Data",
            typeDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllVendorBusiTypeDetails = async (req, res) => {
    try {
        const typeDetails = await vendorBusiTypeModel.find({
            status: { $ne: constant.DELETED },
        });
        if (typeDetails?.length <= 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch Vendor business Type Details",
            typeDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.updateSingleVendorBusiTypeDetails = async (req, res) => {
    try {
        const { id } = req.body;
        const typeDetail = await vendorBusiTypeModel.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true }
        );
        if (!typeDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Update Vendor business Type Data",
            typeDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.deleteVendorBusiTypeDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const typeDetailDeleted = await vendorBusiTypeModel.findOneAndUpdate(
            { _id: id, status: { $ne: constant.DELETED } },
            {
                $set: {
                    status: constant.DELETED,
                },
            },
            { new: true }
        );
        if (!typeDetailDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            `Successfully Delete Vendor business Type Data for id ${id}`,
            typeDetailDeleted
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};