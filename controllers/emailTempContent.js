const emailTempModel = require('../models/emailTempModel.js');

exports.addEmailContent = async (req, res) =>{
    try{
        const simc = new emailTempModel({
            email_for: req.body.email_for,
            email_content: req.body.email_content,
            remarks: req.body.remarks,
            created_by: req.body.created_by
        })
        const simv = await simc.save();
        res.send({simv,status:200});
    } catch(err){
        res.status(500).send({error:err.message,sms:'This email content cannot be created'})
    }
};

exports.getAllEmailContents = async (req, res) => {
    try{
        const simc = await emailTempModel.find({});

        if(!simc){
            res.status(500).send({success:false})
        }
        res.status(200).send({data:simc})
    } catch(err){
        res.status(500).send({error:err.message,sms:'Error getting all email content datas'})
    }
};

exports.getSingleEmailContent = async (req, res) =>{
    try {
        const user = await emailTempModel.findById(req.params._id);
        res.status(200).send({data:user})
    } catch (error) {
        res.status(500).send({error:error.message,sms:'Error getting single email content data'})
    }
};

exports.editEmailContent = async (req, res) => {
    try{
        const editsim = await emailTempModel.findByIdAndUpdate(req.body._id,{
            email_for: req.body.email_for,
            email_content: req.body.email_content,
            remarks: req.body.remarks,
            updated_by: req.body.updated_by
        }, { new: true })

        await simc.save();

        res.status(200).send({success:true,data:editsim})
    } catch(err){
        res.status(500).send({error:err,sms:'Error updating email content details'})
    }
};

exports.deleteEmailContent = async (req, res) =>{
    emailTempModel.findByIdAndDelete(req.params._id).then(item =>{
        if(item){
            return res.status(200).json({success:true, message:'sim deleted'})
        }else{
            return res.status(404).json({success:false, message:'sim not found'})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, message:err})
    })
};