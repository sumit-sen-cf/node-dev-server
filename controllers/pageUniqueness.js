const pageUniquenessModel = require("../models/pageUniquenessModel.js");

exports.addPageUniqueness = async (req, res) => {
  const { creator_name, user_id, status } = req.body;
  try {
    const data = new pageUniquenessModel({
      creator_name,
      user_id,
      status,
    });
    const savedData = await data.save();
    res.status(200).send({
      data: savedData,
      message: "Data created successfeully",
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "Error adding data to database",
    });
  }
};

exports.getAllPageUniqueness = async (req, res) => {
  try {
    const data = await pageUniquenessModel.find();
    if (data.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      res.status(200).send({ data: data });
    }
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "Error getting all data",
    });
  }
};

exports.getPageUniquenessById = async (req, res) => {
  try {
    const fetchedData = await pageUniquenessModel.findById(req.params.id);
    if (!fetchedData) {
      return res
        .status(200)
        .send({ success: false, data: {}, message: "No Record found" });
    } else {
      res.status(200).send({ data: fetchedData });
    }
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "Error getting brandMajorCategory details",
    });
  }
};

exports.editPageUniqueness = async (req, res) => {
  try {
    const data = await pageUniquenessModel.findOneAndUpdate(
      { user_id: req.body.user_id },
      {
        creator_name: req.body.creator_name,
        status: req.body.status,
        user_id: req.body.user_id,
      },
      { new: true }
    );
    if (!data) {
      return res.status(500).send({ success: false });
    }
    return res.status(200).send({ success: true, data });
  } catch (err) {
    return res.status(500).send({
      error: err.message,
      message: "Error updating the data in the database",
    });
  }
};

exports.deletePageUniqueness = async (req, res) => {
  try {
    const result = await pageUniquenessModel.findByIdAndDelete(
      req.params.id
    );
    if (result) {
      return res.status(200).json({
        success: true,
        message: `Data with ID ${req.params.id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `Data with ID ${req.params.id} not found`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the Data",
      error: error.message,
    });
  }
};