const cityModel = require('../models/cityModel.js');

exports.addCity = async (req, res) =>{
    try{
        const simc = new cityModel({
            city_name: req.body.city_name,
            created_by: req.body.created_by
        })
        const simv = await simc.save();
        res.send({simv,status:200});
    } catch(err){
        res.status(500).send({error:err.message,sms:'This city cannot be created'})
    }
};

exports.getAllCities = async (req, res) => {
    try{
        const simc = await cityModel.find({});

        if(!simc){
            res.status(500).send({success:false})
        }
        res.status(200).send({data:simc})
    } catch(err){
        res.status(500).send({error:err.message,sms:'Error getting all cities datas'})
    }
};

exports.getSingleCity = async (req, res) =>{
    try {
        const city = await cityModel.findById(req.params._id);
        res.status(200).send({data:city})
    } catch (error) {
        res.status(500).send({error:error.message,sms:'Error getting single city data'})
    }
};

exports.editCity = async (req, res) => {
    try{
        const editsim = await cityModel.findByIdAndUpdate(req.body._id,{
            city_name: req.body.city_name,
            updated_by: req.body.updated_by
        }, { new: true })
        
        res.status(200).send({ success:true, data: editsim })
    } catch(err){
        res.status(500).send({error:err,sms:'Error updating city details'})
    }
};

exports.deleteCity = async (req, res) =>{
    cityModel.findByIdAndDelete(req.params._id, {timeout : 15000}).then(item =>{
        if(item){
            return res.status(200).json({success:true, message:'city deleted'})
        }else{
            return res.status(404).json({success:false, message:'city not found'})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, message:err})
    })
};

