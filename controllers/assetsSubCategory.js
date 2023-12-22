const response = require("../common/response.js");
const assetsSubCategoryModel = require("../models/assetsSubCategoryModel.js");

exports.addAssetSubCategory = async (req, res) => {
    try {
        const assetssubc = new assetsSubCategoryModel({
            sub_category_name: req.body.sub_category_name,
            category_id: req.body.category_id,
            description: req.body.description,
            created_by: req.body.created_by,
            last_updated_by: req.body.last_updated_by,
            inWarranty : req.body.inWarranty
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

exports.getAssetSubCategorys = async (req, res) => {
    try {
        const assetssubc = await assetsSubCategoryModel
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
                    $unwind: "$category",
                },
                {
                    $project: {
                        _id: 1,
                        category_name: "$category.category_name",
                        sub_category_id: "$sub_category_id",
                        sub_category_name: "$sub_category_name",
                        remark: "$remark",
                        created_by: "$created_by",
                        creation_date: "$creation_date",
                        last_updated_by: "$last_updated_by",
                        last_updated_at: "$last_updated_at",
                        category_id: "$category_id",
                        description: "$description",
                        inWarranty : "$inWarranty"
                    },
                },
            ])
            .exec();
        if (!assetssubc) {
            return response.returnFalse(200, req, res, "No Reord Found...", []);
        }
        res.status(200).send(assetssubc)
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
                        inWarranty : "$inWarranty"
                    },
                },
            ])
            .exec();

        return res.status(200).send(singlesim);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getSingleAssetCat = async (req,res) => {
    try {
        const singleAsset = await assetsSubCategoryModel.find({ sub_category_id : parseInt(req.params.sub_category_id)});
        if(!singleAsset){
            return res.status(500).send({ success : false });
        }
        res.status(200).send({ data : singleAsset });
    } catch (error) {
        res.status(500).send({ error : error.message , sms: "Error getting asset details" });
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
                inWarranty : req.body.inWarranty
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