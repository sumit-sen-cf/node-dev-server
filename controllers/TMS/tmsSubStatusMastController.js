const response = require('../../common/response');
const tmsSubStatusModel = require('../../models/TMS/tmsSubStatusMastModel');
const { message } = require("../../common/message");
const mongoose = require("mongoose");

//POST- TmsSub-StatusMast
exports.createTmsSubStatusMast = async (req, res) => {
    try {
        const checkDuplicacy = await tmsSubStatusModel.findOne({ sub_status_name: req.body.sub_status_name });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: message.TMS_SUB_STATUS_ALREDY_EXIST,
            });
        }
        const { status_id, sub_status_name, dept_id, description, created_date_time, created_by, last_updated_date, last_updated_by } = req.body;
        const subStatusDataAdded = new tmsSubStatusModel({
            sub_status_name: sub_status_name,
            status_id: status_id,
            dept_id: dept_id,
            description: description,
            created_date_time: created_date_time,
            created_by: created_by,
            last_updated_date: last_updated_date,
            last_updated_by: last_updated_by
        });
        await subStatusDataAdded.save();
        return res.status(200).json({
            status: 200,
            message: message.TMS_SUB_STATUS_ADDED,
            data: subStatusDataAdded,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - TmsSub-Status_Mast By ID
exports.getTmsSubStatusMast = async (req, res) => {
    try {
        const tmssubstatusData = await tmsSubStatusModel.aggregate([
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
                }

            },
            {
                $project: {
                    sub_status_name: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (tmssubstatusData) {
            return res.status(200).json({
                status: 200,
                message: message.TMS_SUB_STATUS_DETAILS,
                data: tmssubstatusData,
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

//PUT - updateTmsSub-StatusMast By ID
exports.updateTmsSubStatusMast = async (req, res) => {
    try {
        const { id } = req.params;
        const { sub_status_name, dept_id, description, created_date_time, created_by, last_updated_date, last_updated_by } = req.body;
        const subStatusData = await tmsSubStatusModel.findOne({ _id: id });
        if (!subStatusData) {
            return res.send("Invalid sub-status Id...");
        }
        await subStatusData.save();
        const subStatusUpdatedData = await tmsSubStatusModel.findOneAndUpdate({ _id: id }, {
            $set: {
                sub_status_name,
                dept_id,
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
            message: message.TMS_SUB_STATUS_UPDATED,
            data: subStatusUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - TMSSub-StatusList- CreatedBy(Logged in user)
exports.getAllTmsSubStatusMast = async (req, res) => {
    try {
        const tmsSubStatusMastData = await tmsSubStatusModel.aggregate([
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
                    sub_status_id: 1,
                    status_id: 1,
                    sub_status_name: 1,
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
        if (!tmsSubStatusMastData) {
            return res.status(403).send({
                succes: true,
                message: message.TMS_SUB_STATUS_LOGGED_USER_REQUEST,
            });
        }
        res.status(200).send({
            succes: true,
            message: message.TMS_SUB_STATUS_LOGGED_USER,
            data: tmsSubStatusMastData
        });
    } catch (err) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - TMSSub-Status-List
exports.getAllTmsSubStatusMastList = async (req, res) => {
    try {
        const tmsSubStatusList = await tmsSubStatusModel.aggregate([
            {
                $lookup: {
                    from: "departmentmodels",
                    localField: "dept_id",
                    foreignField: "dept_id",
                    as: "department",
                },
            },
            {
                $unwind: {
                    path: "$department",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "tmsstatusmastmodels",
                    localField: "status_id",
                    foreignField: "_id",
                    as: "tmsstatusmast",
                },
            },
            {
                $unwind: {
                    path: "$tmsstatusmast",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    status_id: 1,
                    status_name: "$tmsstatusmast.status_name",
                    sub_status_id: 1,
                    sub_status_name: 1,
                    dept_id: 1,
                    dept_name: "$department.dept_name"
                }
            },
        ])
        if (!tmsSubStatusList) {
            return res.status(404).send({
                succes: true,
                message: message.TMS_SUB_STATUS_REQUEST_LIST,
            });
        }
        return res.status(200).send({
            succes: true,
            message: message.TMS_SUB_STATUS_LIST,
            data: tmsSubStatusList
        });
    } catch (err) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//DELETE - TmsSub-StatusMast By ID
exports.deleteSubStatusMast = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const dataSubStatusDelete = await tmsSubStatusModel.findOne({ _id: id });
        if (!dataSubStatusDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await tmsSubStatusModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: message.TMS_SUB_STATUS_DELETED,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};