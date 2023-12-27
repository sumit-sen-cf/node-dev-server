const assetReasonModel = require("../models/assetReasonModel.js");

exports.addAssetReason = async (req, res) => {
    const { category_id, sub_category_id, reason } = req.body;
    try {
        const assetReasonData = new assetReasonModel({
            category_id,
            sub_category_id,
            reason
        });
        const savedassetreasondata = await assetReasonData.save();
        res.status(200).send({
            data: savedassetreasondata,
            message: "assetReasonData created success",
        });
    } catch (err) {
        return res.status(500).send({
            error: err.message,
            message: "Error adding assetReasonData to database",
        });
    }
};

exports.getAssetReasons = async (req, res) => {
    try {
        const assetReasonData = await assetReasonModel
            .aggregate([
                {
                    $lookup: {
                        from: "assetscategorymodels",
                        localField: "category_id",
                        foreignField: "category_id",
                        as: "category",
                    },
                },
                {
                    $unwind: {
                        path: "$category",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "assetssubcategorymodels",
                        localField: "sub_category_id",
                        foreignField: "sub_category_id",
                        as: "subcategory",
                    },
                },
                {
                    $unwind: {
                        path: "$subcategory",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: "$_id",
                        asset_reason_id: "$asset_reason_id",
                        category_id: "$category_id",
                        sub_category_id: "$sub_category_id",
                        category_name: "$category.category_name",
                        sub_category_name: "$subcategory.sub_category_name",
                        reason: "$reason"
                    },
                },
            ])
            .exec();

        if (!assetReasonData) {
            return res.status(500).json({ success: false, message: "No data found" });
        }

        res.status(200).json({ data: assetReasonData });
    } catch (err) {
        return res
            .status(500)
            .send({ error: err.message, sms: "Error getting all sim datas" });
    }
};

exports.getAssetReasonById = async (req, res) => {
    try {
        const assetReasonData = await assetReasonModel.findOne({
            asset_reason_id: parseInt(req.params.id),
        });
        if (!assetReasonData) {
            return res
                .status(200)
                .send({ success: false, data: {}, message: "No Record found" });
        } else {
            res.status(200).send({ data: assetReasonData });
        }
    } catch (err) {
        return res.status(500).send({
            error: err.message,
            message: "Error getting assetReason details",
        });
    }
};

exports.editAssetReason = async (req, res) => {
    try {
        const editAssetReasonData = await assetReasonModel.findOneAndUpdate({ asset_reason_id: req.body.asset_reason_id }, {
            category_id: req.body.category_id,
            sub_category_id: req.body.sub_category_id,
            reason: req.body.reason,
            updated_at: req.body.updated_at
        }, { new: true })
        if (!editAssetReasonData) {
            res.status(500).send({ success: false })
        }
        res.status(200).send({ success: true, data: editAssetReasonData })
    } catch (err) {
        return res.status(500).send({
            error: err.message,
            message: "Error updating the assetreasondata in the database",
        });
    }
};

exports.deleteAssetReason = async (req, res) => {
    const id = req.params.id;
    const condition = { asset_reason_id: id };
    try {
        const result = await assetReasonModel.deleteOne(condition);
        if (result.deletedCount === 1) {
            return res.status(200).json({
                success: true,
                message: `AssetReason with ID ${id} deleted successfully`,
            });
        } else {
            return res.status(200).json({
                success: false,
                message: `AssetReason with ID ${id} not found`,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the AssetReason",
            error: error.message,
        });
    }
};
