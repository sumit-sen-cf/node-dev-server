const brandSubCategoryModel = require("../models/brandSubCategoryModel.js");

exports.addBrandSubCategory = async (req, res) => {
    const { brandSubCategory_name, brandCategory_id, created_by } = req.body;
    try {
        let check = await brandSubCategoryModel.findOne({
            brandSubCategory_name: brandSubCategory_name?.toLowerCase().trim(),
            brandCategory_id: parseInt(brandCategory_id),
          });
          if (check) {
           return res.status(200).send({
                data: {},
                message: "Provided brandCategory_id and existing brandSubCategory_name should be unique.",
            });
          }
        const brandsubcategory = new brandSubCategoryModel({
            brandSubCategory_name,
            brandCategory_id,
            created_by
        });
        const savedbrandsubcategory = await brandsubcategory.save();
       return res.status(200).send({
            data: savedbrandsubcategory,
            message: "brandsubcategory created success",
        });
    } catch (err) {
      return  res.status(500).send({
            error: err,
            message: "Error adding brandsubcategory to database",
        });
    }
};

exports.getBrandSubCategorys = async (req, res) => {
    try {
        const brandsubcategorydata = await brandSubCategoryModel.find();
        if (brandsubcategorydata.length === 0) {
            res
                .status(200)
                .send({ success: true, data: [], message: "No Record found" });
        } else {
            res.status(200).send({ data: brandsubcategorydata });
        }
    } catch (err) {
        res
            .status(500)
            .send({ error: err, message: "Error getting all brandsubcategorydata" });
    }
};

exports.getBrandSubCategoryById = async (req, res) => {
    try {
        const fetchedData = await brandSubCategoryModel.findOne({
            brandSubCategory_id: parseInt(req.params.id),
        });
        if (!fetchedData) {
            return res
                .status(200)
                .send({ success: false, data: {}, message: "No Record found" });
        } else {
            res.status(200).send({ data: fetchedData });
        }
    } catch (err) {
        res.status(500).send({
            error: err,
            message: "Error getting brandSubCategory details",
        });
    }
};

exports.editBrandSubCategory = async (req, res) => {
    try {
        let check = await brandSubCategoryModel.findOne({
            brandSubCategory_name: req.body?.brandSubCategory_name?.toLowerCase().trim(),
            brandCategory_id: req.body?.brandCategory_id && parseInt(req.body?.brandCategory_id),
            brandSubCategory_id: { $ne: req.body.brandSubCategory_id },
          });
          if (check) {
           return res.status(200).send({
                data: {},
                message: "Provided brandCategory_id and existing brandSubCategory_name should be unique.",
            });
          }
        const editbrandsubCategory = await brandSubCategoryModel.findOneAndUpdate({ brandSubCategory_id: req.body.brandSubCategory_id }, {
            brandSubCategory_name: req.body.brandSubCategory_name,
            brandCategory_id: req.body.brandCategory_id,
            created_by: req.body.created_by
        }, { new: true })
        if (!editbrandsubCategory) {
          return  res.status(500).send({ success: false })
        }
      return  res.status(200).send({ success: true, data: editbrandsubCategory })
    } catch (err) {
      return  res.status(500).send({
            error: err.message,
            message: "Error updating the brandsubCategory in the database",
        });
    }
};


exports.deleteBrandSubCategory = async (req, res) => {
    const id = req.params.id;
    const condition = { brandSubCategory_id: id };
    try {
        const result = await brandSubCategoryModel.deleteOne(condition);
        if (result.deletedCount === 1) {
            return res.status(200).json({
                success: true,
                message: `brandSubCategory with ID ${id} deleted successfully`,
            });
        } else {
            return res.status(200).json({
                success: false,
                message: `brandSubCategory with ID ${id} not found`,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the brandSubCategory",
            error: error.message,
        });
    }
};