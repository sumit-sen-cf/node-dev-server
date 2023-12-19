const logoCategoryModel = require('../models/logoCategoryModel.js');
const logoBrandModel = require('../models/logoCategoryModel.js');

exports.addLogoBrandCat = async (req, res) =>{
    try{
        const simc = new logoCategoryModel({
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

exports.addLogoBrand = async(req, res) => {
    try {
        const simc = new logoBrandModel({
            brand_name: req.body.brand_name,
            image_type: req.body.image_type,
            size: req.body.size,
            size_in_mb: req.body.size_in_mb,
            created_by: req.body.created_by,
            created_at: req.body.created_at, 
            last_updated_by: req.body.last_updated_by,
            remarks: req.body.remarks,
            logo_cat: req.body.logo_cat,
            upload_logo: req.file.filename 
        })
        const simv = await simc.save()
        res.send({simv, status:200})
    } catch (error) {
        res.status(500).send({error:error, sms:'error while adding logo brand data'})
    }
}

exports.getLogoBrandsCat = async (req, res) => {
    try{
        const simc = await logoCategoryModel.find();
        if(!simc){
            res.status(500).send({success:false})
        }
        res.status(200).send(simc)
    } catch(err){
        res.status(500).send({error:err,sms:'Error getting all logo brands'})
    }
};

exports.getSingleLogoBrandCat = async (req, res) => {
    try{
        const singlesim = await logoCategoryModel.findById(req.params._id);
        if(!singlesim){
            return res.status(500).send({success:false})
        }
        res.status(200).send(singlesim);
    } catch(err){
        res.status(500).send({error:err,sms:'Error getting logo brand details'})
    }
};

exports.editLogoBrandCat = async (req, res) => {
    try{
        const editsim = await logoCategoryModel.findByIdAndUpdate(req.body._id,{
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

exports.deleteLogoBrandCat = async (req, res) =>{
    logoCategoryModel.deleteOne({id:req.params.id}).then(item =>{
        if(item){
            return res.status(200).json({success:true, message:'logo brand deleted'})
        }else{
            return res.status(404).json({success:false, message:'logo brand not found'})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, message:err})
    })
};

