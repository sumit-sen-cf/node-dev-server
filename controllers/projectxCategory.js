const projectxCategorySchema = require("../models/projectxCategoryModel.js");
const response = require("../common/response");
exports.addProjectxCategory = async (req, res) => {
  const { category_name, brand_id } = req.body;
  try {
    let check = await projectxCategorySchema.findOne({
      category_name: category_name.toLowerCase().trim(),
    });
    if (check) {
      return response.returnFalse(
        200,
        req,
        res,
        "Category name must be unique",
        {}
      );
    }
    const projectxCategoryObj = new projectxCategorySchema({
      category_name,
      brand_id,
    });
    const savedprojectxCategory = await projectxCategoryObj.save();
    if (!projectxCategoryObj) {
      res
        .status(500)
        .send({ success: false, data: {}, message: "Something went wrong.." });
    } else {
      res.status(200).send({
        data: savedprojectxCategory,
        message: "projectxcategory created success",
      });
    }
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "Error adding projectxcategory to database",
    });
  }
};

exports.getProjectxCategory = async (req, res) => {
  try {
    const projectxCategory = await projectxCategorySchema.find();
    if (projectxCategory.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      res.status(200).send({ data: projectxCategory });
    }
  } catch (err) {
    res
      .status(500)
      .send({
        error: err.message,
        message: "Error getting all projectxCategory",
      });
  }
};

exports.getProjectxCategoryById = async (req, res) => {
  try {
    const fetchedData = await projectxCategorySchema.findOne({
      category_id: parseInt(req.params.id),
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
      message: "Error getting projectxCategorySchema details",
    });
  }
};

exports.editProjectxCategory = async (req, res) => {
  try {
    const { id, category_name, brand_id } = req.body;
    if (req.body.category_name) {
      let check = await projectxCategorySchema.findOne({
        category_name: category_name.toLowerCase().trim(),
        category_id: { $ne: id },
      });
      if (check) {
        return response.returnFalse(
          200,
          req,
          res,
          "Category name must be unique",
          {}
        );
      }
    }
    const editProjectxCategoryObj =
      await projectxCategorySchema.findOneAndUpdate(
        { category_id: id },
        { $set: { category_name, brand_id } },
        { new: true }
      );

    if (!editProjectxCategoryObj) {
      return res
        .status(200)
        .send({ success: false, message: "projectx category not found" });
    }

    res.status(200).send({ success: true, data: editProjectxCategoryObj });
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "Error updating the projectxcategory in the database",
    });
  }
};

exports.deleteProjectxCategory = async (req, res) => {
  const id = req.params.id;
  const condition = { category_id: id };
  try {
    const result = await projectxCategorySchema.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `projectxcategory with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `projectxcategory with ID ${id} not found`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the projectxcategory",
      error: error.message,
    });
  }
};
