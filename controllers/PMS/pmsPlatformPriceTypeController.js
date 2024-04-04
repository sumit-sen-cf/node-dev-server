const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const pmsPlatformPriceModel = require('../../models/PMS/pmsPlatformPriceTypeModel');

//POST- PMS_Platform_Price
exports.createPlatformPrice = async (req, res) => {
    try {
        const checkDuplicacy = await pmsPlatformPriceModel.findOne({
            platform_id: req.body.platform_id,
            price_type_id: req.body.price_type_id
        });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "PMS platform-price alredy exist!",
            });
        }
        const { platform_id,platform_price_name, description, price_type_id, created_by, last_updated_by } = req.body;
        const addPlatformPriceData = new pmsPlatformPriceModel({
            platform_id: platform_id,
            platform_price_name:platform_price_name,
            price_type_id: price_type_id,
            description: description,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addPlatformPriceData.save();
        return res.status(200).json({
            status: 200,
            message: "PMS platform-price type data added successfully!",
            data: addPlatformPriceData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_Platform-Price-By-ID
exports.getPlatformPriceDetail = async (req, res) => {
    try {
        const PlatformPriceData = await pmsPlatformPriceModel.aggregate([
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
                    platform_id: 1,
                    price_type_id: 1,
                    type_name: 1,
                    platform_price_name:1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (PlatformPriceData) {
            return res.status(200).json({
                status: 200,
                message: "PMS platform-price details successfully!",
                data: PlatformPriceData,
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

//PUT - updatPlatformPriceType_By-ID
exports.updatePlatformPriceData = async (req, res) => {
    try {
        const { id } = req.params;
        const { platform_id,platform_price_name, description, price_type_id, created_by, last_updated_by } = req.body;
        const PlatformPrice = await pmsPlatformPriceModel.findOne({ _id: id });
        if (!PlatformPrice) {
            return res.send("Invalid Platform-price Id...");
        }
        await PlatformPrice.save();
        const platformPriceUpdated = await pmsPlatformPriceModel.findOneAndUpdate({ _id: id }, {
            $set: {
                platform_id,
                price_type_id,
                platform_price_name,
                description,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "PMS platform-price data updated successfully!",
            data: platformPriceUpdated,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_Platform_Price_List
exports.getPlatformPriceList = async (req, res) => {
    try {
        const pmsPlatformPriceData = await pmsPlatformPriceModel.aggregate([
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
                    from: "pmsplatforms",
                    localField: "platform_id",
                    foreignField: "_id",
                    as: "pmsPlatform",
                },
            },
            {
                $unwind: {
                    path: "$pmsPlatform",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "pmspricetypes",
                    localField: "price_type_id",
                    foreignField: "_id",
                    as: "pmsPriceType",
                },
            },
            {
                $unwind: {
                    path: "$pmsPriceType",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    platform_price_name:1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    last_updated_by_name: "$user_data.user_name",
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    PMS_Platform_data: {
                        pmsPlatform_id: "$pmsPlatform._id",
                        platform_name: "$pmsPlatform.platform_name",
                        description: "$pmsPlatform.description"
                    },
                    PMS_Pricetypes_data: {
                        pmsPriceType_id: "$pmsPriceType._id",
                        price_type: "$pmsPriceType.price_type",
                        description_price_type: "$pmsPriceType.description"
                    }
                }
            }
        ])
        if (!pmsPlatformPriceData) {
            return res.status(500).send({
                succes: true,
                message: "PMS platform-price type data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "PMS platform-price type data list successfully!",
            data: pmsPlatformPriceData
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//DELETE - PMS_Platform-Price_Type_ By-ID
exports.deletePlatformPriceData = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const platformPriceData = await pmsPlatformPriceModel.findOne({ _id: id }); 
        if (!platformPriceData) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await pmsPlatformPriceModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "PMS platform-price type data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};