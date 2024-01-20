const response = require('../../common/response');
const deptWiseStatusModel = require("../../models/TMS/deptWiseStatusModel.js");

exports.addDeptWiseStatus = async (req, res) => {
    try {
        const dataDeptWiseStatus = new deptWiseStatusModel({
            dept_id: req.body.dept_id,
            status: req.body.status,
            description: req.body.description,
            created_by: req.body.created_by
        });
        const dataDeptWiseStatusResult = await dataDeptWiseStatus.save();
        return response.returnTrue(
            200,
            req,
            res,
            "Data Dept Wise Status Created Successfully",
            dataDeptWiseStatusResult
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getDeptWiseStatus = async (req, res) => {
    try {
        const dataDeptWiseStatus = await deptWiseStatusModel.aggregate([
            {
                $lookup: {
                    from: 'departmentmodels',
                    localField: 'dept_id',
                    foreignField: 'dept_id',
                    as: 'department'
                }
            },
            {
                $unwind: {
                    path: "$department",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    dept_id: '$dept_id',
                    status: '$status',
                    description: '$description',
                    created_by: '$created_by',
                    dept_name: '$department.dept_name'
                }
            }
        ]).exec();
        // const dataDeptWiseStatus = await deptWiseStatusModel.find({});
        if (!dataDeptWiseStatus) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(dataDeptWiseStatus)
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error getting all data dept wise status ' })
    }
};

exports.getSingleDeptWiseStatus = async (req, res) => {
    try {
        const singleDataDeptWiseStatus = await deptWiseStatusModel.findById(req.params._id);
        if (!singleDataDeptWiseStatus) {
            return res.status(500).send({ success: false })
        }
        res.status(200).send(singleDataDeptWiseStatus);
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error getting single data dept wise status' })
    }
};

exports.editDataDeptWiseStatus = async (req, res) => {
    try {
        const editDataDeptWiseStatus = await deptWiseStatusModel.findByIdAndUpdate(req.body._id, {
            dept_id: req.body.dept_id,
            status: req.body.status,
            description: req.body.description,
            updated_by: req.body.updated_by
        }, { new: true })

        res.status(200).send({ success: true, data: editDataDeptWiseStatus })
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error updating data dept wise status' })
    }
};

exports.deleteDataDeptWiseStatus = async (req, res) => {
    deptWiseStatusModel.findByIdAndDelete(req.params._id).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'data dept wise status deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'data dept wise status not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err.message })
    })
};