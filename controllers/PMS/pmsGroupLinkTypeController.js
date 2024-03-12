const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const pmsGroupLinkTypeModel = require('../../models/PMS/pmsGroupLinkTypeModel');

//POST- PMS_Pay_Cycle
exports.createGroupLink = async (req, res) => {
    try {
        const checkDuplicacy = await pmsGroupLinkTypeModel.findOne({ link_type: req.body.link_type });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "PMS group link type data alredy exist!",
            });
        }
        const { link_type, description, created_by, last_updated_by } = req.body;
        const addGroupLinkData = new pmsGroupLinkTypeModel({
            link_type: link_type,
            description: description,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addGroupLinkData.save();
        return res.status(200).json({
            status: 200,
            message: "PMS group link type data added successfully!",
            data: addGroupLinkData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_group link type-By-ID
exports.getGroupLinkDetail = async (req, res) => {
    try {
        const pmsGroupLinkData = await pmsGroupLinkTypeModel.aggregate([
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
                    group_type_id: 1,
                    link_type: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (pmsGroupLinkData) {
            return res.status(200).json({
                status: 200,
                message: "PMS group link type details successfully!",
                data: pmsGroupLinkData,
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

//PUT - updateGroupLinkType_By-ID
exports.updateGroupLink = async (req, res) => {
    try {
        const { id } = req.params;
        const { link_type, description, created_by, last_updated_by } = req.body;
        const groupLinkData = await pmsGroupLinkTypeModel.findOne({ _id: id });
        if (!groupLinkData) {
            return res.send("Invalid group-link Id...");
        }
        await groupLinkData.save();
        const groupLinkUpdatedData = await pmsGroupLinkTypeModel.findOneAndUpdate({ _id: id }, {
            $set: {
                link_type,
                description,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "PMS group link data updated successfully!",
            data: groupLinkUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_GroupLink_List
exports.getAllGroupLinkList = async (req, res) => {
    try {
        const pmsGroupLinkData = await pmsGroupLinkTypeModel.aggregate([
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
                    link_type: 1,
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
        if (!pmsGroupLinkData) {
            return res.status(500).send({
                succes: true,
                message: "PMS group link type data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "PMS group link type data list successfully!",
            data: pmsGroupLinkData
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//DELETE - PMS_GroupLink-By-ID
exports.deleteGroupLinkData = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const groupLinkDataDelete = await pmsGroupLinkTypeModel.findOne({ _id: id });
        if (!groupLinkDataDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await pmsGroupLinkTypeModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "PMS group link type data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};