const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const opsOwnershipModel = require('../../models/Customer&Campaign/opsOwnershipModel');

//POST- OPS_Ownership
exports.createOwnership = async (req, res) => {
    try {
        const checkDuplicacy = await opsOwnershipModel.findOne({ ownership_name: req.body.ownership_name });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "OPS ownership data alredy exist!",
            });
        }
        const { ownership_name, description, created_by, last_updated_by } = req.body;
        const addOwnershipData = new opsOwnershipModel({
            ownership_name: ownership_name,
            description: description,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addOwnershipData.save();
        return res.status(200).json({
            status: 200,
            message: "OPS ownership data added successfully!",
            data: addOwnershipData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - OPS_get_ownership - BY_ID
exports.getOwnershipDetail = async (req, res) => {
    try {
        const ownershipData = await opsOwnershipModel.aggregate([
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
                    ownership_name: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (ownershipData) {
            return res.status(200).json({
                status: 200,
                message: "OPS ownership details successfully!",
                data: ownershipData,
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

//PUT - updateOwnershipType_By-ID
exports.updateOwnershipType = async (req, res) => {
    try {
        const { id } = req.params;
        const { ownership_name, description, created_by, last_updated_by } = req.body;
        const ownershipData = await opsOwnershipModel.findOne({ _id: id });
        if (!ownershipData) {
            return res.send("Invalid Ownership-type Id...");
        }
        await ownershipData.save();
        const ownershipUpdatedData = await opsOwnershipModel.findOneAndUpdate({ _id: id }, {
            $set: {
                ownership_name,
                description,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "OPS ownership type data updated successfully!",
            data: ownershipUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - OPS_Ownership_List
exports.getOwnershipList = async (req, res) => {
    try {
        const ownershipData = await opsOwnershipModel.aggregate([
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
                    _id: 1,
                    ownership_name: 1,
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
        if (!ownershipData) {
            return res.status(500).send({
                succes: true,
                message: "OPS ownership type data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "OPS ownership type data list successfully!",
            data: ownershipData
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//DELETE - OPS_Ownership- By-ID
exports.deleteOwnership = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const ownershipData = await opsOwnershipModel.findOne({ _id: id });
        if (!ownershipData) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await opsOwnershipModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "OPS ownership data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};