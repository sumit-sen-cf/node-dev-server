const contentManagementModel = require('../models/contentManagementModel.js');
const { storage } = require("../common/uploadFile.js")
const vari = require("../variables.js");

exports.addcontentManagement = async (req, res) =>{
    try{
        const contentManagementc = new contentManagementModel({
            page_name: req.body.page_name,
            content_name: req.body.content_name,
            category: req.body.category,
            sub_category: req.body.sub_category,
            // content: req.file?.originalname,
            reason: req.body.reason,
            status: req.body.status,
            caption: req.body.caption,
            uploaded_by : req.body.uploaded_by
        })

        const bucketName = vari.BUCKET_NAME;
        const bucket = storage.bucket(bucketName);
        const blob = bucket.file(req.file.originalname);
        contentManagementc.content = blob.name;
        const blobStream = blob.createWriteStream();
        blobStream.on("finish", () => { return res.status(200).send("Success") });
        blobStream.end(req.file.buffer);

        const contentManagementv = await contentManagementc.save();
        res.send({contentManagementv,status:200});
    } catch(err){
        res.status(500).send({error:err.message,sms:'This contentManagement cannot be created'})
    }
};

exports.getcontentManagements = async (req, res) => {
    try{
        const contentManagementc = await contentManagementModel.find();
        if(!contentManagementc){
            res.status(500).send({success:false})
        }
        res.status(200).send(contentManagementc)
    } catch(err){
        res.status(500).send({error:err,sms:'Error getting all contentManagements'})
    }
};

exports.getContentManagementById = async (req, res) => {
    try {
      const fetchedData = await contentManagementModel.findOne({
        contentM_id: parseInt(req.params.id),
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
        error: err.message,
        message: "Error getting contentManagementModel details",
      });
    }
  };


exports.editcontentManagement = async (req, res) => {
    try{
        const editcontentmanagement = await contentManagementModel.findOneAndUpdate({ contentM_id: req.body.contentM_id },{
            page_name: req.body.page_name,
            content_name: req.body.content_name,
            category: req.body.category,
            sub_category: req.body.sub_category,
            content: req.file?.originalname,
            reason: req.body.reason,
            status: req.body.status,
            caption: req.body.caption,
            uploaded_by : req.body.uploaded_by
        }, { new: true })

        if(!editcontentmanagement){
            res.status(500).send({success:false})
        }

        const bucketName = vari.BUCKET_NAME;
        const bucket = storage.bucket(bucketName);
        const blob = bucket.file(req.file.originalname);
        editcontentmanagement.content = blob.name;
        const blobStream = blob.createWriteStream();
        blobStream.on("finish", () => { 
            editcontentmanagement.save();
            return res.status(200).send("Success") 
        });
        blobStream.end(req.file.buffer);

        res.status(200).send({success:true,data:editcontentmanagement})
    } catch(err){
        res.status(500).send({error:err.message,sms:'Error updating contentManagement details'})
    }
};


exports.deletecontentManagement = async (req, res) => {
    const id = req.params.id;
    const condition = { contentM_id: id };
    try {
        const result = await contentManagementModel.deleteOne(condition);
        if (result.deletedCount === 1) {
            return res.status(200).json({
                success: true,
                message: `contentManagement with ID ${id} deleted successfully`,
            });
        } else {
            return res.status(200).json({
                success: false,
                message: `contentManagement with ID ${id} not found`,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the contentManagement",
            error: error.message,
        });
    }
};
