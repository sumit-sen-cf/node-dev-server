const response = require("../../common/response.js");
const pageTagCategoryModel = require("../../models/PMS2/pageTagCategoryModel.js");
const mongoose = require("mongoose");
const constant = require("../../common/constant");

exports.addTagCategory = async (req, res) => {
    try {

        const pageCat = new pageTagCategoryModel({
            page_id: req.body.page_id,
            page_name: req.body.page_name,
            page_category_id: req.body.page_category_id,
            created_by: req.body.created_by
        });

        const pageCatData = await pageCat.save();

        return response.returnTrue(
            200,
            req,
            res,
            "page Tag category created successfully",
            pageCatData
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getPageTagCategory = async (req, res) => {
    try {
        const pageTagCatData = await pageTagCategoryModel
            .aggregate([
                {
                    $lookup: {
                        from: "pms2pagecategorymodels",
                        localField: "page_category_id",
                        foreignField: "_id",
                        as: "pageCatData",
                    },
                },
                {
                    $unwind: {
                        path: "$pageCatData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "created_by",
                        foreignField: "user_id",
                        as: "userCreatedData",
                    },
                },
                {
                    $unwind: {
                        path: "$userCreatedData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        page_id: 1,
                        page_name: 1,
                        page_category_id: 1,
                        page_category_name: "$pageCatData.page_category",
                        created_by: 1,
                        created_by_name: "$userCreatedData.user_name"
                    },
                },
                {
                    $group: {
                        _id: "$page_name",
                        pages: { $push: "$$ROOT" }
                    },
                },
                {
                    $project: {
                        _id: 0,
                        page_id: "$_id",
                        pages: 1
                    }
                }
            ]);
        const formattedResult = pageTagCatData.map(item => ({
            [item.page_id]: item.pages
        }));

        if (formattedResult.length === 0) {
            return response.returnFalse(200, req, res, "No Record Found...", []);
        }

        res.status(200).send(formattedResult);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getSinglePageTagCategory = async (req, res) => {
    try {
        const pageTagCatSingleData = await addPlanXLogModel
            .aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.params.id)
                    }
                },
                {
                    $lookup: {
                        from: "pms2pagecategorymodels",
                        localField: "page_category_id",
                        foreignField: "_id",
                        as: "pageCatData",
                    },
                },
                {
                    $unwind: {
                        path: "$pageCatData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "created_by",
                        foreignField: "user_id",
                        as: "userCreatedData",
                    },
                },
                {
                    $unwind: {
                        path: "$userCreatedData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        page_id: 1,
                        page_name: 1,
                        page_category_id: 1,
                        page_category_name: "$pageCatData.page_category",
                        created_by: 1,
                        created_by_name: "$userCreatedData.user_name"
                    },
                },
            ]);
        if (!pageTagCatSingleData) {
            return response.returnFalse(200, req, res, "No Record Found...", []);
        }
        res.status(200).send(pageTagCatSingleData)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.editPageTagCategory = async (req, res) => {
    try {
        const { page_id, page_name, page_category_id, created_by, last_updated_by } = req.body;

        const existingPage = await pageTagCategoryModel.find({ page_name });

        if (existingPage) {
            await pageTagCategoryModel.updateMany(
                { page_name },
                { $set: { status: constant.DELETED } }
            );
        }

        if (Array.isArray(page_category_id) && page_category_id.length > 0) {
            for (const categoryId of page_category_id) {
                const newPageTagData = new pageTagCategoryModel({
                    page_id,
                    page_name,
                    page_category_id: categoryId,
                    created_by,
                    last_updated_by
                });
                await newPageTagData.save();
            }
        }

        return response.returnTrue(
            200,
            req,
            res,
            "Page Category Data Updated and New Categories Inserted Successfully",
            {}
        );

    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.deletePageTagcategory = async (req, res) => {
    pageTagCategoryModel.deleteOne({ _id: req.params.id }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'Page Tag Category Data Deleted Successfully' })
        } else {
            return res.status(404).json({ success: false, message: 'Page Tag Category Data not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err.message })
    })
};