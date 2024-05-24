const constant = require("../../common/constant");
const response = require("../../common/response");
const vendorTypeModel = require("../../models/PMS2/vendorTypeModel");

exports.addVendorType = async (req, res) => {
    try {
        const { type_name, description, created_by } = req.body;
        const savingObj = vendorTypeModel({
            type_name,
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
            "Successfully Saved Vendor Type Data",
            savedObj
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getSingleVendorTypeDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const typeDetail = await vendorTypeModel.findOne({
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
            "Successfully Fetch Vendor Type Data",
            typeDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllVendorTypeDetails = async (req, res) => {
    try {
        const typeDetails = await vendorTypeModel.find({
            status: { $ne: constant.DELETED },
        });
        if (typeDetails?.length <= 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch Vendor Type Details",
            typeDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.updateSingleVendorTypeDetails = async (req, res) => {
    try {
        const { id } = req.body;
        const typeDetail = await vendorTypeModel.findOneAndUpdate(
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
            "Successfully Update Vendor Type Data",
            typeDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.deleteVendorTypeDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const typeDetailDeleted = await vendorTypeModel.findOneAndUpdate(
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
            `Successfully Delete Vendor Type Data for id ${id}`,
            typeDetailDeleted
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllVendorTypeDeletedData = async (req, res) => {
    try {
        // Find all vendor type that are not deleted
        const vendorTypeData = await vendorTypeModel.find({ status: constant.DELETED });

        if (!vendorTypeData) {
            return response.returnFalse(200, req, res, 'No Records Found', {});
        }

        return response.returnTrue(200, req, res, 'Vendor type retrieved successfully!', vendorTypeData);
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};
