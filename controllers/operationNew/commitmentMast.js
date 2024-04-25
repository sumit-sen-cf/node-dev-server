const response = require("../common/response");
const cmtSchema = require("../models/commitmentModel");

exports.addCmt = async (req, res) => {
  try {
    let check = await cmtSchema.findOne({
      cmtName: req.body?.cmtName.toLowerCase().trim(),
    });
    if (check) {
      return response.returnFalse(
        200,
        req,
        res,
        "Commitement name must be unique",
        {}
      );
    }
    const cmtObj = new cmtSchema({
      ...req.body,
    });

    const savedCmt = await cmtObj.save();
    return response.returnTrue(
      200,
      req,
      res,
      "Commitment created successfully",
      savedCmt
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.getCmt = async (req, res) => {
  try {
    const cmtsData = await cmtSchema.find();

    if (cmtsData.length === 0) {
      return response.returnFalse(200, req, res, "No Record Found !", {});
    } else {
      return response.returnTrue(
        200,
        req,
        res,
        "Data Fetched Successfully.",
        cmtsData
      );
    }
  } catch (err) {
    return response.returnTrue(500, req, res, err.message, {});
  }
};

exports.getCmtById = async (req, res) => {
  try {
    const cmt = await cmtSchema.findOne({
      cmtId: parseInt(req.params.id),
    });
    if (!cmt) {
      return response.returnFalse(200, req, res, "No Record Found !", {});
    } else {
      return response.returnTrue(
        200,
        req,
        res,
        "Data Fetched Successfully.",
        cmt
      );
    }
  } catch (err) {
    return response.returnTrue(500, req, res, err.message, {});
  }
};

exports.editCmt = async (req, res) => {
  try {
   if(req.body.cmtName){
    let check = await cmtSchema.findOne({
      cmtName: req.body?.cmtName.toLowerCase().trim(),
      cmtId: { $ne: req.body?.cmtId },
    });
    if (check) {
      return response.returnFalse(
        200,
        req,
        res,
        "Commitment name must be unique",
        {}
      );
    }
   }
    const editCmtObj = await cmtSchema.findOneAndUpdate(
      { cmtId: parseInt(req.body.cmtId) }, // Filter condition
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!editCmtObj) {
      return response.returnFalse(
        200,
        req,
        res,
        "No Record Found with this cmtId.",
        {}
      );
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Data update Successfully.",
      editCmtObj
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.deleteCmt = async (req, res) => {
  const id = parseInt(req.params.id);
  const condition = { cmtId: id };
  try {
    const result = await cmtSchema.deleteOne(condition);
    if (result.deletedCount === 1) {
      return response.returnTrue(
        200,
        req,
        res,
        `Commitement with ID ${id} deleted successfully`,
        {}
      );
    } else {
      return response.returnFalse(
        200,
        req,
        res,
        `Commitement with ID ${id} not found`,
        {}
      );
    }
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};
