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
                platform_ids: req.body?.platform_ids?.split(',').map(id => mongoose.Types.ObjectId(id)),
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
                operation_remark: req.body.operation_remark,
                feedback: req.body.feedback,
                public_usage: req.body.public_usage
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
                blobStream3.end(req.files.sarcasm[0].buffer);
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
                    from: "brandmodels",
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
            {
                $project: {
                    _id: 1,
                    public_usage: 1,
                    data_name: 1,
                    data_id: 1,
                    platform_ids: 1,
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
                    feedback: 1,
                    public_usage: 1,
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
            {
                $group: {
                    _id: "$_id",
                    data: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: "$data" }
            }
        ]).sort({ data_id: -1 });
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
                    localField: "platform_ids",
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
            {
                $project: {
                    _id: 1,
                    data_id: 1,
                    data_name: 1,
                    cat_id: 1,
                    sub_cat_id: 1,
                    platform_ids: 1,
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
                    feedback: 1,
                    public_usage: 1,
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
            platform_ids: req.body.platform_ids,
            // platform_ids: req.body?.platform_ids?.split(',').map(id => mongoose.Types.ObjectId(id)),
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
            operation_remark: req.body.operation_remark,
            feedback: req.body.feedback,
            public_usage: req.body.public_usage
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

exports.getOperationDataBasedDataNameNew = async (req, res) => {
    try {
        const productData = await dataOperationModel.aggregate([
            {
                $match: {
                    data_name: req.params.data_name
                }
            },
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
            {
                $project: {
                    _id: 1,
                    data_id: "$data_id",
                    data_name: "$data_name",
                    platform_ids: "$platform_ids",
                    brand_id: "$brand_id",
                    content_type_id: "$content_type_id",
                    created_by: "$created_by",
                    updated_by: "$updated_by",
                    created_at: "$created_at",
                    designed_by: "$designed_by",
                    designed_by_name: "$userDataName.user_name",
                    created_by_name: "$userData.user_name",
                    updated_by_name: "$userData.user_name",
                    platform_name: "$platforms.platform_name",
                    brand_name: "$brand.brand_name",
                    content_type_name: "$contenttype.content_name",
                    data_type: "$data_type",
                    size_in_mb: "$size_in_mb",
                    remark: "$remark",
                    date_of_completion: "$date_of_completion",
                    date_of_report: "$date_of_report",
                    brand_category_id: "$brand_category_id",
                    brand_sub_category_id: "$brand_sub_category_id",
                    campaign_purpose: "$campaign_purpose",
                    number_of_post: "$number_of_post",
                    number_of_reach: "$number_of_reach",
                    number_of_impression: "$number_of_impression",
                    number_of_engagement: "$number_of_engagement",
                    number_of_views: "$number_of_views",
                    number_of_story_views: "$number_of_story_views",
                    operation_remark: "$operation_remark",
                    feedback: "$feedback",
                    public_usage: "$public_usage",
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
        ]);

        // const productData = await dataOperationModel.find({});

        if (productData && productData.length > 0) {
            return res.status(200).json(productData);
        } else {
            return res.status(404).json({ message: "No Record Found" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message, sms: 'error while adding logo brand data' });
    }
};

exports.editOperationDataName = async (req, res) => {
    try {
        const editsim = await dataOperationModel.updateMany(
            { data_name: req.body.data_name },
            {
                remark: req.body.remark,
                data_type: req.body.data_type,
                size_in_mb: req.body.size_in_mb,
                platform_ids: req.body.platform_ids,
                // platform_ids: req.body?.platform_ids?.split(',').map(id => mongoose.Types.ObjectId(id)),
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
                operation_remark: req.body.operation_remark,
                feedback: req.body.feedback,
                public_usage: req.body.public_usage
            },
            { new: true }
        );

        res.status(200).send({ success: true, data: editsim });
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error updating data details' });
    }
};