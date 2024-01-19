const response = require("../common/response.js");
const dataModel = require("../models/dataModel.js");
const dataSubCategoryModel = require("../models/dataSubCategoryModel.js");
const path = require("path");
const constant = require('../common/constant.js');
const helper = require('../helper/helper.js');
const mongoose = require('mongoose');
const { storage } = require("../common/uploadFile.js")
const vari = require("../variables.js")

exports.addData = async (req, res) => {
    try {
        // const subCatIds = req.body.sub_cat_id.split(',').map(id => mongoose.Types.ObjectId(id.trim()));
        const data = new dataModel({
            data_name: req.body.data_name,
            remark: req.body.remark,
            data_type: req.body.data_type,
            size_in_mb: req.body.size_in_mb,
            cat_id: req.body.cat_id,
            sub_cat_id: req.body.sub_cat_id,
            platform_id: req.body.platform_id,
            brand_id: req.body.brand_id,
            content_type_id: req.body.content_type_id,
            // data_upload: req.file.filename,
            created_by: req.body.created_by,
            updated_by: req.body.updated_by,
            designed_by: req.body.designed_by
        });

        const bucketName = vari.BUCKET_NAME;
        const bucket = storage.bucket(bucketName);
        const blob = bucket.file(req.file.originalname);
        data.data_upload = blob.name;
        const blobStream = blob.createWriteStream();
        blobStream.on("finish", () => { res.status(200).send("Success") });
        blobStream.end(req.file.buffer);

        const simv = await data.save();
        return response.returnTrue(
            200,
            req,
            res,
            "Data Created Successfully",
            simv
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getDatas = async (req, res) => {
    try {

        const simc = await dataModel.aggregate([
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
                    created_at: 1,
                    created_by: 1,
                    updated_by: 1,
                    designed_by: 1,
                    // data_upload: 1,
                    created_by_name: "$userData.user_name",
                    updated_by_name: "$userData.user_name",
                    designed_by_name: "$userDataName.user_name",
                    category_name: "$category.category_name",
                    sub_category_name: "$subcategory. data_sub_cat_name",
                    platform_name: "$platform.platform_name",
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

exports.getSingleData = async (req, res) => {
    try {
        const singlesim = await dataModel.aggregate([
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

exports.getDataBasedDataName = async (req, res) => {
    try {
        const productData = await dataModel.aggregate([
            {
                $match: {
                    data_id: parseInt(req.params.data_id)
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
            {
                $project: {
                    _id: 1,
                    data_id: "$data_id",
                    data_name: "$data_name",
                    cat_id: "$cat_id",
                    sub_cat_id: "$sub_cat_id",
                    platform_id: "$platform_id",
                    brand_id: "$brand_id",
                    content_type_id: "$content_type_id",
                    created_by: "$created_by",
                    updated_by: "$updated_by",
                    created_at: "$created_at",
                    designed_by: "$designed_by",
                    designed_by_name: "$userDataName.user_name",
                    created_by_name: "$userData.user_name",
                    updated_by_name: "$userData.user_name",
                    category_name: "$category.category_name",
                    sub_category_name: "$subcategory.data_sub_cat_name",
                    platform_name: "$platform.platform_name",
                    brand_name: "$brand.brand_name",
                    content_type_name: "$contenttype.content_name",
                    data_type: "$data_type",
                    size_in_mb: "$size_in_mb",
                    remark: "$remark",
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
                    }
                },
            },
        ]);
        if (productData?.length == 0) {
            return res.status(200).json({ message: "No Record Found" });
        }
        res.status(200).json(productData);
    } catch (error) {
        res.status(500).send({ error: error.message, sms: 'error while adding logo brand data' })
    }
}

exports.getDataBasedDataNameNew = async (req, res) => {
    try {
        const productData = await dataModel.aggregate([
            {
                $match: {
                    data_name: req.params.data_name
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
            {
                $project: {
                    _id: 1,
                    data_id: "$data_id",
                    data_name: "$data_name",
                    cat_id: "$cat_id",
                    sub_cat_id: "$sub_cat_id",
                    platform_id: "$platform_id",
                    brand_id: "$brand_id",
                    content_type_id: "$content_type_id",
                    created_by: "$created_by",
                    updated_by: "$updated_by",
                    created_at: "$created_at",
                    designed_by: "$designed_by",
                    designed_by_name: "$userDataName.user_name",
                    created_by_name: "$userData.user_name",
                    updated_by_name: "$userData.user_name",
                    category_name: "$category.category_name",
                    sub_category_name: "$subcategory.data_sub_cat_name",
                    platform_name: "$platform.platform_name",
                    brand_name: "$brand.brand_name",
                    content_type_name: "$contenttype.content_name",
                    data_type: "$data_type",
                    size_in_mb: "$size_in_mb",
                    remark: "$remark",
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
                    }
                },
            },
        ]);
        if (productData?.length == 0) {
            return res.status(200).json({ message: "No Record Found" });
        }
        res.status(200).json(productData);
    } catch (error) {
        res.status(500).send({ error: error.message, sms: 'error while adding logo brand data' })
    }
}

exports.editData = async (req, res) => {
    try {
        const editsim = await dataModel.findOneAndUpdate({ data_id: req.body.data_id }, {
            data_name: req.body.data_name,
            remark: req.body.remark,
            data_type: req.body.data_type,
            size_in_mb: req.body.size_in_mb,
            cat_id: req.body.cat_id,
            sub_cat_id: req.body.sub_cat_id,
            platform_id: req.body.platform_id,
            brand_id: req.body.brand_id,
            content_type_id: req.body.content_type_id,
            // data_upload: req.file?.originalname,
            created_by: req.body.created_by,
            updated_at: req.body.updated_at,
            updated_by: req.body.updated_by,
            designed_by: req.body.designed_by
        }, { new: true })

        // const bucketName = vari.BUCKET_NAME;
        // const bucket = storage.bucket(bucketName);
        // const blob = bucket.file(req.file.originalname);
        // editsim.data_upload = blob.name;
        // const blobStream = blob.createWriteStream();
        // blobStream.on("finish", () => { 
        //     editsim.save();
        //     res.status(200).send("Success") 
        // });
        // blobStream.end(req.file.buffer);

        res.status(200).send({ success: true, data: editsim })
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error updating data details' })
    }
};

exports.deleteData = async (req, res) => {
    dataModel.findByIdAndDelete(req.params._id).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'data deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'data not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
};

exports.deleteDataBasedData = async (req, res) => {
    dataModel.deleteMany({ data_name: req.params.data_name }).then(item => {
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
