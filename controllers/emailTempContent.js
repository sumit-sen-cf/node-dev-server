const emailTempModel = require('../models/emailTempModel.js');
const emailEventModel = require('../models/emailEventModel.js');

exports.addEmailContent = async (req, res) =>{
    try{
        const simc = new emailTempModel({
            email_for: req.body.email_for,
            email_for_id: req.body.email_for_id,
            email_content: req.body.email_content,
            email_sub: req.body.email_sub,
            send_email: false,
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
            send_email: req.body.send_email,
            email_sub: req.body.email_sub,
            remarks: req.body.remarks,
            updated_by: req.body.updated_by
        }, { new: true })

        await simc.save();

        if (req.body.send_email == true) {
            await emailTempModel.updateMany({
                _id: { $ne: req.body._id }
            }, {
                $set: { send_email: false }
            });
        }

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

exports.addEmailEvent = async (req, res) =>{
    try{
        const simc = new emailEventModel({
            event_name: req.body.event_name,
            remarks: req.body.remarks,
            created_by: req.body.created_by
        })
        const simv = await simc.save();
        res.send({simv,status:200});
    } catch(err){
        res.status(500).send({error:err.message,sms:'This email event cannot be created'})
    }
};

exports.getAllEmailEvents = async (req, res) => {
    try{
        const simc = await emailEventModel.find({});

        if(!simc){
            res.status(500).send({success:false})
        }
        res.status(200).send({data:simc})
    } catch(err){
        res.status(500).send({error:err.message,sms:'Error getting all email event datas'})
    }
};

exports.getSingleEmailEvent = async (req, res) =>{
    try {
        const user = await emailEventModel.findById(req.params._id);
        res.status(200).send({data:user})
    } catch (error) {
        res.status(500).send({error:error.message,sms:'Error getting single email event data'})
    }
};

exports.editEmailEvent = async (req, res) => {
    try{
        const editsim = await emailEventModel.findByIdAndUpdate(req.body._id,{
            event_name: req.body.event_name,
            remarks: req.body.remarks,
            updated_by: req.body.updated_by
        }, { new: true })

        await simc.save();

        res.status(200).send({success:true,data:editsim})
    } catch(err){
        res.status(500).send({error:err,sms:'Error updating email event details'})
    }
};