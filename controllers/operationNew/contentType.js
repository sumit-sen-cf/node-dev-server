const contentTypeSchema = require("../models/contentTypeModel.js");
const response = require("../common/response");

exports.addContentType = async (req, res) => {
  try {
    const { content_type, content_value, remarks, created_by } = req.body;
    let check = await contentTypeSchema.findOne({
      content_type: content_type.toLowerCase().trim(),
      
    });
    if (check) {
      return response.returnFalse(
        200,
        req,
        res,
        "Content type must be unique",
        {}
      );
    }
    const ContentTypeObj = new contentTypeSchema({
      content_type,
      content_value,
      remarks,
      created_by,
    });

    const savedContentType = await ContentTypeObj.save();
    res.send({ data: savedContentType, status: 200 });
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "This ContentType cannot be created",
    });
  }
};

exports.getContentTypes = async (req, res) => {
  try {
    const contentType = await contentTypeSchema.find();

    if (contentType.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      return res.status(200).send({ success: true, data: contentType });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting all Content type" });
  }
};

exports.getContentTypeById = async (req, res) => {
  try {
    const contentType = await contentTypeSchema.findOne({
      content_type_id: parseInt(req.params.id),
    });

    if (!contentType) {
      res
        .status(200)
        .send({ success: true, data: {}, message: "No Record found" });
    } else {
      return res.status(200).send({ success: true, data: contentType });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting all Content type" });
  }
};

exports.deleteContentType = async (req, res) => {
  const id = parseInt(req.params.id);
  const condition = { content_type_id: id };
  try {
    const result = await contentTypeSchema.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `ContentType with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `ContentType with ID ${id} not found`,
      });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: err });
  }
};

exports.editContentType = async (req, res) => {
  try {
    const {
      content_type_id,
      content_type,
      content_value,
      last_updated_by,
      remarks,
    } = req.body;

    let check = await contentTypeSchema.findOne({
      content_type: content_type.toLowerCase().trim(),
      content_type_id: { $ne: content_type_id },
    });
    if (check) {
      return response.returnFalse(
        200,
        req,
        res,
        "Content type must be unique",
        {}
      );
    }
    const editContentTypeObj = await contentTypeSchema.findOneAndUpdate(
      { content_type_id: parseInt(content_type_id) }, 
      {
        $set: {
          content_type,
          content_value,
          last_updated_by,
          remarks,
          last_updated_date: Date.now(),
        },
      },
      { new: true }
    );

    if (!editContentTypeObj) {
      return res
        .status(200)
        .send({ success: false, message: "ContentType not found" });
    }

    return res.status(200).send({ success: true, data: editContentTypeObj });
  } catch (err) {
    res
      .status(500)
      .send({ error: err, message: "Error updating ContentType details" });
  }
};
