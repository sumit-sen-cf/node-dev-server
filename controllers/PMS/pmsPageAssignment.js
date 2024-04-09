const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const moment = require('moment');
const pmsPageAssignmentModel = require('../../models/PMS/pmsPageAssignment');
const pmsPageAssignmentHistoryModel = require('../../models/PMS/pmsPageAssignmentHistory');

//POST- pms page assignment
exports.createPageAssignment = async (req, res) => {
    try {
        const checkDuplicacy = await pmsPageAssignmentModel.findOne({
            page_id: req.body.page_id,
            assignment_to: req.body.assignment_to,
        });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "PMS page-assignment in page id alredy assign to same user!",
            });
        }
        const pageAssignmentData = new pmsPageAssignmentModel({
            page_id: req.body.page_id,
            assignment_by: req.body.assignment_by,
            assignment_to: req.body.assignment_to,
            description: req.body.description,
            created_by: req.body.created_by,
            last_updated_by: req.body.last_updated_by
        });

        //data save in DB collection
        const saveData = await pageAssignmentData.save();

        //if data is save successfully then stored in history
        if (saveData) {
            //current date find
            const currentDate = new Date();
            let historyDataObj = {
                page_id: saveData.page_id,
                assignment_by: saveData.assignment_by,
                assignment_to: saveData.assignment_to,
                start_date: currentDate,
            }

            //pms page assignment history data create in DB collection
            await pmsPageAssignmentHistoryModel.create(historyDataObj);
        }
        return res.status(200).json({
            status: 200,
            message: "PMS page-assignment data added successfully!",
            data: pageAssignmentData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//PUT - update pms page assignment_By-ID
exports.updatePageAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const pageAssignmentData = await pmsPageAssignmentModel.findOne({ _id: id });
        if (!pageAssignmentData) {
            return res.send("Invalid page Assignment Id...");
        }
        const pageAssignmentUpdated = await pmsPageAssignmentModel.findOneAndUpdate({
            _id: id
        }, {
            $set: {
                page_id: req.body.page_id,
                assignment_by: req.body.assignment_by,
                assignment_to: req.body.assignment_to,
                description: req.body.description,
                created_by: req.body.created_by,
                last_updated_by: req.body.last_updated_by
            }
        }, {
            new: true
        });

        let pageId = Number(req.body && req.body.page_id) || 0;
        let assignmentTo = Number(req.body && req.body.assignment_to) || 0;

        const pageAssignmentHistoryData = await pmsPageAssignmentHistoryModel.findOne({
            page_id: pageAssignmentData.page_id,
            assignment_to: pageAssignmentData.assignment_to
        })

        if (pageAssignmentHistoryData && pageAssignmentHistoryData.page_id == pageId && pageAssignmentHistoryData.assignment_to == assignmentTo && pageAssignmentUpdated) {
            const start_date = moment((pageAssignmentHistoryData && pageAssignmentHistoryData.start_date));
            const end_date = moment(new Date());

            //days find end and start date to
            let days = end_date.diff(start_date, 'days');

            await pmsPageAssignmentHistoryModel.findOneAndUpdate({
                page_id: pageAssignmentData.page_id,
                assignment_to: pageAssignmentData.assignment_to
            }, {
                $set: {
                    engagement_duration: days,
                    end_date: end_date,
                }
            })
        } else {
            //current date find
            const currentDate = new Date();
            let historyDataObj = {
                page_id: pageId,
                assignment_by: req.body.assignment_by,
                assignment_to: assignmentTo,
                start_date: currentDate,
            }

            //pms page assignment history data create in DB collection
            await pmsPageAssignmentHistoryModel.create(historyDataObj);
        }
        //return success response send
        return res.status(200).json({
            message: "PMS page-assignment data updated successfully!",
            data: pageAssignmentUpdated,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - pms page assignment-By-ID
exports.getPageAssignmentDetail = async (req, res) => {
    try {
        const pmsPageAssignmentData = await pmsPageAssignmentModel.aggregate([{
            $match: {
                _id: mongoose.Types.ObjectId(req.params.id)
            }
        }, {
            $lookup: {
                from: "usermodels",
                localField: "assignment_by",
                foreignField: "user_id",
                as: "assignmentByUserData",
            }
        }, {
            $unwind: {
                path: "$assignmentByUserData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "usermodels",
                localField: "assignment_to",
                foreignField: "user_id",
                as: "assignmentToUserData",
            }
        }, {
            $unwind: {
                path: "$assignmentToUserData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "usermodels",
                localField: "created_by",
                foreignField: "user_id",
                as: "createdByUserData",
            }
        }, {
            $unwind: {
                path: "$createdByUserData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "pmspagemasts",
                localField: "page_id",
                foreignField: "pageMast_id",
                as: "pageData",
            }
        }, {
            $unwind: {
                path: "$pageData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $project: {
                page_id: 1,
                assignment_by: 1,
                assignment_to: 1,
                created_by: 1,
                page_id_name: "$pageData.page_user_name",
                assignment_by_name: "$assignmentByUserData.user_name",
                assignment_to_name: "$assignmentToUserData.user_name",
                created_by_name: "$createdByUserData.user_name",
                description: 1,
                last_updated_by: 1,
            }
        }])
        //success response send
        return res.status(200).json({
            status: 200,
            message: "PMS page Assignment details get successfully!",
            data: pmsPageAssignmentData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - pms page assignment_List
exports.getPageAssignmentList = async (req, res) => {
    try {
        const pmsPageAssignmentData = await pmsPageAssignmentModel.aggregate([{
            $lookup: {
                from: "usermodels",
                localField: "assignment_by",
                foreignField: "user_id",
                as: "assignmentByUserData",
            }
        }, {
            $unwind: {
                path: "$assignmentByUserData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "usermodels",
                localField: "assignment_to",
                foreignField: "user_id",
                as: "assignmentToUserData",
            }
        }, {
            $unwind: {
                path: "$assignmentToUserData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "usermodels",
                localField: "created_by",
                foreignField: "user_id",
                as: "createdByUserData",
            }
        }, {
            $unwind: {
                path: "$createdByUserData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "pmspagemasts",
                localField: "page_id",
                foreignField: "pageMast_id",
                as: "pageData",
            }
        }, {
            $unwind: {
                path: "$pageData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $project: {
                page_id: 1,
                assignment_by: 1,
                assignment_to: 1,
                created_by: 1,
                page_id_name: "$pageData.page_user_name",
                assignment_by_name: "$assignmentByUserData.user_name",
                assignment_to_name: "$assignmentToUserData.user_name",
                created_by_name: "$createdByUserData.user_name",
                description: 1,
                last_updated_by: 1,
            }
        }])

        //check data is not find
        if (!pmsPageAssignmentData) {
            return res.status(500).send({
                succes: true,
                message: "PMS page-assignment data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "PMS page-assignment data list get successfully!",
            data: pmsPageAssignmentData
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//DELETE - pms page assignment-By-ID
exports.deletePageAssignmentData = async (req, res) => {
    try {
        const { id } = req.params;
        const pageAssignmentData = await pmsPageAssignmentModel.findOne({ _id: id });
        if (!pageAssignmentData) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await pmsPageAssignmentModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "PMS page-assignment data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - pms page assignment History _List
exports.getPageAssignmentHistoryList = async (req, res) => {
    try {
        const pmsPageAssignmentHistoryData = await pmsPageAssignmentHistoryModel.aggregate([{
            $lookup: {
                from: "usermodels",
                localField: "assignment_by",
                foreignField: "user_id",
                as: "assignmentByUserData",
            }
        }, {
            $unwind: {
                path: "$assignmentByUserData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "usermodels",
                localField: "assignment_to",
                foreignField: "user_id",
                as: "assignmentToUserData",
            }
        }, {
            $unwind: {
                path: "$assignmentToUserData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "pmspagemasts",
                localField: "page_id",
                foreignField: "pageMast_id",
                as: "pageData",
            }
        }, {
            $unwind: {
                path: "$pageData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $project: {
                page_id: 1,
                assignment_by: 1,
                assignment_to: 1,
                engagement_duration: 1,
                start_date: 1,
                end_date: 1,
                page_id_name: "$pageData.page_user_name",
                assignment_by_name: "$assignmentByUserData.user_name",
                assignment_to_name: "$assignmentToUserData.user_name",
            }
        }])

        //check data is not find
        if (!pmsPageAssignmentHistoryData) {
            return res.status(500).send({
                succes: true,
                message: "PMS page-assignment History data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "PMS page-assignment History data list get successfully!",
            data: pmsPageAssignmentHistoryData
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};