const response = require('../../common/response');
const taskDeliveryModel = require("../../models/TMS/taskDeliveryModel");

exports.addTaskDelivery = async (req, res) => {
    try {
        const addData = new taskDeliveryModel({
            task_id: req.body.task_id,
            delivery_date_time: req.body.delivery_date_time,
            delivery_status: req.body.delivery_status,
            changes_date_time: req.body.changes_date_time,
            changes_summary: req.body.changes_summary,
            created_by: req.body.created_by
        });
        const addDataResult = await addData.save();
        return response.returnTrue(200,req,res,
            "Data created Successfully",
            addDataResult
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getTaskDelivery = async (req, res) => {
    try {
        let getData;
        if(req.body._id){
            getData = await taskDeliveryModel.find({_id: req.body._id})
        }
        getData = await taskDeliveryModel.find({});
        if (!getData) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(getData)
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error getting tasks' })
    }
};

exports.editTaskDelivery = async (req, res) => {
    try {
        const editData = await taskDeliveryModel.findByIdAndUpdate(req.body._id, {
            task_id: req.body.task_id,
            delivery_date_time: req.body.delivery_date_time,
            delivery_status: req.body.delivery_status,
            changes_date_time: req.body.changes_date_time,
            changes_summary: req.body.changes_summary,
            updated_by: req.body.updated_by
        }, { new: true })

        res.status(200).send({ success: true, data: editData })
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error updating data' })
    }
};

exports.deleteTaskDelivery = async (req, res) => {
    taskDeliveryModel.findByIdAndDelete(req.params._id).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'data deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'data not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err.message })
    })
};