const { default: mongoose } = require("mongoose");
const constant = require("../../common/constant");
const response = require("../../common/response");
const {
  uploadImageWithAdjustedFileName,
  deleteImage,
} = require("../../common/uploadImage");
const blogImages = require("../../models/sarcasm_co/blogImages");
const blogModel = require("../../models/sarcasm_co/blogModel");

exports.addBlog = async (req, res) => {
  try {
    const {
      blogCategoryId,
      title,
      body,
      bannerAltDesc,
      metaTitle,
      metaDescription,
      altDescription,
    } = req.body;
    if (!blogCategoryId) {
      return response.returnFalse(
        402,
        req,
        res,
        `Please provide valid blog category ID.`,
        {}
      );
    }
    const savingObj = blogModel({
      blogCategoryId,
      title,
      body,
      bannerAltDesc,
      metaTitle,
      metaDescription,
    });
    if (req.files?.bannerImage) {
      const timestamp = Date.now();
      const fileNamePrefix = req.files?.bannerImage[0].originalname
        .slice(0, 5)
        .replace(/\s+/g, "");
      const adjustedFileName = `${timestamp}_${fileNamePrefix}${constant.CONST_IMAGE_FORMATE}`;
      let imageResult = await uploadImageWithAdjustedFileName(
        adjustedFileName,
        req.files?.bannerImage[0],
        constant.CONST_SARCASM_FOLDER
      );
      savingObj.bannerImage = adjustedFileName;
    }
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
    if (req.files?.blog_images) {
      for (const file of req.files?.blog_images) {
        const timestamp = Date.now();
        const fileNamePrefix = file.originalname
          .slice(0, 5)
          .replace(/\s+/g, "");
        const adjustedFileName = `${timestamp}_${fileNamePrefix}${constant.CONST_IMAGE_FORMATE}`;
        let imageResult = await uploadImageWithAdjustedFileName(
          adjustedFileName,
          file,
          constant.CONST_SARCASM_FOLDER
        );

        const fileData = new blogImages({
          altDescription,
          blogId: savedObj?._id,
          image: adjustedFileName,
        });
        await fileData.save();
      }
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

exports.getSingleBlogDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await blogModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      {
        $addFields: {
          bannerImageUrl: {
            $cond: {
              if: { $ne: ["$bannerImage", ""] },
              then: {
                $concat: [constant.CONST_BLOG_IMAGES_URL, "$bannerImage"],
              },
              else: null,
            },
          },
        },
      },
    ]);

    if (!data || data.length === 0) {
      return response.returnFalse(200, req, res, `No Record Found`, {});
    }

    return response.returnTrue(
      200,
      req,
      res,
      "Successfully Fetch Data",
      data[0]
    );
  } catch (error) {
    return response.returnFalse(500, req, res, `${error.message}`, {});
  }
};

exports.getAllBlogDetails = async (req, res) => {
  try {
    // Extract page and limit from query parameters, default to null if not provided
    const page = req.query?.page ? parseInt(req.query.page) : 1;
    const limit = req.query?.limit ? parseInt(req.query.limit) : 10;

    // Calculate the number of records to skip based on the current page and limit
    const skip = page && limit ? (page - 1) * limit : 0;
    const data = await blogModel.aggregate([
      {
        $addFields: {
          bannerImageUrl: {
            $cond: {
              if: { $ne: ["$bannerImage", ""] },
              then: {
                $concat: [constant.CONST_BLOG_IMAGES_URL, "$bannerImage"],
              },
              else: null,
            },
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      // Skip stage
      {
        $skip: skip,
      },
      // Limit stage
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
exports.getAllBlogByCategory = async (req, res) => {
  try {
    // Extract page and limit from query parameters, default to null if not provided
    const page = req.query?.page ? parseInt(req.query.page) : 1;
    const limit = req.query?.limit ? parseInt(req.query.limit) : 10;
    // Calculate the number of records to skip based on the current page and limit
    const skip = page && limit ? (page - 1) * limit : 0;
    const data = await blogModel.aggregate([
      {
        $match: {
          blogCategoryId: mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $addFields: {
          bannerImageUrl: {
            $cond: {
              if: { $ne: ["$bannerImage", ""] },
              then: {
                $concat: [constant.CONST_BLOG_IMAGES_URL, "$bannerImage"],
              },
              else: null,
            },
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      // Skip stage
      {
        $skip: skip,
      },
      // Limit stage
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

exports.updateSingleBlogDetails = async (req, res) => {
  try {
    const { id } = req.body;
    let data = await blogModel.findByIdAndUpdate(id, { $set: req.body });
    if (!data) {
      return response.returnFalse(200, req, res, `No Record Found`, {});
    }
    if (req.file) {
      const timestamp = Date.now();
      const fileNamePrefix = req.file?.originalname
        .slice(0, 5)
        .replace(/\s+/g, "");
      const adjustedFileName = `${timestamp}_${fileNamePrefix}${constant.CONST_IMAGE_FORMATE}`;
      let imageResult = await uploadImageWithAdjustedFileName(
        adjustedFileName,
        req.file,
        constant.CONST_SARCASM_FOLDER
      );
      await deleteImage(`${constant.CONST_SARCASM_FOLDER}/${data.bannerImage}`);
      data.bannerImage = adjustedFileName;
    }
    await data.save();
    return response.returnTrue(200, req, res, "Successfully Update Data", data);
  } catch (error) {
    return response.returnFalse(500, req, res, `${error.message}`, {});
  }
};

exports.deleteBlogDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await blogModel.findByIdAndDelete(id);
    if (!data) {
      return response.returnFalse(200, req, res, `No Record Found`, {});
    }
    await deleteImage(`${constant.CONST_SARCASM_FOLDER}/${data.bannerImage}`);
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
