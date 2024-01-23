const assetReturnModel = require("../models/assetReturnModel.js");
const multer = require("multer");
const mongoose = require("mongoose");
const vari = require("../variables.js")

const upload = multer({ dest: "uploads/assets" }).fields([
    { name: "return_asset_image_1", maxCount: 1 },
    { name: "return_asset_image_2", maxCount: 1 },
]);

exports.addAssetReturnRequest = [
    upload,
    async (req, res) => {
        try {
            const returndata = new assetReturnModel({
                sim_id: req.body.sim_id,
                asset_return_remark: req.body.asset_return_remark,
                return_asset_image_1: req.files.return_asset_image_1 ? req.files.return_asset_image_1[0].filename : "",
                return_asset_image_2: req.files.return_asset_image_2 ? req.files.return_asset_image_2[0].filename : "",
                asset_return_by: req.body.asset_return_by
            });

            const returnedAsset = await returndata.save();

            res.status(200).send({
                succes: true,
                message: "Asset Return Successfully",
                returnedAsset
            });
        } catch (err) {
            return res.status(500).send({
                succes: false,
                error: err.message,
                sms: "This asset return cannot be created",
            });
        }
    },
];

exports.getAssetReturnRequests = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const singleAssetReturnRequest = await assetReturnModel.aggregate([
            {
                $lookup: {
                    from: "simmodels",
                    localField: "sim_id",
                    foreignField: "sim_id",
                    as: "sim",
                },
            },
            {
                $unwind: {
                    path: "$sim",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "asset_return_by",
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
                    _id: 1,
                    sim_id: 1,
                    asset_return_remark: 1,
                    return_asset_data_time: 1,
                    asset_return_by: 1,
                    assetName: "$sim.assetsName",
                    asset_return_by_name: "$user.user_name",
                    return_asset_image_1: {
                        $concat: [imageUrl, "$return_asset_image_1"],
                    },
                    return_asset_image_2: {
                        $concat: [imageUrl, "$return_asset_image_2"],
                    },
                },
            },
        ]).exec();

        if (!singleAssetReturnRequest) {
            return res.status(500).send({
                succes: true,
                message: "Asset Return Request Not Found"
            });
        }
        res.status(200).send({
            succes: true,
            message: "All Asset Return Request Successfully",
            singleAssetReturnRequest
        });
    } catch (err) {
        return res.status(500).send({
            succes: false,
            message: "Error getting all asset return request "
        });
    }
};

exports.getAssetReturnRequestById = async (req, res) => {
    try {
        // const singleAssetReturnRequest = await assetReturnModel.findById(req.params._id);
        const imageUrl = vari.IMAGE_URL;
        const singleAssetReturnRequest = await assetReturnModel.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(req.params._id)
                },
            },
            {
                $lookup: {
                    from: "simmodels",
                    localField: "sim_id",
                    foreignField: "sim_id",
                    as: "sim",
                },
            },
            {
                $unwind: {
                    path: "$sim",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "asset_return_by",
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
                    _id: 1,
                    sim_id: 1,
                    asset_return_remark: 1,
                    return_asset_data_time: 1,
                    asset_return_by: 1,
                    assetName: "$sim.assetsName",
                    asset_return_by_name: "$user.user_name",
                    return_asset_image_1: {
                        $concat: [imageUrl, "$return_asset_image_1"],
                    },
                    return_asset_image_2: {
                        $concat: [imageUrl, "$return_asset_image_2"],
                    },
                },
            },
        ]).exec();

        if (!singleAssetReturnRequest) {
            return res.status(500).send({
                succes: true,
                message: "Asset Return Request Not Found"
            });
        }
        res.status(200).send({
            succes: true,
            message: "Single Asset Return Request Successfully",
            singleAssetReturnRequest
        });
    } catch (err) {
        return res.status(500).send({
            error: err.message,
            succes: true,
            message: "Error getting single asset return request"
        });
    }
};

const upload1 = multer({ dest: "uploads/assets" }).fields([
    { name: "return_asset_image_1", maxCount: 1 },
    { name: "return_asset_image_2", maxCount: 1 },
]);

exports.editAssetReturnRequest = [
    upload1,
    async (req, res) => {
        try {
            const assetReturnRequest = await assetReturnModel.findOne({
                _id: parseInt(req.body._id),
            });

            const updateFields = {
                sim_id: req.body.sim_id,
                asset_return_remark: req.body.asset_return_remark,
                asset_return_by: req.body.return_by,
                return_asset_data_time: req.body.return_asset_data_time
            };

            if (req.files) {
                updateFields.return_asset_image_1 = req.files["return_asset_image_1"] ? req.files["return_asset_image_1"][0].filename : assetReturnRequest.return_asset_image_1;
                updateFields.return_asset_image_2 = req.files["return_asset_image_2"] ? req.files["return_asset_image_2"][0].filename : assetReturnRequest.return_asset_image_2;
            }

            const editAssetReturn = await repairRequestModel.findOneAndUpdate(
                { _id: parseInt(req.body._id) },
                updateFields,
                { new: true }
            );

            if (!editAssetReturn) {
                return res.status(500).send({ success: false });
            }
            res.status(200).send({
                succes: true,
                message: "Edit Asset Return Request Successfully",
                editAssetReturn
            });
        } catch (err) {
            res.status(500).send({
                succes: true,
                message: "Error updating asset return request data details",
                editAssetReturn
            });
        }
    },
];

exports.deleteAssetReturnRequest = async (req, res) => {
    assetReturnModel.findByIdAndDelete(req.params._id).then(item => {
        if (item) {
            res.status(200).send({
                succes: true,
                message: "Asset Return Request Deleted Successfully"
            });
        } else {
            res.status(500).send({
                succes: false,
                message: "Asset Return Request Not Found"
            });
        }
    }).catch(err => {
        res.status(500).send({
            succes: false,
            message: err.message
        });
    })
};
