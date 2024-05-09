const documentModel = require("../models/documentModel");
const documentHisModel = require("../models/documentHisModel");
const response = require("../common/response.js");
const vari = require("../variables.js");
const { storage } = require('../common/uploadFile.js');

exports.addDocument = async (req, res) => {
  try {
    const { doc_name, doc_type, description, priority, period, isRequired, is_doc_number, doc_number, is_document_expired, expired_date } = req.body;

    const doc = new documentModel({
      doc_name,
      doc_type,
      description,
      priority,
      period,
      isRequired,
      is_doc_number,
      doc_number,
      is_document_expired,
      expired_date,
      job_type: req.body.job_type
    });

    const savedDoc = await doc.save();

    return response.returnTrue(
      200,
      req,
      res,
      "Data Created Successfully",
      savedDoc
    );
  } catch (err) {
    if (err.code === 11000) {
      // The error code 11000 indicates a duplicate key error (unique constraint violation)
      return response.returnFalse(
        500,
        req,
        res,
        "'doc_type  must be unique. Another doc_type already exists.'",
        {}
      );
    } else {
      return response.returnFalse(500, req, res, err.message, {});
    }
  }
};

exports.getDocs = async (req, res) => {
  try {
    const docs = await documentModel.find();
    if (docs.length === 0) {
      return response.returnFalse(200, req, res, "No record found", []);
    } else {
      return response.returnTrue(
        200,
        req,
        res,
        "Data Fetch Successfully",
        docs
      );
    }
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};
exports.getDoc = async (req, res) => {
  try {
    const doc = await documentModel.findById(req?.params?.id);
    if (!doc) {
      return response.returnFalse(200, req, res, "No record found", {});
    } else {
      return response.returnTrue(200, req, res, "Data Fetch Successfully", doc);
    }
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.editDoc = async (req, res) => {
  try {
    const { doc_type, description, priority, period, isRequired, is_doc_number, doc_number, job_type, is_document_expired,
      expired_date } = req.body;

    const editDocObj = await documentModel.findByIdAndUpdate(
      req.body._id,
      {
        $set: {
          doc_name, doc_type, description, priority, period, isRequired, is_doc_number, doc_number, job_type, is_document_expired,
          expired_date
        },
      },
      { new: true }
    );

    if (!editDocObj) {
      return response.returnFalse(200, req, res, "No record found");
    }

    return response.returnTrue(
      200,
      req,
      res,
      "Data Update Successfully",
      editDocObj
    );
  } catch (err) {
    if (err.code === 11000) {
      // The error code 11000 indicates a duplicate key error (unique constraint violation)
      return response.returnFalse(
        500,
        req,
        res,
        "'doc_type  must be unique. Another doc_type already exists.'",
        {}
      );
    } else {
      return response.returnFalse(500, req, res, err.message, {});
    }
  }
};

exports.deleteDoc = async (req, res) => {
  try {
    const result = await documentModel.findByIdAndDelete(req.params.id);
    if (result) {
      return response.returnTrue(
        200,
        req,
        res,
        `Document with ID ${req.params?.id} deleted successfully.`
      );
    } else {
      return response.returnFalse(
        200,
        req,
        res,
        `Document with ID ${req.params?.id} not found.`
      );
    }
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.addHistoryDoc = async (req, res) => {
  try {
    const files = req.files.doc_file;
    const savedDocuments = [];

    for (const file of files) {
      const simc = new documentHisModel({
        user_id: req.body.user_id,
        doc_id: req.body.doc_id,
        // doc_file: file.filename,
        status: req.body.status,
        updated_by: req.body.updated_by
      });

      if (req.file) {
        const bucketName = vari.BUCKET_NAME;
        const bucket = storage.bucket(bucketName);
        const blob = bucket.file(file.originalname);
        simc.doc_file = blob.name;
        const blobStream = blob.createWriteStream();
        blobStream.on("finish", () => {
          // res.status(200).send("Success") 
        });
        blobStream.end(req.file.buffer);
      }

      const simv = await simc.save();
      savedDocuments.push(simv);
    }
    res.send({ documents: savedDocuments, status: 200 });

  } catch (err) {
    res.status(500).send({ error: err.message, sms: 'error while adding doc history' })
  }
};

exports.editHistoryDoc = async (req, res) => {
  try {
    const editsim = await documentHisModel.findByIdAndUpdate(req.body._id, {
      user_id: req.body.user_id,
      // doc_id: req.body.doc_id,
      doc_file_name: req.file?.originalname,
      status: req.body.status,
      updated_by: req.body.updated_by
    }, { new: true })

    if (req.file) {
      const bucketName = vari.BUCKET_NAME;
      const bucket = storage.bucket(bucketName);
      const blob = bucket.file(req.file.originalname);
      editsim.doc_file = blob.name;
      const blobStream = blob.createWriteStream();
      blobStream.on("finish", () => {
        editsim.save();
        // res.status(200).send("Success") 
      });
      blobStream.end(req.file.buffer);
    }

    res.status(200).send({ success: true, data: editsim })
  } catch (err) {
    res.status(500).send({ error: err.message, sms: 'Error updating doc history' })
  }
};