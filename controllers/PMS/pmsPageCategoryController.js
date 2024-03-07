const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const pmsPageCategoryModel = require('../../models/PMS/pmsPageCategoryModel');

//POST- PMS_Pay_Method
exports.createPageCatg = async (req, res) => {
    try {
        const checkDuplicacy = await pmsPageCategoryModel.findOne({ page_category: req.body.page_category });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "PMS page-category data alredy exist!",
            });
        }
        const { page_category, description, created_date_time, created_by, last_updated_date, last_updated_by } = req.body;
        const pageCategoryData = new pmsPageCategoryModel({
            page_category: page_category,
            description: description,
            created_date_time: created_date_time,
            created_by: created_by,
            last_updated_date: last_updated_date,
            last_updated_by: last_updated_by
        });
        await pageCategoryData.save();
        return res.status(200).json({
            status: 200,
            message: "PMS page-category data added successfully!",
            data: pageCategoryData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_Page_Catg-By-ID
exports.getPageCatgDetail = async (req, res) => {
    try {
        const pmsPageCatgData = await pmsPageCategoryModel.aggregate([
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
                    page_category: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (pmsPageCatgData) {
            return res.status(200).json({
                status: 200,
                message: "PMS page-category details successfully!",
                data: pmsPageCatgData,
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

//PUT - updatePageCatg_By-ID
exports.updatePageCatg = async (req, res) => {
    try {
        const { id } = req.params;
        const { page_category, description, created_date_time, created_by, last_updated_date, last_updated_by } = req.body;
        const pageCatgData = await pmsPageCategoryModel.findOne({ _id: id });
        if (!pageCatgData) {
            return res.send("Invalid page-Catg Id...");
        }
        await pageCatgData.save();
        const pageCatgUpdated = await pmsPageCategoryModel.findOneAndUpdate({ _id: id }, {
            $set: {
                page_category,
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
            message: "PMS page-catg data updated successfully!",
            data: pageCatgUpdated,
        });
    } catch (error) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_Page_Category_List
exports.getPageCatgList = async (req, res) => {
    try {
        const pmsPageCatgData = await pmsPageCategoryModel.aggregate([
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
                    page_category: 1,
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
        if (!pmsPageCatgData) {
            return res.status(500).send({
                succes: true,
                message: "PMS page-catg data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "PMS page-catg data list successfully!",
            data: pmsPageCatgData
        });
    } catch (err) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//DELETE - PMS_Page_Catg-By-ID
exports.deletePageCatgData = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const pageCatgData = await pmsPageCategoryModel.findOne({ _id: id });
        if (!pageCatgData) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await pmsPageCategoryModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "PMS page-catg data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};