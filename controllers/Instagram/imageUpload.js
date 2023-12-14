const { default: mongoose } = require("mongoose");
const constant = require("../../common/constant");
const response = require("../../common/response");
const helper = require("../../helper/helper");
const imageModel = require("../../models/Instagram/imageUpload");

exports.addImage = async (req, res) => {
  try {
    const { img_type, created_by } = req.body;
    let img =
      req.files?.brandImageToServer ||
      req.files?.campaignImageToServer ||
      req.files?.creatorImageToServer;
    let savedDocuments = [];
    if (img) {
      for (const file of img) {
        const savingImag = new imageModel({
          img: file.filename,
          img_type,
          created_by,
        });
        const savedImg = await savingImag.save();
        savedDocuments.push(savedImg);
      }
    }
    if (savedDocuments.length !== 0) {
      return response.returnTrue(
        200,
        req,
        res,
        "IMAGES SAVED SUCCESSFULLY",
        savedDocuments
      );
    } else {
      return response.returnFalse(200, req, res, "SOMETHING WENT WRONG", {});
    }
  } catch (err) {
    return response.returnFalse(
      500,
      req,
      res,
      `INTERNAL SERVER ERROR : ${err.message}`,
      {}
    );
  }
};
exports.getImages = async (req, res) => {
  try {
    let matchCondition = req.body.img_type
      ? { img_type: req.body.img_type }
      : {};

    const images = await imageModel.aggregate([
      { $match: matchCondition },
      {
        $addFields: {
          img_url: {
            $cond: {
              if: "$img",
              then: {
                $concat: [
                  {
                    $switch: {
                      branches: [
                        {
                          case: { $eq: ["$img_type", 1] },
                          then: `${constant.base_url}/uploads/Brand_s Avatar/`,
                        },
                        {
                          case: { $eq: ["$img_type", 2] },
                          then: `${constant.base_url}/uploads/Campaign_s Avatar/`,
                        },
                        {
                          case: { $eq: ["$img_type", 3] },
                          then: `${constant.base_url}/uploads/Creator_s Avatar/`,
                        },
                      ],
                      default: "",
                    },
                  },
                  "$img",
                ],
              },
              else: "",
            },
          },
        },
      },
    ]);

    if (images.length === 0) {
      return response.returnFalse(200, req, res, "NO RECORD FOUND", {});
    } else {
      return response.returnTrue(
        200,
        req,
        res,
        "IMAGES SAVED SUCCESSFULLY",
        images
      );
    }
  } catch (err) {
    return response.returnFalse(
      500,
      req,
      res,
      `INTERNAL SERVER ERROR : ${err.message}`,
      {}
    );
  }
};
exports.getImage = async (req, res) => {
  try {
    const image = await imageModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.id) } }, // Filter condition based on ID
      {
        $addFields: {
          img_url: {
            $cond: {
              if: "$img",
              then: {
                $concat: [
                  {
                    $switch: {
                      branches: [
                        {
                          case: { $eq: ["$img_type", 1] },
                          then: `${constant.base_url}/uploads/Brand_s Avatar/`,
                        },
                        {
                          case: { $eq: ["$img_type", 2] },
                          then: `${constant.base_url}/uploads/Campaign_s Avatar/`,
                        },
                        {
                          case: { $eq: ["$img_type", 3] },
                          then: `${constant.base_url}/uploads/Creator_s Avatar/`,
                        },
                      ],
                      default: "",
                    },
                  },
                  "$img",
                ],
              },
              else: "",
            },
          },
        },
      },
    ]);
    if (image.length === 0) {
      return response.returnFalse(200, req, res, "NO RECORD FOUND", {});
    } else {
      return response.returnTrue(
        200,
        req,
        res,
        "IMAGES FETCH SUCCESSFULLY",
        image[0]
      );
    }
  } catch (err) {
    return response.returnFalse(
      500,
      req,
      res,
      `INTERNAL SERVER ERROR : ${err.message}`,
      {}
    );
  }
};
exports.editImages = async (req, res) => {
  try {
    let image =
      req.files.brandImageToServer ||
      req.files.campaignImageToServer ||
      req.files.creatorImageToServer;
    const editImage = await imageModel.findByIdAndUpdate(req.body._id, {
      $set: {
        img: image[0].originalname,
        updated_at: Date.now(),
      },
    });

    if (!editImage) {
      return response.returnFalse(200, req, res, "NO RECORD FOUND", {});
    }

    let folderName =
      editImage?.img_type === 1
        ? "../uploads/Brand_s Avatar"
        : editImage?.img_type === 2
        ? "/uploads/Campaign_s Avatar"
        : "/uploads/Creator_s Avatar/";

    const result = helper.fileRemove(editImage?.img, folderName);
    if (result?.status == false) {
      console.log("Insta image not delete from folder");
    }

    return response.returnTrue(200, req, res, "IMAGES UPDATE SUCCESSFULLY", {});
  } catch (err) {
    return response.returnFalse(
      500,
      req,
      res,
      `INTERNAL SERVER ERROR : ${err.message}`,
      {}
    );
  }
};
exports.deleteImage = async (req, res) => {
  try {
    const result = await imageModel.findByIdAndDelete(req.params.id);
    if (result) {
      let folderName =
      result?.img_type === 1
        ? "../uploads/Brand_s Avatar"
        : result?.img_type === 2
        ? "/uploads/Campaign_s Avatar"
        : "/uploads/Creator_s Avatar/";

      const result2 = helper.fileRemove(result?.img, folderName);
      if (result2?.status == false) {
        console.log("Insta image not delete from folder");
      }
      return response.returnTrue(
        200,
        req,
        res,
        `Image with ID ${req.params.id} deleted successfully`,
        {}
      );
    } else {
      return response.returnFalse(
        200,
        req,
        res,
        `Image with ID ${req.params.id} not found`,
        {}
      );
    }
  } catch (err) {
    return response.returnFalse(
      500,
      req,
      res,
      `INTERNAL SERVER ERROR : ${err.message}`,
      {}
    );
  }
};
