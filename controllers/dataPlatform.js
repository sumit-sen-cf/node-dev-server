const response = require("../common/response.js");
const dataPlatformModel = require("../models/dataPlatformModel.js");

exports.addDataPlatform = async (req, res) => {
    try {
        const dataplatform = new dataPlatformModel({
            platform_name: req.body.platform_name,
            remark: req.body.remark,
            created_by: req.body.created_by,
            updated_by: req.body.updated_by
        });
        const simv = await dataplatform.save();
        return response.returnTrue(
            200,
            req,
            res,
            "Data Platform Created Successfully",
            simv
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getDataPlatforms = async (req, res) => {
    try {
        const simc = await dataPlatformModel.find({});
        if (!simc) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(simc)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting all data platform' })
    }
};

exports.getSingleDataPlatform = async (req, res) => {
    try {
        const singlesim = await dataPlatformModel.findById(req.params._id);
        if (!singlesim) {
            return res.status(500).send({ success: false })
        }
        res.status(200).send(singlesim);
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting data platform details' })
    }
};

exports.editDataPlatform = async (req, res) => {
    try {
        const editsim = await dataPlatformModel.findByIdAndUpdate(req.body._id, {
            platform_name: req.body.platform_name,
            remark: req.body.remark,
            created_by: req.body.created_by,
            updated_at: req.body.updated_at,
            updated_by: req.body.updated_by
        }, { new: true })

        res.status(200).send({ success: true, data: editsim })
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error updating data platform details' })
    }
};

exports.deleteDataPlatform = async (req, res) => {
    dataPlatformModel.findByIdAndDelete(req.params._id).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'data platform deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'data platform not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
};