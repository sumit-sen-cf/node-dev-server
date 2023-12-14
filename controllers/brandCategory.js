const brandCategoryModel = require("../models/brandCategoryModel.js");

exports.addBrandCategory = async (req, res) => {
    const { brandCategory_name, brand_id, created_by } = req.body;
    try {
        const brandcategory = new brandCategoryModel({
            brandCategory_name,
            brand_id,
            created_by
        });
        const savedbrandcategory = await brandcategory.save();
        res.status(200).send({
            data: savedbrandcategory,
            message: "brandcategory created success",
        });
    } catch (err) {
        res.status(500).send({
            error: err.message,
            message: "Error adding brandcategory to database",
        });
    }
};

exports.getBrandCategorys = async (req, res) => {
    try {
        const brandcategorydata = await brandCategoryModel.find();
        if (brandcategorydata.length === 0) {
            res
                .status(200)
                .send({ success: true, data: [], message: "No Record found" });
        } else {
            res.status(200).send({ data: brandcategorydata });
        }
    } catch (err) {
        res
            .status(500)
            .send({ error: err.message, message: "Error getting all brandcategorydata" });
    }
};

exports.getBrandCategoryById = async (req, res) => {
    try {
      const fetchedData = await brandCategoryModel.findOne({
        brandCategory_id: parseInt(req.params.id),
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
        error: err.message,
        message: "Error getting brandCategory details",
      });
    }
  };

exports.editBrandCategory = async (req, res) => {
    try {
        const editbrandCategory = await brandCategoryModel.findOneAndUpdate({ brandCategory_id: req.body.brandCategory_id }, {
            brandCategory_name: req.body.brandCategory_name,
            brand_id: req.body.brand_id,
            created_by: req.body.created_by
        }, { new: true })
        if (!editbrandCategory) {
            res.status(500).send({ success: false })
        }
        res.status(200).send({ success: true, data: editbrandCategory })
    } catch (err) {
        res.status(500).send({
            error: err.message,
            message: "Error updating the brandCategory in the database",
        });
    }
};


exports.deleteBrandCategory = async (req, res) => {
    const id = req.params.id;
    const condition = { brandCategory_id: id };
    try {
      const result = await brandCategoryModel.deleteOne(condition);
      if (result.deletedCount === 1) {
        return res.status(200).json({
          success: true,
          message: `brandCategory with ID ${id} deleted successfully`,
        });
      } else {
        return res.status(200).json({
          success: false,
          message: `brandCategory with ID ${id} not found`,
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the brandCategory",
        error: error.message,
      });
    }
  };