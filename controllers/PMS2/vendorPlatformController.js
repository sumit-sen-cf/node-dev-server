const constant = require("../../common/constant");
const response = require("../../common/response");
const vendorPlatformModel = require("../../models/PMS2/vendorPlatformModel");

exports.addVendorPlatform = async (req, res) => {
    try {
        const { platform_name, description, created_by } = req.body;
        const savingObj = vendorPlatformModel({
            platform_name,
            description,
            created_by,
        });
        const savedObj = await savingObj.save();
        if (!savedObj) {
            return response.returnFalse(
                500,
                req,
                res,
                `Oop's Something went wrong while saving vendor platform data.`,
                {}
            );
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Saved Vendor Platform Data",
            savedObj
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getSingleVendorPlatformDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const platformDetail = await vendorPlatformModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!platformDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch Vendor Platform Data",
            platformDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllVendorPlatformDetails = async (req, res) => {
    try {
        const platformDetails = await vendorPlatformModel.find({
            status: { $ne: constant.DELETED },
        });
        if (platformDetails?.length <= 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch Vendor Platform Details",
            platformDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.updateSingleVendorPlatformDetails = async (req, res) => {
    try {
        const { id } = req.body;
        const platformDetail = await vendorPlatformModel.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true }
        );
        if (!platformDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Update Vendor Platform Data",
            platformDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.deleteVendorPlatformDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const platformDetailDeleted = await vendorPlatformModel.findOneAndUpdate(
            { _id: id, status: { $ne: constant.DELETED } },
            {
                $set: {
                    status: constant.DELETED,
                },
            },
            { new: true }
        );
        if (!platformDetailDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            `Successfully Delete Vendor Platform Data for id ${id}`,
            platformDetailDeleted
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllVendorPlatformDeletedData = async (req, res) => {
    try {
        // Find all vendor platform that are not deleted
        const vendorPlatformData = await vendorPlatformModel.find({ status: { $ne: constant.DELETED } });

        if (!vendorPlatformData) {
            return response.returnFalse(200, req, res, 'No Records Found', {});
        }

        return response.returnTrue(200, req, res, 'Vendor platform retrieved successfully!', vendorPlatformData);
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};