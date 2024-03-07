const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const tmsTaskModel = require('../../models/TMS/tmsTaskMastModel');
const vari = require("../../variables.js");
const { storage } = require('../../common/uploadFile.js');
const constant = require('../../common/constant.js');

//POST- TmsSub-StatusMast
exports.addTmsTaskMast = async (req, res) => {
    try {
        const { user_id } = req.body;
        console.log("ddddddddddddddd", req.body, user_id)
        const checkDuplicacy = await tmsTaskModel.findOne({ task_name: req.body.task_name });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "TMS task master already exists!",
            });
        }
        const { cat_id, sub_cat_id, status_id, sub_status_id, task_name, start_date, due_date, assign_to, assign_by,
            ageing, task_health, task_description, task_type, priority, score, } = req.body;
        const taskMastDataAdded = new tmsTaskModel({
            cat_id: cat_id,
            sub_cat_id: sub_cat_id,
            status_id: status_id,
            sub_status_id: sub_status_id,
            task_name: task_name,
            start_date: start_date,
            assign_to: parseInt(assign_to),
            assign_by: assign_by,
            due_date: due_date,
            ageing: ageing,
            task_health: task_health,
            task_description: task_description,
            task_type: task_type,
            priority: priority,
            score: score,
        });
        if (req.file) {
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);
            const blob = bucket.file(req.file.originalname);
            taskMastDataAdded.attachments = blob.name;
            const blobStream = blob.createWriteStream();
            blobStream.on("finish", () => {
            });
            blobStream.end(req.file.buffer);
        }
        await taskMastDataAdded.save();
        return res.status(200).json({
            status: 200,
            message: "Task data added successfully!",
            data: taskMastDataAdded,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - Tms_Task_Mast By ID
exports.getSingleTmsTaskMast = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const getTaskMastDeatails = await tmsTaskModel.findOne({ _id: id });
        if (getTaskMastDeatails) {
            return res.status(200).json({
                status: 200,
                message: "Task data details created successfully!",
                data: getTaskMastDeatails,
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

//PUT - updateTmsTask-Mast By ID
exports.updateTmsTaskMast = async (req, res) => {
    try {
        const { id } = req.params;
        const { task_name, start_date, assign_to, assign_by, due_date,
            ageing, task_health, task_description, task_type, priority, score, } = req.body;
        const taskData = await tmsTaskModel.findOne({ _id: id });
        if (!taskData) {
            return res.send("Invalid task Id...");
        }
        if (req.file) {
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);
            const blob = bucket.file(req.file.originalname);
            taskData.attachments = blob.name;
            const blobStream = blob.createWriteStream();
            blobStream.on("finish", () => {
            });
            blobStream.end(req.file.buffer);
        }
        await taskData.save();
        const taskUpdatedData = await tmsTaskModel.findOneAndUpdate({ _id: id }, {
            $set: {
                // cat_id: cat_id,
                // sub_cat_id: sub_cat_id,
                // status_id: status_id,
                // sub_status_id: sub_status_id,
                task_name: task_name,
                start_date: start_date,
                assign_to: assign_to,
                assign_by: assign_by,
                due_date: due_date,
                ageing: ageing,
                task_health: task_health,
                task_description: task_description,
                task_type: task_type,
                priority: priority,
                score: score,
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "task data updated successfully!",
            data: taskUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - TMS_Task-List
exports.getAllTmsTaskMastList = async (req, res) => {
    try {
        const tmsTaskMastList = await tmsTaskModel.aggregate([
            {
                $lookup: {
                    from: "tmscatmastmodels",
                    localField: "cat_id",
                    foreignField: "_id",
                    as: "tmscatmast",
                },
            },
            {
                $unwind: {
                    path: "$tmscatmast",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "tmssubcatmasts",
                    localField: "sub_cat_id",
                    foreignField: "_id",
                    as: "tmssubcatmast",
                },
            },
            {
                $unwind: {
                    path: "$tmssubcatmast",
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
                $lookup: {
                    from: "tmssubstatusmasts",
                    localField: "sub_status_id",
                    foreignField: "_id",
                    as: "tmssubstatusmast",
                },
            },
            {
                $unwind: {
                    path: "$tmssubstatusmast",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "assign_by",
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
                    task_name: "$task_name",
                    start_date: "$start_date",
                    assign_to: "$assign_to",
                    assign_by: "$assign_by",
                    assign_by_name: "$user_data.user_name",
                    due_date: "$due_date",
                    ageing: "$ageing",
                    task_health: "$task_health",
                    task_description: "$task_description",
                    task_type: "$task_type",
                    priority: "$priority",
                    score: "$score",
                    attachments: "$attachments",
                    data_image: {
                        $cond: {
                            if: { $ne: ['$attachments', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}`,
                                    '$attachments'
                                ]
                            },
                            else: null                    
                        }
                    },
                    cat_data: {
                        cat_id: "$cat_id",
                        cat_name: "$tmscatmast.cat_name",
                        description: "$tmscatmast.description",
                        created_date_time: "$tmscatmast.created_date_time",
                        created_by: "$tmscatmast.created_by",
                        last_updated_date: "$tmscatmast.last_updated_date",
                        last_updated_by: "$tmscatmast.last_updated_by"
                    },
                    sub_cat_data: {
                        sub_cat_id: "$sub_cat_id",
                        sub_cat_name: "$tmssubcatmast.sub_cat_name",
                        sub_cat_description: "$tmssubcatmast.description",
                        created_date_time: "$tmssubcatmast.created_date_time",
                        created_by: "$tmssubcatmast.created_by",
                        last_updated_date: "$tmssubcatmast.last_updated_date",
                        last_updated_by: "$tmssubcatmast.last_updated_by"
                    },
                    status_data: {
                        status_id: "$status_id",
                        status_name: "$tmsstatusmast.status_name",
                        dept_id: "$tmsstatusmast.dept_id",
                        status_description: "$tmsstatusmast.description",
                        status_created_by: "$tmsstatusmast.created_by",
                    },
                    sub_status_data: {
                        sub_status_id: "$sub_status_id",
                        sub_status_dept_id: "$tmssubstatusmast.sub_status_dept_id",
                        sub_status_name: "$tmssubstatusmast.sub_status_name",
                        sub_status_description: "$tmssubstatusmast.description",
                        sub_status_created_date_time: "$tmssubstatusmast.created_date_time",
                        sub_status_created_by: "$tmssubstatusmast.created_by",
                    },
                },
            },
        ])
        const totalTaskList = await tmsTaskModel.countDocuments(tmsTaskMastList);
        if (!totalTaskList) {
            return res.status(404).send({
                succes: true,
                message: "Task data request list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "Task list created successfully!",
            task_data: totalTaskList, tmsTaskMastList
        });
    } catch (err) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//DELETE - TmsTask-Mast By ID
exports.deleteTmsTaskMast = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const dataSubStatusDelete = await tmsTaskModel.findOne({ _id: id });
        if (!dataSubStatusDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await tmsTaskModel.deleteOne({ _id: id });
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
