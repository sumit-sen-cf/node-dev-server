const expenseModel = require('../models/expenseModel.js');
const vari = require("../variables.js");
const {storage, uploadToGCP} = require('../common/uploadFile.js')

exports.addExpense = async (req, res) =>{
    try{
        const simc = new expenseModel({
            account_details: req.body.account_details,
            amount: req.body.amount,
            description: req.body.description,
            reference_number: req.body.reference_number,
            expense_category: req.body.expense_category,
            created_by: req.body.created_by,
            assigned_to: req.body.assigned_to,
            creation_date: req.body.creation_date,
            minor_status: req.body.minor_status,
            major_status: req.body.major_status,
        })

        uploadToGCP(req, simc, 'upload_bill')
        .then((message) => {
            res.status(200).send(message);
        })
        .catch((error) => {
            res.status(500).send(error.message);
        });
        const simv = await simc.save();
        res.send({data:simv,status:200,message:'data created successfully'});
    } catch(err){
        res.status(500).send({error:err.message,sms:'This demo data cannot be created'})
    }
};

exports.getAllExpenses = async (req, res) => {
    try{
        const simc = await expenseModel.find({});

        if(!simc){
            res.status(500).send({success:false})
        }
        res.status(200).send({data:simc})
    } catch(err){
        res.status(500).send({error:err.message,sms:'Error getting all expense datas'})
    }
};

exports.getSingleExpense = async (req, res) =>{
    try {
        const user = await expenseModel.findById(req.params._id);
        res.status(200).send({data:user})
    } catch (error) {
        res.status(500).send({error:error.message,sms:'Error getting single expense data'})
    }
};

exports.editExpense = async (req, res) => {
    try{
        const editsim = await expenseModel.findByIdAndUpdate(req.body._id,{
            account_details: req.body.account_details,
            amount: req.body.amount,
            description: req.body.description,
            reference_number: req.body.reference_number,
            expense_category: req.body.expense_category,
            created_by: req.body.created_by,
            assigned_to: req.body.assigned_to,
            creation_date: req.body.creation_date,
            minor_status: req.body.minor_status,
            major_status: req.body.major_status,
            upload_bill : req.file?.originalname
        }, { new: true })

        if(req.file){
            uploadToGCP(req, editsim, 'upload_bill')
            .then((message) => {
                res.status(200).send(message);
            })
            .catch((error) => {
                res.status(500).send(error.message);
            });
        }

        res.status(200).send({success:true,data:editsim})
    } catch(err){
        res.status(500).send({error:err,sms:'Error updating expense details'})
    }
};

exports.deleteExpense = async (req, res) =>{
    expenseModel.findByIdAndDelete(req.params._id).then(item =>{
        if(item){
            return res.status(200).json({success:true, message:'expense data deleted'})
        }else{
            return res.status(404).json({success:false, message:'expense data not found'})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, message:err})
    })
};