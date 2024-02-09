const response = require("../common/response.js");
const dataOperationModel = require("../models/dataOperationModel.js");
const path = require("path");
const constant = require('../common/constant.js');
const helper = require('../helper/helper.js');
const mongoose = require('mongoose');
const { storage } = require("../common/uploadFile.js")
const vari = require("../variables.js");
const multer = require("multer");


const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "data_upload", maxCount: 1 },
    { name: "mmc", maxCount: 1 },
    { name: "sarcasm", maxCount: 1 },
    { name: "no_logo", maxCount: 1 }
]);
exports.addOperationData = [
    upload,
    async (req, res) => {
        try {
            const data = new dataOperationModel({
                data_name: req.body.data_name,
                remark: req.body.remark,
                data_type: req.body.data_type,
                size_in_mb: req.body.size_in_mb,
                // cat_id: req.body.cat_id,
                // sub_cat_id: req.body.sub_cat_id,
                platform_ids: req.body.platform_ids,
                brand_id: req.body.brand_id,
                content_type_id: req.body.content_type_id,
                created_by: req.body.created_by,
                updated_by: req.body.updated_by,
                designed_by: req.body.designed_by,
                date_of_completion: req.body.date_of_completion,
                date_of_report: req.body.date_of_report,
                brand_category_id: req.body.brand_category_id,
                brand_sub_category_id: req.body.brand_sub_category_id,
                campaign_purpose: req.body.campaign_purpose,
                number_of_post: req.body.number_of_post,
                number_of_reach: req.body.number_of_reach,
                number_of_impression: req.body.number_of_impression,
                number_of_engagement: req.body.number_of_engagement,
                number_of_views: req.body.number_of_views,
                number_of_story_views: req.body.number_of_story_views,
                operation_remark: req.body.operation_remark
            });

            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            if (req.files.data_upload && req.files.data_upload[0].originalname) {
                const blob1 = bucket.file(req.files.data_upload[0].originalname);
                data.data_upload = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => {
                    // res.status(200).send("Success")
                });
                blobStream1.end(req.files.data_upload[0].buffer);
            }
            if (req.files.mmc && req.files.mmc[0].originalname) {
                const blob2 = bucket.file(req.files.mmc[0].originalname);
                data.mmc = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                    // res.status(200).send("Success") 
                });
                blobStream2.end(req.files.mmc[0].buffer);
            }
            if (req.files.sarcasm && req.files.sarcasm[0].originalname) {
                const blob3 = bucket.file(req.files.sarcasm[0].originalname);
                data.sarcasm = blob3.name; // Corrected field name
                const blobStream3 = blob3.createWriteStream();
                blobStream3.on("finish", () => {
                    // res.status(200).send("Success") 
                });
                blobStream3.end(req.files.sarcasm[0].buffer); // Corrected field name
            }
            if (req.files.no_logo && req.files.no_logo[0].originalname) {
                const blob4 = bucket.file(req.files.no_logo[0].originalname);
                data.no_logo = blob4.name;
                const blobStream4 = blob4.createWriteStream();
                blobStream4.on("finish", () => {
                    // res.status(200).send("Success") 
                });
                blobStream4.end(req.files.no_logo[0].buffer);
            }

            const simv = await data.save();
            return response.returnTrue(
                200,
                req,
                res,
                "Data Operation Created Successfully",
                simv
            );
        } catch (err) {
            return response.returnFalse(500, req, res, err.message, {});
        }

    }
];


