const response = require('../../common/response');
const tmsStatusModel = require('../../models/TMS/tmsStatusMastModel');
const { message } = require("../../common/message");
const mongoose = require("mongoose");

//POST- TmsStatusMast
exports.createTmsStatusMast = async (req, res) => {
    try {
        const checkDuplicacy = await tmsStatusModel.findOne({ status_name: req.body.status_name });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: message.TMS_STATUS_CATEGORY_ALREDY_EXIST,
            });
        }
        const { status_name, dept_id, description, created_date_time, created_by, last_updated_date, last_updated_by } = req.body;
        const dataAdded = new tmsStatusModel({
            status_name: status_name,
            dept_id: dept_id,
            description: description,
            created_date_time: created_date_time,
            created_by: created_by,
            last_updated_date: last_updated_date,
            last_updated_by: last_updated_by
        });
        await dataAdded.save();
        return res.status(200).json({
            status: 200,
            message: message.TMS_STATUS_CATEGORY_ADDED,
            data: dataAdded,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - TmsCatMast By ID
exports.getTmsStatusMast = async (req, res) => {
    try {
        const tmsstatusData = await tmsStatusModel.aggregate([
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
                    status_name: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])

        if (tmsstatusData) {
            return res.status(200).json({
                status: 200,
                message: message.TMS_STATUS_CATEGORY_DETAILS,
                data: tmsstatusData,
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

//PUT - updateTmsStatusMast By ID
exports.updateTmsStatusMast = async (req, res) => {
    try {
        const { id } = req.params;
        const { status_name, dept_id, description, created_date_time, created_by, last_updated_date, last_updated_by } = req.body;
        const statusMastData = await tmsStatusModel.findOne({ _id: id });
        if (!statusMastData) {
            return res.send("Invalid status Id...");
        }
        await statusMastData.save();
        const statusMastUpdatedData = await tmsStatusModel.findOneAndUpdate({ _id: id }, {
            $set: {
                status_name,
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
            message: message.TMS_STATUS_CATEGORY_UPDATED,
            data: statusMastUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - TMSList
exports.getAllTmsStatusMast = async (req, res) => {
    try {
        const tmsStatusMastData = await tmsStatusModel.aggregate([
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
                    status_id: 1,
                    status_name: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_by_name: "$user_data.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                }
            }

        ])
        if (!tmsStatusMastData) {
            return res.status(403).send({
                succes: true,
                message: message.TMS_STATUS_CATEGORY_LOGGED_USER_REQUEST,
            });
        }
        res.status(200).send({
            succes: true,
            message: message.TMS_STATUS_CATEGORY_LOGGED_USER,
            data: tmsStatusMastData
        });
    } catch (err) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - TMSSub-cat_catList
exports.getAllTmsStatusMastList = async (req, res) => {
    try {
        const tmsStatusData = await tmsStatusModel.aggregate([
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
                $project: {
                    status_id: 1,
                    status_name: 1,
                    dept_id: 1,
                    dept_name: "$department.dept_name"
                }
            }

        ])
        if (!tmsStatusData) {
            return res.status(404).send({
                succes: true,
                message: message.TMS_STATUS_CATEGORY_REQUEST_LIST,
            });
        }
        res.status(200).send({
            succes: true,
            message: message.TMS_STATUS_CATEGORY_LIST,
            data: tmsStatusData
        });
    } catch (err) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//DELETE - TmsCatMast By ID
exports.deleteStatusMast = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const dataStatusMastDelete = await tmsStatusModel.findOne({ _id: id });
        if (!dataStatusMastDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await tmsStatusModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: message.TMS_STATUS_CATEGORY_DELETED,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};