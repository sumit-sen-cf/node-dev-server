const response = require("../common/response.js");
const attendanceDisputeModel = require("../models/attendanceDisputeModel.js");

exports.addAttendanceDispute = async (req, res) => {
    try {
        const attendanceDispute = new attendanceDisputeModel({
            user_id: req.body.user_id,
            attendence_id: req.body.attendence_id,
            dispute_status: req.body.dispute_status,
            dispute_reason: req.body.dispute_reason,
            dispute_date: req.body.dispute_date,
            created_by: req.body.created_by
        });

        const disputeData = await attendanceDispute.save();

        return res.send({ disputeData, status: 200 });
    } catch (err) {
        return res
            .status(500)
            .send({ error: err.message, sms: "This dispute cannot be created" });
    }
};

exports.getAttendanceDisputes = async (req, res) => {
    try {
        const simc = await attendanceDisputeModel.aggregate([
            {
                $lookup: {
                    from: "attendancemodels",
                    localField: "attendence_id",
                    foreignField: "attendence_id",
                    as: "attendence_data",
                },
            },
            {
                $unwind: {
                    path: "$attendence_data",
                    // preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "departmentmodels",
                    localField: "attendence_data.dept",
                    foreignField: "dept_id",
                    as: "dept_data",
                },
            },
            {
                $unwind: "$dept_data",
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "user_id",
                    foreignField: "user_id",
                    as: "user_data",
                },
            },
            {
                $unwind: {
                    path: "$user_data",
                    // preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user_created_by",
                },
            },
            {
                $unwind: {
                    path: "$user_created_by",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "last_updated_by",
                    foreignField: "user_id",
                    as: "user_last_updated_by",
                },
            },
            {
                $unwind: {
                    path: "$user_last_updated_by",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    attendence_id: 1,
                    dispute_status: 1,
                    dispute_reason: 1,
                    dispute_date: 1,
                    creation_date: 1,
                    created_by: 1,
                    last_updated_by: 1,
                    last_updated_date: 1,
                    noOfabsent: "$attendence_data.noOfabsent",
                    year: "$attendence_data.year",
                    remark: "$attendence_data.remark",
                    Creation_date: "$attendence_data.Creation_date",
                    Created_by: "$attendence_data.Created_by",
                    Last_updated_by: "$attendence_data.Last_updated_by",
                    Last_updated_date: "$attendence_data.Last_updated_date",
                    month: "$attendence_data.month",
                    bonus: "$attendence_data.bonus",
                    total_salary: "$attendence_data.total_salary",
                    net_salary: "$attendence_data.net_salary",
                    tds_deduction: "$attendence_data.tds_deduction",
                    toPay: "$attendence_data.toPay",
                    sendToFinance: "$attendence_data.sendToFinance",
                    attendence_generated: "$attendence_data.attendence_generated",
                    attendence_status: "$attendence_data.attendence_status",
                    salary_status: "$attendence_data.salary_status",
                    salary_deduction: "$attendence_data.salary_deduction",
                    salary: "$attendence_data.salary",
                    dept_id: "$attendence_data.dept",
                    dept_name: "$dept_data.dept_name",
                    user_name: "$user_data.user_name",
                    user_created_by_name: "$user_created_by.user_name",
                    user_last_updated_by: "$user_last_updated_by.user_name"
                },
            },
            // {
            //     $group: {
            //         _id: "$id",
            //         data: { $first: "$$ROOT" }
            //     }
            // },
            // {
            //     $replaceRoot: { newRoot: "$data" }
            // }
        ]);
        if (!simc) {
            res.status(500).send({ success: false });
        }
        return res.status(200).send(simc);
    } catch (err) {
        return res
            .status(500)
            .send({ error: err.message, sms: "Error getting all Attendance Disputes" });
    }
};

