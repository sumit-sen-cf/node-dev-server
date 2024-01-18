const userDocManagmentModel = require("../models/userDocManagementModel.js");
const response = require("../common/response.js");
const constant = require("../common/constant.js");
const { default: mongoose } = require("mongoose");
const helper = require("../helper/helper.js");

exports.addUserDoc = async (req, res) => {
  try {
    const {
      reject_reason,
      status,
      timer,
      doc_id,
      user_id,
      upload_date,
      approval_date,
      approval_by,
    } = req.body;
    let doc_image = req.file.filename;
    const doc = new userDocManagmentModel({
      reject_reason,
      status,
      timer,
      doc_id,
      user_id,
      upload_date,
      approval_date,
      approval_by,
      doc_image,
    });

    const savedDoc = await doc.save();

    return response.returnTrue(
      200,
      req,
      res,
      "Data Created Successfully",
      savedDoc
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.getUserDoc = async (req, res) => {
  try {
    let userDocId = req.body?._id;
    let user_id = req.body?.user_id;
    let matchCondition = {};

    if (user_id) {
      matchCondition.user_id = parseInt(user_id);
    }
    if (userDocId) {
      matchCondition._id = mongoose.Types.ObjectId(userDocId);
    }
    let docs = await userDocManagmentModel.aggregate([
      {
        $match: matchCondition,
      },
      {
        $lookup: {
          from: "documentmodels",
          localField: "doc_id",
          foreignField: "_id",
          as: "document",
        },
      },
      {
        $unwind: "$document",
      },
      {
        $addFields: {
          doc_image_url: {
            $cond: {
              if: "$doc_image",
              then: {
                $concat: [
                  `${constant.base_url}`,
                  "$doc_image",
                ],
              },
              else: "",
            },
          },
        },
      },
    ]);

    if (docs?.length === 0) {
      return response.returnFalse(200, req, res, "No record found", []);
    } else {
      return response.returnTrue(
        200,
        req,
        res,
        "Data Fetch Successfully",
        docs
      );
    }
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.editDoc = async (req, res) => {
  try {
    const {
      _id,
      reject_reason,
      status,
      timer,
      doc_id,
      user_id,
      upload_date,
      approval_date,
      approval_by,
    } = req.body;
    let doc_image = req.file?.filename;
    const editDocObj = await userDocManagmentModel.findByIdAndUpdate(_id, {
      $set: {
        reject_reason,
        status,
        timer,
        doc_id,
        user_id,
        upload_date,
        approval_date,
        approval_by,
        doc_image,
      },
    });
    if (doc_image) {
      const result = helper.fileRemove(
        editDocObj?.doc_image,
        "../uploads/userDocuments"
      );
      if (result?.status == false) {
        console.log(result.msg);
      }
    }
    if (!editDocObj) {
      return response.returnFalse(200, req, res, "No record found", {});
    }
    return response.returnTrue(200, req, res, "Data Update Successfully", {});
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.deleteDoc = async (req, res) => {
  try {
    const data = await userDocManagmentModel.findByIdAndDelete(req.params.id);
    if (data) {
      const result = helper.fileRemove(
        data?.doc_image,
        "../uploads/userDocuments"
      );
      if (result?.status == false) {
        console.log(result.msg);
      }

      return response.returnTrue(
        200,
        req,
        res,
        `Document with ID ${req.params?.id} deleted successfully.`
      );
    } else {
      return response.returnFalse(
        200,
        req,
        res,
        `Document with ID ${req.params?.id} not found.`
      );
    }
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};
