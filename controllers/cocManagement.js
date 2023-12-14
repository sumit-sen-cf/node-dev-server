const cocModel = require('../models/cocModel.js');
const cocHisModel = require('../models/cocHisModel.js')

exports.addCoc = async (req, res) =>{
    try{
        const simc = new cocModel({
            display_sequence: req.body.display_sequence,
            heading: req.body.heading,
            heading_desc: req.body.heading_desc,
            sub_heading: req.body.sub_heading,
            sub_heading_desc: req.body.sub_heading_desc,
            sub_heading_sequence: req.body.sub_heading_sequence,
            description: req.body.description,
            remarks: req.body.remarks,
            designed_by: req.body.designed_by,
            created_by: req.body.created_by
        })
        const simv = await simc.save();
        res.send({simv,status:200});
    } catch(err){
        res.status(500).send({error:err.message,sms:'This coc cannot be created'})
    }
};

exports.getAllCocs = async (req, res) => {
    try{
        const simc = await cocModel.find({});

        if(!simc){
            res.status(500).send({success:false})
        }
        res.status(200).send({data:simc})
    } catch(err){
        res.status(500).send({error:err.message,sms:'Error getting all coc datas'})
    }
};

exports.getSingleCoc = async (req, res) =>{
    try {
        const user = await cocModel.findById(req.params._id);
        res.status(200).send({data:user})
    } catch (error) {
        res.status(500).send({error:error.message,sms:'Error getting single coc data'})
    }
};

exports.editCoc = async (req, res) => {
    try{
        const editsim = await cocModel.findByIdAndUpdate(req.body._id,{
            display_sequence: req.body.display_sequence,
            heading: req.body.heading,
            heading_desc: req.body.heading_desc,
            sub_heading: req.body.sub_heading,
            sub_heading_desc: req.body.sub_heading_desc,
            sub_heading_sequence: req.body.sub_heading_sequence,
            description: req.body.description,
            remarks: req.body.remarks,
            updated_by: req.body.updated_by
        }, { new: true })
        
        const simc = new cocHisModel({
            coc_id: req.body._id,
            display_sequence: req.body.display_sequence,
            heading: req.body.heading,
            sub_heading: req.body.sub_heading,
            sub_heading_sequence: req.body.sub_heading_sequence,
            description: req.body.description,
            updated_by: req.body.updated_by
        })
        await simc.save();

        res.status(200).send({success:true,data:editsim})
    } catch(err){
        res.status(500).send({error:err,sms:'Error updating coc details'})
    }
};

exports.deleteCoc = async (req, res) =>{
    cocModel.findByIdAndDelete(req.params._id).then(item =>{
        if(item){
            return res.status(200).json({success:true, message:'sim deleted'})
        }else{
            return res.status(404).json({success:false, message:'sim not found'})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, message:err})
    })
};

exports.getCocHistory = async (req, res) => {
    try {
        const cocData = await cocHisModel.find({coc_id: req.params._id})
        res.status(200).send({data:cocData})
    } catch (error) {
        res.status(500).send({error:error.message, sms:'error getting coc history'})
    }
}