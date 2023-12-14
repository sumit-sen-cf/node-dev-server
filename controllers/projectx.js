const projectxSchema = require("../models/projectxModel.js");

exports.addProjectx = async (req, res) => {
  const {
    page_id,
    page_name,
    page_user_id,
    page_link,
    profile_type,
    page_category_id,
    projectx_user_id,
    manage_by,
    followers_count,
    track,
    page_logo_url,
    tracking_cron,
    tracking,
    crawler_count,
    max_post_count_a_day,
    avg_post_count_a_day
  } = req.body;
  try {
    const projectxObj = new projectxSchema({
      page_id,
      page_name,
      page_user_id,
      page_link,
      profile_type,
      page_category_id,
      projectx_user_id,
      manage_by,
      followers_count,
      track,
      created_at: Date.now(),
      page_logo_url,
      tracking_cron,
      tracking,
      crawler_count,
      max_post_count_a_day,
      avg_post_count_a_day
    });
    const savedprojectx = await projectxObj.save();
    if (!projectxObj) {
      res
        .status(500)
        .send({ success: false, data: {}, message: "Something went wrong.." });
    } else {
      res.status(200).send({
        data: savedprojectx,
        message: "projectx created success",
      });
    }
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "Error adding projectx to database",
    });
  }
};

exports.getProjectx = async (req, res) => {
  try {
    const projectx = await projectxSchema.find();
    if (projectx.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      res.status(200).send({ data: projectx });
    }
  } catch (err) {
    res.status(500).send({ error: err, message: "Error getting all projectx" });
  }
};

exports.getProjectxByPageName = async (req, res) => {

  try {
    const fetchedData = await projectxSchema.findOne({
      // page_name: req.body.page_name,
      page_name: { $regex: new RegExp(req.body.page_name, 'i') },
      // page_name: parseInt(req.params.id),
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
      message: "Error getting projectxSchema details",
    });
  }
};

exports.editProjectx = async (req, res) => {
  try {
    const editProjectxObj = await projectxSchema.findOneAndUpdate(
      { id: req.body.id },
      { $set: req.body },
      { new: true }
    );

    if (!editProjectxObj) {
      return res
        .status(200)
        .send({ success: false, message: "projectx  not found" });
    }

    res.status(200).send({ success: true, data: editProjectxObj });
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "Error updating the projectx in the database",
    });
  }
};

exports.deleteProjectx = async (req, res) => {
  const id = req.params.id;
  const condition = { id };
  try {
    const result = await projectxSchema.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `projectx with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `projectx with ID ${id} not found`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the projectx",
      error: error.message,
    });
  }
};
