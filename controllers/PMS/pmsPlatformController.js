const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const pmsPlatformModel = require('../../models/PMS/pmsPlatformModel');

//POST- PMS_Platform
exports.createPlatform = async (req, res) => {
    try {
        const checkDuplicacy = await pmsPlatformModel.findOne({ platform_name: req.body.platform_name });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: " PMS platform alredy exist!",
            });
        }
        const { platform_name, description, created_by, last_updated_by } = req.body;
        const addPlatformData = new pmsPlatformModel({
            platform_name: platform_name,
            description: description,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addPlatformData.save();
        return res.status(200).json({
            status: 200,
            message: "PMS platform data added successfully!",
            data: addPlatformData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_Platform-By-ID
exports.getPlatformDetail = async (req, res) => {
    try {
        const pmsPlatformData = await pmsPlatformModel.aggregate([
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
                    type_id: 1,
                    platform_name: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (pmsPlatformData) {
            return res.status(200).json({
                status: 200,
                message: "PMS platform details successfully!",
                data: pmsPlatformData,
            });
        }
        return res.status(404).json({
            status: 404,
            message: message.DATA_NOT_FOUND,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//PUT - updateVendorType_By-ID
exports.updatePlatformData = async (req, res) => {
    try {
        const { id } = req.params;
        const { platform_name, description, created_by, last_updated_by } = req.body;
        const editPlatformData = await pmsPlatformModel.findOne({ _id: id });
        if (!editPlatformData) {
            return res.send("Invalid Platform Id...");
        }
        await editPlatformData.save();
        const platformUpdatedData = await pmsPlatformModel.findOneAndUpdate({ _id: id }, {
            $set: {
                platform_name,
                description,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "PMS vendor data updated successfully!",
            data: platformUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_Platform_List
exports.getAllPlatformList = async (req, res) => {
    try {
        const pmsPlatformData = await pmsPlatformModel.aggregate([
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
                    platform_name: 1,
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
        if (!pmsPlatformData) {
            return res.status(500).send({
                succes: true,
                message: "PMS platform data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "PMS platform data list successfully!",
            data: pmsPlatformData
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//DELETE - PMS_vendor_Type_ By-ID
exports.deletePlatformData = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const platformDataDelete = await pmsPlatformModel.findOne({ _id: id });
        if (!platformDataDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await pmsPlatformModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "PMS platform data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};