exports.getSingleAttendanceDispute = async (req, res) => {
    try {
        const simc = await attendanceDisputeModel.aggregate([
            {
                $match: {
                    user_id: parseInt(req.params.user_id)
                }
            },
            {
                $lookup: {
                    from: "attendancemodels",
                    localField: "attendence_id",
                    foreignField: "attendence_id",
                    as: "attendence_data",
                },
            },
            {
                $unwind: {
                    path: "$attendence_data",
                    // preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "departmentmodels",
                    localField: "attendence_data.dept",
                    foreignField: "dept_id",
                    as: "dept_data",
                },
            },
            {
                $unwind: "$dept_data",
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "user_id",
                    foreignField: "user_id",
                    as: "user_data",
                },
            },
            {
                $unwind: {
                    path: "$user_data",
                    // preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user_created_by",
                },
            },
            {
                $unwind: {
                    path: "$user_created_by",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "last_updated_by",
                    foreignField: "user_id",
                    as: "user_last_updated_by",
                },
            },
            {
                $unwind: {
                    path: "$user_last_updated_by",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    attendence_id: 1,
                    dispute_status: 1,
                    dispute_reason: 1,
                    dispute_date: 1,
                    creation_date: 1,
                    created_by: 1,
                    last_updated_by: 1,
                    last_updated_date: 1,
                    noOfabsent: "$attendence_data.noOfabsent",
                    year: "$attendence_data.year",
                    remark: "$attendence_data.remark",
                    Creation_date: "$attendence_data.Creation_date",
                    Created_by: "$attendence_data.Created_by",
                    Last_updated_by: "$attendence_data.Last_updated_by",
                    Last_updated_date: "$attendence_data.Last_updated_date",
                    month: "$attendence_data.month",
                    bonus: "$attendence_data.bonus",
                    total_salary: "$attendence_data.total_salary",
                    net_salary: "$attendence_data.net_salary",
                    tds_deduction: "$attendence_data.tds_deduction",
                    toPay: "$attendence_data.toPay",
                    sendToFinance: "$attendence_data.sendToFinance",
                    attendence_generated: "$attendence_data.attendence_generated",
                    attendence_status: "$attendence_data.attendence_status",
                    salary_status: "$attendence_data.salary_status",
                    salary_deduction: "$attendence_data.salary_deduction",
                    salary: "$attendence_data.salary",
                    dept_id: "$attendence_data.dept",
                    dept_name: "$dept_data.dept_name",
                    user_name: "$user_data.user_name",
                    user_created_by_name: "$user_created_by.user_name",
                    user_last_updated_by: "$user_last_updated_by.user_name"
                },
            },
            // {
            //     $group: {
            //         _id: "$id",
            //         data: { $first: "$$ROOT" }
            //     }
            // },
            // {
            //     $replaceRoot: { newRoot: "$data" }
            // }
        ]);
        if (!simc) {
            res.status(500).send({ success: false });
        }
        return res.status(200).send(simc);
    } catch (err) {
        return res
            .status(500)
            .send({ error: err.message, sms: "Error getting Single Attendance Dispute" });
    }
};

exports.editAttendanceDispute = async (req, res) => {
    try {
        const editAttendanceDispute = await attendanceDisputeModel.findOneAndUpdate(
            { attendence_id: parseInt(req.body.attendence_id) },
            {
                user_id: req.body.user_id,
                dispute_status: req.body.dispute_status,
                dispute_reason: req.body.dispute_reason,
                dispute_date: req.body.dispute_date,
                created_by: req.body.created_by,
                last_updated_by: req.body.last_updated_by,
                last_updated_date: req.body.last_updated_date
            },
            { new: true }
        );
        if (!editAttendanceDispute) {
            return response.returnFalse(
                200,
                req,
                res,
                "No Reord Found With This Vendor Id",
                {}
            );
        }
        return response.returnTrue(200, req, res, "Updation Successfully", editAttendanceDispute);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.deleteAttendanceDispute = async (req, res) => {
    attendanceDisputeModel.findByIdAndDelete(req.params._id).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'Attendance Dispute Data deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'Attendance Dispute Data not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err.message })
    })
};