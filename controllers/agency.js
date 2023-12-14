const agencyModel = require("../models/agencyModel.js");

exports.addAgency = async (req, res) => {
  const { agency_name } = req.body;
  try {
    const agencydata = new agencyModel({
      agency_name
    });
    const savedagencydata = await agencydata.save();
    res.status(200).send({
        data: savedagencydata,
        message: "agencydata created success",
      });
  } catch (err) {
    res.status(500).send({
      error: err,
      message: "Error adding agencydata to database",
    });
  }
};

exports.getAgencys = async (req, res) => {
  try {
    const agencydata = await agencyModel.find();
    if (agencydata.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      res.status(200).send({ data: agencydata });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err, message: "Error getting all agencydata" });
  }
};

exports.getAgencyById = async (req, res) => {
  try {
    const fetchedData = await agencyModel.findOne({
      agency_id: parseInt(req.params.id),
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
      message: "Error getting agencyModel details",
    });
  }
};

exports.editAgency = async (req, res) => {
  try {
      const editagency = await agencyModel.findOneAndUpdate({ agency_id: req.body.agency_id }, {
        agency_name : req.body.agency_name
      }, { new: true })
      if (!editagency) {
          res.status(500).send({ success: false })
      }
      res.status(200).send({ success: true, data: editagency })
  } catch (err) {
      res.status(500).send({
          error: err,
          message: "Error updating the agency in the database",
      });
  }
};

exports.deleteAgency = async (req, res) => {
  const id = req.params.id;
  const condition = { agency_id: id };
  try {
    const result = await agencyModel.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `Agency with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `Agency with ID ${id} not found`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the agency",
      error: error.message,
    });
  }
};
