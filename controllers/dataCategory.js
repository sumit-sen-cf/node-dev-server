const response = require("../common/response.js");
const dataCategoryModel = require("../models/dataCategoryModel.js")

exports.addDataCategory = async (req, res) => {
    try {
        const datacategory = new dataCategoryModel({
            category_name: req.body.category_name,
            remark: req.body.remark,
            created_by: req.body.created_by,
            updated_by: req.body.updated_by
        });
        const simv = await datacategory.save();
        return response.returnTrue(
            200,
            req,
            res,
            "Data Category Created Successfully",
            simv
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getDataCategorys = async (req, res) => {
    try {
        const simc = await dataCategoryModel.find({});
        if (!simc) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(simc)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting all data categories' })
    }
};

exports.getSingleDataCategory = async (req, res) => {
    try {
        const singlesim = await dataCategoryModel.findById(req.params._id);
        if (!singlesim) {
            return res.status(500).send({ success: false })
        }
        res.status(200).send(singlesim);
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting data sub category details' })
    }
};

exports.editDataCategory = async (req, res) => {
    try {
        const editsim = await dataCategoryModel.findByIdAndUpdate(req.body._id, {
            category_name: req.body.category_name,
            remark: req.body.remark,
            created_by: req.body.created_by,
            updated_at: req.body.updated_at,
            updated_by: req.body.updated_by
        }, { new: true })

        res.status(200).send({ success: true, data: editsim })
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error updating data category details' })
    }
};

exports.deleteDataCategory = async (req, res) => {
    dataCategoryModel.findByIdAndDelete(req.params._id).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'data category deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'data category not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
};

