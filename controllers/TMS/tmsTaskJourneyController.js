const response = require('../../common/response');
const tmsTaskJourneyModel = require('../../models/TMS/tmsTaskJourneyModel');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const vari = require("../../variables.js");
const { storage } = require('../../common/uploadFile.js');
const constant = require('../../common/constant.js');

//POST- TMS_Task_Journey
exports.createTmsTaskJourney = async (req, res) => {
    try {
        const { sub_status_id, journey_type, message, created_date_time, created_by, } = req.body;
        const addTaskJourney = new tmsTaskJourneyModel({
            sub_status_id: sub_status_id,
            journey_type: journey_type,
            message: message,
            created_date_time: created_date_time,
            created_by: created_by,
        });
        if (req.file) {
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);
            const blob = bucket.file(req.file.originalname);
            addTaskJourney.attachments = blob.name;
            const blobStream = blob.createWriteStream();
            blobStream.on("finish", () => {
            });
            blobStream.end(req.file.buffer);
        }
        await addTaskJourney.save();
        return res.status(200).json({
            status: 200,
            message: "Task journey data added!",
            data: addTaskJourney,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - TmsSub-Status_Mast-By ID
exports.getTmsTaskJourney = async (req, res) => {
    try {
        const tmstaskJourneyData = await tmsTaskJourneyModel.aggregate([
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
                    journey_type: 1,
                    message: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    attachments: 1,
                    data_image: {
                        $cond: {
                            if: { $ne: ['$attachments', null] },
                            then: {
                                $concat: [
                                    `${constant.local_base_url}`,
                                    '$attachments'
                                ]
                            },
                            else: null
                        }
                    },
                },
            },
        ])
        if (tmstaskJourneyData) {
            return res.status(200).json({
                status: 200,
                message: "Task journey details successfully added!",
                data: tmstaskJourneyData,
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

//GET - TMSTask-Journey- CreatedBy(Logged in user)
exports.getAllTmsTaskJourney = async (req, res) => {
    try {
        const tmsTaskJourneyData = await tmsTaskJourneyModel.aggregate([
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
                    task_journey_id: 1,
                    sub_status_id: 1,
                    status_id: 1,
                    journey_type: 1,
                    message: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    attachments: 1,
                    data_image: {
                        $cond: {
                            if: { $ne: ['$attachments', null] },
                            then: {
                                $concat: [
                                    `${constant.local_base_url}`,
                                    '$attachments'
                                ]
                            },
                            else: null
                        }
                    },
                }
            }
        ])
        if (!tmsTaskJourneyData) {
            return res.status(403).send({
                succes: true,
                message: "Task journey logged user request not found!",
            });
        }
        res.status(200).send({
            succes: true,
            message: "Task journey logged user list successfully!",
            data: tmsTaskJourneyData
        });
    } catch (err) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - TMSSub-Status-List
exports.getAllTmsTaskJourneyList = async (req, res) => {
    try {
        const tmsTaskJourneyList = await tmsTaskJourneyModel.aggregate([
            {
                $lookup: {
                    from: "tmssubstatusmasts",
                    localField: "sub_status_id",
                    foreignField: "_id",
                    as: "tmssubstatus",
                },
            },
            {
                $unwind: {
                    path: "$tmssubstatus",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    journey_type: "$journey_type",
                    message: "$message",
                    sub_status_name: "$tmssubstatus.sub_status_name",
                    dept_id: "$tmssubstatus.dept_id",
                    description: "$tmssubstatus.description",
                    attachments: 1,
                    data_image: {
                        $cond: {
                            if: { $ne: ['$attachments', null] },
                            then: {
                                $concat: [
                                    `${constant.local_base_url}`,
                                    '$attachments'
                                ]
                            },
                            else: null
                        }
                    },
                }
            },
        ])
        if (!tmsTaskJourneyList) {
            return res.status(404).send({
                succes: true,
                message: "Task journey request list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "Task journey list successfully!",
            data: tmsTaskJourneyList
        });
    } catch (err) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//DELETE - TmsSub-StatusMast By ID
exports.deleteTaskJourney = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const dataTaskJourney = await tmsTaskJourneyModel.findOne({ _id: id });
        if (!dataTaskJourney) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await tmsTaskJourneyModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Task data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};