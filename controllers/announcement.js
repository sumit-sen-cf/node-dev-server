const announcementSchema = require("../models/announcementModel.js");

exports.addAnnouncement = async (req, res) => {
  try {
    const {
      dept_id,
      desi_id,
      onboard_status,
      heading,
      sub_heading,
      content,
      remarks,
      created_by,
    } = req.body;

    const announcementObj = new announcementSchema({
      dept_id,
      desi_id,
      onboard_status,
      heading,
      sub_heading,
      content,
      remarks,
      created_by: parseInt(created_by),
    });

    const savedAnnouncement = await announcementObj.save();
    res.send({ data: savedAnnouncement, status: 200 });
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "This announcement cannot be created",
    });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const annoncements = await announcementSchema.aggregate([
      {
        $lookup: {
          from: "designationmodels",
          localField: "desi_id",
          foreignField: "desi_id",
          as: "designationData",
        },
      },
      {
        $lookup: {
          from: "departmentmodels",
          localField: "dept_id",
          foreignField: "dept_id",
          as: "departmentData",
        },
      },
      //user_mast  pending thats why i not join using onboard status but there is mandatory
      {
        $unwind: "$departmentData",
      },
      {
        $unwind: "$designationData",
      },
      {
        $addFields: {
          dept_name: "$departmentData.dept_name",
          desi_name: "$designationData.desi_name",
        },
      },
      {
        $project: {
          departmentData: 0,
          designationData: 0,
        },
      },
    ]);
    if (annoncements.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      res.status(200).send({ data: annoncements });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting all annoncements" });
  }
};

exports.editAnnoncement = async (req, res) => {
  try {
    const editAnnoncementObj = await announcementSchema.findOneAndUpdate(
      { id: parseInt(req.body.id) }, // Filter condition
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!editAnnoncementObj) {
      return res
        .status(200)
        .send({ success: false, message: "Annoncement not found" });
    }

    return res.status(200).send({ success: true, data: editAnnoncementObj });
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "Error updating Annoncement details",
    });
  }
};

exports.deleteAnnoncement = async (req, res) => {
  const id = parseInt(req.params.id);
  const condition = { id };
  try {
    const result = await announcementSchema.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `Annoncement with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `Annoncement with ID ${id} not found`,
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAnnoncementById = async (req, res) => {
  try {
    let match_condition = { id: parseInt(req.params.id) };
    const annoncement = await announcementSchema.aggregate([
      {
        $match: match_condition,
      },
      {
        $lookup: {
          from: "designationmodels",
          localField: "desi_id",
          foreignField: "desi_id",
          as: "designationData",
        },
      },
      {
        $lookup: {
          from: "departmentmodels",
          localField: "dept_id",
          foreignField: "dept_id",
          as: "departmentData",
        },
      },
      //user_mast  pending thats why i not join using onboard status but there is mandatory
      {
        $unwind: "$departmentData",
      },
      {
        $unwind: "$designationData",
      },
      {
        $addFields: {
          dept_name: "$departmentData.dept_name",
          desi_name: "$designationData.desi_name",
        },
      },
      {
        $project: {
          departmentData: 0,
          designationData: 0,
        },
      },
    ]);
    if (annoncement.length === 0) {
      return res
        .status(200)
        .send({ success: false, data: {}, message: "No Record found" });
    } else {
      res.status(200).send({ data: annoncement[0] });
    }
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "Error getting annoncement details",
    });
  }
};
