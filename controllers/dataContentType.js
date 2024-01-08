const response = require("../common/response.js");
const dataContentTypeModel = require("../models/dataContentTypeModel.js");

exports.addDataContentType = async (req, res) => {
    try {
        const datacontent = new dataContentTypeModel({
            content_name: req.body.content_name,
            remark: req.body.remark,
            created_by: req.body.created_by,
            updated_by: req.body.updated_by
        });
        const simv = await datacontent.save();
        return response.returnTrue(
            200,
            req,
            res,
            "Data content type Created Successfully",
            simv
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getDataContentTypes = async (req, res) => {
    try {
        const simc = await dataContentTypeModel.find({});
        if (!simc) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(simc)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting all data content type' })
    }
};

exports.getSingleDataContentType = async (req, res) => {
    try {
        const singlesim = await dataContentTypeModel.findById(req.params._id);
        if (!singlesim) {
            return res.status(500).send({ success: false })
        }
        res.status(200).send(singlesim);
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting data sub category details' })
    }
};

exports.editDataContentType = async (req, res) => {
    try {
        const editsim = await dataContentTypeModel.findByIdAndUpdate(req.body._id, {
            content_name: req.body.content_name,
            remark: req.body.remark,
            created_by: req.body.created_by,
            updated_at: req.body.updated_at,
            updated_by: req.body.updated_by
        }, { new: true })

        res.status(200).send({ success: true, data: editsim })
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error updating data content type details' })
    }
};

exports.deleteDataContentType = async (req, res) => {
    dataContentTypeModel.findByIdAndDelete(req.params._id).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'data content type deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'data content type not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
};

