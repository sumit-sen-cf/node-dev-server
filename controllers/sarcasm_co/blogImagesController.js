const { default: mongoose } = require("mongoose");
const constant = require("../../common/constant");
const response = require("../../common/response");
const {
  uploadImageWithAdjustedFileName,
  deleteImage,
} = require("../../common/uploadImage");
const blogImages = require("../../models/sarcasm_co/blogImages");

exports.addBlogImages = async (req, res) => {
  try {
    const { altDescription, blogId } = req.body;
    if (!blogId) {
      return response.returnFalse(
        402,
        req,
        res,
        "Please provide valid Blog ID",
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
          blogId,
          image: adjustedFileName,
        });
        await fileData.save();
      }
    } else {
      return response.returnFalse(
        402,
        req,
        res,
        "Please provide valid images",
        {}
      );
    }

    return response.returnTrue(200, req, res, "Successfully Saved Data", {});
  } catch (error) {
    return response.returnFalse(500, req, res, `${error.message}`, {});
  }
};

exports.getSingleBlogImagesDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await blogImages.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      {
        $addFields: {
          imageUrl: {
            $cond: {
              if: { $ne: ["$image", ""] },
              then: {
                $concat: [constant.CONST_BLOG_IMAGES_URL, "$image"],
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

exports.getAllBlogImageDetails = async (req, res) => {
  try {
    const data = await blogImages.aggregate([
      {
        $addFields: {
          imageUrl: {
            $cond: {
              if: { $ne: ["$image", ""] },
              then: {
                $concat: [constant.CONST_BLOG_IMAGES_URL, "$image"],
              },
              else: null,
            },
          },
        },
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

exports.updateSingleBlogImageDetails = async (req, res) => {
  try {
    const { id } = req.body;
    const data = await blogImages.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

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
      await deleteImage(`${constant.CONST_SARCASM_FOLDER}/${data.image}`);
      data.image = adjustedFileName;
    }
    await data.save();
    return response.returnTrue(200, req, res, "Successfully Update Data", data);
  } catch (error) {
    return response.returnFalse(500, req, res, `${error.message}`, {});
  }
};

exports.deleteBlogImageDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await blogImages.findByIdAndDelete(id);
    if (!data) {
      return response.returnFalse(200, req, res, `No Record Found`, {});
    }
    await deleteImage(`${constant.CONST_SARCASM_FOLDER}/${data.image}`);
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
