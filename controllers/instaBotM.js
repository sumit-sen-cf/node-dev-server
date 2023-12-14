const botMSchema = require("../models/insatBotMModel");

exports.addBotM = async (req, res) => {
  try {
    const { number, createdBy, status, campaign_id } = req.body;
    let check = await botMSchema.findOne({
      number: number?.toString().trim(),
    });
    if (check) {
      return res.status(200).json({
        message: "number must be unique",
        status: 200,
      });
    }
    const botMObj = new botMSchema({
      createdBy,
      status,
      campaign_id,
      number,
    });

    const savedBotM = await botMObj.save();
    res.send({ data: savedBotM, status: 200 });
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "This botM cannot be created",
    });
  }
};

exports.getBotMs = async (req, res) => {
  try {
    const botMs = await botMSchema.find();
    if (botMs.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      res.status(200).send({ data: botMs });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting all botM" });
  }
};
exports.getBotM = async (req, res) => {
  try {
    const botM = await botMSchema.findOne({
      botMId: parseInt(req?.params?.id),
    });
    if (!botM) {
      res
        .status(200)
        .send({ success: true, data: {}, message: "No Record found" });
    } else {
      res.status(200).send({ data: botM });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting  botM" });
  }
};

exports.editBotM = async (req, res) => {
  try {
    const { botMId, number, createdBy, campaign_id, status } = req.body;
    let check = await botMSchema.findOne({
      number: number?.toString().trim(),
      botMId: { $ne: botMId },
    });
    if (check) {
      return res.status(200).json({
        message: "number must be unique",
        status: 200,
      });
    }
    const editBotMObj = await botMSchema.findOneAndUpdate(
      { botMId: parseInt(botMId) }, // Filter condition
      {
        $set: {
          number,
          status,
          campaign_id,
          createdBy,
        },
      },
      { new: true }
    );

    if (!editBotMObj) {
      return res
        .status(200)
        .send({ success: false, message: "BotM not found" });
    }

    return res.status(200).send({ success: true, data: editBotMObj });
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error updating botM details" });
  }
};

exports.deleteBotM = async (req, res) => {
  const id = parseInt(req.params.id);
  const condition = { botMId: id };
  try {
    const result = await botMSchema.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `BotM with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `BotM with ID ${id} not found`,
      });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
