const salesIndustryModel = require("../../models/SMS/salesIndustryModel");
const { message } = require("../../common/message")
const mongoose = require("mongoose");

/**
 * Api is to used for the sales_industry data add in the DB collection.
 */
exports.createSalesIndustry = async (req, res) => {
    try {
        const { industry_name, remarks, managed_by, created_by, last_updated_by } = req.body;
        const addSalesIndustry = new salesIndustryModel({
            industry_name: industry_name,
            remarks: remarks,
            managed_by: managed_by,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addSalesIndustry.save();
        return res.status(200).json({
            status: 200,
            message: "Sales industry data added successfully!",
            data: addSalesIndustry,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the sales_industry data get_ByID in the DB collection.
 */
exports.getSalesIndustry = async (req, res) => {
    try {
        const salesBrandIndustry = await salesIndustryModel.aggregate([
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
                $lookup: {
                    from: "usermodels",
                    localField: "managed_by",
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
                    industry_name: 1,
                    remarks: 1,
                    managed_by: 1,
                    managed_by_name: "$user.user_name",
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (salesBrandIndustry) {
            return res.status(200).json({
                status: 200,
                message: "Sales industry data successfully!",
                data: salesBrandIndustry,
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

/**
 * Api is to used for the sales_industry data update in the DB collection.
 */
exports.updateSalesIndustry = async (req, res) => {
    try {
        const { id } = req.params;
        const { industry_name, remarks, managed_by, created_by, last_updated_by } = req.body;
        const salesIndustryData = await salesIndustryModel.findOne({ _id: id });
        if (!salesIndustryData) {
            return res.send("Invalid sales_industry Id...");
        }
        await salesIndustryData.save();
        const salesIndustryUpdatedData = await salesIndustryModel.findOneAndUpdate({ _id: id }, {
            $set: {
                industry_name,
                remarks,
                managed_by,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "Sales industry data updated successfully!",
            data: salesIndustryUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the sales_industry data get_list in the DB collection.
 */
exports.getSalesIndustryList = async (req, res) => {
    try {
        const salesIndustryListData = await salesIndustryModel.aggregate([
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
                    localField: "managed_by",
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
                    industry_name: 1,
                    remarks: 1,
                    managed_by: 1,
                    managed_by_name: "$user.user_name",
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (salesIndustryListData) {
            return res.status(200).json({
                status: 200,
                message: "Sales industry list successfully!",
                data: salesIndustryListData,
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

/**
 * Api is to used for the sales_industry data delete in the DB collection.
 */
exports.deleteSalesIndustry = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const salesIndustryDataDelete = await salesIndustryModel.findOne({ _id: id });
        if (!salesIndustryDataDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await salesIndustryModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Sales industry data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};