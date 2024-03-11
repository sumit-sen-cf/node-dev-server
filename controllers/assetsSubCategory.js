const response = require("../common/response.js");
const assetsSubCategoryModel = require("../models/assetsSubCategoryModel.js");
const assetsCategoryModel = require("../models/assetsCategoryModel.js");
const simModel = require("../models/simModel.js");

exports.addAssetSubCategory = async (req, res) => {
    try {
        const assetssubc = new assetsSubCategoryModel({
            sub_category_name: req.body.sub_category_name,
            category_id: req.body.category_id,
            description: req.body.description,
            created_by: req.body.created_by,
            last_updated_by: req.body.last_updated_by,
            inWarranty: req.body.inWarranty
        });
        const simv = await assetssubc.save();
        return response.returnTrue(
            200,
            req,
            res,
            "Assets Category Created Successfully",
            simv
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

// exports.getAssetSubCategorys = async (req, res) => {
//     try {
//         const assetSubCategories = await assetsSubCategoryModel.find().exec();

//         if (!assetSubCategories || assetSubCategories.length === 0) {
//             return response.returnFalse(200, req, res, "No Record Found...", []);
//         }

//         const result = [];

//         for (const subcategory of assetSubCategories) {
//             const subCategories = await assetsCategoryModel.find({
//                 category_id: subcategory.category_id,
//             });

//             const subCategoryCount = subCategories.length;

//             const totalAllocatedAssets = await simModel.countDocuments({
//                 category_id: subcategory.category_id,
//                 status: 'Allocated',
//             });

//             const totalAvailableAssets = await simModel.countDocuments({
//                 category_id: subcategory.category_id,
//                 status: 'Available',
//             });
//             result.push({
//                 sub_category_id: subcategory.sub_category_id,
//                 sub_category_name: subcategory.sub_category_name,
//                 category_id: subcategory.category_id,
//                 // category_name: ,
//                 sub_category_count: subCategoryCount,
//                 allocated_assets_count: totalAllocatedAssets,
//                 available_assets_count: totalAvailableAssets
//             });
//         }

//         return response.returnTrue(
//             200,
//             req,
//             res,
//             "Asset Sub-Categories Data Fetch Successfully",
//             result
//         );
//     } catch (err) {
//         return response.returnFalse(500, req, res, err.message, {});
//     }
// };

exports.getAssetSubCategorys = async (req, res) => {
    try {
        const assetSubCategories = await assetsSubCategoryModel.find({});

        if (!assetSubCategories || assetSubCategories.length === 0) {
            return response.returnFalse(200, req, res, "No Record Found...", []);
        }

        const result = [];

        for (const subcategory of assetSubCategories) {
            const subCategories = await assetsCategoryModel.find({
                category_id: subcategory.category_id,
            });

            const subCategoryCount = subCategories.length;

            const totalAllocatedAssets = await simModel.countDocuments({
                category_id: subcategory.category_id,
                status: 'Allocated',
            });

            const totalAvailableAssets = await simModel.countDocuments({
                category_id: subcategory.category_id,
                status: 'Available',
            });

            const category = await assetsCategoryModel.findOne({
                category_id: subcategory.category_id,
            });

            result.push({
                sub_category_id: subcategory.sub_category_id,
                sub_category_name: subcategory.sub_category_name,
                category_id: subcategory.category_id,
                category_name: category ? category?.category_name : '',
                sub_category_count: subCategoryCount,
                allocated_assets_count: totalAllocatedAssets,
                available_assets_count: totalAvailableAssets,
                inWarranty: subcategory.inWarranty
            });
        }

        // // Sort the result array based on sub_category_id
        // result.sort((a, b) => b.sub_category_id - a.sub_category_id);

        return response.returnTrue(
            200,
            req,
            res,
            "Asset Sub-Categories Data Fetch Successfully",
            result
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getSingleAssetSubCategory = async (req, res) => {
    try {
        const singlesim = await assetsSubCategoryModel
            .aggregate([
                {
                    $match: { category_id: parseInt(req.params.category_id) },
                },
                {
                    $lookup: {
                        from: "assetscategorymodels",
                        localField: "category_id",
                        foreignField: "category_id",
                        as: "category",
                    },
                },
                {
                    $unwind: "$category",
                },
                {
                    $project: {
                        _id: 1,
                        category_name: "$category.dept_name",
                        sub_category_id: "$sub_category_id",
                        sub_category_name: "$sub_category_name",
                        category_id: "$category_id",
                        id: "$id",
                        created_by: "$created_by",
                        last_updated_by: "$last_updated_by",
                        description: "$description",
                        inWarranty: "$inWarranty"
                    },
                },
            ])
            .exec();

        return res.status(200).send(singlesim);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getSingleAssetCat = async (req, res) => {
    try {
        const singleAsset = await assetsSubCategoryModel.find({ sub_category_id: parseInt(req.params.sub_category_id) });
        if (!singleAsset) {
            return res.status(500).send({ success: false });
        }
        res.status(200).send({ data: singleAsset });
    } catch (error) {
        res.status(500).send({ error: error.message, sms: "Error getting asset details" });
    }
}

exports.editAssetSubCategory = async (req, res) => {
    try {
        const editsim = await assetsSubCategoryModel.findOneAndUpdate(
            { sub_category_id: parseInt(req.body.sub_category_id) },
            {
                sub_category_name: req.body.sub_category_name,
                category_id: req.body.category_id,
                description: req.body.description,
                created_by: req.body.created_by,
                last_updated_by: req.body.last_updated_by,
                last_updated_date: req.body.last_updated_date,
                inWarranty: req.body.inWarranty
            },
            { new: true }
        );
        if (!editsim) {
            return response.returnFalse(
                200,
                req,
                res,
                "No Reord Found With This Asset Category Id",
                {}
            );
        }
        return response.returnTrue(200, req, res, "Updation Successfully", editsim);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.deleteAssetSubCategory = async (req, res) => {
    assetsSubCategoryModel.deleteOne({ sub_category_id: req.params.sub_category_id }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'Asset Sub Category deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'Asset Sub Category not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err.message })
    })
};

exports.getAssetSubCategoryFromCategoryId = async (req, res) => {
    try {
        const singlesim = await assetsSubCategoryModel
            .aggregate([
                {
                    $match: { category_id: parseInt(req.params.category_id) },
                },
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
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        category_name: "$category.category_name",
                        sub_category_name: "$sub_category_name",
                        category_id: "$category_id",
                        sub_category_id: "$sub_category_id",
                    },
                },
            ])
            .exec();
        return res.status(200).send(singlesim);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getTotalAssetInSubCategory = async (req, res) => {
    try {
        const assets = await simModel
            .aggregate([
                {
                    $match: {
                        sub_category_id: parseInt(req.params.sub_category_id),
                        status: "Available",
                    }
                },
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
                        sim_id: "$sim_id",
                        asset_id: "$sim_no",
                        status: "$status",
                        asset_type: "$s_type",
                        assetsName: "$assetsName",
                        category_id: "$category_id",
                        sub_category_id: "$sub_category_id",
                        category_name: "$category.category_name",
                        sub_category_name: "$subcategory.sub_category_name"
                    },
                },
            ])
            .exec();

        if (!assets || assets.length === 0) {
            return res.status(404).send({ success: false, message: 'No assets found for the given sub_category_id' });
        }

        res.status(200).send({ success: true, data: assets });
    } catch (err) {
        console.error(err);
        res.status(500).send({ success: false, error: err, message: 'Error getting asset details' });
    }
};

exports.getTotalAssetInSubCategoryAllocated = async (req, res) => {
    try {
        const assets = await simModel.aggregate([
            {
                $match: {
                    sub_category_id: parseInt(req.params.sub_category_id),
                    status: "Allocated",
                },
            },
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
                    sim_id: "$sim_id",
                    asset_id: "$sim_no",
                    status: "$status",
                    asset_type: "$s_type",
                    assetsName: "$assetsName",
                    category_id: "$category_id",
                    sub_category_id: "$sub_category_id",
                    category_name: "$category.category_name",
                    sub_category_name: "$subcategory.sub_category_name",
                },
            },
        ]).exec();
        if (!assets || assets.length === 0) {
            return res.status(404).send({ success: false, message: 'No assets found for the given sub_category_id' });
        }

        res.status(200).send({ success: true, data: assets });
    } catch (err) {
        console.error(err);
        res.status(500).send({ success: false, error: err, message: 'Error getting asset details' });
    }
};
