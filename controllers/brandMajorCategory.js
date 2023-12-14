const brandMajorCategoryModel = require("../models/brandMajorCategoryModel.js");

exports.addBrandMajorCategory = async (req, res) => {
  const { brandMajorCategory_name, brand_id, created_by } = req.body;
  try {
    const brandmajorcategory = new brandMajorCategoryModel({
      brandMajorCategory_name,
      brand_id,
      created_by,
    });
    const savedbrandmajorcategory = await brandmajorcategory.save();
    res.status(200).send({
      data: savedbrandmajorcategory,
      message: "brandmajorcategory created success",
    });
  } catch (err) {
    res.status(500).send({
      error: err,
      message: "Error adding brandmajorcategory to database",
    });
  }
};

exports.getBrandMajorCategorys = async (req, res) => {
  try {
    const brandmajorcategorydata = await brandMajorCategoryModel.find();
    if (brandmajorcategorydata.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      res.status(200).send({ data: brandmajorcategorydata });
    }
  } catch (err) {
    res
      .status(500)
      .send({
        error: err,
        message: "Error getting all brandmajorcategorydata",
      });
  }
};

exports.getBrandMajorCategoryById = async (req, res) => {
  try {
    const fetchedData = await brandMajorCategoryModel.findOne({
      brandMajorCategory_id: parseInt(req.params.id),
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
      message: "Error getting brandMajorCategory details",
    });
  }
};

exports.editBrandMajorCategory = async (req, res) => {
  try {
    const editbrandmajorCategory =
      await brandMajorCategoryModel.findOneAndUpdate(
        { brandCategory_id: req.body.brandCategory_id },
        {
          brandMajorCategory_name: req.body.brandMajorCategory_name,
          brand_id: req.body.brand_id,
          created_by: req.body.created_by,
        },
        { new: true }
      );
    if (!editbrandmajorCategory) {
      return res
        .status(200)
        .send({ success: false, message: "Brand Major Category not found" });
    }
    return res
      .status(200)
      .send({ success: true, data: editbrandmajorCategory });
  } catch (err) {
    res.status(500).send({
      error: err,
      message: "Error updating the brandmajorCategory in the database",
    });
  }
};

exports.deleteBrandMajorCategory = async (req, res) => {
  const id = req.params.id;
  const condition = { brandMajorCategory_id: id };
  try {
    const result = await brandMajorCategoryModel.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `brandMajorCategory with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `brandMajorCategory with ID ${id} not found`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the brandMajorCategory",
      error: error.message,
    });
  }
};
