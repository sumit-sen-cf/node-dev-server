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
    // Extract page and limit from query parameters, default to null if not provided
    const page = req.query?.page ? parseInt(req.query.page) : 1;
    const limit = req.query?.limit ? parseInt(req.query.limit) : 10;

    // Calculate the number of records to skip based on the current page and limit
    const skip = page && limit ? (page - 1) * limit : 0;
    const data = await blogCategoryModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
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
exports.getRecentBlogsForEachBlogCategory = async (req, res) => {
  try {
    // Extract page and limit from query parameters, default to null if not provided
    const page = req.query?.page ? parseInt(req.query.page) : 1;
    const limit = req.query?.limit ? parseInt(req.query.limit) : 10;

    // Calculate the number of records to skip based on the current page and limit
    const skip = page && limit ? (page - 1) * limit : 0;

    const data = await blogCategoryModel.aggregate([
      // Stage 1: Fetch all categories
      {
        $lookup: {
          from: "blogmodels",
          localField: "_id",
          foreignField: "blogCategoryId",
          as: "recentBlogs",
        },
      },
      // Stage 2: Unwind the recentBlogs array
      {
        $unwind: {
          path: "$recentBlogs",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Stage 3: Sort blogs within each category by createdAt
      {
        $sort: {
          "recentBlogs.createdAt": -1,
        },
      },
      // Stage 4: Group back to categories and get the most recent blog for each category
      {
        $group: {
          _id: "$_id",
          categoryName: { $first: "$name" }, // Adjust based on your schema
          recentBlog: { $first: "$recentBlogs" },
        },
      },
      // Stage 5: Pagination
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

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
