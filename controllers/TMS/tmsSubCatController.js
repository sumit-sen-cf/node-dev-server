const response = require('../../common/response');
const tmsSubCatModel = require('../../models/TMS/tmsSubCatMastModel');
const { message } = require("../../common/message")
const mongoose = require("mongoose");

//POST- TmsSubCatMast
exports.createTmsSubCatMast = async (req, res) => {
    try {
        const checkDuplicacy = await tmsSubCatModel.findOne({ sub_cat_name: req.body.sub_cat_name });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: message.TMS_SUB_CATEGORY_ALREDY_EXIST,
            });
        }
        const { cat_id, sub_cat_name, description, created_date_time, created_by, last_updated_date, last_updated_by } = req.body;
        const subCatDataAdded = new tmsSubCatModel({
            cat_id: cat_id,
            sub_cat_name: sub_cat_name,
            description: description,
            created_date_time: created_date_time,
            created_by: created_by,
            last_updated_date: last_updated_date,
            last_updated_by: last_updated_by
        });
        await subCatDataAdded.save();
        return res.status(200).json({
            status: 200,
            message: message.TMS_SUB_CATEGORY_ADDED,
            data: subCatDataAdded,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - TmsCatMast By ID
exports.getTmsSubCatMast = async (req, res) => {
    try {
        const tmsSubCatData = await tmsSubCatModel.aggregate([
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
                    sub_cat_name: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])

        if (tmsSubCatData) {
            return res.status(200).json({
                status: 200,
                message: message.TMS_CATEGORY_DETAILS,
                data: tmsSubCatData,
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
exports.updateTmsSubCatMast = async (req, res) => {
    try {
        const { id } = req.params;
        const { sub_cat_name, description, created_date_time, created_by, last_updated_date, last_updated_by } = req.body;
        const catMastData = await tmsSubCatModel.findOne({ _id: id });
        if (!catMastData) {
            return res.send("Invalid Sub_Category Id...");
        }
        await catMastData.save();
        const catMastUpdatedData = await tmsSubCatModel.findOneAndUpdate({ _id: id }, {
            $set: {
                sub_cat_name,
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
            message: message.TMS_SUB_CATEGORY_UPDATED,
            data: catMastUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - TMS_Sub-cat_catList
exports.getAllTmsSubCatMast = async (req, res) => {
    try {
        const tmsSubCat_CatData = await tmsSubCatModel.aggregate([
            {
                $lookup: {
                    from: "tmscatmastmodels",
                    localField: "cat_id",
                    foreignField: "_id",
                    as: "tmscatmast",
                },
            },
            {
                $unwind: "$tmscatmast",
            },
            {
                $project: {
                    cat_id: 1,
                    cat_name: "$tmscatmast.cat_name",
                    sub_cat_name: "$sub_cat_name",
                    description: "$description",
                    cat_description: "$cat.description",
                }
            }
        ])
        if (!tmsSubCat_CatData) {
            return res.status(404).send({
                succes: true,
                message: message.TMS_SUB_CATEGORY_REQUEST_LIST,
            });
        }
        res.status(200).send({
            succes: true,
            message: message.TMS_SUB_CATEGORY_LIST,
            data: tmsSubCat_CatData
        });
    } catch (err) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - ALLSubCatList - Logged in User
exports.getAllTmsSubCatList = async (req, res) => {
    try {
        const tmsSubCatData = await tmsSubCatModel.aggregate([
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
                    sub_cat_name: 1,
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
        if (!tmsSubCatData) {
            return res.status(404).send({
                succes: true,
                message: message.TMS_SUB_CATEGORY_LOGGED_USER_REQUEST,
            });
        }
        res.status(200).send({
            succes: true,
            message: message.TMS_SUB_CATEGORY_LOGGED_USER,
            data: tmsSubCatData
        });
    } catch (err) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//DELETE - TmsSub-CatMast By ID
exports.deleteTmsSubCatMast = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const dataSubCatMastDelete = await tmsSubCatModel.findOne({ _id: id });
        if (!dataSubCatMastDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await tmsSubCatModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: message.TMS_SUB_CATEGORY_DELETED,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};