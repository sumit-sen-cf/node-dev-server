const keywordSchema = require("../models/keywordModel");

exports.addKeyword = async (req, res) => {
  try {
    const { keyword, createdBy,status } = req.body;
    let check = await keywordSchema.findOne({
      keyword: keyword.toLowerCase().trim(),
    });
    if (check) {
      return res.status(200).json({
        message: "keyword must be unique",
        status: 200,
      });
    }
    const keywordObj = new keywordSchema({
      keyword,
      createdBy,
      status
    });

    const savedKeyword = await keywordObj.save();
    res.send({ data: savedKeyword, status: 200 });
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "This keyword cannot be created",
    });
  }
};

exports.getKeywords = async (req, res) => {
  try {
    const keywords = await keywordSchema.find();
    if (keywords.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      res.status(200).send({ data: keywords });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting all keywords" });
  }
};
exports.getKeyword = async (req, res) => {
  try {
    const keyword = await keywordSchema.findOne({
      keywordId: parseInt(req?.params?.id),
    });
    if (!keyword) {
      res
        .status(200)
        .send({ success: true, data: {}, message: "No Record found" });
    } else {
      res.status(200).send({ data: keyword });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting  keyword" });
  }
};

exports.editKeyword = async (req, res) => {
  try {
    const { keywordId, keyword, updatedBy,status } = req.body;
    let check = await keywordSchema.findOne({
      keyword: keyword.toLowerCase().trim(),
      keywordId: { $ne: keywordId },
    });
    if (check) {
      return res.status(200).json({
        message: "keyword must be unique",
        status: 200,
      });
    }
    const editKeywordObj = await keywordSchema.findOneAndUpdate(
      { keywordId: parseInt(keywordId) }, // Filter condition
      {
        $set: {
          keyword,
          updatedBy,
          updatedAt: Date.now(),
          status
        },
      },
      { new: true }
    );

    if (!editKeywordObj) {
      return res
        .status(200)
        .send({ success: false, message: "Keyword not found" });
    }

    return res.status(200).send({ success: true, data: editKeywordObj });
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error updating keyword details" });
  }
};

exports.deleteKeyword = async (req, res) => {
  const id = parseInt(req.params.id);
  const condition = { keywordId: id };
  try {
    const result = await keywordSchema.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `Keyword with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `Keyword with ID ${id} not found`,
      });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
