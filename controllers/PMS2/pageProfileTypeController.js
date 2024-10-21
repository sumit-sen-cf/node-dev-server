const constant = require("../../common/constant");
const response = require("../../common/response");
const { updatePageMasterModel } = require("../../helper/helper");
const pageProfileTypeModel = require("../../models/PMS2/pageProfileTypeModel");

exports.addProfileType = async (req, res) => {
    try {
        const { profile_type, description, created_by } = req.body;
        const saveProfileType = await pageProfileTypeModel.create({
            profile_type,
            description,
            created_by,
        });
        if (!saveProfileType) {
            return response.returnFalse(
                500,
                req,
                res,
                `Oop's Something went wrong while saving profile type data.`,
                {}
            );
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Profile type data saved successfully.",
            saveProfileType
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

exports.getProfileTypeDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const profileTypeDetail = await pageProfileTypeModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!profileTypeDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Profile type details retrive successfully.",
            profileTypeDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllProfileTypeList = async (req, res) => {
    try {
        const profileTypeList = await pageProfileTypeModel.find({
            status: { $ne: constant.DELETED },
        });
        if (profileTypeList?.length <= 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Profile type data list retrive successfully.",
            profileTypeList
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.updateProfileTypeDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const { profile_type, description, last_updated_by } = req.body;

        // Step 1: Fetch the existing profile type details
        const existingProfileType = await pageProfileTypeModel.findById(id);

        if (!existingProfileType) {
            return response.returnFalse(200, req, res, 'Profile type not found.');
        }

        const previousProfileType = existingProfileType?.profile_type; // Save the previous profile type

        // Step 2: Update the profile type details in `pageProfileTypeModel`
        const updateProfileTypeResult = await pageProfileTypeModel.updateOne(
            { _id: id },
            {
                $set: {
                    profile_type,
                    description,
                    last_updated_by,
                },
            }
        );

        // Step 3: Check if any documents were updated
        if (updateProfileTypeResult.matchedCount === 0) {
            return response.returnTrue(500, req, res, 'Profile type update failed.');
        } else if (updateProfileTypeResult.modifiedCount === 0) {
            return response.returnFalse(200, req, res, 'Profile type was not updated.');
        } else {
            // Step 4: If `profile_type` is updated, update related records in other models
            if (profile_type && previousProfileType !== profile_type) {
                // Call the helper function to update related records in other models
                const updatePageMasterResult = await updatePageMasterModel(
                    previousProfileType,
                    profile_type,
                    baseModel = pageProfileTypeModel,
                    baseModelField = "profile_type",
                    targetModelField = "page_profile_type_name"
                );

                if (updatePageMasterResult.matchedCount > 0) {
                    console.log(`${updatePageMasterResult.modifiedCount} records updated in related models.`);
                } else {
                    console.log('No records found in related models to update.');
                }
            }

            // Step 5: Return success response
            return response.returnTrue(200, req, res, 'Profile type updated successfully.');
        }
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};


exports.deleteProfileType = async (req, res) => {
    try {
        const { id } = req.params;
        const profileTypeDataDelete = await pageProfileTypeModel.findOneAndUpdate(
            { _id: id, status: { $ne: constant.DELETED } },
            {
                $set: {
                    status: constant.DELETED,
                },
            },
            { new: true }
        );
        if (!profileTypeDataDelete) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            `Profile type data deleted successfully! ${id}`,
            profileTypeDataDelete
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllProfileTypeDataDeleted = async (req, res) => {
    try {
        // Find all Profile type that are not deleted
        const profileTypeData = await pageProfileTypeModel.find({ status: constant.DELETED });

        if (!profileTypeData) {
            return response.returnFalse(200, req, res, 'No Records Found', {});
        }

        return response.returnTrue(200, req, res, 'Profile type retrieved successfully!', profileTypeData);
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};