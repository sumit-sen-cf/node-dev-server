const response = require("../common/response.js");
const dataSubCategoryModel = require("../models/dataSubCategoryModel.js");

exports.addDataSubCat = async (req, res) => {
    try {
        const logoSubCatData = new dataSubCategoryModel({
            data_sub_cat_name: req.body.data_sub_cat_name,
            cat_id: req.body.cat_id,
            remark: req.body.remark,
            created_at: req.body.created_at,
            created_by: req.body.created_by
        });
        const simv = await logoSubCatData.save();
        return response.returnTrue(
            200,
            req,
            res,
            "Data Sub Category Created Successfully",
            simv
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getDataSubCats = async (req, res) => {
    try {

        const simc = await dataSubCategoryModel.find().populate('cat_id');
        if (!simc) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(simc)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting all data sub category' })
    }
};

exports.getSingleDataSubCat = async (req, res) => {
    try {
        const singlesim = await dataSubCategoryModel.findById(req.params._id);
        if (!singlesim) {
            return res.status(500).send({ success: false })
        }
        res.status(200).send(singlesim);
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting data sub category details' })
    }
};

exports.editDataSubCat = async (req, res) => {
    try {
        const editsim = await dataSubCategoryModel.findByIdAndUpdate(req.body._id, {
            data_sub_cat_name: req.body.data_sub_cat_name,
            cat_id: req.body.cat_id,
            remark: req.body.remark,
            created_at: req.body.created_at,
            created_by: req.body.created_by
        }, { new: true })
        if (!editsim) {
            res.status(500).send({ success: false })
        }
        res.status(200).send({ success: true, data: editsim })
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error updating data sub category details' })
    }
};

exports.deleteDataSubCat = async (req, res) => {
    dataSubCategoryModel.findByIdAndDelete(req.params._id).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'data sub category deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'data sub category not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
};

