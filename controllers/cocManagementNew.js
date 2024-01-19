const cocNewModel = require('../models/cocNewModel.js');

exports.addNewCoc = async (req, res) => {
    try {
        const newcoc = new cocNewModel({
            coc_content: req.body.coc_content,
            created_by: req.body.created_by
        })
        const cocData = await newcoc.save();
        res.send({ cocData, status: 200 });
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'This coc cannot be created' })
    }
};
exports.getAllNewCocs = async (req, res) => {
    try {
        const newcoc = await cocNewModel.find({});
        if (!newcoc) {
            res.status(500).send({ success: false })
        }
        res.status(200).send({ data: newcoc })
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error getting all coc datas' })
    }
};
exports.getSingleNewCoc = async (req, res) => {
    try {
        const singleCoc = await cocNewModel.findById(req.params._id);
        res.status(200).send({ data: singleCoc })
    } catch (error) {
        res.status(500).send({ error: error.message, sms: 'Error getting single coc data' })
    }
};
exports.editNewCoc = async (req, res) => {
    try {
        const editcoc = await cocNewModel.findByIdAndUpdate(req.body._id, {
            coc_content: req.body.coc_content,
            created_by: req.body.created_by,
            updated_by: req.body.updated_by
        }, { new: true })
        res.status(200).send({ success: true, data: editcoc })
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error updating coc details' })
    }
};
exports.deleteNewCoc = async (req, res) => {
    cocNewModel.findByIdAndDelete(req.params._id).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'coc deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'coc not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
};