const response = require('../../common/response');
const taskModel = require("../../models/TMS/taskModel");

exports.addTask = async (req, res) => {
    try {
        const addData = new taskModel({
            task_title: req.body.task_title,
            task_description: req.body.status,
            assigned_to: req.body.assigned_to,
            deliver_to: req.body.deliver_to,
            aging: req.body.aging,
            review: req.body.review,
            rating: req.body.rating,
            task_status: req.body.task_status,
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

exports.getTasks = async (req, res) => {
    try {
        let getData;
        if(req.params._id){
            getData = await taskModel.find({_id: req.body._id})
        }
        getData = await taskModel.find({created_by: req.body.created_by});
        if (!getData) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(getData)
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error getting tasks' })
    }
};

exports.editTask = async (req, res) => {
    try {
        const editData = await taskModel.findByIdAndUpdate(req.body._id, {
            task_title: req.body.task_title,
            task_description: req.body.status,
            assigned_to: req.body.assigned_to,
            deliver_to: req.body.deliver_to,
            aging: req.body.aging,
            review: req.body.review,
            rating: req.body.rating,
            task_status: req.body.task_status,
            updated_by: req.body.updated_by
        }, { new: true })

        res.status(200).send({ success: true, data: editData })
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error updating data' })
    }
};

exports.deleteTask = async (req, res) => {
    taskModel.findByIdAndDelete(req.params._id).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'data deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'data not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err.message })
    })
};