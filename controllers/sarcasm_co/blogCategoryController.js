
const response = require("../../common/response");
const blogCategoryModel = require("../../models/sarcasm_co/blogCategoryModel");

exports.addBlogCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const savingObj = blogCategoryModel({
      name,
    });
    const savedObj = await savingObj.save();
    if (!savedObj) {
      return response.returnFalse(
        500,
        req,
        res,
        `Oop's Something went wrong while saving data.`,
        {}
      );
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Successfully Saved Data",
      savedObj
    );
  } catch (error) {
    return response.returnFalse(500, req, res, `${error.message}`, {});
  }
};

exports.getSingleBlogCategoryDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await blogCategoryModel.findById(id);
    if (!data) {
      return response.returnFalse(200, req, res, `No Record Found`, {});
    }
    return response.returnTrue(200, req, res, "Successfully Fetch Data", data);
  } catch (error) {
    return response.returnFalse(500, req, res, `${error.message}`, {});
  }
};

exports.getAllBlogCategoryDetails = async (req, res) => {
  try {
    const data = await blogCategoryModel.find();
    if (data?.length <= 0) {
      return response.returnFalse(200, req, res, `No Record Found`, []);
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Successfully Fetch Details",
      data
    );
  } catch (error) {
    return response.returnFalse(500, req, res, `${error.message}`, {});
  }
};

exports.updateSingleBlogCategoryDetails = async (req, res) => {
  try {
    const { id } = req.body;
    const data = await blogCategoryModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    if (!data) {
      return response.returnFalse(200, req, res, `No Record Found`, {});
    }
    return response.returnTrue(200, req, res, "Successfully Update Data", data);
  } catch (error) {
    return response.returnFalse(500, req, res, `${error.message}`, {});
  }
};

exports.deleteBlogCategoryDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await blogCategoryModel.findByIdAndDelete(id);
    if (!data) {
      return response.returnFalse(200, req, res, `No Record Found`, {});
    }
    return response.returnTrue(
      200,
      req,
      res,
      `Successfully Delete Data for id ${id}`,
      data
    );
  } catch (error) {
    return response.returnFalse(500, req, res, `${error.message}`, {});
  }
};
