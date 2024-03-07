const response = require('../../common/response');
const { message } = require("../../common/message");
const tmsCatModel = require('../../models/TMS/tmsCatMastModel');
const mongoose = require("mongoose");

//POST- TmsCatMast
exports.createTmsCatMast = async (req, res) => {
    try {
        const checkDuplicacy = await tmsCatModel.findOne({ cat_name: req.body.cat_name });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: message.TMS_CATEGORY_ALREDY_EXIST,
            });
        }
        const { cat_name, description, created_date_time, created_by, last_updated_date, last_updated_by } = req.body;
        const dataAdded = new tmsCatModel({
            cat_name: cat_name,
            description: description,
            created_date_time: created_date_time,
            created_by: created_by, 
            last_updated_date: last_updated_date,
            last_updated_by: last_updated_by
        });
        await dataAdded.save();
        return res.status(200).json({
            status: 200,
            message: message.TMS_CATEGORY_ADDED,
            data: dataAdded,
        });
    } catch (error) {
        console.log("error--------",error)
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - TmsCatMast By ID
exports.getTmsCatMast = async (req, res) => {
    try {
        const tmsCatData = await tmsCatModel.aggregate([
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
                        cat_id: 1,
                        cat_name: 1,
                        description: 1,
                        created_date_time: 1,
                        created_by: 1,
                        created_by_name: "$user.user_name",
                        last_updated_date: 1,
                        last_updated_by: 1,
                    },
                },
            ])

        if (tmsCatData) {
            return res.status(200).json({
                status: 200,
                message: message.TMS_CATEGORY_DETAILS,
                data: tmsCatData,
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

//PUT - updateTmsCatMast By ID
exports.updateTmsCatMast = async (req, res) => {
    try {
        const { id } = req.params;
        const { cat_name, description, created_date_time, created_by, last_updated_date, last_updated_by } = req.body;
        const catMastData = await tmsCatModel.findOne({ _id: id });
        if (!catMastData) {
            return res.send("Invalid Category Id...");
        }
        await catMastData.save();
        const catMastUpdatedData = await tmsCatModel.findOneAndUpdate({ _id: id }, {
            $set: {
                cat_name,
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
            message: message.TMS_CATEGORY_UPDATED,
            data: catMastUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - TMSList
exports.getAllTmsCatMast = async (req, res) => {
    try {
        const tmsCatMastData = await tmsCatModel.aggregate([
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
                    cat_id: 1,
                    cat_name: 1,
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
        if (!tmsCatMastData) {
            return res.status(500).send({
                succes: true,
                message: message.TMS_CATEGORY_LOGGED_USER_REQUEST,
            });
        }
        res.status(200).send({
            succes: true,
            message: message.TMS_CATEGORY_LOGGED_USER,
            data: tmsCatMastData
        });
    } catch (err) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//DELETE - TmsCatMast By ID
exports.deleteTmsCatMast = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const dataCatMastDelete = await tmsCatModel.findOne({ _id: id });
        if (!dataCatMastDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await tmsCatModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: message.TMS_CATEGORY_DELETED,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};