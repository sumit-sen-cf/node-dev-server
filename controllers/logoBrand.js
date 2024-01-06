const logoCategoryModel = require('../models/logoCategoryModel.js');
const logoBrandModel = require('../models/logoBrandModel.js');
const path = require("path");
const constant = require('../common/constant.js');
const helper = require('../helper/helper.js');

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
        const lastRecord = await logoBrandModel.findOne({}, {}, { sort: { 'logo_id': -1 } });
        const nextLogoId = (lastRecord && lastRecord.logo_id) ? lastRecord.logo_id + 1 : 1;

        const simc = new logoBrandModel({
            logo_id: nextLogoId,
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
        res.status(500).send({error:error.message, sms:'error while adding logo brand data'})
    }
}
exports.getlogoImage = async(req, res) => {
    try {
        const filename = req.params.filename;
        const imagePath = path.join(__dirname, "../uploads/logo", filename);
       
        res.sendFile(imagePath);
    } catch (error) {
        res.status(500).send({error:error.message, sms:'error while adding logo brand data'})
    }
}
exports.getLogoData = async(req, res) => {
    try {
        const productData = await logoBrandModel.aggregate([
            {
                $lookup: {
                    from: 'logocategorymodels', 
                    localField: 'id',
                    foreignField: 'logo_cat',
                    as: 'logoCategory'
                }
            },
            {
                $lookup: {
                    from: "usermodels", 
                    localField: 'created_by',
                    foreignField: 'user_id',
                    as: 'createdByUser'
                }
            },
            {
                $project: {
                    _id: 0,
                    logo_id: 1,
                    brand_name: '$brand_name',
                    image_type: '$image_type',
                    size: '$size',
                    size_in_mb: '$size_in_mb',
                    remarks: '$remarks',
                    created_by: '$created_by',
                    user_name: { $arrayElemAt: ['$createdByUser.user_name', 0] },
                    created_at: '$created_at',
                    last_updated_at: '$last_updated_at',
                    last_updated_by: '$last_updated_by',
                    cat_id: { $arrayElemAt: ['$logoCategory._id', 0] },
                    cat_name: { $arrayElemAt: ['$logoCategory.cat_name', 0] },
                    logo_image: {
                        $cond: {
                            if: { $ne: ['$upload_logo', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}/uploads/logo/`,
                                    '$upload_logo'
                                ]
                            },
                            else: null
                        }
                    },
                    logo_image_download: {
                        $cond: {
                            if: { $ne: ['$upload_logo', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}/uploads/logo/`,
                                    '$upload_logo'
                                ]
                            },
                            else: null
                        }
                    }
                }
            }
        ]);
        if (productData?.length == 0){
            return res.status(200).json({message : "No Record Found"});
            }
      return  res.status(200).json(productData);
    } catch (error) {
        res.status(500).send({error:error.message, sms:'error while adding logo brand data'})
    }
}
exports.getSingleLogoData = async(req, res) => {
    try {
        const productData = await logoBrandModel.aggregate([
            {
                $match : {
                    logo_id : req.params.logo_id && parseInt(req.params.logo_id)
                }
            },
            {
                $lookup: {
                    from: 'logocategorymodels', 
                    localField: 'id',
                    foreignField: 'logo_cat',
                    as: 'logoCategory'
                }
            },
            {
                $lookup: {
                    from: "usermodels", 
                    localField: 'created_by',
                    foreignField: 'user_id',
                    as: 'createdByUser'
                }
            },
            {
                $project: {
                    _id: 0,
                    logo_id: 1,
                    brand_name: '$brand_name',
                    image_type: '$image_type',
                    size: '$size',
                    size_in_mb: '$size_in_mb',
                    remarks: '$remarks',
                    created_by: '$created_by',
                    user_name: { $arrayElemAt: ['$createdByUser.user_name', 0] },
                    created_at: '$created_at',
                    last_updated_at: '$last_updated_at',
                    last_updated_by: '$last_updated_by',
                    cat_id: { $arrayElemAt: ['$logoCategory._id', 0] },
                    cat_name: { $arrayElemAt: ['$logoCategory.cat_name', 0] },
                    logo_image: {
                        $cond: {
                            if: { $ne: ['$upload_logo', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}/uploads/logo/`,
                                    '$upload_logo'
                                ]
                            },
                            else: null
                        }
                    },
                    logo_image_download: {
                        $cond: {
                            if: { $ne: ['$upload_logo', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}/uploads/logo/`,
                                    '$upload_logo'
                                ]
                            },
                            else: null
                        }
                    }
                }
            }
        ]);
if (productData?.length == 0){
return res.status(200).json({message : "No Record Found"});
}
        res.status(200).json(productData[0]);
    } catch (error) {
        res.status(500).send({error:error.message, sms:'error while adding logo brand data'})
    }
}

