const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const pmsPriceTypeModel = require('../../models/PMS/pmsPriceTypeModel');

//POST- PMS_Price-type
exports.createPriceType = async (req, res) => {
    try {
        const checkDuplicacy = await pmsPriceTypeModel.findOne({ price_type: req.body.price_type });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "PMS price type alredy exist!",
            });
        }
        const { price_type, description, created_date_time, created_by, last_updated_date, last_updated_by } = req.body;
        const addPriceData = new pmsPriceTypeModel({
            price_type: price_type,
            description: description,
            created_date_time: created_date_time,
            created_by: created_by,
            last_updated_date: last_updated_date,
            last_updated_by: last_updated_by
        });
        await addPriceData.save();
        return res.status(200).json({
            status: 200,
            message: "PMS price data added successfully!",
            data: addPriceData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_Price-By-ID
exports.getPriceDetail = async (req, res) => {
    try {
        const pmsPriceTypeData = await pmsPriceTypeModel.aggregate([
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
                    price_id: 1,
                    price_type: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (pmsPriceTypeData) {
            return res.status(200).json({
                status: 200,
                message: "PMS price type details successfully!",
                data: pmsPriceTypeData,
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

//PUT - updatePriceType_By-ID
exports.updatePriceType = async (req, res) => {
    try {
        const { id } = req.params;
        const { price_type, description, created_date_time, created_by, last_updated_date, last_updated_by } = req.body;
        const priceTypeData = await pmsPriceTypeModel.findOne({ _id: id });
        if (!priceTypeData) {
            return res.send("Invalid price Id...");
        }
        await priceTypeData.save();
        const priceUpdate = await pmsPriceTypeModel.findOneAndUpdate({ _id: id }, {
            $set: {
                price_type,
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
            message: "PMS price data updated successfully!",
            data: priceUpdate,
        });
    } catch (error) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_Vendo_List
exports.getPriceList = async (req, res) => {
    try {
        const pmsPriceData = await pmsPriceTypeModel.aggregate([
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
                    price_type_id: 1,
                    price_type: 1,
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
        if (!pmsPriceData) {
            return res.status(500).send({
                succes: true,
                message: "PMS price data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "PMS price data list successfully!",
            data: pmsPriceData
        });
    } catch (err) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//DELETE - PMS_Price_Type_ By-ID
exports.deletePriceType = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const priceDataDelete = await pmsPriceTypeModel.findOne({ _id: id });
        if (!priceDataDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await pmsPriceTypeModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "PMS price data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};