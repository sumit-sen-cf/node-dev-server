const hobbyModel = require("../models/hobbyModel.js");

exports.addHobby = async (req, res) => {
  const { hobby_name,remark } = req.body;
  try {
    const checkDuplicacy = await hobbyModel.findOne({hobby_name: req.body.hobby_name})
    if(checkDuplicacy){
      return res.status(409).send({
        data: [],
        message: "Hobby name already exist",
      });
    }
    const hobbydata = new hobbyModel({
      hobby_name,
      remark
    });
    const savedhobbydata = await hobbydata.save();
    return res.status(200).send({
      data: savedhobbydata,
      message: "hobbydata created success",
    });
  } catch (err) {
    return res.status(500).send({
      error: err,
      message: "Error adding hobbydata to database",
    });
  }
};

exports.getHobbys = async (req, res) => {
  try {
    const hobbydata = await hobbyModel.find();
    if (hobbydata.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      res.status(200).send({ data: hobbydata });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err, message: "Error getting all hobbydata" });
  }
};

exports.getHobbyById = async (req, res) => {
  try {
    const fetchedData = await hobbyModel.findOne({
      hobby_id: parseInt(req.params.id),
    });
    if (!fetchedData) {
      return res
        .status(200)
        .send({ success: false, data: {}, message: "No Record found" });
    } else {
      res.status(200).send({ data: fetchedData });
    }
  } catch (err) {
    res.status(500).send({
      error: err,
      message: "Error getting hobbyModel details",
    });
  }
};

exports.editHobby = async (req, res) => {
  try {
    const checkDuplicacy = await hobbyModel.findOne({hobby_name: req.body.hobby_name})
    if(checkDuplicacy){
      return res.status(409).send({
        data: [],
        message: "Hobby name already exist",
      });
    }
      const editHobby = await hobbyModel.findOneAndUpdate({ hobby_id: req.body.hobby_id }, {
        hobby_name : req.body.hobby_name,
        remark : req.body.remark,
        updated_at : req.body.updated_at
      }, { new: true })
      if (!editHobby) {
          res.status(500).send({ success: false })
      }
      res.status(200).send({ success: true, data: editHobby })
  } catch (err) {
      res.status(500).send({
          error: err,
          message: "Error updating the hobby in the database",
      });
  }
};

exports.deleteHobby = async (req, res) => {
  const id = req.params.id;
  const condition = { hobby_id: id };
  try {
    const result = await hobbyModel.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `Hobby with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `Hobby with ID ${id} not found`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the hobby",
      error: error.message,
    });
  }
};