exports.getLogoDataBasedBrand = async(req, res) => {
    try {
        const productData = await logoBrandModel.aggregate([
            {
                $match : {
                    brand_name : req.params.brand_name
                }
            },
            {
                $lookup: {
                    from: 'logocategorymodels', 
                    localField: 'id',
                    foreignField: 'logo_cat',
                    as: 'logoCategory'
                }
            },
            {
                $project: {
                    _id: 0,
                    logo_id: 1,
                    brand_name: '$brand_name',
                    image_type: '$image_type',
                    size: '$size',
                    remarks: '$remarks',
                    created_at: '$created_at',
                    last_updated_at: '$last_updated_at',
                    last_updated_by: '$last_updated_by',
                    cat_id: { $arrayElemAt: ['$logoCategory._id', 0] },
                    cat_name: { $arrayElemAt: ['$logoCategory.cat_name', 0] },
                    logo_image: {
                        $cond: {
                            if: { $ne: ['$upload_logo', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}/uploads/logo/`,
                                    '$upload_logo'
                                ]
                            },
                            else: null
                        }
                    },
                    logo_image_download: {
                        $cond: {
                            if: { $ne: ['$upload_logo', null] },
                            then: {
                                $concat: [
                                    `${constant.base_url}/uploads/logo/`,
                                    '$upload_logo'
                                ]
                            },
                            else: null
                        }
                    }
                }
            }
        ]);
if (productData?.length == 0){
return res.status(200).json({message : "No Record Found"});
}
        res.status(200).json(productData);
    } catch (error) {
        res.status(500).send({error:error.message, sms:'error while adding logo brand data'})
    }
}

exports.deleteLogoBrand = async (req, res) =>{
    logoBrandModel.findOneAndDelete({logo_id:req.params.logo_id}).then(item =>{
        if(item.deletedCount !== 0){
            return res.status(200).json({success:true, message:'logo brand deleted'})
        }else{
            return res.status(404).json({success:false, message:'logo brand not found'})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, message:err.message})
    })
};

exports.deleteLogoBrandBasedBrand = async (req, res) =>{
    logoBrandModel.deleteMany({brand_name:req.params.brand_name}).then(item =>{
        if(item){
            const result = helper.fileRemove(
                item?.upload_logo,
                "../uploads/logo"
              );
              if (result?.status == false) {
                return res.status(200).json({success:false, message: result.msg})
              }
            return res.status(200).json({success:true, message:'logo brand deleted'})
        }else{
            return res.status(404).json({success:false, message:'logo brand not found'})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, message:err.message})
    })
};

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
        const singlesim = await logoCategoryModel.findOne({id:parseInt(req.params.id)});
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
        const editsim = await logoCategoryModel.findOneAndUpdate({id:parseInt(req.body.id)},{
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

exports.editLogoBrand = async(req, res) => {
    try{
        const editlogobrand = await logoBrandModel.findOneAndUpdate({logo_id:req.body.id},{
            brand_name: req.body.brand_name,
            image_type: req.body.image_type,
            size: req.body.size,
            size_in_mb: req.body.size_in_mb,
            updated_at: req.body.updated_at, 
            last_updated_by: req.body.last_updated_by,
            remarks: req.body.remarks,
            logo_cat: req.body.logo_cat,
            upload_logo: req.file.filename
        })

        res.status(200).send({data:editlogobrand, sms:'logo brands details updated successfully'})
    }catch(err){
        res.status(500).send({error: err.message, sms:'error udpdating logo brands details'})
    }
}

exports.editLogoBrandNew = async(req, res) => {
    try{
        const getName = await logoBrandModel.findOne({logo_id:req.body.id}).select({brand_name:1});
        const getAllNames = await logoBrandModel.find({brand_name:getName}).select({logo_id:1});
        const groupIds = getAllNames.map((item)=> item.logo_id);
        const editlogoname = await logoBrandModel.updateMany({logo_id:{$in:groupIds}},{
            $set:{
                brand_name: req.body.brand_name,
                updated_at: req.body.updated_at, 
                last_updated_by: req.body.last_updated_by,
                remarks: req.body.remarks
            }
        })
        res.status(200).send({data:editlogoname, sms:'logo brand name updated successfully'})
    }catch(err){
        res.status(500).send({error: err.message, sms:'error udpdating logo brands details'})
    }
}