exports.getOprationDatas = async (req, res) => {
    try {

        const simc = await dataOperationModel.aggregate([
            {
                $lookup: {
                    from: "dataplatformmodels",
                    localField: "platform_ids",
                    foreignField: "_id",
                    as: "platforms",
                },
            },
            {
                $unwind: {
                    path: "$platforms",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "datacontenttypemodels",
                    localField: "content_type_id",
                    foreignField: "_id",
                    as: "contenttype",
                },
            },
            {
                $unwind: {
                    path: "$contenttype",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "databrandmodels",
                    localField: "brand_id",
                    foreignField: "_id",
                    as: "brand",
                },
            },
            {
                $unwind: {
                    path: "$brand",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: 'created_by',
                    foreignField: 'user_id',
                    as: 'userData'
                }
            },
            {
                $unwind: {
                    path: "$userData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: 'designed_by',
                    foreignField: 'user_id',
                    as: 'userDataName'
                }
            },
            {
                $unwind: {
                    path: "$userDataName",
                    preserveNullAndEmptyArrays: true,
                },
            },
            // {
            //     $lookup: {
            //         from: "brandcategorymodels",
            //         localField: "brandCategory_id",
            //         foreignField: "brand_category_id",
            //         as: "brandCategory",
            //     },
            // },
            // {
            //     $unwind: {
            //         path: "$brandCategory",
            //         preserveNullAndEmptyArrays: true,
            //     },
            // },
            // {
            //     $lookup: {
            //         from: "brandsubcategorymodels",
            //         localField: "brandSubCategory_id",
            //         foreignField: "brand_sub_category_id",
            //         as: "brandSubCategory",
            //     },
            // },
            // {
            //     $unwind: {
            //         path: "$brandSubCategory",
            //         preserveNullAndEmptyArrays: true,
            //     },
            // },
            {
                $project: {
                    _id: 1,
                    data_name: 1,
                    data_id: 1,
                    platform_id: 1,
                    brand_id: 1,
                    content_type_id: 1,
                    created_at: 1,
                    created_by: 1,
                    updated_by: 1,
                    designed_by: 1,
                    date_of_completion: 1,
                    date_of_report: 1,
                    brand_category_id: 1,
                    brand_sub_category_id: 1,
                    campaign_purpose: 1,
                    number_of_post: 1,
                    number_of_reach: 1,
                    number_of_impression: 1,
                    number_of_engagement: 1,
                    number_of_views: 1,
                    number_of_story_views: 1,
                    operation_remark: 1,
                    // data_upload: 1,
                    // brand_category_name: "$brandCategory.brandCategory_name",
                    // brand_sub_category_name: "$brandSubCategory.brandSubCategory_name",
                    created_by_name: "$userData.user_name",
                    updated_by_name: "$userData.user_name",
                    designed_by_name: "$userDataName.user_name",
                    category_name: "$category.category_name",
                    sub_category_name: "$subcategory. data_sub_cat_name",
                    platform_name: "$platforms.platform_name",
                    brand_name: "$brand.brand_name",
                    content_type_name: "$contenttype.content_name",
                    data_type: "$data_type",
                    size_in_mb: "$size_in_mb",
                    data_image: {
                        $cond: {
                            if: { $ne: ['$data_upload', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}`,
                                    '$data_upload'
                                ]
                            },
                            else: null
                        }
                    },
                    mmc_image: {
                        $cond: {
                            if: { $ne: ['$mmc', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}`,
                                    '$mmc'
                                ]
                            },
                            else: null
                        }
                    },
                    sarcasm_image: {
                        $cond: {
                            if: { $ne: ['$sarcasm', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}`,
                                    '$sarcasm'
                                ]
                            },
                            else: null
                        }
                    },
                    no_logo_image: {
                        $cond: {
                            if: { $ne: ['$no_logo', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}`,
                                    '$no_logo'
                                ]
                            },
                            else: null
                        }
                    }
                },
            },
        ]);
        if (!simc) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(simc)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting all data' })
    }
};

