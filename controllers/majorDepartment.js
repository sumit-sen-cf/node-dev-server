const response = require("../common/response.js");
const majorDepartmentModel = require("../models/majorDepartMentModel.js");

exports.addMajorDepartment = async (req, res) => {
    try {
        const simc = new majorDepartmentModel({
            m_dept_name: req.body.m_dept_name,
            dept_id: req.body.dept_id,
            Remarks: req.body.remark,
            Created_by: req.body.Created_by,
        });
        const simv = await simc.save();
        return response.returnTrue(
            200,
            req,
            res,
            "Major Department Created Successfully",
            simv
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getMajorDepartments = async (req, res) => {
    try {
        const simc = await majorDepartmentModel.aggregate([
            {
                $lookup: {
                    from: "departmentmodels",
                    localField: "dept_id",
                    foreignField: "dept_id",
                    as: "deptData",
                },
            },
            {
                $unwind: {
                    path: "$deptData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "Created_by",
                    foreignField: "user_id",
                    as: "userData",
                },
            },
            {
                $unwind: {
                    path: "$userData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    dept_id: 1,
                    m_dept_id: 1,
                    m_dept_name: 1,
                    Remarks: 1,
                    Created_by: 1,
                    dept_name: "$deptData.dept_name",
                    created_by_name: "$userData.user_name",
                    Last_updated_by: 1,
                    Last_updated_date: 1,
                    Creation_date: 1
                },
            },
        ]);
        if (!simc) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(simc)

    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getSingleMajorDepartment = async (req, res) => {
    try {
        const singlesim = await majorDepartmentModel.findOne({
            m_dept_id: parseInt(req.params.id),
        });
        if (!singlesim) {
            return response.returnFalse(200, req, res, "No Record Found...", {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Major Department Data Fetch Successfully",
            singlesim
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.editMajorDepartment = async (req, res) => {
    try {

        const editsim = await majorDepartmentModel.findOneAndUpdate(
            { m_dept_id: parseInt(req.body.m_dept_id) },
            {
                m_dept_name: req.body.m_dept_name,
                dept_id: req.body.dept_id,
                Remarks: req.body.remark,
                Created_by: req.body.Created_by,
                Last_updated_by: req.body.Last_updated_by,
                Last_updated_date: req.body.Last_updated_date,
            },
            { new: true }
        );
        if (!editsim) {
            return response.returnFalse(
                200,
                req,
                res,
                "No Reord Found With This Department Id",
                {}
            );
        }
        return response.returnTrue(200, req, res, "Updation Successfully", editsim);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.deleteMajorDepartment = async (req, res) => {
    majorDepartmentModel.deleteOne({ m_dept_id: req.params.id }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'Major Department deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'Major Department not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
};
