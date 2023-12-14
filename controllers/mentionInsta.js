const hashTagModel = require("../models/hashTagModel");
const mentionSchema = require("../models/mentionModel");

exports.addMention= async (req, res) => {
  try {
    const { mention, createdBy,status } = req.body;
    let check2 = await hashTagModel.findOne({
      hash_tag: mention?.toLowerCase().trim(),
    });
    if (check2) {
      return res.status(200).json({
        message: "mention is available in hash tag you can not add this mention.",
        status: 200,
      });
    }
    let check = await mentionSchema.findOne({
      mention: mention?.toLowerCase().trim(),
    });
    if (check) {
      return res.status(200).json({
        message: "mention must be unique",
        status: 200,
      });
    }
    const mentionObj = new mentionSchema({
      mention,
      createdBy,
      status
    });

    const savedMention= await mentionObj.save();
    res.send({ data: savedMention, status: 200 });
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "This mention cannot be created",
    });
  }
};
exports.getMentions = async (req, res) => {
  try {
    const mentions = await mentionSchema.find();
    if (mentions.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      res.status(200).send({ data: mentions });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting all mentions" });
  }
};
exports.getMention= async (req, res) => {
  try {
    const mention= await mentionSchema.findOne({
      mentionId: parseInt(req?.params?.id),
    });
    if (!mention) {
      res
        .status(200)
        .send({ success: true, data: {}, message: "No Record found" });
    } else {
      res.status(200).send({ data: mention});
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting  mention" });
  }
};
exports.editMention= async (req, res) => {
  try {
    const { mentionId, mention,status } = req.body;
    let check2 = await hashTagModel.findOne({
      hash_tag: mention?.toLowerCase().trim(),
    });
    if (check2) {
      return res.status(200).json({
        message: "mention is available in hash tag you can not add this mention.",
        status: 200,
      });
    }
    let check = await mentionSchema.findOne({
      mention: mention?.toLowerCase().trim(),
      mentionId: { $ne: mentionId },
    });
    if (check) {
      return res.status(200).json({
        message: "mention must be unique",
        status: 200,
      });
    }
    const editMentionObj = await mentionSchema.findOneAndUpdate(
      { mentionId: parseInt(mentionId) }, // Filter condition
      {
        $set: {
          mention,
          status
        },
      },
      { new: true }
    );

    if (!editMentionObj) {
      return res
        .status(200)
        .send({ success: false, message: "Mention not found" });
    }

    return res.status(200).send({ success: true, data: editMentionObj });
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error updating mention details" });
  }
};
exports.deleteMention= async (req, res) => {
  const id = parseInt(req.params.id);
  const condition = { mentionId: id };
  try {
    const result = await mentionSchema.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `Mention with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `Mention with ID ${id} not found`,
      });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