exports.getSingleOprationData = async (req, res) => {
    try {
        const singlesim = await dataOperationModel.aggregate([
            {
                $match: {
                    data_id: parseInt(req.params.data_id),
                }
            },
            {
                $lookup: {
                    from: "datacategorymodels",
                    localField: "cat_id",
                    foreignField: "_id",
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
                    from: "datasubcategorymodels",
                    localField: "sub_cat_id",
                    foreignField: "_id",
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
                $lookup: {
                    from: "dataplatformmodels",
                    localField: "platform_id",
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
                $lookup: {
                    from: "datacontenttypemodels",
                    localField: "content_type_id",
                    foreignField: "_id",
                    as: "contenttype",
                },
            },
            {
                $unwind: {
                    path: "$contenttype",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "databrandmodels",
                    localField: "brand_id",
                    foreignField: "_id",
                    as: "brand",
                },
            },
            {
                $unwind: {
                    path: "$brand",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: 'created_by',
                    foreignField: 'user_id',
                    as: 'userData'
                }
            },
            {
                $unwind: {
                    path: "$userData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: 'designed_by',
                    foreignField: 'user_id',
                    as: 'userDataName'
                }
            },
            {
                $unwind: {
                    path: "$userDataName",
                    preserveNullAndEmptyArrays: true,
                },
            },
            // {
            //     $lookup: {
            //         from: "brandcategorymodels",
            //         localField: "brand_category_id",
            //         foreignField: "brandCategory_id",
            //         as: "brandCategory",
            //     },
            // },
            // {
            //     $unwind: {
            //         path: "$brandCategory",
            //         preserveNullAndEmptyArrays: true,
            //     },
            // },
            // {
            //     $lookup: {
            //         from: "brandsubcategorymodels",
            //         localField: "brand_sub_category_id",
            //         foreignField: "brandSubCategory_id",
            //         as: "brandSubCategory",
            //     },
            // },
            // {
            //     $unwind: {
            //         path: "$brandSubCategory",
            //         preserveNullAndEmptyArrays: true,
            //     },
            // },
            {
                $project: {
                    _id: 1,
                    data_id: 1,
                    data_name: 1,
                    cat_id: 1,
                    sub_cat_id: 1,
                    platform_id: 1,
                    brand_id: 1,
                    content_type_id: 1,
                    created_by: 1,
                    updated_by: 1,
                    designed_by: 1,
                    date_of_completion: 1,
                    date_of_report: 1,
                    brand_category_id: 1,
                    brand_sub_category_id: 1,
                    campaign_purpose: 1,
                    number_of_post: 1,
                    number_of_reach: 1,
                    number_of_impression: 1,
                    number_of_engagement: 1,
                    number_of_views: 1,
                    number_of_story_views: 1,
                    operation_remark: 1,
                    // brand_category_name: "$brandCategory.brandCategory_name",
                    // brand_sub_category_name: "$brandSubCategory.brandSubCategory_name",
                    designed_by_name: "$userDataName.user_name",
                    created_by_name: "$userData.user_name",
                    updated_by_name: "$userData.user_name",
                    category_name: { $ifNull: ['$category.category_name', null] },
                    sub_category_name: { $ifNull: ['$subcategory.data_sub_cat_name', null] },
                    platform_name: { $ifNull: ['$platform.platform_name', null] },
                    brand_name: { $ifNull: ['$brand.brand_name', null] },
                    content_type_name: { $ifNull: ['$contenttype.content_name', null] },
                    data_type: "$data_type",
                    size_in_mb: "$size_in_mb",
                    data_image: {
                        $cond: {
                            if: { $ne: ['$data_upload', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}`,
                                    '$data_upload'
                                ]
                            },
                            else: null
                        }
                    },
                    data_image_download: {
                        $cond: {
                            if: { $ne: ['$data_upload', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}`,
                                    '$data_upload'
                                ]
                            },
                            else: null
                        }
                    },
                    mmc_image: {
                        $cond: {
                            if: { $ne: ['$mmc', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}`,
                                    '$mmc'
                                ]
                            },
                            else: null
                        }
                    },
                    sarcasm_image: {
                        $cond: {
                            if: { $ne: ['$sarcasm', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}`,
                                    '$sarcasm'
                                ]
                            },
                            else: null
                        }
                    },
                    no_logo_image: {
                        $cond: {
                            if: { $ne: ['$no_logo', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}`,
                                    '$no_logo'
                                ]
                            },
                            else: null
                        }
                    }
                }
            },
        ]);

        if (!singlesim || singlesim.length === 0) {
            res.status(500).send({ success: false });
            return;
        }

        res.status(200).send(singlesim[0]);
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error getting data details' })
    }
};


exports.editOperationData = async (req, res) => {
    try {
        const editsim = await dataOperationModel.findOneAndUpdate({ data_id: req.body.data_id }, {
            remark: req.body.remark,
            data_type: req.body.data_type,
            size_in_mb: req.body.size_in_mb,
            platform_id: req.body.platform_id,
            brand_id: req.body.brand_id,
            content_type_id: req.body.content_type_id,
            // data_upload: req.file?.originalname,
            created_by: req.body.created_by,
            updated_at: req.body.updated_at,
            updated_by: req.body.updated_by,
            designed_by: req.body.designed_by,
            date_of_completion: req.body.date_of_completion,
            date_of_report: req.body.date_of_report,
            brand_category_id: req.body.brand_category_id,
            brand_sub_category_id: req.body.brand_sub_category_id,
            campaign_purpose: req.body.campaign_purpose,
            number_of_post: req.body.number_of_post,
            number_of_reach: req.body.number_of_reach,
            number_of_impression: req.body.number_of_impression,
            number_of_engagement: req.body.number_of_engagement,
            number_of_views: req.body.number_of_views,
            number_of_story_views: req.body.number_of_story_views,
            operation_remark: req.body.operation_remark
        }, { new: true })

        res.status(200).send({ success: true, data: editsim })
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error updating data details' })
    }
};

exports.deleteOperationData = async (req, res) => {
    dataOperationModel.findByIdAndDelete(req.params._id).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'data operation deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'data operation not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err.message })
    })
};

exports.deleteDataBasedData = async (req, res) => {
    dataOperationModel.deleteMany({ data_name: req.params.data_name }).then(item => {
        if (item) {
            const result = helper.fileRemove(
                item?.data_upload,
                "../uploads/dataimages"
            );
            if (result?.status == false) {
                return res.status(200).json({ success: false, message: result.msg })
            }
            return res.status(200).json({ success: true, message: 'Data deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'data not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err.message })
    })
};

exports.editDataNew = async (req, res) => {
    try {
        const getName = await dataModel.findOne({ _id: req.body._id }).select({ data_name: 1 });
        const getAllNames = await dataModel.find({ data_name: getName.data_name }).select({ _id: 1 });
        const groupIds = getAllNames.map((item) => item._id);
        const editdataname = await dataModel.updateMany({ _id: { $in: groupIds } }, {
            $set: {
                data_name: req.body.data_name,
                updated_at: req.body.updated_at,
                remark: req.body.remark
            }
        })
        res.status(200).send({ data: editdataname, sms: 'Data updated successfully' })
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'error udpdating data details' })
    }
}

exports.DistinctCreatedByWithUserName = async (req, res) => {
    try {
        const distinctCreatedByValues = await dataModel.aggregate([
            {
                $group: {
                    _id: "$created_by"
                }
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "userDetails"
                }
            },
            {
                $project: {
                    _id: 1,
                    user_name: { $arrayElemAt: ["$userDetails.user_name", 0] }
                }
            }
        ]);

        return res.status(200).json({ success: true, data: distinctCreatedByValues });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.DistinctDesignedByWithUserName = async (req, res) => {
    try {
        const distinctCreatedByValues = await dataModel.aggregate([
            {
                $group: {
                    _id: "$designed_by"
                }
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "userDetails"
                }
            },
            {
                $project: {
                    _id: 1,
                    user_name: { $arrayElemAt: ["$userDetails.user_name", 0] }
                }
            }
        ]);

        return res.status(200).json({ success: true, data: distinctCreatedByValues });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.ImagesWithDataName = async (req, res) => {
    try {
        const { data_name } = req.params;

        const productData = await dataModel.aggregate([
            {
                $match: {
                    data_name: data_name
                }
            },
            {
                $project: {
                    _id: 1,
                    data_name: 1,
                    data_type: 1,
                    size_in_mb: 1,
                    remark: 1,
                    data_image: {
                        $cond: {
                            if: { $ne: ['$data_upload', null] },
                            then: {
                                $concat: [
                                    constant.base_url,
                                    '$data_upload'
                                ]
                            },
                            else: null
                        }
                    },
                    data_image_download: {
                        $cond: {
                            if: { $ne: ['$data_upload', null] },
                            then: {
                                $concat: [
                                    constant.base_url,
                                    '$data_upload'
                                ]
                            },
                            else: null
                        }
                    },
                    mmc_image: {
                        $cond: {
                            if: { $ne: ['$mmc', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}`,
                                    '$mmc'
                                ]
                            },
                            else: null
                        }
                    },
                    sarcasam_image: {
                        $cond: {
                            if: { $ne: ['$sarcasam', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}`,
                                    '$sarcasam'
                                ]
                            },
                            else: null
                        }
                    },
                    no_logo_image: {
                        $cond: {
                            if: { $ne: ['$no_logo', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}`,
                                    '$no_logo'
                                ]
                            },
                            else: null
                        }
                    }
                },
            },
        ]);

        if (productData.length === 0) {
            return res.status(404).json({ message: "No Record Found" });
        }

        res.status(200).json(productData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message, message: 'Error getting data details' });
    }
};

exports.totalCountOfData = async (req, res) => {
    try {
        const distinctDataNames = await dataModel.distinct('data_name');
        const distinctDataNamesCount = distinctDataNames.length;

        return res.status(200).send({
            success: true,
            message: "Distinct data names count retrieved successfully",
            distinctDataNamesCount,
            distinctDataNames
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message, message: 'Error getting data details' });
    }
};