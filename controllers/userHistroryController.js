const userHistoryModel = require("../models/userHistoryModel.js");
const mongoose = require("mongoose")

exports.getAllUserHistorys = async (req, res) => {
    try {
        const userDataPipeline = [
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
                $lookup: {
                    from: 'designationmodels',
                    localField: 'user_designation',
                    foreignField: 'desi_id',
                    as: 'designation'
                }
            },
            {
                $unwind: {
                    path: "$designation",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'rolemodels',
                    localField: 'role_id',
                    foreignField: 'role_id',
                    as: 'role'
                }
            },
            {
                $unwind: {
                    path: "$role",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "createdByUserData",
                }
            },
            {
                $unwind: {
                    path: "$createdByUserData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    user_id: 1,
                    user_name: 1,
                    user_credit_limit: 1,
                    account_type: 1,
                    branch_name: 1,
                    offer_later_status: 1,
                    user_designation: 1,
                    user_email_id: 1,
                    user_login_id: 1,
                    user_login_password: 1,
                    user_report_to_id: 1,
                    created_At: 1,
                    last_updated: 1,
                    created_by: 1,
                    user_contact_no: 1,
                    dept_id: 1,
                    location_id: 1,
                    role_id: 1,
                    sitting_id: 1,
                    image: 1,
                    job_type: 1,
                    PersonalNumber: 1,
                    Report_L1: 1,
                    Report_L2: 1,
                    Report_L3: 1,
                    PersonalEmail: 1,
                    level: 1,
                    joining_date: 1,
                    releaving_date: 1,
                    salary: 1,
                    year_salary: 1,
                    Gender: 1,
                    Nationality: 1,
                    DOB: 1,
                    Age: 1,
                    fatherName: 1,
                    motherName: 1,
                    Hobbies: 1,
                    BloodGroup: 1,
                    MartialStatus: 1,
                    DateOfMarriage: 1,
                    onboard_status: 1,
                    tbs_applicable: 1,
                    tds_per: 1,
                    user_status: 1,
                    sub_dept_id: 1,
                    pan_no: 1,
                    uid_no: 1,
                    current_address: 1,
                    current_city: 1,
                    current_state: 1,
                    current_pin_code: 1,
                    att_status: 1,
                    permanent_address: 1,
                    permanent_city: 1,
                    permanent_state: 1,
                    permanent_pin_code: 1,
                    department_name: "$department.dept_name",
                    Role_name: "$role.Role_name",
                    report: "$reportTo.user_name",
                    Report_L1N: "$reportL1.user_name",
                    designation_name: "$designation.desi_name",
                    emergency_contact_person_name2: 1
                }
            }
        ];
        const users = await mongoose.model('userHistoryModel').aggregate(userDataPipeline).sort({ user_id: -1 });
        return res.status(200).send({ data: users });

    } catch (err) {
        return res.status(500).send({ error: err.message, sms: 'Error getting all users' });
    }
};