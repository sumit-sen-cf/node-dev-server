const response = require('../../common/response');
const taskSequenceModel = require("../../models/TMS/taskSequenceModel");

exports.addSequence = async (req, res) => {
    try {
        const addData = new taskSequenceModel({
            sequence: req.body.sequence,
            status_id: req.body.status_id,
            created_by: req.body.created_by
        });
        const addDataResult = await addData.save();
        return response.returnTrue(200,req,res,
            "sequence data created Successfully",
            addDataResult
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getSequences = async (req, res) => {
    try {
        let getData;
        if(req.params._id){
            getData = await taskSequenceModel.find({_id: req.params._id})
        }
        getData = await taskSequenceModel.find({});
        if (!getData) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(getData)
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error getting task sequence' })
    }
};

exports.editTaskSequence = async (req, res) => {
    try {
        const editData = await taskSequenceModel.findByIdAndUpdate(req.body._id, {
            status_id: req.body.status_id,
            updated_by: req.body.updated_by
        }, { new: true })

        res.status(200).send({ success: true, data: editData })
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error updating data' })
    }
};

exports.deleteTaskSequence = async (req, res) => {
    taskSequenceModel.findByIdAndDelete(req.params._id).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'data deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'data not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err.message })
    })
};