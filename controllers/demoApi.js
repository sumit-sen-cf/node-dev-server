const demoModel = require('../models/demoModel.js');
const vari = require("../variables.js");
const {storage} = require('../common/uploadFile.js')

exports.addDemo = async (req, res) =>{
    try{
        const simc = new demoModel({
            t1: req.body.t1,
            t2: req.body.t2,
            t3: req.body.t3,
            t4: req.body.t4,
            t5: req.body.t5,
            t6: req.body.t6,
            t7: req.body.t7,
            t8: req.body.t8,
            t9: req.body.t9,
            t10: req.body.t10,
            t11: req.body.t11,
            t12: req.body.t12,
            // t13 : req?.file?.filename
        })

        const bucketName = vari.BUCKET_NAME;
        const bucket = storage.bucket(bucketName);
        const blob = bucket.file(req.file.originalname);
        simc.t13 = blob.name;
        const blobStream = blob.createWriteStream();
        blobStream.on("finish", () => { return res.status(200).send("Success") });
        blobStream.end(req.file.buffer);

        const simv = await simc.save();
        res.send({simv,status:200});
    } catch(err){
        res.status(500).send({error:err.message,sms:'This demo data cannot be created'})
    }
};

exports.getAllDemo = async (req, res) => {
    try{
        const simc = await demoModel.find({});

        if(!simc){
            res.status(500).send({success:false})
        }
        res.status(200).send({data:simc})
    } catch(err){
        res.status(500).send({error:err.message,sms:'Error getting all demo datas'})
    }
};

exports.getSingleDemo = async (req, res) =>{
    try {
        const user = await demoModel.findById(req.params._id);
        res.status(200).send({data:user})
    } catch (error) {
        res.status(500).send({error:error.message,sms:'Error getting single demo data'})
    }
};

exports.editDemo = async (req, res) => {
    try{
        const editsim = await demoModel.findByIdAndUpdate(req.body._id,{
            t1: req.body.t1,
            t2: req.body.t2,
            t3: req.body.t3,
            t4: req.body.t4,
            t5: req.body.t5,
            t6: req.body.t6,
            t7: req.body.t7,
            t8: req.body.t8,
            t9: req.body.t9,
            t10: req.body.t10,
            t11: req.body.t11,
            t12: req.body.t12,
            t13 : req.file?.originalname
        }, { new: true })

        const bucketName = vari.BUCKET_NAME;
        const bucket = storage.bucket(bucketName);
        const blob = bucket.file(req.file.originalname);
        editsim.t13 = blob.name;
        const blobStream = blob.createWriteStream();
        blobStream.on("finish", () => { 
            editsim.save();
            return res.status(200).send("Success") 
        });
        blobStream.end(req.file.buffer);

        res.status(200).send({success:true,data:editsim})
    } catch(err){
        res.status(500).send({error:err,sms:'Error updating demo details'})
    }
};

exports.deleteDemo = async (req, res) =>{
    demoModel.findByIdAndDelete(req.params._id).then(item =>{
        if(item){
            return res.status(200).json({success:true, message:'demo data deleted'})
        }else{
            return res.status(404).json({success:false, message:'demo data not found'})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, message:err})
    })
};