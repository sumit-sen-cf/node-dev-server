const hashTagSchema = require("../models/hashTagModel");
const mentionModel = require("../models/mentionModel");

exports.addHashTag = async (req, res) => {
  try {
    const { hash_tag, tag, campaign_id } = req.body;
    let check2 = await mentionModel.findOne({
      mention: hash_tag?.toLowerCase().trim(),
    });
    if (check2) {
      return res.status(200).json({
        message: "hash_tag is available in mention you can not add this hash tag.",
        status: 200,
      });
    }
    let check = await hashTagSchema.findOne({
      hash_tag: hash_tag?.toLowerCase().trim(),
    });
    if (check) {
      return res.status(200).json({
        message: "hash_tag must be unique",
        status: 200,
      });
    }
    const hashTagObj = new hashTagSchema({
      hash_tag,
      tag,
      campaign_id,
    });

    const savedHashTag = await hashTagObj.save();
    res.send({ data: savedHashTag, status: 200 });
  } catch (err) {
    res.status(500).send({
      erroradd_hashTag: err,
      message: "This hashTag cannot be created",
    });
  }
};

exports.getHashTags = async (req, res) => {
  try {
    const hashTags = await hashTagSchema.find();
    if (hashTags.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      res.status(200).send({ data: hashTags });
    }
  } catch (err) {
    res.status(500).send({ error: err, message: "Error getting all hashTags" });
  }
};

exports.editHashTag = async (req, res) => {
  try {
    const { hash_tag_id, hash_tag, tag, campaign_id } = req.body;
    let check2 = await mentionModel.findOne({
      mention: hash_tag?.toLowerCase().trim(),
    });
    if (check2) {
      return res.status(200).json({
        message: "hash_tag is available in mention you can not add this hash tag.",
        status: 200,
      });
    }
    let check = await hashTagSchema.findOne({
      hash_tag: hash_tag?.toLowerCase().trim(),
      hash_tag_id: { $ne: hash_tag_id },
    });
    if (check) {
      return res.status(200).json({
        message: "hash_tag must be unique",
        status: 200,
      });
    }
    const editHashTagObj = await hashTagSchema.findOneAndUpdate(
      { hash_tag_id: parseInt(hash_tag_id) }, // Filter condition
      {
        $set: {
          hash_tag,
          tag,
          campaign_id,
        },
      },
      { new: true }
    );

    if (!editHashTagObj) {
      return res
        .status(200)
        .send({ success: false, message: "HashTag not found" });
    }

    return res.status(200).send({ success: true, data: editHashTagObj });
  } catch (err) {
    res
      .status(500)
      .send({ error: err, message: "Error updating hashTag details" });
  }
};

exports.deleteHashTag = async (req, res) => {
  const id = parseInt(req.params.id);
  const condition = { hash_tag_id: id };
  try {
    const result = await hashTagSchema.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `HashTag with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `HashTag with ID ${id} not found`,
      });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: err });
  }
};
