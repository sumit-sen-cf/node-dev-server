const response = require("../common/response.js");
const dataCategoryModel = require("../models/dataCategoryModel.js");
const dataSubCategoryModel = require("../models/dataSubCategoryModel.js");

exports.addDataCategory = async (req, res) => {
    try {
        const datacategory = new dataCategoryModel({
            category_name: req.body.category_name,
            remark: req.body.remark,
            created_by: req.body.created_by,
            updated_by: req.body.updated_by
        });
        const simv = await datacategory.save();
        return response.returnTrue(
            200,
            req,
            res,
            "Data Category Created Successfully",
            simv
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

// exports.getDataCategorys = async (req, res) => {
//     try {
//         const simc = await dataCategoryModel.find({});

//         const subCategoryCount = await dataSubCategoryModel.countDocuments({ cat_id: { $in: simc.map(cat => cat._id) } });

//         if (!simc) {
//             res.status(500).send({ success: false })
//         }
//         res.status(200).send({ simc, subCategoryCount })
//     } catch (err) {
//         res.status(500).send({ error: err, sms: 'Error getting all data categories' })
//     }
// };

exports.getDataCategorys = async (req, res) => {
    try {
        const simc = await dataCategoryModel.find({});

        const subCategoryCounts = await Promise.all(simc.map(async (category) => {
            const subCategoryCount = await dataSubCategoryModel.countDocuments({ cat_id: category._id });
            return {
                _id: category._id,
                category_name: category.category_name,
                created_by: category.created_by,
                updated_by: category.updated_by,
                created_at: category.created_at,
                updated_at: category.updated_at,
                sub_category_count: subCategoryCount,
                __v: category.__v
            };
        }));

        // const totalSubCategoryCount = subCategoryCounts.reduce((total, category) => total + category.sub_category_count, 0);

        if (!simc) {
            res.status(500).send({ success: false });
        }

        const simcWithSubCategoryCount = simc.map((category, index) => ({
            ...category.toObject(),
            sub_category_count: subCategoryCounts[index].sub_category_count
        }));

        res.status(200).send({ simcWithSubCategoryCount });
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting all data categories' });
    }
};

exports.getSingleDataCategory = async (req, res) => {
    try {
        const singlesim = await dataCategoryModel.findById(req.params._id);
        if (!singlesim) {
            return res.status(500).send({ success: false })
        }
        res.status(200).send(singlesim);
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting data sub category details' })
    }
};

exports.editDataCategory = async (req, res) => {
    try {
        const editsim = await dataCategoryModel.findByIdAndUpdate(req.body._id, {
            category_name: req.body.category_name,
            remark: req.body.remark,
            created_by: req.body.created_by,
            updated_at: req.body.updated_at,
            updated_by: req.body.updated_by
        }, { new: true })

        res.status(200).send({ success: true, data: editsim })
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error updating data category details' })
    }
};

exports.deleteDataCategory = async (req, res) => {
    dataCategoryModel.findByIdAndDelete(req.params._id).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'data category deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'data category not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
};

exports.getDataSubCategoryCount = async (req, res) => {
    try {
        const categoryId = req.params._id;

        const category = await dataCategoryModel.findOne({
            _id: categoryId,
        });

        if (!category) {
            return response.returnFalse(200, req, res, "No Record Found...", {});
        }

        const subCategories = await dataSubCategoryModel.find({
            cat_id: categoryId,
        });

        const subCategoryCount = subCategories.length;

        const result = {
            sub_categories: subCategories,
            sub_category_count: subCategoryCount,
        };

        return response.returnTrue(
            200,
            req,
            res,
            "Data Category Data Fetch Successfully",
            result
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};
