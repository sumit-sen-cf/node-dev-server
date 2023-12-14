const botYSchema = require("../models/instaBotYModel");

exports.addBotY = async (req, res) => {
  try {
    const { word, createdBy, status, campaign_id } = req.body;
    let check = await botYSchema.findOne({
      word: word?.toLowerCase().trim(),
    });
    if (check) {
      return res.status(200).json({
        message: "word must be unique",
        status: 200,
      });
    }
    const botYObj = new botYSchema({
      createdBy,
      status,
      campaign_id,
      word,
    });

    const savedBotY = await botYObj.save();
    res.send({ data: savedBotY, status: 200 });
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "This botY cannot be created",
    });
  }
};

exports.getBotYs = async (req, res) => {
  try {
    const botYs = await botYSchema.find();
    if (botYs.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      res.status(200).send({ data: botYs });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting all botY" });
  }
};
exports.getBotY = async (req, res) => {
  try {
    const botY = await botYSchema.findOne({
      botYId: parseInt(req?.params?.id),
    });
    if (!botY) {
      res
        .status(200)
        .send({ success: true, data: {}, message: "No Record found" });
    } else {
      res.status(200).send({ data: botY });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting  botY" });
  }
};

exports.editBotY = async (req, res) => {
  try {
    const { botYId, word, createdBy, campaign_id, status } = req.body;
    let check = await botYSchema.findOne({
      word: word?.toLowerCase().trim(),
      botYId: { $ne: botYId },
    });
    if (check) {
      return res.status(200).json({
        message: "word must be unique",
        status: 200,
      });
    }
    const editBotYObj = await botYSchema.findOneAndUpdate(
      { botYId: parseInt(botYId) }, // Filter condition
      {
        $set: {
          word,
          status,
          campaign_id,
          createdBy,
        },
      },
      { new: true }
    );

    if (!editBotYObj) {
      return res
        .status(200)
        .send({ success: false, message: "BotY not found" });
    }

    return res.status(200).send({ success: true, data: editBotYObj });
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error updating botY details" });
  }
};

exports.deleteBotY = async (req, res) => {
  const id = parseInt(req.params.id);
  const condition = { botYId: id };
  try {
    const result = await botYSchema.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `BotY with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `BotY with ID ${id} not found`,
      });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
