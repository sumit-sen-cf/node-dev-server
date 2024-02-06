const assetReturnModel = require("../models/assetReturnModel.js");
const simModel = require("../models/simModel.js");
const userModel = require("../models/userModel.js");
const multer = require("multer");
const mongoose = require("mongoose");
const vari = require("../variables.js");
const { storage } = require('../common/uploadFile.js')


const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "return_asset_image_1", maxCount: 1 },
    { name: "return_asset_image_2", maxCount: 1 },
    { name: "recover_asset_image_1", maxCount: 1 },
    { name: "recover_asset_image_2", maxCount: 1 }
]);

exports.addAssetReturnRequest = [
    upload,
    async (req, res) => {
        try {
            const returndata = new assetReturnModel({
                sim_id: req.body.sim_id,
                asset_return_remark: req.body.asset_return_remark,
                asset_return_status: req.body.asset_return_status,
                // return_asset_image_1: req.files.return_asset_image_1 ? req.files.return_asset_image_1[0].filename : "",
                // return_asset_image_2: req.files.return_asset_image_2 ? req.files.return_asset_image_2[0].filename : "",
                asset_return_by: req.body.asset_return_by,
                asset_return_recover_by: req.body.asset_return_recover_by,
                // recover_asset_image_1: req.files.recover_asset_image_1 ? req.files.recover_asset_image_1[0].filename : "",
                // recover_asset_image_2: req.files.recover_asset_image_2 ? req.files.recover_asset_image_2[0].filename : "",
                asset_return_recover_by_remark: req.body.asset_return_recover_by_remark,
            });

            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            if (req.files.return_asset_image_1 && req.files.return_asset_image_1[0].originalname) {
                const blob1 = bucket.file(req.files.return_asset_image_1[0].originalname);
                returndata.return_asset_image_1 = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => {
                    // res.status(200).send("Success")
                });
                blobStream1.end(req.files.return_asset_image_1[0].buffer);
            }
            if (req.files.return_asset_image_2 && req.files.return_asset_image_2[0].originalname) {
                const blob2 = bucket.file(req.files.return_asset_image_2[0].originalname);
                returndata.return_asset_image_2 = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                    // res.status(200).send("Success") 
                });
                blobStream2.end(req.files.return_asset_image_2[0].buffer);
            }
            if (req.files.recover_asset_image_1 && req.files.recover_asset_image_1[0].originalname) {
                const blob3 = bucket.file(req.files.recover_asset_image_1[0].originalname);
                returndata.recover_asset_image_1 = blob3.name;
                const blobStream3 = blob3.createWriteStream();
                blobStream3.on("finish", () => {
                    // res.status(200).send("Success") 
                });
                blobStream3.end(req.files.recover_asset_image_1[0].buffer);
            }
            if (req.files.recover_asset_image_2 && req.files.recover_asset_image_2[0].originalname) {
                const blob4 = bucket.file(req.files.recover_asset_image_2[0].originalname);
                returndata.recover_asset_image_2 = blob4.name;
                const blobStream4 = blob4.createWriteStream();
                blobStream4.on("finish", () => {
                    // res.status(200).send("Success") 
                });
                blobStream4.end(req.files.recover_asset_image_2[0].buffer);
            }

            const returnedAsset = await returndata.save();

            const assetHistoryData = {
                sim_id: returnedAsset.sim_id,
                action_date_time: returnedAsset.return_asset_data_time,
                action_by: returnedAsset.asset_return_by,
                asset_detail: "",
                action_to: 0,
                asset_remark: returnedAsset.asset_return_remark
            };

            const newAssetHistory = await assetHistoryModel.create(assetHistoryData);

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
                    from: "simallomodels",
                    localField: "sim_id",
                    foreignField: "sim_id",
                    as: "simallo",
                },
            },
            {
                $unwind: {
                    path: "$simallo",
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
                    asset_return_status: 1,
                    asset_return_recover_by: 1,
                    asset_return_recover_by_remark: 1,
                    asset_return_recovered_date_time: 1,
                    allo_id: "$simallo.allo_id",
                    asset_name: "$sim.assetsName",
                    asset_return_by_name: "$user.user_name",
                    return_asset_image_1: {
                        $concat: [imageUrl, "$return_asset_image_1"],
                    },
                    return_asset_image_2: {
                        $concat: [imageUrl, "$return_asset_image_2"],
                    },
                    recover_asset_image_1: {
                        $concat: [imageUrl, "$recover_asset_image_1"],
                    },
                    recover_asset_image_2: {
                        $concat: [imageUrl, "$recover_asset_image_2"],
                    },
                },
            },
            {
                $group: {
                    _id: "$_id",
                    doc: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: "$doc" }
            }
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
                    asset_return_status: 1,
                    asset_return_recover_by: 1,
                    asset_return_recover_by_remark: 1,
                    asset_return_recovered_date_time: 1,
                    asset_name: "$sim.assetsName",
                    asset_return_by_name: "$user.user_name",
                    return_asset_image_1: {
                        $concat: [imageUrl, "$return_asset_image_1"],
                    },
                    return_asset_image_2: {
                        $concat: [imageUrl, "$return_asset_image_2"],
                    },
                    recover_asset_image_1: {
                        $concat: [imageUrl, "$recover_asset_image_1"],
                    },
                    recover_asset_image_2: {
                        $concat: [imageUrl, "$recover_asset_image_2"],
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

exports.editAssetReturnRequest = [
    upload,
    async (req, res) => {
        try {
            const assetReturnRequest = await assetReturnModel.findOne({
                _id: req.body._id,
            });

            if (!assetReturnRequest) {
                return res.status(404).send({ success: false, message: "Asset return request not found" });
            }

            const updateFields = {
                sim_id: req.body.sim_id,
                asset_return_remark: req.body.asset_return_remark,
                asset_return_status: req.body.asset_return_status,
                asset_return_by: req.body.return_by,
                return_asset_data_time: req.body.return_asset_data_time,
                asset_return_recovered_date_time: req.body.asset_return_recovered_date_time,
                asset_return_recover_by: req.body.asset_return_recover_by,
                asset_return_recover_by_remark: req.body.asset_return_recover_by_remark,
            };

            if (req.files) {
                updateFields.return_asset_image_1 = req.files["return_asset_image_1"] ? req.files["return_asset_image_1"][0].filename : assetReturnRequest.return_asset_image_1;
                updateFields.return_asset_image_2 = req.files["return_asset_image_2"] ? req.files["return_asset_image_2"][0].filename : assetReturnRequest.return_asset_image_2;
                updateFields.recover_asset_image_1 = req.files["recover_asset_image_1"] ? req.files["recover_asset_image_1"][0].filename : assetReturnRequest.recover_asset_image_1;
                updateFields.recover_asset_image_2 = req.files["recover_asset_image_2"] ? req.files["recover_asset_image_2"][0].filename : assetReturnRequest.recover_asset_image_2;
            }

            const editAssetReturn = await assetReturnModel.findOneAndUpdate(
                { _id: req.body._id },
                updateFields,
                { new: true }
            );

            if (!editAssetReturn) {
                return res.status(404).send({ success: false, message: "Failed to update asset return request" });
            }

            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            if (req.files.return_asset_image_1 && req.files.return_asset_image_1[0].originalname) {
                const blob1 = bucket.file(req.files.return_asset_image_1[0].originalname);
                returndata.return_asset_image_1 = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => {
                    // res.status(200).send("Success")
                });
                blobStream1.end(req.files.return_asset_image_1[0].buffer);
            }
            if (req.files.return_asset_image_2 && req.files.return_asset_image_2[0].originalname) {
                const blob2 = bucket.file(req.files.return_asset_image_2[0].originalname);
                returndata.return_asset_image_2 = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                    // res.status(200).send("Success") 
                });
                blobStream2.end(req.files.return_asset_image_2[0].buffer);
            }
            if (req.files.recover_asset_image_1 && req.files.recover_asset_image_1[0].originalname) {
                const blob3 = bucket.file(req.files.recover_asset_image_1[0].originalname);
                returndata.recover_asset_image_1 = blob3.name;
                const blobStream3 = blob3.createWriteStream();
                blobStream3.on("finish", () => {
                    // res.status(200).send("Success") 
                });
                blobStream3.end(req.files.recover_asset_image_1[0].buffer);
            }
            if (req.files.recover_asset_image_2 && req.files.recover_asset_image_2[0].originalname) {
                const blob4 = bucket.file(req.files.recover_asset_image_2[0].originalname);
                returndata.recover_asset_image_2 = blob4.name;
                const blobStream4 = blob4.createWriteStream();
                blobStream4.on("finish", () => {
                    // res.status(200).send("Success") 
                });
                blobStream4.end(req.files.recover_asset_image_2[0].buffer);
            }

            res.status(200).send({
                success: true,
                message: "Edit Asset Return Request Successfully",
                editAssetReturn
            });
        } catch (err) {
            console.error("Error updating asset return request:", err);
            res.status(500).send({
                success: false,
                message: "Error updating asset return request data details"
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

exports.showReturnAssetDataToUserReport = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const { user_id } = req.params;
        const userData = await simModel.aggregate([
            {
                $lookup: {
                    from: "assetreturnmodels",
                    localField: "sim_id",
                    foreignField: "sim_id",
                    as: "assetReturn",
                },
            },
            {
                $unwind: {
                    path: "$assetReturn",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "assetReturn.asset_return_by",
                    foreignField: "user_id",
                    as: "userdata",
                },
            },
            {
                $unwind: {
                    path: "$userdata",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "assetReturn.asset_return_recover_by",
                    foreignField: "user_id",
                    as: "userdata1",
                },
            },
            {
                $unwind: {
                    path: "$userdata1",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    "userdata.Report_L1": parseInt(user_id),
                },
            },
            {
                $project: {
                    _id: "$assetReturn._id",
                    sim_id: 1,
                    asset_return_remark: "$assetReturn.asset_return_remark",
                    return_asset_data_time: "$assetReturn.return_asset_data_time",
                    asset_return_status: "$assetReturn.asset_return_status",
                    asset_return_recover_by: "$assetReturn.asset_return_recover_by",
                    asset_return_recover_by_remark: "$assetReturn.asset_return_recover_by_remark",
                    asset_return_recovered_date_time: "$assetReturn.asset_return_recovered_date_time",
                    assetName: "$assetsName",
                    asset_return_by_name: "$userdata.user_name",
                    asset_return_recover_by_name: "$userdata1.user_name",
                    return_asset_image_1: {
                        $concat: [imageUrl, "$return_asset_image_1"],
                    },
                    return_asset_image_2: {
                        $concat: [imageUrl, "$return_asset_image_2"],
                    },
                    recover_asset_image_1: {
                        $concat: [imageUrl, "$recover_asset_image_1"],
                    },
                    recover_asset_image_2: {
                        $concat: [imageUrl, "$recover_asset_image_2"],
                    },
                },
            }
        ]);

        if (!userData) {
            return res.status(500).json({ success: false, message: "No data found" });
        }

        if (userData.length === 0) {
            return res.status(404).json({ success: false, message: "No data found for the user_id" });
        }

        res.status(200).json({ data: userData });
    } catch (err) {
        return res.status(500).send({ error: err.message, sms: "Error getting Asset Return Request Data" });
    }
};
