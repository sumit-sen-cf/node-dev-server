const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const pmsProfileTypeModel = require('../../models/PMS/pmsProfileTypeModel');

//POST- TmsCatMast
exports.createPmsProfile = async (req, res) => {
    try {
        const checkDuplicacy = await pmsProfileTypeModel.findOne({ profile_type: req.body.profile_type });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "PMS profile type alredy exist!",
            });
        }
        const { profile_type, description, created_date_time, created_by, last_updated_date, last_updated_by } = req.body;
        const addProfileData = new pmsProfileTypeModel({
            profile_type: profile_type,
            description: description,
            created_date_time: created_date_time,
            created_by: created_by,
            last_updated_date: last_updated_date,
            last_updated_by: last_updated_by
        });
        await addProfileData.save();
        return res.status(200).json({
            status: 200,
            message: "PMS profile data added successfully!",
            data: addProfileData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_Profile_Type-By-ID
exports.getProfileDetail = async (req, res) => {
    try {
        const pmsProfileTypeData = await pmsProfileTypeModel.aggregate([
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
                    profile_type_id: 1,
                    profile_type_name: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (pmsProfileTypeData) {
            return res.status(200).json({
                status: 200,
                message: "PMS profile type details successfully!",
                data: pmsProfileTypeData,
            });
        }
        return res.status(404).json({
            status: 404,
            message: message.DATA_NOT_FOUND,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};

//PUT - updateProfileType_By-ID
exports.updateProfileType = async (req, res) => {
    try {
        const { id } = req.params;
        const { profile_type, description, created_date_time, created_by, last_updated_date, last_updated_by } = req.body;
        const profileData = await pmsProfileTypeModel.findOne({ _id: id });
        if (!profileData) {
            return res.send("Invalid Vendore Id...");
        }
        await profileData.save();
        const profileUpdatedData = await pmsProfileTypeModel.findOneAndUpdate({ _id: id }, {
            $set: {
                profile_type,
                description,
                created_date_time,
                created_by,
                last_updated_date,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "PMS profile data updated successfully!",
            data: profileUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_Profile_List
exports.getProfileList = async (req, res) => {
    try {
        const pmsProfileData = await pmsProfileTypeModel.aggregate([
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
                $lookup: {
                    from: "usermodels",
                    localField: "last_updated_by",
                    foreignField: "user_id",
                    as: "user_data",
                },
            },
            {
                $unwind: {
                    path: "$user_data",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    type_name: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    last_updated_by_name: "$user_data.user_name",
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                }
            }
        ])
        if (!pmsProfileData) {
            return res.status(500).send({
                succes: true,
                message: "PMS profile data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "PMS profile data list successfully!",
            data: pmsProfileData
        });
    } catch (err) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//DELETE - PMS_vendor_Type_ By-ID
exports.deleteProfileType = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const profileDataDelete = await pmsProfileTypeModel.findOne({ _id: id });
        if (!profileDataDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await pmsProfileTypeModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "PMS profile data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};