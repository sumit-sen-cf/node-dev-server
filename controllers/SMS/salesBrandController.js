const salesBrandModel = require("../../models/SMS/salesBrandModel");
const { message } = require("../../common/message")
const mongoose = require("mongoose");

/**
 * Api is to used for the sales_brand data add in the DB collection.
 */
exports.createSalesBrand = async (req, res) => {
    try {
        const { brand_name, remarks, managed_by, created_by, last_updated_by } = req.body;
        const addSalesBrand = new salesBrandModel({
            brand_name: brand_name,
            remarks: remarks,
            managed_by: managed_by,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addSalesBrand.save();
        return res.status(200).json({
            status: 200,
            message: "Sales brand data added successfully!",
            data: addSalesBrand,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};


/**
 * Api is to used for the sales_brand data get_ByID in the DB collection.
 */
exports.getSalesBrand = async (req, res) => {
    try {
        const salesBrandData = await salesBrandModel.aggregate([
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
                    brand_name: 1,
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
        if (salesBrandData) {
            return res.status(200).json({
                status: 200,
                message: "Sales brand data successfully!",
                data: salesBrandData,
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
 * Api is to used for the sales_brand data update in the DB collection.
 */
exports.updateSalesBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const { brand_name, remarks, managed_by, created_by, last_updated_by } = req.body;
        const salesBrandData = await salesBrandModel.findOne({ _id: id });
        if (!salesBrandData) {
            return res.send("Invalid sales_brand Id...");
        }
        await salesBrandData.save();
        const salesBrandUpdatedData = await salesBrandModel.findOneAndUpdate({ _id: id }, {
            $set: {
                brand_name,
                remarks,
                managed_by,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "Sales brand data updated successfully!",
            data: salesBrandUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};


/**
 * Api is to used for the sales_brand data get_list in the DB collection.
 */
exports.getSalesBrandList = async (req, res) => {
    try {
        const salesBrandListData = await salesBrandModel.aggregate([
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
                    brand_name: 1,
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
        if (salesBrandListData) {
            return res.status(200).json({
                status: 200,
                message: "Sales brand list successfully!",
                data: salesBrandListData,
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
 * Api is to used for the sales_brand data delete in the DB collection.
 */
exports.deleteSalesBrand = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const paymentDetailsDataDelete = await salesBrandModel.findOne({ _id: id });
        if (!paymentDetailsDataDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await salesBrandModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Sales brand data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};