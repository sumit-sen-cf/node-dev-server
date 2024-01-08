const response = require("../common/response.js");
const dataModel = require("../models/dataModel.js");
const dataSubCategoryModel = require("../models/dataSubCategoryModel.js");
const path = require("path");
const constant = require('../common/constant.js');
const helper = require('../helper/helper.js');

exports.addData = async (req, res) => {
    try {
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
            data_upload: req.file.filename,
            created_by: req.body.created_by,
            updated_by: req.body.updated_by
        });
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


// exports.getDatas = async (req, res) => {
//     try {
//         const simc = await dataModel.find()
//             .populate('cat_id')
//             .populate('sub_cat_id')
//             .populate('platform_id')
//             .populate('content_type_id')
//             .populate('brand_id');

//         if (!simc) {
//             res.status(500).send({ success: false })
//         }
//         const simcWithSubcategories = await Promise.all(simc.map(async item => {
//             const subCategoryData = await dataSubCategoryModel.findOne({ data_sub_cat_id: item.sub_cat_id });
//             return { ...item.toObject(), sub_cat_data: subCategoryData };
//         }));

//         res.status(200).send(simcWithSubcategories);
//     } catch (err) {
//         res.status(500).send({ error: err, sms: 'Error getting all data brand' })
//     }
// };

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
                $project: {
                    _id: 1,
                    data_name: 1,
                    cat_id: 1,
                    sub_cat_id: 1,
                    platform_id: 1,
                    brand_id: 1,
                    content_type_id: 1,
                    created_by: 1,
                    updated_by: 1,
                    created_by_name: "$userData.user_name",
                    updated_by_name: "$userData.user_name",
                    category_name: "$category.category_name",
                    sub_category_name: "$subcategory. data_sub_cat_name",
                    platform_name: "$platform.platform_name",
                    brand_name: "$brand.brand_name",
                    content_type_name: "$contenttype.content_name"
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
        // const singlesim = await dataModel.findById(req.params._id);
        // if (!singlesim) {
        //     return res.status(500).send({ success: false })
        // }
        // res.status(200).send(singlesim);
        const singlesim = await dataModel.aggregate([
            {
                $match: {
                    _id: req.params._id
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
                $project: {
                    _id: 1,
                    data_name: 1,
                    cat_id: 1,
                    sub_cat_id: 1,
                    platform_id: 1,
                    brand_id: 1,
                    content_type_id: 1,
                    created_by: 1,
                    updated_by: 1,
                    created_by_name: "$userData.user_name",
                    updated_by_name: "$userData.user_name",
                    category_name: "$category.category_name",
                    sub_category_name: "$subcategory. data_sub_cat_name",
                    platform_name: "$platform.platform_name",
                    brand_name: "$brand.brand_name",
                    content_type_name: "$contenttype.content_name",
                    data_image: {
                        $cond: {
                            if: { $ne: ['$data_upload', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}/uploads/dataimages/`,
                                    '$data_upload'
                                ]
                            },
                            else: null
                        }
                    },
                },
            },
        ]);
        if (!singlesim) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(singlesim)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting data details' })
    }
};

exports.getDataBasedDataName = async (req, res) => {
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
                $project: {
                    _id: 1,
                    data_name: 1,
                    cat_id: 1,
                    sub_cat_id: 1,
                    platform_id: 1,
                    brand_id: 1,
                    content_type_id: 1,
                    created_by: 1,
                    updated_by: 1,
                    created_by_name: "$userData.user_name",
                    updated_by_name: "$userData.user_name",
                    category_name: "$category.category_name",
                    sub_category_name: "$subcategory. data_sub_cat_name",
                    platform_name: "$platform.platform_name",
                    brand_name: "$brand.brand_name",
                    content_type_name: "$contenttype.content_name",
                    data_image: {
                        $cond: {
                            if: { $ne: ['$data_upload', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}/uploads/dataimages/`,
                                    '$data_upload'
                                ]
                            },
                            else: null
                        }
                    },
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
        const editsim = await demoModel.findByIdAndUpdate(req.body._id, {
            data_name: req.body.data_name,
            remark: req.body.remark,
            data_type: req.body.data_type,
            size_in_mb: req.body.size_in_mb,
            cat_id: req.body.cat_id,
            sub_cat_id: req.body.sub_cat_id,
            platform_id: req.body.platform_id,
            brand_id: req.body.brand_id,
            content_type_id: req.body.content_type_id,
            data_upload: req?.file?.filename,
            created_by: req.body.created_by,
            updated_at: req.body.updated_at,
            updated_by: req.body.updated_by
        }, { new: true })

        res.status(200).send({ success: true, data: editsim })
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error updating data details' })
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