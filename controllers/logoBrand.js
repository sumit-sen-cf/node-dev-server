const logoBrandModel = require('../models/logoBrandModel.js');

exports.addLogoBrand = async (req, res) =>{
    try{
        const simc = new logoBrandModel({
            cat_name: req.body.cat_name,
            remark: req.body.remark,
            created_at: req.body.created_at,
            created_by: req.body.created_by
        })
        const simv = await simc.save();
        res.send({simv,status:200});
    } catch(err){
        res.status(500).send({error:err,sms:'This logo brand cannot be created'})
    }
};

exports.getLogoBrands = async (req, res) => {
    try{
        const simc = await logoBrandModel.find();
        if(!simc){
            res.status(500).send({success:false})
        }
        res.status(200).send(simc)
    } catch(err){
        res.status(500).send({error:err,sms:'Error getting all logo brands'})
    }
};

exports.getSingleLogoBrand = async (req, res) => {
    try{
        const singlesim = await logoBrandModel.findById(req.params._id);
        if(!singlesim){
            return res.status(500).send({success:false})
        }
        res.status(200).send(singlesim);
    } catch(err){
        res.status(500).send({error:err,sms:'Error getting logo brand details'})
    }
};

exports.editLogoBrand = async (req, res) => {
    try{
        const editsim = await logoBrandModel.findByIdAndUpdate(req.body._id,{
            cat_name: req.body.cat_name,
            remark: req.body.remark,
            created_at: req.body.created_at,
            created_by: req.body.created_by
        }, { new: true })
        if(!editsim){
            res.status(500).send({success:false})
        }
        res.status(200).send({success:true,data:editsim})
    } catch(err){
        res.status(500).send({error:err,sms:'Error updating logo brand details'})
    }
};

exports.deleteLogoBrand = async (req, res) =>{
    logoBrandModel.findByIdAndRemove(req.params._id).then(item =>{
        if(item){
            return res.status(200).json({success:true, message:'logo brand deleted'})
        }else{
            return res.status(404).json({success:false, message:'logo brand not found'})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, message:err})
    })
};
