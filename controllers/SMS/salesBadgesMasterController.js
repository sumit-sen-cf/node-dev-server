const { message } = require("../../common/message")
const mongoose = require("mongoose");
const salesBadgesMasterModel = require("../../models/SMS/salesBadgesMasterModel");
const multer = require("multer");
const vari = require("../../variables.js");
const { storage } = require('../../common/uploadFile.js');

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "badge_image", maxCount: 1 }
]);

/**
 * Api is to used for the sales_badges_master data add in the DB collection.
 */
exports.createSalesBadgesMaster = [
    upload, async (req, res) => {
        try {
            const { badge_name, max_rate_status, managed_by, created_by, last_updated_by } = req.body;
            const addSalesBadgesMaster = new salesBadgesMasterModel({
                badge_name: badge_name,
                max_rate_status: max_rate_status,
                managed_by: managed_by,
                created_by: created_by,
                last_updated_by: last_updated_by
            });
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);
            if (req.files.badge_image && req.files.badge_image[0].originalname) {
                const blob2 = bucket.file(req.files.badge_image[0].originalname);
                addSalesBadgesMaster.badge_image = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                });
                blobStream2.end(req.files.badge_image[0].buffer);
            }
            await addSalesBadgesMaster.save();
            return res.status(200).json({
                status: 200,
                message: "Sales badges master data added successfully!",
                data: addSalesBadgesMaster,
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message ? error.message : message.ERROR_MESSAGE,
            });
        }
    }];

/**
* Api is to used for the sales_badges_master data get_ByID in the DB collection.
*/
exports.getSalesBadgesMaster = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const salesBadgesMaster = await salesBadgesMasterModel.aggregate([
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
                    badge_name: 1,
                    max_rate_status: 1,
                    managed_by: 1,
                    managed_by_name: "$user.user_name",
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    badge_image: {
                        $concat: [imageUrl, "$badge_image"],
                    },
                },
            },
        ])
        if (salesBadgesMaster) {
            return res.status(200).json({
                status: 200,
                message: "Sales badges master data successfully!",
                data: salesBadgesMaster,
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
 * Api is to used for the sales_badges_master data update in the DB collection.
 */
exports.updateSalesBadgesMaster = [
    upload, async (req, res) => {
        try {
            const { id } = req.params;
            const { badge_name, max_rate_status, managed_by, created_by, last_updated_by } = req.body;
            const salesBadgesMasterData = await salesBadgesMasterModel.findOne({ _id: id });
            if (!salesBadgesMasterData) {
                return res.send("Invalid sales_badges_master Id...");
            }
            if (req.files) {
                salesBadgesMasterData.badge_image = req.files["badge_image"] ? req.files["badge_image"][0].filename : salesBadgesMasterData.badge_image;
            }
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            if (req.files?.badge_image && req.files?.badge_image[0].originalname) {
                const blob1 = bucket.file(req.files.badge_image[0].originalname);
                salesBadgesMasterData.badge_image = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => {
                });
                blobStream1.end(req.files.badge_image[0].buffer);
            }
            await salesBadgesMasterData.save();
            const salesBadgesMasterUpdated = await salesBadgesMasterModel.findOneAndUpdate({ _id: id }, {
                $set: {
                    badge_name,
                    max_rate_status,
                    managed_by,
                    created_by,
                    last_updated_by
                },
            },
                { new: true }
            );
            return res.status(200).json({
                message: "Sales badges master data updated successfully!",
                data: salesBadgesMasterUpdated,
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message ? error.message : message.ERROR_MESSAGE,
            });
        }
    }];

    
/**
 * Api is to used for the sales_badges_master data get_list in the DB collection.
 */
exports.getSalesBadgesMasterList = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const salesBadgesMasterListData = await salesBadgesMasterModel.aggregate([
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
                    badge_name: 1,
                    max_rate_status: 1,
                    managed_by: 1,
                    managed_by_name: "$user.user_name",
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    badge_image: {
                        $concat: [imageUrl, "$badge_image"],
                    },
                },
            },
        ])
        if (salesBadgesMasterListData) {
            return res.status(200).json({
                status: 200,
                message: "Sales badges master list successfully!",
                data: salesBadgesMasterListData,
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
 * Api is to used for the sales_badges_master data delete in the DB collection.
 */
exports.deleteSalesBadgesMaster = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const salesBadgesMasterDataDelete = await salesBadgesMasterModel.findOne({ _id: id });
        if (!salesBadgesMasterDataDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await salesBadgesMasterModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Sales badges master data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};