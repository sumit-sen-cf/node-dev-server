const userModel = require('../models/userModel.js');
const newUserModel = require("../models/newusermodel.js");
const userAuthModel = require('../models/userAuthModel.js');
const departmentModel = require("../models/departmentModel.js");
const designationModel = require("../models/designationModel.js");
const deptDesiAuthModel = require("../models/deptDesiAuthModel.js");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const axios = require('axios');
const mongoose = require('mongoose');



const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "image", maxCount: 1 },
    { name: "UID", maxCount: 1 },
    { name: "pan", maxCount: 1 }
]);

function getDateInProperFormat(dateString) {
    const date = new Date(dateString);
    date.setUTCHours(0, 0, 0, 0);
    return date.toISOString().replace('.000Z', '+00:00');
}


exports.addNewUser = [upload, async (req, res) => {
    try {
        const latestUser = await userModel.findOne({}).sort({ created_At: -1 });
        let latestInvoiceNo = latestUser ? latestUser.invoice_template_no + 1 : 1;
        if (latestInvoiceNo > 9) {
            latestInvoiceNo = 1;
        }

        let encryptedPass;
        if (req.body.user_login_password) {
            encryptedPass = await bcrypt.hash(req.body.user_login_password, 10);
        }


        const simc = new userModel({
            user_name: req.body.user_name,
            role_id: req.body.role_id,
            ctc: req.body.ctc,
            Age: req.body.Age,
            offer_letter_send: req.body.offer_letter_send,
            user_login_id: req.body.user_login_id?.toLowerCase().trim(),
            user_login_password: encryptedPass,
            sitting_id: req.body.sitting_id,
            room_id: req.body.room_id,
            dept_id: req.body.dept_id,
            sub_dept_id: req.body.sub_dept_id,
            Gender: req.body.Gender,
            job_type: req.body.job_type,
            invoice_template_no: latestInvoiceNo,
            // DOB: req.body.DOB,
            DOB: getDateInProperFormat(req.body.DOB),
            user_contact_no: req.body?.user_contact_no,
            PersonalNumber: req.body?.personal_number,
            user_email_id: req.body?.user_email_id,
            PersonalEmail: req.body.Personal_email,
            Report_L1: req.body.report_L1,
            Report_L2: req.body.report_L2,
            Report_L3: req.body.report_L3,
            user_designation: req.body.user_designation,
            // joining_date: req.body.joining_date,
            joining_date: getDateInProperFormat(req.body.joining_date),
            onboard_status: req.body.onboard_status,
            created_by: req.body.created_by,
            att_status: req.body.att_status,
            alternate_contact: req.body?.alternate_contact,
            salary: req.body?.salary,
            tds_applicable: (req.body.salary >= 30000) ? 'Yes' : req.body.tds_applicable,
            tds_per: (req.body.salary >= 25000) ? 1 : req.body.tds_per,
            // tds_applicable: req.body?.tds_applicable,
            // tds_per: req.body?.tds_per,
            permanent_city: req.body?.permanent_city,
            permanent_state: req.body?.permanent_state,
            permanent_address: req.body?.permanent_address,
            user_status: req.body?.user_status,
            current_address: req.body.current_address,
            current_city: req.body.current_city,
            current_state: req.body.current_state,
            current_pin_code: req.body.current_pin_code,
            emergency_contact_person_name2: req.body.emergency_contact_person_name2
        })

        if (req.files && req.files.image && req.files.image[0].originalname) {
            const allowedTypes = ['image/jpeg', 'image/png'];
            const maxFileSize = 1 * 1024 * 1024;
            const imageFile = req.files.image[0];
            if (allowedTypes.includes(imageFile.mimetype) && imageFile.size <= maxFileSize) {
                const bucketName = vari.BUCKET_NAME;
                const bucket = storage.bucket(bucketName);
                const blob1 = bucket.file(imageFile.originalname);
                simc.image = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => { });
                blobStream1.end(imageFile.buffer);
            } else {
                return res.status(400).send('Invalid file type or file exceeds size limit (1MB)');
            }
        }

        const data = new newUserModel({
            user_id: req.body.user_id,
            spouse_name: req.body.spouse_name,
            highest_qualification_name: req.body.highest_qualification_name,
            tenth_marksheet_validate: req.body.tenth_marksheet_validate,
            twelveth_marksheet_validate: req.body.twelveth_marksheet_validate,
            UG_Marksheet_validate: req.body.UG_Marksheet_validate,
            passport_validate: req.body.passport_validate,
            pre_off_letter_validate: req.body.pre_off_letter_validate,
            pre_expe_letter_validate: req.body.pre_expe_letter_validate,
            pre_relieving_letter_validate: req.body.pre_relieving_letter_validate,
            bankPassBook_Cheque_validate: req.body.bankPassBook_Cheque_validate,
            tenth_marksheet_validate_remark: req.body.tenth_marksheet_validate_remark,
            twelveth_marksheet_validate_remark: req.body.twelveth_marksheet_validate_remark,
            UG_Marksheet_validate_remark: req.body.UG_Marksheet_validate_remark,
            passport_validate_remark: req.body.passport_validate_remark,
            pre_off_letter_validate_remark: req.body.pre_off_letter_validate_remark,
            pre_expe_letter_validate_remark: req.body.pre_expe_letter_validate_remark,
            pre_relieving_letter_validate_remark: req.body.pre_relieving_letter_validate_remark,
            bankPassBook_Cheque_validate_remark: req.body.bankPassBook_Cheque_validate_remark,
            joining_date_extend: req.body.joining_date_extend,
            joining_date_extend_status: req.body.joining_date_extend_status,
            joining_date_extend_reason: req.body.joining_date_extend_reason,
            joining_date_reject_reason: req.body.joining_date_reject_reason,
            UID: req.body.UID,
            pan: req.body.pan,
            highest_upload: req.body.highest_upload,
            other_upload: req.body.other_upload,
            tenth_marksheet: req.body.tenth_marksheet,
            twelveth_marksheet: req.body.twelveth_marksheet,
            UG_Marksheet: req.body.UG_Marksheet,
            passport: req.body.passport,
            pre_off_letter: req.body.pre_off_letter,
            pre_expe_letter: req.body.pre_expe_letter,
            pre_relieving_letter: req.body.pre_relieving_letter,
            bankPassBook_Cheque: req.body.bankPassBook_Cheque,
            joining_extend_document: req.body.joining_extend_document,
            userSalaryStatus: req.body.userSalaryStatus,
            digital_signature_image: req.body.digital_signature_image,
            bank_name: req.body.bank_name,
            account_type: req.body.account_type,
            branch_name: req.body.branch_name,
            ifsc_code: req.body.ifsc_code,
            account_no: req.body.account_no,
            guardian_name: req.body.guardian_name,
            guardian_address: req.body.guardian_address,
            relation_with_guardian: req.body.relation_with_guardian,
            gaurdian_number: req.body.gaurdian_number,
            emergency_contact1: req.body.emergency_contact1,
            emergency_contact2: req.body.emergency_contact2,
            offer_letter_send: req.body.offer_letter_send,
            annexure_pdf: req.body.annexure_pdf,
            profileflag: req.body.profileflag,
            nick_name: req.body.nick_name,
            offer_later_date: req.body.offer_later_date,
            offer_later_acceptance_date: req.body.offer_later_acceptance_date,
            offer_later_status: req.body.offer_later_status,
            offer_later_reject_reason: req.body.offer_later_reject_reason,
            offer_later_pdf_url: req.body.offer_later_pdf_url,
            first_login_flag: req.body.first_login_flag,
            sms_time: req.body.sms_time,
            showOnboardingModal: req.body.showOnboardingModal,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            coc_flag: req.body.coc_flag,
            beneficiary: req.body.beneficiary,
            emp_id: req.body.emp_id,
            alternate_contact: req.body.alternate_contact,
            cast_type: req.body.cast_type,
            emergency_contact_person_name1: req.body.emergency_contact_person_name1,
            emergency_contact_relation1: req.body.emergency_contact_relation1,
            emergency_contact_relation2: req.body.emergency_contact_relation2,
            document_percentage_mandatory: req.body.document_percentage_mandatory,
            document_percentage_non_mandatory: req.body.document_percentage_non_mandatory,
            document_percentage: req.body.document_percentage,
            show_rocket: req.body.show_rocket,
            bank_type: req.body.bank_type,
            bank_proof_image: req.body.bank_proof_image,
            year_salary: req.body.year_salary
        });

        const simv = await simc.save();

        res.status(200).send({ simv });

        const docs = await documentModel.find();
        if (docs.length !== 0) {
            const newDocuments = docs.map(item => ({
                doc_id: item._id,
                user_id: simv.user_id,
            }));
            await userDocManagmentModel.insertMany(newDocuments);
        }

        const objectData = await objModel.find();
        const lastAuth = await userAuthModel.findOne({}, {}, { sort: { 'auth_id': -1 } });
        let currentAuthId = lastAuth ? lastAuth.auth_id : 0;

        const bulkOps = objectData.map(object => {
            let insert = 0, view = 0, update = 0, delete_flag = 0;
            if (simv.role_id === 1) {
                insert = view = update = delete_flag = 1;
            }
            currentAuthId++;
            return {
                insertOne: {
                    document: {
                        auth_id: currentAuthId,
                        Juser_id: simv.user_id,
                        obj_id: object.obj_id,
                        insert, view, update, delete_flag,
                        creation_date: new Date(),
                        created_by: simv.created_by || 0,
                        last_updated_by: simv.created_by || 0,
                        last_updated_date: new Date(),
                    }
                }
            };
        });

        await userAuthModel.bulkWrite(bulkOps);


        const deptDesiData = await deptDesiAuthModel.find({
            dept_id: req.body.dept_id,
            desi_id: req.body.user_designation,
            $or: [
                { insert: 1 },
                { view: 1 },
                { update: 1 },
                { delete_flag: 1 }
            ]
        }).select({
            dept_id: 1,
            desi_id: 1,
            obj_id: 1,
            insert: 1,
            view: 1,
            update: 1,
            delete_flag: 1
        });

        // console.log("deptDesiData", deptDesiData);

        await Promise.all(deptDesiData.map(async (deptDesi) => {
            if (deptDesi) {
                // console.log("Updating for dept_id:", deptDesi.dept_id, "and obj_id:", deptDesi.obj_id);
                // console.log("Userrrrrrrrrrr", simv.user_id);
                const updatedData = await userAuthModel.updateOne(
                    {
                        Juser_id: simv.user_id,
                        obj_id: deptDesi.obj_id,
                    },
                    {
                        $set: {
                            insert: deptDesi.insert,
                            view: deptDesi.view,
                            update: deptDesi.update,
                            delete_flag: deptDesi.delete_flag
                        }
                    },
                    { new: true }
                );
            }
        }));

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message, sms: 'This user cannot be created' });
    }
}];

