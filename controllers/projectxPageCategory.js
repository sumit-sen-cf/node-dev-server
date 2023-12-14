const projectxPageCategorySchema = require("../models/projectxPageCategoryModel.js");

exports.addProjectxPageCategory = async (req, res) => {
  try {
    const projectxPageCategoryObj = new projectxPageCategorySchema({
      category_name: req.body.category_name,
    });
    const savedprojectxPageCategory = await projectxPageCategoryObj.save();
    if (!projectxPageCategoryObj) {
      res
        .status(500)
        .send({ success: false, data: {}, message: "Something went wrong.." });
    } else {
      res.status(200).send({
        data: savedprojectxPageCategory,
        message: "projectxpagecategory created success",
      });
    }
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "Error adding projectx page category to database",
    });
  }
};

exports.getProjectxPageCategory = async (req, res) => {
  try {
    const projectxPageCategory = await projectxPageCategorySchema.find();
    if (projectxPageCategory.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      res.status(200).send({ data: projectxPageCategory });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting all projectxPageCategory" });
  }
};

exports.getProjectxPageCategoryById = async (req, res) => {
  try {
    const fetchedData = await projectxPageCategorySchema.findOne({
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
      message: "Error getting projectx page category details",
    });
  }
};
exports.editProjectxPageCategory = async (req, res) => {
    try {
      const { id, category_name } = req.body;
  
      const editProjectxPageCategoryObj = await projectxPageCategorySchema.findOneAndUpdate(
        id,
        { category_name },
        { new: true }
      );
  
      if (!editProjectxPageCategoryObj) {
        return res
          .status(404)
          .send({ success: false, message: "Page category not found" });
      }
  
      res.status(200).send({ success: true });
    } catch (err) {
      res.status(500).send({
        error: err,
        message: "Error updating the projectxpagecategory in the database",
      });
    }
  };
  

exports.deleteProjectxPageCategory = async (req, res) => {
  const id = req.params.id;
  const condition = { category_id: id };
  try {
    const result = await projectxPageCategorySchema.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `projectx page category with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `projectx page category with ID ${id} not found`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the projectx page category",
      error: error.message,
    });
  }
};
