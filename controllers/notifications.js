const notificationModel = require('../models/notificationModel.js');

exports.addNotification = async (req, res) =>{
    try{
        const simc = new notificationModel({
            user_id: req.body.user_id,
            notification_title: req.body.notification_title,
            notification_message: req.body.notification_message,
            notification_show: req.body.notification_show,
            readen: req.body.readen,
            created_by: req.body.created_by
        })
        const simv = await simc.save();
        res.send({simv,status:200});
    } catch(err){
        res.status(500).send({error:err.message, sms:'This notification cannot be created'})
    }
};

exports.getAllUnredenNotifications = async (req, res) => {
    try{
        const simc = await notificationModel.find({readen: false}).limit(5).sort({creation_date : -1});
        const count = simc.length;

        if(!simc){
            res.status(500).send({success:false})
        }
        res.status(200).send({data:simc})
    } catch(err){
        res.status(500).send({error:err.message, sms:'Error getting all notifications'})
    }
};
exports.getAllNotifications = async (req, res) => {
    try{
        const simc = await notificationModel.find();
        const count = simc.length;

        if(!simc){
            res.status(500).send({success:false})
        }
        res.status(200).send({data:simc})
    } catch(err){
        res.status(500).send({error:err.message, sms:'Error getting all notifications'})
    }
};

exports.editNotification = async (req, res) => {
    try{
        const editsim = await notificationModel.findByIdAndUpdate(req.body._id,{
            // notification_title: req.body.notification_title,
            // notification_show: req.body.notification_show,
            readen: true
        }, { new: true })

        res.status(200).send({success:true,data:editsim})
    } catch(err){
        res.status(500).send({error:err,sms:'Error updating notification details'})
    }
};

exports.deleteNotification = async (req, res) =>{
    try {
        notificationModel.findByIdAndRemove(req.params._id).then(item =>{
            if(item){
                return res.status(200).json({success:true, message:'notification deleted'})
            }else{
                return res.status(404).json({success:false, message:'notification not found'})
            }
        })    
    } catch (error) {
        res.status(500).send({error:err,sms:'Error deleteing notification details'})
    }
};