exports.getUsers = async (req, res) => {
    try {
        const userImagesBaseUrl = `${vari.IMAGE_URL}`;
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
                    user_available_limit: 1,
                    user_designation: 1,
                    user_email_id: 1,
                    user_login_id: 1,
                    created_At: 1,
                    last_updated: 1,
                    created_by: 1,
                    user_contact_no: 1,
                    dept_id: 1,
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
                    DOB: 1,
                    Age: 1,
                    user_status: 1,
                    sub_dept_id: 1,
                    department_name: "$department.dept_name",
                    Role_name: "$role.Role_name",
                    report: "$reportTo.user_name",
                    Report_L1N: "$reportL1.user_name",
                    Report_L2N: "$reportL2.user_name",
                    Report_L3N: "$reportL3.user_name",
                    designation_name: "$designation.desi_name",
                    image_url: { $concat: [userImagesBaseUrl, "$image"] },
                    joining_extend_document: { $concat: [userImagesBaseUrl, "$joining_extend_document"] },
                    created_by: 1,
                    created_by_name: "$createdByUserData.user_name",
                    created_date_time: 1
                }
            }
        ];
        const users = await mongoose.model('userModel').aggregate(userDataPipeline).sort({ user_id: -1 });
        return res.status(200).send({ data: users });

    } catch (err) {
        return res.status(500).send({ error: err.message, sms: 'Error getting all users' });
    }
}