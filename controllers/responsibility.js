const jobResponsibilityModel = require('../models/jobResponsibilityModel.js');
const responsibilityModel = require('../models/responsibilityModel.js');

exports.addJobResponsibility = async (req, res) =>{
    try{
        const checkDuplicacy = await jobResponsibilityModel.findOne({
            sjob_responsibility: req.body.job_responsi,
            user_id: req.body.user_id
        })
        if(checkDuplicacy){
            return res.status(409).send({
            data: [],
            message: "Job responsiblity already assigned to user",
            });
        }
        const simc = new jobResponsibilityModel({
            user_id: req.body.user_id,
            sjob_responsibility: req.body.job_responsi,
            description: req.body.description,
            Created_by: req.body.created_by
        })
        const simv = await simc.save();
        res.send({simv,status:200});
    } catch(err){
        res.status(500).send({error:err,sms:'This responsibility cannot be created'})
    }
};

exports.getJobResposibilities = async (req, res) => {
    try{
        const simc = await jobResponsibilityModel.aggregate([
            {
                $lookup: {
                    from: 'usermodels',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    _id: 1,
                    Job_res_id:"$Job_res_id",
                    user_name: '$user.user_name',
                    description: '$description',
                    sjob_responsibility: '$sjob_responsibility',
                    user_id: '$user_id',
                    user_email_id:"$user.user_email_id",
                    user_contact_no:"$user.user_contact_no"
                }
            }
        ]).exec();
        if(!simc){
            res.status(500).send({success:false})
        }
        res.status(200).send({data : simc})
    } catch(err){
        res.status(500).send({error:err,sms:'Error getting all responsibility datas'})
    }
};

exports.getSingleJobResponsibility = async (req, res) => {
    try{
        const singlesim = await subDepartmentModel.aggregate([
            {
                $match: { user_id: req.body.user_id } 
            },
            {
                $lookup: {
                    from: 'usermodels',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    _id: 1,
                    created_by_name: '$user.user_name',
                    description: '$description',
                    sjob_responsibility: '$sjob_responsibility',
                    user_id: '$user_id'
                }
            }
        ]).exec();
        if(!singlesim){
            return res.status(500).send({success:false})
        }
        res.status(200).send(singlesim);
    } catch(err){
        res.status(500).send({error:err,sms:'Error getting responsibility details'})
    }
};

exports.editJobResponsibility = async (req, res) => {
    try{
        const checkDuplicacy = await jobResponsibilityModel.findOne({
            sjob_responsibility: req.body.job_responsi,
            user_id: req.body.user_id
        })
        if(checkDuplicacy){
            return res.status(409).send({
            data: [],
            message: "Job responsiblity already assigned to user",
            });
        }
        const editsim = await jobResponsibilityModel.findOneAndUpdate({Job_res_id:parseInt(req.body.Job_res_id)},{
            user_id: parseInt(req.body.user_id),
            sjob_responsibility: req.body.job_responsi,
            description: req.body.description,
            last_updated_by: req.body.last_updated_by
        }, { new: true })
        if(!editsim){
            res.status(500).send({success:false})
        }
        res.status(200).send({success:true,data:editsim})
    } catch(err){
        res.status(500).send({error:err,sms:'Error updating responsibility details'})
    }
};

exports.deleteJobResponsibility = async (req, res) =>{
    jobResponsibilityModel.deleteOne({id:req.params.Job_res_id}).then(item =>{
        if(item){
            return res.status(200).json({success:true, message:'responsibility deleted'})
        }else{
            return res.status(404).json({success:false, message:'responsibility not found'})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, message:err})
    })
};

exports.addResponsibility = async (req, res) =>{
    try{
        const checkDuplicacy = await responsibilityModel.findOne({respo_name: req.body.respo_name})
        if(checkDuplicacy){
            return res.status(409).send({
                data: [],
                message: "Responsibility already exist",
            });
        }
        const simc = new responsibilityModel({
            respo_name: req.body.respo_name,
            remark: req.body.remark,
            description: req.body.description,
            created_by: req.body.created_by
        })
        const simv = await simc.save();
        res.send({simv,status:200});
    } catch(err){
        res.status(500).send({error:err,sms:'This responsibility cannot be created'})
    }
};

exports.getResposibilities = async (req, res) => {
    try{
        const simc = await responsibilityModel.find();
        if(!simc){
            res.status(500).send({success:false})
        }
        res.status(200).send(simc)
    } catch(err){
        res.status(500).send({error:err,sms:'Error getting all responsibility datas'})
    }
};

exports.getSingleResposibility = async (req, res) => {
    try{
        const simc = await responsibilityModel.findOne({id:req.params.id});
        if(!simc){
            res.status(500).send({success:false})
        }
        res.status(200).send(simc)
    } catch(err){
        res.status(500).send({error:err,sms:'Error getting all responsibility datas'})
    }
};

exports.deleteResponsibility = async (req, res) =>{
    responsibilityModel.deleteOne({id:req.params.id}).then(item =>{
        if(item){
            return res.status(200).json({success:true, message:'responsibility deleted'})
        }else{
            return res.status(404).json({success:false, message:'responsibility not found'})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, message:err})
    })
};

exports.editResponsibility = async (req, res) => {
    try{
        const checkDuplicacy = await responsibilityModel.findOne({respo_name: req.body.respo_name})
        if(checkDuplicacy){
            return res.status(409).send({
                data: [],
                message: "Responsibility already exist",
            });
        }
        const editsim = await responsibilityModel.findOneAndUpdate({id:req.params.id},{
            respo_name: req.body.respo_name,
            remark: req.body.remark,
            description: req.body.description,
            last_updated_by: req.body.last_updated_by
        }, { new: true })
        if(!editsim){
            res.status(500).send({success:false})
        }
        res.status(200).send({success:true,data:editsim})
    } catch(err){
        res.status(500).send({error:err,sms:'Error updating responsibility details'})
    }
};

exports.usersByJobResponsi = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}