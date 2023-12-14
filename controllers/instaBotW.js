const botWSchema = require("../models/instaBotWModel");

exports.addBotW = async (req, res) => {
  try {
    const { websiteName, createdBy, status, campaign_id } = req.body;
    let check = await botWSchema.findOne({
      websiteName: websiteName?.toLowerCase().trim(),
    });
    if (check) {
      return res.status(200).json({
        message: "websiteName must be unique",
        status: 200,
      });
    }
    const botWObj = new botWSchema({
      createdBy,
      status,
      campaign_id,
      websiteName,
    });

    const savedBotW = await botWObj.save();
    res.send({ data: savedBotW, status: 200 });
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "This botW cannot be created",
    });
  }
};

exports.getBotWs = async (req, res) => {
  try {
    const botWs = await botWSchema.find();
    if (botWs.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      res.status(200).send({ data: botWs });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting all botW" });
  }
};
exports.getBotW = async (req, res) => {
  try {
    const botW = await botWSchema.findOne({
      botWId: parseInt(req?.params?.id),
    });
    if (!botW) {
      res
        .status(200)
        .send({ success: true, data: {}, message: "No Record found" });
    } else {
      res.status(200).send({ data: botW });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting  botW" });
  }
};

exports.editBotW = async (req, res) => {
  try {
    const { botWId, websiteName, createdBy, campaign_id, status } = req.body;
    let check = await botWSchema.findOne({
      websiteName: websiteName?.toLowerCase().trim(),
      botWId: { $ne: botWId },
    });
    if (check) {
      return res.status(200).json({
        message: "websiteName must be unique",
        status: 200,
      });
    }
    const editBotWObj = await botWSchema.findOneAndUpdate(
      { botWId: parseInt(botWId) }, // Filter condition
      {
        $set: {
          websiteName,
          status,
          campaign_id,
          createdBy,
        },
      },
      { new: true }
    );

    if (!editBotWObj) {
      return res
        .status(200)
        .send({ success: false, message: "BotW not found" });
    }

    return res.status(200).send({ success: true, data: editBotWObj });
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error updating botW details" });
  }
};

exports.deleteBotW = async (req, res) => {
  const id = parseInt(req.params.id);
  const condition = { botWId: id };
  try {
    const result = await botWSchema.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `BotW with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `BotW with ID ${id} not found`,
      });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
