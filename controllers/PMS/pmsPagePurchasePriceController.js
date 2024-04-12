const pmsPagePurchasePriceModel = require("../../models/PMS/pmsPagePurchasePriceModel");
const { message } = require("../../common/message");
const mongoose = require("mongoose");

exports.createPagePurchasePrice = async (req, res) => {
    try {
        const checkDuplicacy = await pmsPagePurchasePriceModel.findOne({
            platform_id: req.body.platform_id,
        });
        console.log("checkDuplicacy", checkDuplicacy)
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "PMS platform_id data alredy exist!",
            });
        }
        const { platform_id, pageMast_id, price_type_id, price_cal_type, variable_type, purchase_price, description, created_by, last_updated_by } = req.body;
        const addPagePurchasePriceData = new pmsPagePurchasePriceModel({
            platform_id: platform_id,
            pageMast_id: pageMast_id,
            price_type_id: price_type_id,
            price_cal_type: price_cal_type,
            variable_type: variable_type,
            purchase_price: purchase_price,
            description: description,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addPagePurchasePriceData.save();
        return res.status(200).json({
            status: 200,
            message: "PMS page purchase price data added successfully!",
            data: addPagePurchasePriceData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};


exports.getPagePurchasePrice = async (req, res) => {
    try {
        const pagePurchasePriceData = await pmsPagePurchasePriceModel.aggregate([
            {
                // $match: { _id: mongoose.Types.ObjectId(req.params.id) },
                $match: { pageMast_id: Number(req.params.id) },
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
                $lookup: {
                    from: "pmspagemasts",
                    localField: "pageMast_id",
                    foreignField: "pageMast_id",
                    as: "pmspagemast",
                },
            },
            {
                $unwind: {
                    path: "$pmspagemast",
                    preserveNullAndEmptyArrays: true,
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
                    platform_price_id: 1,
                    pageMast_id: 1,
                    price_type_id: 1,
                    price_cal_type: 1,
                    variable_type: 1,
                    purchase_price: 1,
                    description: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    PMS_PageMast_data: {
                        pmspageMast_id: "$pmspagemast._id",
                        page_user_name: "$pmspagemast.page_user_name",
                        link: "$pmspagemast.link",
                        platform_id: "$pmspagemast.platform_id",
                        page_catg_id: "$pmspagemast.page_catg_id",
                        tag_category: "$pmspagemast.tag_category",
                        page_level: "$pmspagemast.page_level",
                        page_status: "$pmspagemast.page_status",
                        page_closed_by_user_id: "$user.user_id",
                        page_name_type: "$pmspagemast.page_name_type",
                        content_creation: "$pmspagemast.content_creation",
                        ownership_type: "$pmspagemast.ownership_type",
                        vendorMast_id: "$pmspagemast.vendorMast_id",
                        followers_count: "$pmspagemast.followers_count",
                        profile_type_id: "$pmspagemast.profile_type_id",
                        platform_active_on: "$pmspagemast.platform_active_on",
                        engagment_rate: "$pmspagemast.engagment_rate",
                        description: "$pmspagemast.description",
                        created_by: "$pmspagemast.created_by",
                        created_by_name: "$user.user_name",
                        last_updated_by: "$pmspagemast.last_updated_by",
                    },
                },
            },
            {
                $group: {
                    _id: "$_id",
                    data: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: "$data" }
            }
        ])
        if (pagePurchasePriceData) {
            return res.status(200).json({
                status: 200,
                message: "PMS page purchase price details successfully!",
                data: pagePurchasePriceData,
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

exports.updatePagePurchasePrice = async (req, res) => {
    try {
        const { id } = req.params;
        const { platform_id, pageMast_id, price_type_id, price_cal_type, variable_type, purchase_price, description, created_by, last_updated_by } = req.body;
        const pagePurchasePriceData = await pmsPagePurchasePriceModel.findOne({ _id: id });
        if (!pagePurchasePriceData) {
            return res.send("Invalid page purchase price Id...");
        }
        await pagePurchasePriceData.save();
        const pagePurchasePriceUpdate = await pmsPagePurchasePriceModel.findOneAndUpdate({ _id: id }, {
            $set: {
                platform_id,
                pageMast_id,
                price_type_id,
                price_cal_type,
                variable_type,
                purchase_price,
                description,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "PMS page purchase price data updated successfully!",
            data: pagePurchasePriceUpdate,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};


exports.getPagePurchasePriceList = async (req, res) => {
    try {

        const pagePurchasePriceData = await pmsPagePurchasePriceModel.aggregate([
            {
                $lookup: {
                    from: "pmsplatforms",
                    localField: "platform_id",
                    foreignField: "_id",
                    as: "pmsplatform",
                },
            },
            {
                $unwind: {
                    path: "$pmsplatform",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "pmspagemasts",
                    localField: "pagemast_id",
                    foreignField: "pagemast_id",
                    as: "pmspagemast",
                },
            },
            {
                $unwind: {
                    path: "$pmspagemast",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "pmspricetypes",
                    localField: "price_type_id",
                    foreignField: "_id",
                    as: "pmspricetype",
                },
            },
            {
                $unwind: {
                    path: "$pmspricetype",
                    preserveNullAndEmptyArrays: true,
                },
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
                    platform_id: 1,
                    pageMast_id: 1,
                    price_type_id: 1,
                    price_cal_type: 1,
                    variable_type: 1,
                    purchase_price: 1,
                    description: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    PMS_Platforms_data: {
                        platform_id: "$pmsplatform.platform_id",
                        platform_name: "$pmsplatform.platform_name",
                        description: "$pmsplatform.description",
                        created_by: "$pmsplatform.created_by",
                    },
                    PMS_PageMast_data: {
                        pmspageMast_id: "$pmspagemast._id",
                        page_user_name: "$pmspagemast.page_user_name",
                        link: "$pmspagemast.link",
                        platform_id: "$pmspagemast.platform_id",
                        page_catg_id: "$pmspagemast.page_catg_id",
                        tag_category: "$pmspagemast.tag_category",
                        page_level: "$pmspagemast.page_level",
                        page_status: "$pmspagemast.page_status",
                        page_closed_by_user_id: "$user.user_id",
                        page_name_type: "$pmspagemast.page_name_type",
                        content_creation: "$pmspagemast.content_creation",
                        ownership_type: "$pmspagemast.ownership_type",
                        vendorMast_id: "$pmspagemast.vendorMast_id",
                        followers_count: "$pmspagemast.followers_count",
                        profile_type_id: "$pmspagemast.profile_type_id",
                        platform_active_on: "$pmspagemast.platform_active_on",
                        engagment_rate: "$pmspagemast.engagment_rate",
                        description: "$pmspagemast.description",
                        created_by: "$pmspagemast.created_by",
                        created_by_name: "$user.user_name",
                        last_updated_by: "$pmspagemast.last_updated_by",
                    },
                    PMS_Price_data: {
                        price_type_id: "$pmspricetype._id",
                        platform_id: "$platform._id",
                        price_type: "$pmspricetype.price_type",
                        description: "$pmspricetype.description",
                        created_by: "$pmspricetype.created_by"
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    data: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: "$data" }
            }
        ])
        if (!pagePurchasePriceData) {
            return res.status(500).send({
                succes: true,
                message: "PMS page purchase price data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "PMS page purchase price data list successfully!",
            data: pagePurchasePriceData
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

exports.getAllPagePurchasePriceList = async (req, res) => {
    try {

        const pagePurchasePriceGetData = await pmsPagePurchasePriceModel.aggregate([
            {
                // $match: { _id: mongoose.Types.ObjectId(req.params.id) },
                $match: { platform_id: mongoose.Types.ObjectId(req.params.id) },
            },
            {
                $lookup: {
                    from: "pmsplatforms",
                    localField: "platform_id",
                    foreignField: "_id",
                    as: "pmsplatform",
                },
            },
            {
                $unwind: {
                    path: "$pmsplatform",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "pmspricetypes",
                    localField: "price_type_id",
                    foreignField: "_id",
                    as: "pmspricetype",
                },
            },
            {
                $unwind: {
                    path: "$pmspricetype",
                    preserveNullAndEmptyArrays: true,
                },
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
                $lookup: {
                    from: "pmsplatforms", // Lookup again in the pmsplatforms collection
                    localField: "pmspricetype.platform_id", // Use the platform_id from pmspricetypes
                    foreignField: "_id",
                    as: "platform",
                },
            },
            {
                $unwind: {
                    path: "$platform",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    platform_id: 1,
                    pageMast_id: 1,
                    price_type_id: 1,
                    price_cal_type: 1,
                    variable_type: 1,
                    purchase_price: 1,
                    description: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    PMS_Platforms_data: {
                        platform_id: "$pmsplatform.platform_id",
                        platform_name: "$pmsplatform.platform_name",
                        description: "$pmsplatform.description",
                        created_by: "$pmsplatform.created_by",
                        price_type_id: "$pmspricetype._id",
                        price_type: "$pmspricetype.price_type",
                        description: "$pmspricetype.description",
                        created_by: "$pmspricetype.created_by"
                    },
                    PMS_Price_data: {
                        price_type_id: "$pmspricetype._id",
                        price_type: "$pmspricetype.price_type",
                        platform_id: "$platform_id",
                        platform_name: "$pmsplatform.platform_name",
                        description: "$pmspricetype.description",
                        created_by: "$pmspricetype.created_by"
                    }
                }
            },
            {
                $group: {
                    _id: "$pmspricetype.price_type_id",
                    data: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: "$data" }
            }
        ])
        if (!pagePurchasePriceGetData) {
            return res.status(500).send({
                succes: true,
                message: "PMS all page purchase price data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "PMS all page purchase price data list successfully!",
            data: pagePurchasePriceGetData
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};



exports.deletePagePurchasePriceData = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const pagePurchasePriceData = await pmsPagePurchasePriceModel.findOne({ _id: id });
        if (!pagePurchasePriceData) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await pmsPagePurchasePriceModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "PMS page purchase price data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};



exports.getAllPagePurchasePriceList = async (req, res) => {
    try {

        const pagePurchasePriceGetData = await pmsPagePurchasePriceModel.aggregate([
            // {
            //     // $match: { _id: mongoose.Types.ObjectId(req.params.id) },
            //     $match: { platform_id: mongoose.Types.ObjectId(req.params.id) },
            // },
            {
                $lookup: {
                    from: "pmsplatforms",
                    localField: "platform_id",
                    foreignField: "_id",
                    as: "pmsplatform",
                },
            },
            {
                $unwind: {
                    path: "$pmsplatform",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "pmspricetypes",
                    localField: "price_type_id",
                    foreignField: "_id",
                    as: "pmspricetype",
                },
            },
            {
                $unwind: {
                    path: "$pmspricetype",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                // $match: { _id: mongoose.Types.ObjectId(req.params.id) },
                $match: { "pmspricetype.platform_id": mongoose.Types.ObjectId(req.params.id) },
            },
            {
                $lookup: {
                    from: "pmsplatforms",
                    localField: "pmspricetype.platform_id",
                    foreignField: "_id",
                    as: "platformModel",
                },
            },
            {
                $unwind: {
                    path: "$platformModel",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    platform_id: 1,
                    pageMast_id: 1,
                    price_type_id: 1,
                    price_cal_type: 1,
                    variable_type: 1,
                    purchase_price: 1,
                    description: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    PMS_Platforms_data: {
                        platform_id: "$pmsplatform.platform_id",
                        platform_name: "$pmsplatform.platform_name",
                        description: "$pmsplatform.description",
                        created_by: "$pmsplatform.created_by",
                        price_type_id: "$pmspricetype._id",
                        price_type: "$pmspricetype.price_type",
                        description: "$pmspricetype.description",
                        created_by: "$pmspricetype.created_by"
                    },
                    PMS_Price_data: {
                        price_type_id: "$pmspricetype._id",
                        price_type: "$pmspricetype.price_type",
                        platform_id: "$pmspricetype.platform_id",
                        platform_name: "$platformModel.platform_name",
                        description: "$pmspricetype.description",
                        created_by: "$pmspricetype.created_by"
                    }
                }
            },
            {
                $group: {
                    _id: "$pmspricetype.price_type_id",
                    data: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: "$data" }
            }
        ])
        return res.status(200).send({
            succes: true,
            message: "PMS all page purchase price data list successfully!",
            data: pagePurchasePriceGetData
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};



exports.deletePagePurchasePriceData = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const pagePurchasePriceData = await pmsPagePurchasePriceModel.findOne({ _id: id });
        if (!pagePurchasePriceData) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await pmsPagePurchasePriceModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "PMS page purchase price data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};