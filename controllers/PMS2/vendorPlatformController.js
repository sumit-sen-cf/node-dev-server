const constant = require("../../common/constant");
const response = require("../../common/response");
const { updatePageMasterModel } = require("../../helper/helper");
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
        const { id, platform_name  } = req.body;

        // Step 1: Fetch the existing platform details
        const existingPlatformDetail = await vendorPlatformModel.findById(id);

        if (!existingPlatformDetail) {
            return response.returnFalse(200, req, res, 'No Record Found.', {});
        }

        const previousPlatformName = existingPlatformDetail?.platform_name; // Save the previous platform name

        // Step 2: Update the Vendor Platform Details in `vendorPlatformModel`
        const platformDetail = await vendorPlatformModel.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true } // Return the updated document
        );

        if (!platformDetail) {
            return response.returnFalse(200, req, res, 'No Record Found.', {});
        }

        // Step 3: If `platform_name` is updated, update related data in other models
        if (platform_name && previousPlatformName !== platform_name) {
            // Call the helper function to update related records in other models
            const updatePageMasterResult = await updatePageMasterModel(
                previousPlatformName,
                platform_name,
                baseModel = vendorPlatformModel,
                baseModelField = "platform_name",
                targetModelField = "platform_name"
            );

            if (updatePageMasterResult.matchedCount > 0) {
                console.log(`${updatePageMasterResult.modifiedCount} records updated in the related model.`);
            } else {
                console.log('No records found in the related model to update.');
            }
        }

        // Step 4: Return success response with the updated platform details
        return response.returnTrue(
            200,
            req,
            res,
            'Successfully Updated Vendor Platform Data',
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
        const vendorPlatformData = await vendorPlatformModel.find({ status: constant.DELETED });

        if (!vendorPlatformData) {
            return response.returnFalse(200, req, res, 'No Records Found', {});
        }

        return response.returnTrue(200, req, res, 'Vendor platform retrieved successfully!', vendorPlatformData);
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};