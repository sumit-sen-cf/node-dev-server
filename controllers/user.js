const userModel = require('../models/userModel.js');
const multer = require("multer");
const jwt = require("jsonwebtoken");
const axios = require('axios');
const mongoose = require('mongoose');
// const fetch = require('node-fetch');
const userAuthModel = require('../models/userAuthModel.js');
const path = require("path");
const jobResponsibilityModel = require('../models/jobResponsibilityModel.js');
const userOtherFieldModel = require('../models/userOtherFieldModel.js');
const reasonModel = require('../models/reasonModel.js');
const separationModel = require('../models/separationModel.js');
const attendanceModel = require('../models/attendanceModel.js');
const userLoginHisModel = require('../models/userLoginHisModel.js')
const notificationModel = require('../models/notificationModel.js')
const objModel = require('../models/objModel.js');
const constant = require('../common/constant.js');
const response = require("../common/response");
const documentModel = require("../models/documentModel");
const bcrypt = require("bcrypt");
const fs = require("fs");
const ejs = require('ejs');
const nodemailer = require("nodemailer");
const userDocManagmentModel = require("../models/userDocManagementModel.js");
const sendMail = require("../common/sendMail.js");
const helper = require('../helper/helper.js');
const OrderRequest = require("../models/orderReqModel.js");
const Sitting = require("../models/sittingModel.js");
const { generateEmpId } = require("../helper/helper.js");
const departmentModel = require("../models/departmentModel.js");
const designationModel = require("../models/designationModel.js");
const deptDesiAuthModel = require("../models/deptDesiAuthModel.js");
const emailTempModel = require("../models/emailTempModel");
const emailEventModel = require("../models/emailEventModel");
const vari = require("../variables.js");
const { storage } = require('../common/uploadFile.js');
const documentHisModel = require("../models/documentHisModel.js")
const educationModel = require("../models/educationModel.js");
const familyModel = require('../models/familyModel.js');
const guardianModel = require('../models/guardianModel.js');
const orderReqModel = require('../models/orderReqModel.js');
const simAlloModel = require('../models/simAlloModel.js');
const objectModel = require("../models/objModel.js");
const userHistoryModel = require("../models/userHistoryModel.js");


const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "image", maxCount: 1 },
    { name: "UID", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "highest_upload", maxCount: 1 },
    { name: "other_upload", maxCount: 1 },
    { name: "tenth_marksheet", maxCount: 1 },
    { name: "twelveth_marksheet", maxCount: 1 },
    { name: "UG_Marksheet", maxCount: 1 },
    { name: "passport", maxCount: 1 },
    { name: "pre_off_letter", maxCount: 1 },
    { name: "pre_expe_letter", maxCount: 1 },
    { name: "pre_relieving_letter", maxCount: 1 },
    { name: "bankPassBook_Cheque", maxCount: 1 },
    { name: "joining_extend_document", maxCount: 1 },
    { name: "digital_signature_image", maxCount: 1 },
    { name: "annexure_pdf", maxCount: 1 },
    { name: "bank_proof_image", maxCount: 5 },
]);

function getDateInProperFormat(dateString) {
    const date = new Date(dateString);
    date.setUTCHours(0, 0, 0, 0);
    return date.toISOString().replace('.000Z', '+00:00');
}


exports.addUser = [upload, async (req, res) => {
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

exports.addUserForGeneralInformation = [upload, async (req, res) => {
    try {
        const encryptedPass = req.body.user_login_password ? await bcrypt.hash(req.body.user_login_password, 10) : null;

        // if (req.body.DOB) {
        //     var dob = new Date(req.body.DOB);
        //     dob.setDate(dob.getDate() + 1);
        // }

        // if (req.body.joining_date) {
        //     var doj = new Date(req.body.joining_date);
        //     doj.setDate(doj.getDate() + 1);
        // }

        const simc = new userModel({
            // Fields omitted for brevity
            user_name: req.body.user_name,
            PersonalEmail: req.body.Personal_email,
            PersonalNumber: req.body.personal_number,
            alternate_contact: req.body.alternate_contact,
            Gender: req.body.Gender,
            // DOB: req.body.DOB,
            DOB: getDateInProperFormat(req.body.DOB),
            Age: req.body.Age,
            Nationality: req.body.Nationality,
            MartialStatus: req.body.MartialStatus,
            created_by: req.body.created_by,
            //for official information
            job_type: req.body.job_type,
            dept_id: req.body.dept_id,
            sub_dept_id: req.body.sub_dept_id == null ? 0 : req.body.sub_dept_id,
            user_designation: req.body.user_designation,
            Report_L1: req.body.report_L1,
            Report_L2: req.body.report_L2,
            Report_L3: req.body.report_L3,
            role_id: req.body.role_id,
            user_email_id: req.body.user_email_id, //for offical
            user_contact_no: req.body.user_contact_no, //for offical
            user_login_id: req.body.user_login_id.toLowerCase().trim(),
            user_login_password: encryptedPass,
            user_status: req.body.user_status,
            // joining_date: req.body.joining_date,
            joining_date: getDateInProperFormat(req.body.joining_date),
            sitting_id: req.body.sitting_id,
            room_id: req.body.room_id,
            upi_Id: req.body.upi_Id,
            ctc: req.body.ctc,
            salary: req.body.salary,
            // emp_id: empId,
            user_credit_limit: req.body.user_credit_limit,
            user_available_limit: req.body.user_credit_limit,
            created_date_time: req.body.created_date_time,
        });

        if (req.files && req.files.image && req.files.image[0].originalname) {
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);
            const blob1 = bucket.file(req.files.image[0].originalname);
            simc.image = blob1.name;
            const blobStream1 = blob1.createWriteStream();
            await new Promise((resolve, reject) => {
                blobStream1.on("finish", resolve);
                blobStream1.on("error", reject);
                blobStream1.end(req.files.image[0].buffer);
            });
        }

        const simv = await simc.save();

        const docs = await documentModel.find();
        if (docs.length !== 0) {
            const newDocuments = docs.map(item => ({
                doc_id: item._id,
                user_id: simv?.user_id,
            }));
            await userDocManagmentModel.insertMany(newDocuments);
        }

        if (simv) {
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
        }

        res.send({ simv, status: 200 });
    } catch (err) {
        return res.status(500).send({ error: err.message, sms: 'This user cannot be created' });
    }
}];


exports.updateUserForGeneralInformation = [upload, async (req, res) => {
    try {
        // console.log("ddddddd", req.body)
        let encryptedPass;
        if (req.body.user_login_password) {
            encryptedPass = await bcrypt.hash(req.body.user_login_password, 10);
        }
        //check user exist or not
        const existingUser = await userModel.findOne({
            user_id: req.params.user_id
        });

        //new updated user credit limit
        let newUserCreditLimit = req.body?.user_credit_limit;
        let limitDifference = newUserCreditLimit - existingUser.user_credit_limit;
        let finalAvailableCreditLimit = existingUser.user_available_limit + limitDifference;

        //if user not exist then return error
        if (!existingUser) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        //user details update in DB
        const editsim = await userModel.findOneAndUpdate({
            user_id: parseInt(req.params.user_id)
        }, {
            //for personal information
            user_name: req.body.user_name,
            PersonalEmail: req.body.Personal_email,
            PersonalNumber: req.body.personal_number,
            alternate_contact: req.body.alternate_contact,
            Gender: req.body.Gender,
            DOB: req.body.DOB,
            Age: req.body.Age,
            upi_Id: req.body.upi_Id,
            Nationality: req.body.Nationality,
            MartialStatus: req.body.MartialStatus,
            created_by: req.body.created_by,
            //for official information
            job_type: req.body.job_type,
            dept_id: req.body.dept_id,
            sub_dept_id: isNaN(req.body.sub_dept_id) ? 0 : req.body.sub_dept_id,
            user_designation: req.body.user_designation,
            Report_L1: isNaN(req.body.report_L1) ? 0 : req.body.report_L1,
            Report_L2: isNaN(req.body.report_L2) ? 0 : req.body.report_L2,
            Report_L3: isNaN(req.body.report_L3) ? 0 : req.body.report_L3,
            role_id: req.body.role_id,
            user_email_id: req.body.user_email_id, //for offical
            user_contact_no: req.body.user_contact_no, //for offical
            user_login_id: req.body?.user_login_id?.toLowerCase().trim(),
            user_login_password: encryptedPass,
            user_status: req.body.user_status,
            joining_date: req.body.joining_date,
            sitting_id: req.body.sitting_id,
            room_id: req.body.room_id,
            upi_Id: req.body.upi_Id,
            user_credit_limit: Number(newUserCreditLimit),
            user_available_limit: finalAvailableCreditLimit,
            ctc: req.body.ctc,
            salary: req.body.salary,
            emergency_contact_person_name2: req.body.emergency_contact_person_name2
        }, {
            new: true
        });

        if (!editsim) {
            return res.status(500).send({ success: false })
        }
        // Genreate a pdf file for offer later
        if (editsim?.offer_later_status == true || (editsim?.joining_date_extend || (editsim?.digital_signature_image && editsim?.digital_signature_image !== ""))) {
            helper.generateOfferLaterPdf(editsim)
        }

        if (req.files && req.files.image && req.files.image[0]?.originalname) {
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            const currentDate = new Date();
            const fileNamef = `${currentDate.getTime()}.jpg`;

            const blob = bucket.file(fileNamef);
            editsim.image = blob.name;

            const saveBlobPromise = new Promise((resolve, reject) => {
                const blobStream = blob.createWriteStream();
                blobStream.on("finish", () => {
                    resolve();
                });
                blobStream.end(req.files.image[0]?.buffer);
            });

            try {
                await saveBlobPromise;
                editsim.save();
            } catch (error) {
                console.error("Error saving image:", error);
            }
        }


        if (req.files && req.files.digital_signature_image && req.files.digital_signature_image[0]?.originalname) {
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);
            const blob = bucket.file(req.files?.digital_signature_image[0]?.originalname);
            editsim.digital_signature_image = blob.name;

            const saveBlobPromise = new Promise((resolve, reject) => {
                const blobStream = blob.createWriteStream();
                blobStream.on("finish", () => {
                    resolve();
                });
                blobStream.end(req.files.digital_signature_image[0]?.buffer);
            })
            try {
                await saveBlobPromise;
                editsim.save();
            } catch (err) {
                console.log('error', err)
            }
        }

        return res.status(200).send({ success: true, data: editsim })
    } catch (err) {
        return res.status(500).send({ error: err.message, sms: 'Error while updating user personal information details' })
    }
}];

exports.updateUserInformation = async (req, res) => {
    try {
        const { current_address, current_city, current_state, current_pin_code,
            permanent_address, permanent_city, permanent_state, permanent_pin_code,
            BloodGroup, Hobbies, SpokenLanguages,
            cast_type, upi_Id } = req.body;

        //current user find for update details
        const updateProfile = await userModel.findOne({
            user_id: req.params.user_id
        });

        //check user is not find
        if (!updateProfile) {
            return res.status(404).send("User not found");
        }

        //user details update
        const profileUpdate = await userModel.findOneAndUpdate({
            user_id: req.params.user_id
        }, {
            $set: {
                current_address: current_address,
                current_city: current_city,
                current_state: current_state,
                current_pin_code: current_pin_code,
                permanent_address: permanent_address,
                permanent_city: permanent_city,
                permanent_state: permanent_state,
                permanent_pin_code: permanent_pin_code,
                BloodGroup: BloodGroup,
                Hobbies: Hobbies,
                SpokenLanguages: SpokenLanguages,
                cast_type: cast_type,
                upi_Id: upi_Id
            }
        }, {
            new: true
        });
        return res.status(200).json({
            status: 200,
            message: "profile updated successfully!",
            profileUpdate,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Unexpected error,please try again later!",
        });
    }
};

//changes - multiple images
exports.updateBankInformation = [upload, async (req, res) => {
    try {
        const { bank_name, account_no, ifsc_code, beneficiary, account_type, branch_name, upi_id, old_pf_number, uan_number, old_esic_number } = req.body;
        const updateBankProfile = await userModel.findOne({ user_id: req.params.user_id });
        if (!updateBankProfile) {
            return res.status(404).send("User not found!");
        }
        const bucketName = vari.BUCKET_NAME;
        const bucket = storage.bucket(bucketName);
        if (req.files['bank_proof_image']) {
            // Change to map through files directly
            const imagesPromises = req.files['bank_proof_image'].map(async (bank_proof_image) => {
                if (bank_proof_image.originalname) {
                    const blob = bucket.file(bank_proof_image.originalname);
                    updateBankProfile.bank_proof_image.push(blob.name);
                    const blobStream = blob.createWriteStream();
                    blobStream.on("finish", () => {
                        console.log('Image uploaded successfully');
                    });
                    blobStream.end(bank_proof_image.buffer);
                }
            });
            await Promise.all(imagesPromises);
        }
        await updateBankProfile.save();
        const bankprofileUpdate = await userModel.findOneAndUpdate({
            user_id: req.params.user_id
        }, {
            $set: {
                bank_name: bank_name,
                account_no: account_no,
                ifsc_code: ifsc_code,
                beneficiary: beneficiary,
                account_type: account_type,
                branch_name: branch_name,
                upi_Id: upi_id,
                old_pf_number: old_pf_number,
                uan_number: uan_number,
                old_esic_number: old_esic_number
            }
        }, {
            new: true
        });
        return res.status(200).json({
            status: 200,
            message: "Bank profile updated successfully!",
            bankprofileUpdate,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Unexpected error,please try again later!",
        });
    }
}];

exports.updateUser = [upload, async (req, res) => {
    try {
        let encryptedPass;
        if (req.body.user_login_password) {
            encryptedPass = await bcrypt.hash(req.body.user_login_password, 10);
        }

        const existingUser = await userModel.findOne({ user_id: req.body.user_id });

        if (!existingUser) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }


        const editsim = await userModel.findOneAndUpdate({ user_id: parseInt(req.body.user_id) }, {
            user_name: req.body.user_name || existingUser.user_name,
            user_designation: req.body.user_designation || existingUser.user_designation,
            user_email_id: req.body.user_email_id || existingUser.user_email_id,
            user_login_id: req.body.user_login_id || existingUser.user_login_id,
            user_login_password: encryptedPass || existingUser.user_login_password,
            user_report_to_id: req.body.user_report_to_id || existingUser.user_report_to_id,
            user_contact_no: req.body.user_contact_no || existingUser.user_contact_no,
            dept_id: req.body.dept_id || existingUser.dept_id,
            location_id: req.body.location_id || existingUser.location_id,
            created_by: req.body.created_by || existingUser.created_by,
            role_id: req.body.role_id || existingUser.role_id,
            sitting_id: req.body.sitting_id || existingUser.sitting_id,
            job_type: req.body.job_type || existingUser.job_type,
            personal_number: req.body.personal_number || existingUser.personal_number,
            Report_L1: req.body.report_L1 || existingUser.Report_L1,
            Report_L2: req.body?.report_L2 || existingUser.Report_L2,
            Report_L3: req.body?.report_L3 || existingUser.Report_L3,
            Personal_email: req.body.Personal_email || existingUser.Personal_email,
            joining_date: req.body.joining_date || existingUser.joining_date,
            releaving_date: req.body.releaving_date,
            level: req.body.level || existingUser.level,
            room_id: req.body.room_id || existingUser.room_id,
            salary: req.body.salary || existingUser.salary,
            att_status: req.body.att_status || existingUser.att_status,
            year_salary: req.body.year_salary || existingUser.year_salary,
            SpokenLanguages: req.body.SpokenLanguages || existingUser.SpokenLanguages,
            Gender: req.body.Gender || existingUser.Gender,
            Nationality: req.body.Nationality || existingUser.Nationality,
            DOB: req.body.DOB || existingUser.DOB,
            Age: req.body.Age || existingUser.Age,
            fatherName: req.body.fatherName || existingUser.fatherName,
            motherName: req.body.motherName || existingUser.motherName,
            // Hobbies: req.body.Hobbies,
            Hobbies: req.body?.Hobbies?.split(',').map(Number) || existingUser.Hobbies,
            BloodGroup: req.body.BloodGroup || existingUser.BloodGroup,
            MartialStatus: req.body.MartialStatus || existingUser.MartialStatus,
            DateofMarriage: req.body.DateofMarriage || existingUser.DateOfMarriage,
            // tds_applicable: req.body?.tds_applicable || existingUser.tds_applicable,
            // tds_per: req.body?.tds_per || existingUser.tds_per,
            tds_applicable: (req.body.salary >= 25000 || req.body.ctc >= 100000) ? 'Yes' : req.body.tds_applicable,
            tds_per: (req.body.salary >= 25000 || req.body.ctc >= 100000) ? 1 : req.body.tds_per,
            onboard_status: req.body.onboard_status || existingUser.onboard_status,
            image_remark: req.body.image_remark || existingUser.image_remark,
            image_validate: req.body.image_validate || existingUser.image_validate,
            uid_remark: req.body.uid_remark || existingUser.uid_remark,
            uid_validate: req.body.uid_validate || existingUser.uid_validate,
            pan_remark: req.body.pan_remark || existingUser.pan_remark,
            pan_validate: req.body.pan_validate || existingUser.pan_validate,
            highest_upload_remark: req.body.highest_upload_remark || existingUser.highest_upload_remark,
            highest_upload_validate: req.body.highest_upload_validate || existingUser.highest_upload_validate,
            other_upload_remark: req.body.other_upload_remark || existingUser.other_upload_remark,
            other_upload_validate: req.body.other_upload_validate || existingUser.other_upload_validate,
            user_status: req.body.user_status || existingUser.user_status,
            lastupdated: req.body.lastupdated || existingUser.lastupdated,
            sub_dept_id: req.body?.sub_dept_id || existingUser.sub_dept_id,
            pan_no: req.body.pan_no || existingUser.pan_no,
            uid_no: req.body.uid_no || existingUser.uid_no,
            spouse_name: req.body.spouse_name || existingUser.spouse_name,
            highest_qualification_name: req.body.highest_qualification_name || existingUser.highest_qualification_name,
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
            passport_validate_remark: req.body.passport_validate,
            pre_off_letter_validate_remark: req.body.pre_off_letter_validate_remark,
            pre_expe_letter_validate_remark: req.body.pre_expe_letter_validate_remark,
            pre_relieving_letter_validate_remark: req.body.pre_relieving_letter_validate_remark,
            bankPassBook_Cheque_validate_remark: req.body.bankPassBook_Cheque_validate_remark,
            current_address: req.body.current_address || existingUser.current_address,
            current_city: req.body.current_city || existingUser.current_city,
            current_state: req.body.current_state || existingUser.current_state,
            current_pin_code: req.body.current_pin_code || existingUser.current_pin_code,
            permanent_address: req.body.permanent_address || existingUser.permanent_address,
            permanent_city: req.body.permanent_city || existingUser.permanent_city,
            permanent_state: req.body.permanent_state || existingUser.permanent_state,
            permanent_pin_code: req.body.permanent_pin_code || existingUser.permanent_pin_code,
            joining_date_extend: req.body.joining_date_extend,
            joining_date_extend_status: req.body.joining_date_extend_status,
            joining_date_extend_reason: req.body.joining_date_extend_reason,
            joining_date_reject_reason: req.body.joining_date_reject_reason,
            invoice_template_no: req.body.invoice_template_no || existingUser.invoice_template_no,
            image: req.files && req.files?.image && req.files?.image[0] ? req.files?.image[0].originalname : existingUser.image,
            UID: req.files && req.files['UID'] && req.files['UID'][0] ? req.files['UID'][0].filename : (existingUser && existingUser.UID) || '',
            pan: req.files && req.files['pan'] && req.files['pan'][0] ? req.files['pan'][0].filename : (existingUser && existingUser.pan) || '',
            tenth_marksheet: req.files && req.files['tenth_marksheet'] && req.files['tenth_marksheet'][0] ? req.files['tenth_marksheet'][0].filename : (existingUser && existingUser.tenth_marksheet) || '',
            highest_upload: req.files && req.files['highest_upload'] && req.files['highest_upload'][0] ? req.files['highest_upload'][0].filename : (existingUser && existingUser.highest_upload) || '',
            other_upload: req.files && req.files['other_upload'] && req.files['other_upload'][0] ? req.files['other_upload'][0].filename : (existingUser && existingUser.other_upload) || '',
            twelveth_marksheet: req.files && req.files['twelveth_marksheet'] && req.files['twelveth_marksheet'][0] ? req.files['twelveth_marksheet'][0].filename : (existingUser && existingUser.twelveth_marksheet) || '',
            UG_Marksheet: req.files && req.files['UG_Marksheet'] && req.files['UG_Marksheet'][0] ? req.files['UG_Marksheet'][0].filename : (existingUser && existingUser.UG_Marksheet) || '',
            passport: req.files && req.files['passport'] && req.files['passport'][0] ? req.files['passport'][0].filename : (existingUser && existingUser.passport) || '',
            pre_off_letter: req.files && req.files['pre_off_letter'] && req.files['pre_off_letter'][0] ? req.files['pre_off_letter'][0].filename : (existingUser && existingUser.pre_off_letter) || '',
            pre_expe_letter: req.files && req.files['pre_expe_letter'] && req.files['pre_expe_letter'][0] ? req.files['pre_expe_letter'][0].filename : (existingUser && existingUser.pre_expe_letter) || '',
            pre_relieving_letter: req.files && req.files['pre_relieving_letter'] && req.files['pre_relieving_letter'][0] ? req.files['pre_relieving_letter'][0].filename : (existingUser && existingUser.pre_relieving_letter) || '',
            bankPassBook_Cheque: req.files && req.files['bankPassBook_Cheque'] && req.files['bankPassBook_Cheque'][0] ? req.files['bankPassBook_Cheque'][0].filename : (existingUser && existingUser.bankPassBook_Cheque) || '',
            joining_extend_document: req.files && req.files?.joining_extend_document && req.files?.joining_extend_document[0] ? req.files?.joining_extend_document[0].originalname : '',
            userSalaryStatus: req.body.userSalaryStatus,
            // digital_signature_image: req.files && req.files['digital_signature_image'] && req.files['digital_signature_image'][0] ? req.files['digital_signature_image'][0].filename : (existingUser && existingUser.digital_signature_image) || '',
            digital_signature_image: req.files && req.files?.digital_signature_image && req.files?.digital_signature_image[0] ? req.files?.digital_signature_image[0].originalname : existingUser.digital_signature_image,
            bank_name: req.body.bank_name,
            ifsc_code: req.body.ifsc_code,
            account_no: req.body.account_no,
            guardian_name: req.body.guardian_name,
            guardian_address: req.body.guardian_address,
            relation_with_guardian: req.body.relation_with_guardian,
            gaurdian_number: req.body.gaurdian_number,
            emergency_contact1: req.body.emergency_contact1,
            emergency_contact2: req.body.emergency_contact2,
            ctc: req.body.ctc,
            offer_letter_send: req.body.offer_letter_send,
            annexure_pdf: req.files && req.files['annexure_pdf'] && req.files['annexure_pdf'][0] ? req.files['annexure_pdf'][0].filename : (existingUser && existingUser.annexure_pdf) || '',
            profileflag: req.body.profileflag,
            nick_name: req.body.nick_name,
            offer_later_acceptance_date: req.body.offer_later_acceptance_date,
            offer_later_status: req.body.offer_later_status,
            offer_later_reject_reason: req.body.offer_later_reject_reason,
            showOnboardingModal: req.body.showOnboardingModal,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            coc_flag: req.body.coc_flag,
            beneficiary: req.body.beneficiary,
            alternate_contact: req.body.alternate_contact || existingUser.alternate_contact,
            cast_type: req.body.cast_type,
            emergency_contact_person_name1: req.body.emergency_contact_person_name1,
            emergency_contact_person_name2: req.body.emergency_contact_person_name2,
            emergency_contact_relation1: req.body.emergency_contact_relation1,
            emergency_contact_relation2: req.body.emergency_contact_relation2,
            document_percentage_mandatory: req.body.document_percentage_mandatory,
            document_percentage_non_mandatory: req.body.document_percentage_non_mandatory,
            document_percentage: req.body.document_percentage,
            show_rocket: req.body.show_rocket,
            bank_type: req.body.bank_type,
            upi_Id: req.body.upi_Id,
            user_credit_limit: req.body.user_credit_limit,
            work_experience: req.body.work_experience
        }, { new: true });

        if (!editsim) {
            return res.status(500).send({ success: false })
        }
        // Genreate a pdf file for offer later
        // if (editsim?.offer_later_status == true || (editsim?.joining_date_extend || (editsim?.digital_signature_image && editsim?.digital_signature_image !== ""))) {
        //     helper.generateOfferLaterPdf(editsim)
        // }

        if (req.files && req.files.image && req.files.image[0]?.originalname) {
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            const currentDate = new Date();
            const fileNamef = `${currentDate.getTime()}.jpg`;

            const blob = bucket.file(fileNamef);
            editsim.image = blob.name;

            const saveBlobPromise = new Promise((resolve, reject) => {
                const blobStream = blob.createWriteStream();
                blobStream.on("finish", () => {
                    resolve();
                });
                blobStream.end(req.files.image[0]?.buffer);
            });

            try {
                await saveBlobPromise;
                editsim.save();
            } catch (error) {
                console.error("Error saving image:", error);
            }
        }


        if (req.files && req.files.digital_signature_image && req.files.digital_signature_image[0]?.originalname) {
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);
            const blob = bucket.file(req.files?.digital_signature_image[0]?.originalname);
            editsim.digital_signature_image = blob.name;

            const saveBlobPromise = new Promise((resolve, reject) => {
                const blobStream = blob.createWriteStream();
                blobStream.on("finish", () => {
                    resolve();
                });
                blobStream.end(req.files.digital_signature_image[0]?.buffer);
            })
            try {
                await saveBlobPromise;
                editsim.save();
            } catch (err) {
                console.log('error', err)
            }
        }

        if (req.files && req.files.joining_extend_document && req.files.joining_extend_document[0]?.originalname) {
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            const currentDate = new Date();
            const fileNamef = `${currentDate.getTime()}.jpg`;

            const blob = bucket.file(fileNamef);
            editsim.joining_extend_document = blob.name;

            const saveBlobPromise = new Promise((resolve, reject) => {
                const blobStream = blob.createWriteStream();
                blobStream.on("finish", () => {
                    resolve();
                });
                blobStream.end(req.files.joining_extend_document[0]?.buffer);
            });

            try {
                await saveBlobPromise;
                editsim.save();
            } catch (error) {
                console.error("Error saving joining_extend_document:", error);
            }
        } else {
            editsim.joining_extend_document = '';
        }


        // update salary also in attendance model
        const attendanceData = await attendanceModel.findOneAndUpdate({
            user_id: req.body.user_id
        }, {
            $set: {
                salary: req.body.salary
            }
        }, {
            new: true
        });

        const historyData = new userHistoryModel({
            user_id: editsim.user_id,
            user_name: editsim.user_name,
            user_designation: editsim.user_designation,
            user_email_id: editsim.user_email_id,
            user_login_id: editsim.user_login_id,
            user_login_password: editsim.user_login_password,
            user_contact_no: editsim.user_contact_no,
            dept_id: editsim.dept_id,
            role_id: editsim.role_id,
            job_type: editsim.job_type,
            PersonalNumber: editsim.PersonalNumber,
            Report_L1: editsim.Report_L1,
            PersonalEmail: editsim.PersonalEmail,
            joining_date: editsim.joining_date,
            releaving_date: editsim.releaving_date,
            salary: editsim.salary,
            DOB: editsim.DOB,
            Age: editsim.Age,
            MartialStatus: editsim.MartialStatus,
            tds_applicable: editsim.tds_applicable,
            tds_per: editsim.tds_per,
            user_status: editsim.user_status,
            sub_dept_id: editsim.sub_dept_id,
            pan_no: editsim.pan_no,
            uid_no: editsim.uid_no,
            current_address: editsim.current_address,
            current_city: editsim.current_city,
            current_state: editsim.current_state,
            current_pin_code: editsim.current_pin_code,
            permanent_address: editsim.permanent_address,
            permanent_city: editsim.permanent_city,
            permanent_state: editsim.permanent_state,
            permanent_pin_code: editsim.permanent_pin_code,
            invoice_template_no: editsim.invoice_template_no,
            ctc: editsim.ctc,
            nick_name: editsim.nick_name,
            emp_id: editsim.user_id,
            alternate_contact: editsim.alternate_contact,
            emergency_contact_person_name2: editsim.emergency_contact_person_name2,
            att_status: editsim.att_status,
            year_salary: editsim.year_salary
        })

        await historyData.save();

        return res.status(200).send({ success: true, data: editsim })
    } catch (err) {
        return res.status(500).send({ error: err.message, sms: 'Error updating user details' })
    }
}];

exports.getWFHUsersByDept = async (req, res) => {
    try {
        const simc = await userModel.find({ dept_id: req.params.dept_id, job_type: 'WFHD', user_status: "Active", att_status: "onboarded" }).lean();
        if (!simc) {
            res.status(500).send({ success: false })
        }
        const modifiedUsers = simc.map(user => {

            if (user.hasOwnProperty('lastupdated')) {
                user.last_updated = user.lastupdated;
                delete user.lastupdated;
            }
            if (user.hasOwnProperty('tds_applicable')) {
                user.tbs_applicable = user.tds_applicable;
                delete user.tds_applicable;
            }
            return user;
        });
        res.status(200).send(modifiedUsers)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting all wfh users' })
    }
};


exports.getAllUsers = async (req, res) => {
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
                    room_id: 1,
                    // UID: 1,
                    // pan: 1,
                    // highest_upload: 1,
                    // other_upload: 1,
                    salary: 1,
                    year_salary: 1,
                    SpokenLanguages: 1,
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
                    // image_remark: 1,
                    // image_validate: 1,
                    // uid_remark: 1,
                    // uid_validate: 1,
                    // pan_remark: 1,
                    // pan_validate: 1,
                    // highest_upload_remark: 1,
                    // highest_upload_validate: 1,
                    // other_upload_remark: 1,
                    // other_upload_validate: 1,
                    user_status: 1,
                    sub_dept_id: 1,
                    pan_no: 1,
                    uid_no: 1,
                    spouse_name: 1,
                    // highest_qualification_name: 1,
                    // tenth_marksheet: 1,
                    // twelveth_marksheet: 1,
                    // UG_Marksheet: 1,
                    // passport: 1,
                    pre_off_letter: 1,
                    // pre_expe_letter: 1,
                    // pre_relieving_letter: 1,
                    // bankPassBook_Cheque: 1,
                    // tenth_marksheet_validate: 1,
                    // twelveth_marksheet_validate: 1,
                    // UG_Marksheet_validate: 1,
                    // passport_validate: 1,
                    // pre_off_letter_validate: 1,
                    // pre_expe_letter_validate: 1,
                    // pre_relieving_letter_validate: 1,
                    // bankPassBook_Cheque_validate: 1,
                    // tenth_marksheet_validate_remark: 1,
                    // twelveth_marksheet_validate_remark: 1,
                    // UG_Marksheet_validate_remark: 1,
                    // passport_validate_remark: 1,
                    // pre_off_letter_validate_remark: 1,
                    // pre_expe_letter_validate_remark: 1,
                    // pre_relieving_letter_validate_remark: 1,
                    // bankPassBook_Cheque_validate_remark: 1,
                    current_address: 1,
                    current_city: 1,
                    current_state: 1,
                    current_pin_code: 1,
                    att_status: 1,
                    permanent_address: 1,
                    permanent_city: 1,
                    permanent_state: 1,
                    permanent_pin_code: 1,
                    joining_date_extend: 1,
                    joining_date_extend_status: 1,
                    joining_date_extend_reason: 1,
                    joining_date_reject_reason: 1,
                    joining_extend_document: 1,
                    invoice_template_no: 1,
                    userSalaryStatus: 1,
                    department_name: "$department.dept_name",
                    Role_name: "$role.Role_name",
                    report: "$reportTo.user_name",
                    Report_L1N: "$reportL1.user_name",
                    Report_L2N: "$reportL2.user_name",
                    Report_L3N: "$reportL3.user_name",
                    designation_name: "$designation.desi_name",
                    userSalaryStatus: 1,
                    digital_signature_image: 1,
                    bank_name: 1,
                    ifsc_code: 1,
                    account_no: 1,
                    guardian_name: 1,
                    guardian_address: 1,
                    relation_with_guardian: 1,
                    gaurdian_number: 1,
                    emergency_contact1: 1,
                    emergency_contact2: 1,
                    ctc: 1,
                    offer_letter_send: 1,
                    annexure_pdf: 1,
                    profileflag: 1,
                    nick_name: 1,
                    showOnboardingModal: 1,
                    coc_flag: 1,
                    latitude: 1,
                    longitude: 1,
                    beneficiary: 1,
                    emp_id: 1,
                    alternate_contact: 1,
                    cast_type: 1,
                    bank_type: 1,
                    emergency_contact_person_name1: 1,
                    emergency_contact_person_name2: 1,
                    emergency_contact_relation1: 1,
                    emergency_contact_relation2: 1,
                    image_url: { $concat: [userImagesBaseUrl, "$image"] },
                    joining_extend_document: { $concat: [userImagesBaseUrl, "$joining_extend_document"] },
                    // document_percentage_mandatory: 1,
                    // document_percentage_non_mandatory: 1,
                    // document_percentage: 1,
                    upi_Id: 1,
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
};

exports.getSingleUser = async (req, res) => {
    try {
        const singlesim = await userModel.aggregate([
            {
                $match: { user_id: parseInt(req.params.id) }
            },
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
                    localField: "user_report_to_id",
                    foreignField: "user_id",
                    as: "reportTo"
                }
            },
            {
                $unwind: {
                    path: "$reportTo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "Report_L1",
                    foreignField: "user_id",
                    as: "reportL1"
                }
            },
            {
                $unwind: {
                    path: "$reportL1",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "Report_L2",
                    foreignField: "user_id",
                    as: "reportL2"
                }
            },
            {
                $unwind: {
                    path: "$reportL2",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "Report_L3",
                    foreignField: "user_id",
                    as: "reportL3"
                }
            },
            {
                $unwind: {
                    path: "$reportL3",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'subdepartmentmodels',
                    localField: 'department.dept_id',
                    foreignField: 'dept_id',
                    as: 'subDepartment'
                }
            },
            {
                $unwind: {
                    path: "$subDepartment",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    show_rocket: "$show_rocket",
                    offer_later_pdf_url: "$offer_later_pdf_url",
                    offer_later_acceptance_date: "$offer_later_acceptance_date",
                    offer_later_status: "$offer_later_status",
                    offer_later_reject_reason: "$offer_later_reject_reason",
                    user_id: "$user_id",
                    user_name: "$user_name",
                    sub_dept_id: "$subDepartment.id",
                    sub_dept_name: "$subDepartment.sub_dept_name",
                    user_designation: "$user_designation",
                    user_email_id: "$user_email_id",
                    user_login_id: "$user_login_id",
                    user_login_password: "$user_login_password",
                    user_report_to_id: "$user_report_to_id",
                    created_At: "$created_At",
                    last_updated: "$lastupdated",
                    created_by: "$created_by",
                    user_contact_no: "$user_contact_no",
                    dept_id: "$dept_id",
                    location_id: "$location_id",
                    role_id: "$role_id",
                    sitting_id: "$sitting_id",
                    image: "$image",
                    job_type: "$job_type",
                    PersonalNumber: "$PersonalNumber",
                    Report_L1: "$Report_L1",
                    Report_L2: "$Report_L2",
                    Report_L3: "$Report_L3",
                    PersonalEmail: "$PersonalEmail",
                    att_status: "$att_status",
                    level: "$level",
                    joining_date: "$joining_date",
                    releaving_date: "$releaving_date",
                    room_id: "$room_id",
                    UID: "$UID",
                    pan: "$pan",
                    highest_upload: "$highest_upload",
                    other_upload: "$other_upload",
                    salary: "$salary",
                    year_salary: "$year_salary",
                    SpokenLanguages: "$SpokenLanguages",
                    Gender: "$Gender",
                    Nationality: "$Nationality",
                    DOB: "$DOB",
                    Age: "$Age",
                    fatherName: "$fatherName",
                    motherName: "$motherName",
                    Hobbies: "$Hobbies",
                    BloodGroup: "$BloodGroup",
                    MartialStatus: "$MartialStatus",
                    DateOfMarriage: "$DateOfMarriage",
                    onboard_status: "$onboard_status",
                    tbs_applicable: "$tds_applicable",
                    tds_per: "$tds_per",
                    image_remark: "$image_remark",
                    image_validate: "$image_validate",
                    uid_remark: "$uid_remark",
                    uid_validate: "$uid_validate",
                    pan_remark: "$pan_remark",
                    pan_validate: "$pan_validate",
                    highest_upload_remark: "$highest_upload_remark",
                    highest_upload_validate: "$highest_upload_validate",
                    other_upload_remark: "$other_upload_remark",
                    other_upload_validate: "$other_upload_validate",
                    user_status: "$user_status",
                    sub_dept_id: "$sub_dept_id",
                    pan_no: "$pan_no",
                    uid_no: "$uid_no",
                    spouse_name: "$spouse_name",
                    highest_qualification_name: "$highest_qualification_name",
                    tenth_marksheet: "$tenth_marksheet",
                    twelveth_marksheet: "$twelveth_marksheet",
                    UG_Marksheet: "$UG_Marksheet",
                    passport: "$passport",
                    pre_off_letter: "$pre_off_letter",
                    pre_expe_letter: "$pre_expe_letter",
                    pre_relieving_letter: "$pre_relieving_letter",
                    bankPassBook_Cheque: "$bankPassBook_Cheque",
                    tenth_marksheet_validate: "$tenth_marksheet_validate",
                    twelveth_marksheet_validate: "$twelveth_marksheet_validate",
                    UG_Marksheet_validate: "$UG_Marksheet_validate",
                    passport_validate: "$passport_validate",
                    pre_off_letter_validate: "$pre_off_letter_validate",
                    pre_expe_letter_validate: "$pre_expe_letter_validate",
                    pre_relieving_letter_validate: "$pre_relieving_letter_validate",
                    bankPassBook_Cheque_validate: "$bankPassBook_Cheque_validate",
                    tenth_marksheet_validate_remark: "$tenth_marksheet_validate_remark",
                    twelveth_marksheet_validate_remark: "$twelveth_marksheet_validate_remark",
                    UG_Marksheet_validate_remark: "$UG_Marksheet_validate_remark",
                    passport_validate_remark: "$passport_validate_remark",
                    pre_off_letter_validate_remark: "$pre_off_letter_validate_remark",
                    pre_expe_letter_validate_remark: "$pre_expe_letter_validate_remark",
                    pre_relieving_letter_validate_remark: "$pre_relieving_letter_validate_remark",
                    bankPassBook_Cheque_validate_remark: "$bankPassBook_Cheque_validate_remark",
                    current_address: "$current_address",
                    current_city: "$current_city",
                    current_state: "$current_state",
                    current_pin_code: "$current_pin_code",
                    permanent_address: "$permanent_address",
                    permanent_city: "$permanent_city",
                    permanent_state: "$permanent_state",
                    permanent_pin_code: "$permanent_pin_code",
                    joining_date_extend: "$joining_date_extend",
                    joining_date_extend_status: "$joining_date_extend_status",
                    joining_date_extend_reason: "$joining_date_extend_reason",
                    joining_date_reject_reason: "$joining_date_reject_reason",
                    joining_extend_document: "$joining_extend_document",
                    invoice_template_no: "$invoice_template_no",
                    userSalaryStatus: "$userSalaryStatus",
                    digital_signature_image: "$digital_signature_image",
                    department_name: '$department.dept_name',
                    Role_name: "$role.Role_name",
                    report: "$reportTo.user_name",
                    Report_L1N: "$reportL1.user_name",
                    Report_L2N: "$reportL2.user_name",
                    Report_L3N: "$reportL3.user_name",
                    designation_name: "$designation.desi_name",
                    bank_name: "$bank_name",
                    ifsc_code: "$ifsc_code",
                    account_no: "$account_no",
                    guardian_name: "$guardian_name",
                    guardian_address: "$guardian_address",
                    relation_with_guardian: "$relation_with_guardian",
                    gaurdian_number: "$gaurdian_number",
                    emergency_contact1: "$emergency_contact1",
                    emergency_contact2: "$emergency_contact2",
                    ctc: "$ctc",
                    offer_letter_send: "$offer_letter_send",
                    profileflag: "$profileflag",
                    nick_name: "$nick_name",
                    showOnboardingModal: "$showOnboardingModal",
                    coc_flag: "$coc_flag",
                    latitude: "$latitude",
                    longitude: "$longitude",
                    beneficiary: "$beneficiary",
                    emp_id: "$emp_id",
                    alternate_contact: "$alternate_contact",
                    cast_type: "$cast_type",
                    emergency_contact_person_name1: "$emergency_contact_person_name1",
                    emergency_contact_person_name2: "$emergency_contact_person_name2",
                    emergency_contact_relation1: "$emergency_contact_relation1",
                    emergency_contact_relation2: "$emergency_contact_relation2",
                    document_percentage_mandatory: "$document_percentage_mandatory",
                    document_percentage_non_mandatory: "$document_percentage_non_mandatory",
                    document_percentage: "$document_percentage",
                    bank_type: "$bank_type",
                    account_type: "$account_type",
                    branch_name: "$branch_name",
                    upi_Id: "$upi_Id",
                    user_credit_limit: "$user_credit_limit",
                    user_available_limit: "$user_available_limit",
                    facebookLink: 1,
                    instagramLink: 1,
                    linkedInLink: 1,
                    height: 1,
                    weight: 1,
                    travelMode: 1,
                    sportsTeam: 1,
                    smoking: 1,
                    daysSmoking: 1,
                    alcohol: 1,
                    medicalHistory: 1,
                    bmi: 1,
                    passportNumber: 1,
                    passportValidUpto: 1,
                    aadharName: 1,
                    voterIdNumber: 1,
                    voterName: 1,
                    panName: 1,
                    vehicleNumber: 1,
                    vehicleName: 1,
                    drivingLicenseNumber: 1,
                    drivingLicenseValidUpto: 1,
                    work_experience: 1,
                    old_pf_number: 1,
                    uan_number: 1,
                    old_esic_number: 1
                }
            }
        ]).exec();
        const userImagesBaseUrl = vari.IMAGE_URL;
        const dataWithImageUrl = singlesim.map((user) => ({
            ...user,
            image_url: user.image ? userImagesBaseUrl + user.image : null,
            uid_url: user.UID ? userImagesBaseUrl + user.UID : null,
            pan_url: user.pan ? userImagesBaseUrl + user.pan : null,
            highest_upload_url: user.highest_upload
                ? userImagesBaseUrl + user.highest_upload
                : null,
            other_upload_url: user.other_upload
                ? userImagesBaseUrl + user.other_upload
                : null,
            tenth_marksheet_url: user.tenth_marksheet ? userImagesBaseUrl + user.tenth_marksheet : null,
            twelveth_marksheet_url: user.twelveth_marksheet ? userImagesBaseUrl + user.twelveth_marksheet : null,
            UG_Marksheet_url: user.UG_Marksheet ? userImagesBaseUrl + user.UG_Marksheet : null,
            pasport_url: user.passport ? userImagesBaseUrl + user.passport : null,
            pre_off_letter_url: user.pre_off_letter ? userImagesBaseUrl + user.pre_off_letter : null,
            pre_expe_letter_url: user.pre_expe_letter ? userImagesBaseUrl + user.pre_expe_letter : null,
            Pre_relieving_letter_url: user.pre_relieving_letter ? userImagesBaseUrl + user.pre_relieving_letter : null,
            bankPassBook_Cheque_url: user.bankPassBook_Cheque ? userImagesBaseUrl + user.bankPassBook_Cheque : null,
            joining_extend_document_url: user.joining_extend_document ? userImagesBaseUrl + user.joining_extend_document : null,
            digital_signature_image_url: user.digital_signature_image ? userImagesBaseUrl + user.digital_signature_image : null,
            annexure_pdf: user.annexure_pdf ? userImagesBaseUrl + user.annexure_pdf : null
        }));
        if (dataWithImageUrl?.length === 0) {
            res
                .status(200)
                .send({ success: true, data: [], message: "No Record found" });
        } else {
            const result = dataWithImageUrl[0];
            res.status(200).send(result);
        }
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting all users' })
    }
}

exports.deleteUser = async (req, res) => {
    userModel.deleteOne({ user_id: req.params.id }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'user deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'user not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
    // try{
    //     const deleteuser = await userModel.deleteOne({ user_id: req.params.id });
    //     if(deleteuser){
    //         await attendanceModel.deleteMany({user_id: req.params.id});
    //         await documentHisModel.deleteMany({user_id: req.params.id});
    //         await educationModel.deleteMany({user_id: req.params.id});
    //         await familyModel.deleteMany({user_id: req.params.id});
    //         await guardianModel.deleteMany({user_id: req.params.id});
    //         await jobResponsibilityModel.deleteMany({user_id: req.params.id});
    //         await notificationModel.deleteOne({user_id: req.params.id});
    //         await orderReqModel.deleteMany({user_id: req.params.id});
    //         await separationModel.deleteOne({user_id: req.params.id});
    //         await simAlloModel.deleteMany({user_id: req.params.id});
    //         await userAuthModel.deleteMany({user_id: req.params.id});
    //         await userDocManagmentModel.deleteMany({user_id: req.params.id});
    //         await userLoginHisModel.deleteMany({user_id: req.params.id});
    //         await userOtherFieldModel.deleteMany({user_id: req.params.id});
    //     }
    // }catch(err){
    //     return res.status(500).json({success: false, sms:err.message})
    // }
};

exports.loginUser = async (req, res) => {
    try {

        const simc = await userModel.aggregate([
            {
                $match: {
                    user_login_id: req.body.user_login_id.toLowerCase().trim(),

                }
            },
            {
                $lookup: {
                    from: 'sittingmodels',
                    localField: 'sitting_id',
                    foreignField: 'sitting_id',
                    as: 'sitting'
                }
            },
            {
                $unwind: {
                    path: "$sitting",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    sitting_id: '$sitting.sitting_id',
                    sitting_ref_no: '$sitting.sitting_ref_no',
                    first_login_flag: '$first_login_flag',
                    name: '$user_name',
                    email: '$user_email_id',
                    dept_id: '$dept_id',
                    role_id: '$role_id',
                    id: "$user_id",
                    room_id: '$room_id',
                    user_status: '$user_status',
                    user_login_password: '$user_login_password',
                    onboard_status: '$onboard_status',
                    user_login_id: '$user_login_id',
                    invoice_template_no: "$invoice_template_no",
                    job_type: "$job_type",
                    // digital_signature_image: "$digital_signature_image"
                    digital_signature_image: { $concat: [vari.IMAGE_URL, "$digital_signature_image"] }
                }
            }
        ]).exec();

        if (simc.length === 0) {
            return res.status(500).send({ error: "Invalid Login Id" });
        }

        let role = req.body?.role_id;
        if (bcrypt.compareSync(req.body.user_login_password, simc[0]?.user_login_password) || role === constant.ADMIN_ROLE) {
            const token = jwt.sign(
                {
                    id: simc[0]?.id,
                    name: simc[0]?.name,
                    email: simc[0]?.email,
                    sitting_id: simc[0]?.sitting_id,
                    role_id: simc[0]?.role_id,
                    dept_id: simc[0]?.dept_id,
                    room_id: simc[0]?.room_id,
                    sitting_ref_no: simc[0]?.sitting_ref_no,
                    onboard_status: simc[0]?.onboard_status,
                    user_status: simc[0]?.user_status,
                    invoice_template_no: simc[0].invoice_template_no,
                    digital_signature_image: simc[0].digital_signature_image,
                    job_type: simc[0].job_type
                },
                constant.SECRET_KEY_LOGIN,
                { expiresIn: constant.CONST_VALIDATE_SESSION_EXPIRE }
            );

            var currentDate = new Date();
            currentDate.setHours(currentDate.getHours() + 5)
            currentDate.setMinutes(currentDate.getMinutes() + 30)
            var formattedDateTime = currentDate.toLocaleString();

            if (simc[0].onboard_status == 2) {
                const saveDataObj = {
                    user_id: simc[0].id,
                    user_email_id: simc[0].email || simc[0].user_login_id
                };
                await userLoginHisModel.create(saveDataObj);
                if (simc[0].first_login_flag == false) {
                    await userModel.findOneAndUpdate({ user_login_id: req.body.user_login_id.toLowerCase().trim() }, {
                        first_login_flag: true,
                        first_login_time: formattedDateTime
                    });
                    const sms = new notificationModel({
                        user_id: simc[0].id,
                        notification_title: "New Candidate has been logged in",
                        notification_message: `${simc[0].name} has been loggedin on ${formattedDateTime}`,
                        created_by: simc[0].id
                    })
                    await sms.save();
                }
            }

            return res.status(200).send({ token, user: simc[0] });
        } else {
            return res.status(500).send({ error: 'Invalid Password' });
        }

    } catch (err) {
        return res.status(500).send({ error: err.message, sms: 'Error getting user details' });
    }
}

exports.deliveryBoy = async (req, res) => {
    try {
        const delv = await userModel.find({ role_id: 3 }).select({ user_id: 1, user_name: 1, room_id: 1 })
        if (!delv) {
            res.status(500).send({ success: false })
        }
        res.status(200).send({ results: delv })
    } catch (err) {
        res.status(500).send({ error: err, sms: 'error getting all delivery boy' })
    }
}

exports.deliveryBoyByRoom = async (req, res) => {
    try {
        const delv = await userModel.find({ role_id: 3, room_id: parseInt(req.params.room_id) })
        if (!delv) {
            res.status(500).send({ success: false })
        }
        res.status(200).send({ results: delv })
    } catch (err) {
        res.status(500).send({ error: err, sms: 'error getting delivery boy from this room' })
    }
}

exports.deliveryUser = async (req, res) => {
    const ImageUrl = `${vari.IMAGE_URL}`;
    try {
        const delv = await userModel.aggregate([
            {
                $match: { role_id: 3 }
            },
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
                    preserveNullAndEmptyArrays: true,
                },
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
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'usermodels',
                    localField: 'user_report_to_id',
                    foreignField: 'user_id',
                    as: 'user1'
                }
            },
            {
                $unwind: {
                    path: "$user1",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    dept_name: '$department.dept_name',
                    dept_id: "$dept_id",
                    desi_id: '$desi_id',
                    id: "$id",
                    user_id: "$user_id",
                    report: '$user1.user_name',
                    report_L1_name: '$user2.user_name',
                    user_name: '$user_name',
                    user_email_id: '$user_email_id',
                    user_login_id: '$user_login_id',
                    user_login_password: '$user_login_password',
                    user_report_to_id: '$user_report_to_id',
                    user_contact_no: '$user_contact_no',
                    location_id: '$location_id',
                    created_by: '$created_by',
                    role_id: '$role_id',
                    sitting_id: '$sitting_id',
                    job_type: '$job_type',
                    personal_number: '$personal_number',
                    report_L1: '$report_L1',
                    report_L2: '$report_L2',
                    report_L3: '$report_L3',
                    Personal_email: '$Personal_email',
                    joining_date: '$joining_date',
                    releaving_date: '$releaving_date',
                    level: '$level',
                    room_id: '$room_id',
                    salary: '$salary',
                    SpokenLanguages: '$SpokenLanguages',
                    Gender: '$Gender',
                    Nationality: '$Nationality',
                    DOB: '$DOB',
                    Age: '$Age',
                    FatherName: '$FatherName',
                    MotherName: '$MotherName',
                    Hobbies: '$Hobbies',
                    BloodGroup: '$BloodGroup',
                    MartialStatus: '$MartialStatus',
                    DateofMarriage: '$DateofMarriage',
                    tds_applicable: '$tds_applicable',
                    tds_per: '$tds_per',
                    onboard_status: '$onboard_status',
                    image_remark: '$image_remark',
                    image_validate: '$image_validate',
                    uid_remark: '$uid_remark',
                    uid_validate: '$uid_validate',
                    pan_remark: '$pan_remark',
                    pan_validate: '$pan_validate',
                    highest_upload_remark: '$highest_upload_remark',
                    highest_upload_validate: '$highest_upload_validate',
                    other_upload_remark: '$other_upload_remark',
                    other_upload_validate: '$other_upload_validate',
                    user_status: '$user_status',
                    lastupdated: '$lastupdated',
                    sub_dept_id: '$sub_dept_id',
                    pan_no: '$pan_no',
                    uid_no: '$uid_no',
                    spouse_name: '$spouse_name',
                    highest_qualification_name: '$highest_qualification_name',
                    tenth_marksheet_validate: '$tenth_marksheet_validate',
                    twelveth_marksheet_validate: '$twelveth_marksheet_validate',
                    UG_Marksheet_validate: '$UG_Marksheet_validate',
                    passport_validate: '$passport_validate',
                    pre_off_letter_validate: '$pre_off_letter_validate',
                    pre_expe_letter_validate: '$pre_expe_letter_validate',
                    pre_relieving_letter_validate: '$pre_relieving_letter_validate',
                    bankPassBook_Cheque_validate: '$bankPassBook_Cheque_validate',
                    tenth_marksheet_validate_remark: '$tenth_marksheet_validate_remark',
                    twelveth_marksheet_validate_remark: '$twelveth_marksheet_validate_remark',
                    UG_Marksheet_validate_remark: '$UG_Marksheet_validate_remark',
                    passport_validate_remark: '$passport_validate',
                    pre_off_letter_validate_remark: '$pre_off_letter_validate_remark',
                    pre_expe_letter_validate_remark: '$pre_expe_letter_validate_remark',
                    pre_relieving_letter_validate_remark: '$pre_relieving_letter_validate_remark',
                    bankPassBook_Cheque_validate_remark: '$bankPassBook_Cheque_validate_remark',
                    current_address: '$current_address',
                    current_city: '$current_city',
                    current_state: '$current_state',
                    current_pin_code: '$current_pin_code',
                    permanent_address: '$permanent_address',
                    permanent_city: '$permanent_city',
                    permanent_state: '$permanent_state',
                    permanent_pin_code: '$permanent_pin_code',
                    joining_date_extend: '$joining_date_extend',
                    joining_date_extend_status: '$joining_date_extend_status',
                    joining_date_extend_reason: '$joining_date_extend_reason',
                    joining_date_reject_reason: '$joining_date_reject_reason',
                    invoice_template_no: '$invoice_template_no',
                    image: { $concat: [ImageUrl, '$image'] },
                    UID: { $concat: [ImageUrl, '$UID'] },
                    pan: { $concat: [ImageUrl, '$pan'] },
                    highest_upload: { $concat: [ImageUrl, '$highest_upload'] },
                    other_upload: { $concat: [ImageUrl, '$other_upload'] },
                    tenth_marksheet: { $concat: [ImageUrl, '$tenth_marksheet'] },
                    twelveth_marksheet: { $concat: [ImageUrl, '$twelveth_marksheet'] },
                    UG_Marksheet: { $concat: [ImageUrl, '$UG_Marksheet'] },
                    passport: { $concat: [ImageUrl, '$passport'] },
                    pre_off_letter: { $concat: [ImageUrl, '$pre_off_letter'] },
                    pre_expe_letter: { $concat: [ImageUrl, '$pre_expe_letter'] },
                    pre_relieving_letter: { $concat: [ImageUrl, '$pre_relieving_letter'] },
                    bankPassBook_Cheque: { $concat: [ImageUrl, '$bankPassBook_Cheque'] },
                    joining_extend_document: { $concat: [ImageUrl, '$joining_extend_document'] },
                    guardian_name: "$guardian_name",
                    guardian_address: "$guardian_address",
                    relation_with_guardian: "$relation_with_guardian",
                    gaurdian_number: "$gaurdian_number",
                    emergency_contact: "$emergency_contact",
                    document_percentage_mandatory: "$document_percentage_mandatory",
                    document_percentage_non_mandatory: "$document_percentage_non_mandatory",
                    document_percentage: "$document_percentage",
                }
            }
        ]).exec();
        if (!delv) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(delv)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'error getting delivery user' })
    }
}

exports.addUserAuth = async (req, res) => {
    try {
        const simc = new userAuthModel({
            Juser_id: req.body.Juser_id,
            obj_id: req.body.obj_id,
            insert: req.body.insert,
            view: req.body.view,
            update: req.body.update,
            delete_flag: req.body.delete_flag,
            creation_date: req.body.creation_date,
            created_by: req.body.created_by
        })
        const simv = await simc.save();
        res.send({ simv, status: 200 });
    } catch (err) {
        res.status(500).send({ error: err, sms: 'This user auth cannot be created' })
    }
}

exports.allUserAuthDetail = async (req, res) => {
    try {
        const delv = await userAuthModel.aggregate([
            {
                $lookup: {
                    from: 'usermodels',
                    localField: 'Juser_id',
                    foreignField: 'user_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $lookup: {
                    from: 'objectmodels',
                    localField: 'obj_id',
                    foreignField: 'obj_id',
                    as: 'object'
                }
            },
            {
                $unwind: '$object'
            },
            {
                $project: {
                    auth_id: "$auth_id",
                    user_name: '$user.user_name',
                    obj_name: "$object.obj_name",
                    id: "$_id",
                    Juser_id: '$Juser_id',
                    obj_id: '$obj_id',
                    insert: '$insert',
                    view: '$view',
                    update: '$update',
                    delete_flag: '$delete_flag',
                }
            }
        ]).exec();
        if (!delv) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(delv)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'error getting all user auth details' })
    }
}

exports.updateUserAuth = async (req, res) => {
    try {
        const editsim = await userAuthModel.findOneAndUpdate({ auth_id: req.body.auth_id }, {
            Juser_id: req.body.Juser_id,
            obj_id: req.body.obj_id,
            insert: req.body.insert,
            view: req.body.view,
            update: req.body.update,
            delete_flag: req.body.delete_flag,
            Last_updated_date: req.body.Last_updated_date,
            Last_updated_by: req.body.Last_updated_by
        }, { new: true })
        if (!editsim) {
            res.status(500).send({ success: false })
        }
        return res.status(200).send({ success: true, data: editsim })
    } catch (err) {
        return res.status(500).send({ error: err, sms: 'Error updating user auth details' })
    }
};

exports.deleteUserAuth = async (req, res) => {
    userAuthModel.deleteOne({ auth_id: req.body.auth_id }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'user auth deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'user auth not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
};

exports.getSingleUserAuthDetail = async (req, res) => {
    try {
        const objectImagesBaseUrl = vari.IMAGE_URL;
        const delv = await userAuthModel.aggregate([
            {
                $match: { Juser_id: parseInt(req.params.Juser_id) }
            },
            {
                $lookup: {
                    from: 'objectmodels',
                    localField: 'obj_id',
                    foreignField: 'obj_id',
                    as: 'object'
                }
            },
            {
                $unwind: {
                    path: "$object",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$obj_id',
                    auth_id: { $first: '$auth_id' },
                    Juser_id: { $first: '$Juser_id' },
                    obj_name: { $first: '$object.obj_name' },
                    project_name: { $first: '$object.project_name' },
                    summary: { $first: '$object.summary' },
                    screenshot: { $first: { $concat: [objectImagesBaseUrl, "$screenshot"] } },
                    obj_id: { $first: '$obj_id' },
                    insert_value: { $first: '$insert' },
                    view_value: { $first: '$view' },
                    update_value: { $first: '$update' },
                    delete_flag_value: { $first: '$delete_flag' }
                }
            },
            {
                $sort: { obj_id: 1 }
            }
        ]);

        if (delv.length === 0) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        res.status(200).send(delv);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message, message: 'Error getting user auth details' });
    }
};


exports.userObjectAuth = async (req, res) => {
    try {
        const delv = await userAuthModel.aggregate([
            {
                $match: {
                    Juser_id: req.body.Juser_id,
                    user_id: req.body.user_id
                }
            },
            {
                $lookup: {
                    from: 'usermodels',
                    localField: 'user_id',
                    foreignField: 'Juser_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $lookup: {
                    from: 'objectmodels',
                    localField: 'obj_id',
                    foreignField: 'obj_id',
                    as: 'object'
                }
            },
            {
                $unwind: '$object'
            },
            {
                $lookup: {
                    from: 'departmentmodels',
                    localField: 'dept_id',
                    foreignField: 'dept_id',
                    as: 'department'
                }
            },
            {
                $unwind: '$department'
            },
            {
                $project: {
                    user_name: '$user.user_name',
                    department_name: '$department.dept_name',
                    obj_name: "$object.obj_name",
                    id: "$_id",
                    Juser_id: '$Juser_id',
                    obj_id: '$obj_id',
                    insert: '$insert',
                    view: '$view',
                    update: '$update',
                    delete_flag: '$delete_flag',
                }
            }
        ]).exec();
        if (!delv) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(delv)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'error getting user object auth details' })
    }
};

// exports.sendUserMail = async (req, res) => {
//     try {
//         const { email, subject, name, password, login_id, status, text, name2 } = req.body;

//         const attachment = req.file;
//         if (status == "onboarded") {

//             const templatePath = path.join(__dirname, "template.ejs");
//             const template = await fs.promises.readFile(templatePath, "utf-8");
//             const html = ejs.render(template, { email, password, name, login_id, text });

//             /* dynamic email temp code start */
//             // const contentList = await emailTempModel.findOne({ email_for_id: '65bde0335629ebe4e2a71ae3', send_email: true });

//             // const filledEmailContent = contentList.email_content
//             //     .replace("{{user_name}}", name)
//             //     .replace("{{user_email}}", email)
//             //     .replace("{{user_password}}", password)
//             //     .replace("{{user_login_id}}", login_id);

//             // const html = filledEmailContent;
//             /* dynamic email temp code end */

//             let mailTransporter = nodemailer.createTransport({
//                 service: "gmail",
//                 auth: {
//                     user: "onboarding@creativefuel.io",
//                     pass: "zboiicwhuvakthth",
//                 },
//             });

//             let mailOptions = {
//                 from: "onboarding@creativefuel.io",
//                 to: email,
//                 subject: subject,
//                 // subject: contentList.email_sub,
//                 html: html,
//                 attachments: attachment
//                     ? [
//                         {
//                             filename: attachment.originalname,
//                             path: attachment.path,
//                         },
//                     ]
//                     : [],
//             };

//             await mailTransporter.sendMail(mailOptions);
//             res.sendStatus(200);
//         } else if (status == "reportTo") {
//             const templatePath = path.join(__dirname, "reportTo.ejs");
//             const template = await fs.promises.readFile(templatePath, "utf-8");
//             const html = ejs.render(template, { name, name2 });

//             /* dynamic email temp code start */
//             // const contentList = await emailTempModel.findOne({ email_for_id: '65be343aad52cfd11fa27e52', send_email: true })

//             // const filledEmailContent = contentList.email_content.replace("{{user_reportTo}}", name2);

//             // const html = filledEmailContent;
//             /* dynamic email temp code end */

//             let mailTransporter = nodemailer.createTransport({
//                 service: "gmail",
//                 auth: {
//                     user: "onboarding@creativefuel.io",
//                     pass: "zboiicwhuvakthth",
//                 },
//             });

//             let mailOptions = {
//                 from: "onboarding@creativefuel.io",
//                 to: email,
//                 // subject: contentList.email_sub,
//                 html: html,
//                 attachments: attachment
//                     ? [
//                         {
//                             filename: attachment.originalname,
//                             path: attachment.path,
//                         },
//                     ]
//                     : [],
//             };

//             await mailTransporter.sendMail(mailOptions);
//             res.sendStatus(200);
//         }
//     } catch (error) {
//         res.status(500).send({ error: error.message, sms: 'error sending to email' });
//     }
// }

exports.sendUserMail = async (req, res) => {
    try {
        const { email, subject, name, password, login_id, status, text, name2 } = req.body;
        // const attachment = req.file;

        const transporterOptions = {
            service: "gmail",
            auth: {
                user: constant.EMAIL_ID,
                pass: constant.EMAIL_PASS,
            },
        };

        const createMailOptions = (html) => ({
            from: constant.EMAIL_ID,
            to: email,
            subject: subject,
            html: html,
        });

        const sendMail = async (mailOptions) => {
            const transporter = nodemailer.createTransport(transporterOptions);
            await transporter.sendMail(mailOptions);
        };

        if (status === "onboarded") {
            const templatePath = path.join(__dirname, "template.ejs");
            const template = await fs.promises.readFile(templatePath, "utf-8");
            const html = ejs.render(template, { email, password, name, login_id, text });
            const mailOptions = createMailOptions(html);
            await sendMail(mailOptions);
        } else if (status === "reportTo") {
            const templatePath = path.join(__dirname, "reportTo.ejs");
            const template = await fs.promises.readFile(templatePath, "utf-8");
            const html = ejs.render(template, { name, name2 });
            const mailOptions = createMailOptions(html);
            await sendMail(mailOptions);
        }

        res.sendStatus(200);
    } catch (error) {
        res.status(500).send({ error: error.message, sms: 'error sending to email' });
    }
};

exports.getUserByDeptAndWFH = async (req, res) => {
    try {
        const delv = await userModel.find({ dept_id: req.params.dept_id, job_type: 'WFHD' })
        if (!delv) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(delv)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'error getting all whf user with dept id' })
    }
}

exports.getUserJobResponsibility = async (req, res) => {
    try {
        const delv = await jobResponsibilityModel.aggregate([
            {
                $match: {
                    user_id: req.body.user_id
                }
            },
            {
                $lookup: {
                    from: 'usermodels',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    id: "$_id",
                    Job_res_id: '$Job_res_id',
                    user_name: '$user.user_name',
                    sjob_responsibility: "$sjob_responsibility",
                    description: "$description",
                    Created_by: "$Created_by",
                    Last_updated_by: "$Last_updated_by",
                    Last_updated_date: "$Last_updated_date"
                }
            }
        ]).exec();
        if (!delv) {
            res.status(500).send({ success: false })
        }
        res.status(200).send({ data: delv })
    } catch (err) {
        res.status(500).send({ error: err, sms: 'error getting user job responsibility' })
    }
}

exports.getUserByDeptId = async (req, res) => {
    try {

        const singlesim = await userModel.aggregate([
            {
                $match: { dept_id: parseInt(req.params.id) }
            },
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
                $project: {
                    user_id: "$user_id",
                    user_name: "$user_name",
                    user_designation: "$user_designation",
                    department_name: '$department.dept_name',
                    designation_name: "$designation.desi_name",
                    last_updated: "$lastupdated",
                    tbs_applicable: "$tds_applicable"
                }
            }
        ]).exec();

        // const delv = await userModel.find({ dept_id: req.params.id }).lean();
        // if (!delv) {
        //     res.status(500).send({ success: false })
        // }
        // const modifiedUsers = delv.map(user => {
        //     if (user.hasOwnProperty('lastupdated')) {
        //         user.last_updated = user.lastupdated;
        //         delete user.lastupdated;
        //     }
        //     if (user.hasOwnProperty('tds_applicable')) {
        //         user.tbs_applicable = user.tds_applicable;
        //         delete user.tds_applicable;
        //     }
        //     return user;
        // });
        res.status(200).send(singlesim)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'error getting all users by dept id' })
    }
}

exports.getUserOtherFields = async (req, res) => {
    try {
        // const delv = await userOtherFieldModel.find({});
        const delv = await userOtherFieldModel.aggregate([
            {
                $match: {
                    user_id: req.params.user_id
                }
            },
            {
                $lookup: {
                    from: 'usermodels',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    user_name: '$user.user_name',
                    // created_by_name: '$user.user_name',
                    id: "$_id",
                    user_id: '$user_id',
                    field_name: '$field_name',
                    field_value: '$field_value',
                    remark: '$remark',
                    created_at: '$created_at',
                    created_by: '$created_by',
                    lastupdated_by: '$lastupdated_by'
                }
            }
        ]).exec();
        if (!delv) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(delv)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'error getting user other fields' })
    }
}

exports.addUserOtherField = async (req, res) => {
    try {
        const simc = new userOtherFieldModel({
            user_id: req.body.user_id,
            field_name: req.body.field_name,
            field_value: req.file ? req.file.filename : '',
            remark: req.body.remark,
            created_by: req.body.created_at
        })
        const simv = await simc.save();
        res.send({ simv, status: 200 });
    } catch (err) {
        res.status(500).send({ error: err, sms: 'This users other fields cannot be created' })
    }
}

exports.updateUserOtherField = async (req, res) => {
    try {
        const editsim = await userOtherFieldModel.findOneAndUpdate({ user_id: req.params.user_id }, {
            field_name: req.body.field_name,
            field_value: req.file,
            remark: req.body.remark
        }, { new: true })
        if (!editsim) {
            res.status(500).send({ success: false })
        }
        res.status(200).send({ success: true, data: editsim })
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error updating user other fields' })
    }
};

exports.addReason = async (req, res) => {
    try {
        const simc = new reasonModel({
            remark: req.body.remark,
            reason: req.body.reason
        })
        const simv = await simc.save();
        res.send({ simv, status: 200 });
    } catch (err) {
        res.status(500).send({ error: err, sms: 'This reason cannot be created' })
    }
}

exports.getAllReasons = async (req, res) => {
    try {
        // const delv = await reasonModel.aggregate([
        //     {
        //         $lookup: {
        //             from: 'usermodels',
        //             localField: 'user_id',
        //             foreignField: 'created_by',
        //             as: 'user'
        //         }
        //     },
        //     {
        //         $unwind: '$user'
        //     },
        //     {
        //         $project: {
        //             createdBY_name: '$user.user_name',
        //             id: "$id",
        //             reason: '$reason',
        //             remark: '$remark',
        //             created_by: '$created_by'
        //         }
        //     }
        // ]).exec();
        const delv = await reasonModel.find();
        if (!delv) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(delv)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'error getting all reasons' })
    }
}

exports.addSeparation = async (req, res) => {
    try {
        const simc = new separationModel({
            user_id: req.body.user_id,
            status: req.body.status,
            created_by: req.body.created_by,
            resignation_date: req.body.resignation_date,
            last_working_day: req.body.last_working_day,
            remark: req.body.remark,
            reason: req.body.reason,
            reinstate_date: req.body.reinstate_date
        })
        const simv = await simc.save();

        await userModel.findOneAndUpdate(
            { user_id: simv.user_id },
            { user_status: 'Exit' },
            { new: true }
        );

        res.send({ simv, status: 200 });
    } catch (err) {
        res.status(500).send({ error: err, sms: 'This separation cannot be created' })
    }
}

exports.getAllSeparations = async (req, res) => {
    try {
        const delv = await separationModel.aggregate([
            {
                $lookup: {
                    from: 'usermodels',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $lookup: {
                    from: 'reasonmodels',
                    localField: 'id',
                    foreignField: 'reason',
                    as: 'reason'
                }
            },
            {
                $unwind: '$reason'
            },
            {
                $project: {
                    createdBY_name: '$user.user_name',
                    reasonValue: '$reason.reason',
                    id: "$_id",
                    reason: '$reason',
                    remark: '$remark',
                    status: '$status',
                    user_id: '$user_id',
                    resignation_date: '$resignation_date',
                    last_working_date: '$last_working_date',
                    reinstate_date: '$reinstate_date'
                }
            }
        ]).exec();
        if (!delv) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(delv)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'error getting all separations' })
    }
}

exports.getSingleSeparation = async (req, res) => {
    try {
        const delv = await separationModel.aggregate([
            {
                $match: {
                    user_id: req.params.user_id
                }
            },
            {
                $lookup: {
                    from: 'usermodels',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $lookup: {
                    from: 'reasonmodels',
                    localField: 'id',
                    foreignField: 'reason',
                    as: 'reason'
                }
            },
            {
                $unwind: '$reason'
            },
            {
                $project: {
                    createdBY_name: '$user.user_name',
                    reasonValue: '$reason.reason',
                    id: "$_id",
                    reason: '$reason',
                    remark: '$remark',
                    status: '$status',
                    user_id: '$user_id',
                    resignation_date: '$resignation_date',
                    last_working_date: '$last_working_date',
                    reinstate_date: '$reinstate_date'
                }
            }
        ]).exec();
        if (!delv) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(delv)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'error getting single separation details' })
    }
}

exports.updateSeparation = async (req, res) => {
    try {
        const editsim = await separationModel.findOneAndUpdate({ id: req.body.id }, {
            user_id: req.body.user_id,
            status: req.body.status,
            resignation_date: req.body.resignation_date,
            last_working_day: req.body.last_working_day,
            remark: req.body.remark,
            reason: req.body.reason,
            reinstate_date: req.body.reinstate_date
        }, { new: true })
        if (!editsim) {
            res.status(500).send({ success: false })
        }
        res.status(200).send({ success: true, data: editsim })
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error updating user separation' })
    }
};

exports.sendMailAllWfoUser = async (req, res) => {
    try {
        const { subject, text } = req.body;
        const attachment = req.file;

        const templatePath = path.join(__dirname, "template2.ejs");
        const template = await fs.promises.readFile(templatePath, "utf-8");

        const results = await userModel.find({ job_type: 'WFO' })

        results.forEach((user) => {
            const userName = user.user_name;
            const emailId = user.user_email_id;

            const html = ejs.render(template, {
                emailId,
                userName,
                text,
            });

            let mailTransporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: constant.EMAIL_ID,
                    pass: constant.EMAIL_PASS,
                },
            });

            let mailOptions = {
                from: constant.EMAIL_ID,
                to: emailId,
                subject: subject,
                html: html,
                attachments: attachment
                    ? [
                        {
                            filename: attachment.originalname,
                            path: attachment.path,
                        },
                    ]
                    : [],
            };

            mailTransporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return error;
                } else {
                    res.send("Email sent successfully to:", emailId);
                }
            });
        })
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error sending email' })
    }
}

exports.getAllWfhUsers = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        // const simc = await userModel.find({ job_type: 'WFHD' }).lean();
        const simc = await userModel.aggregate([
            {
                $match: { job_type: 'WFHD' }
            },
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
                $project: {
                    user_id: "$user_id",
                    user_name: "$user_name",
                    // offer_later_status: "$offer_later_status",
                    user_designation: "$user_designation",
                    desi_name: "$designation.desi_name",
                    user_email_id: "$user_email_id",
                    user_login_id: "$user_login_id",
                    user_login_password: "$user_login_password",
                    // user_report_to_id: "$user_report_to_id",
                    // created_At: "$created_At",
                    // last_updated: "$lastupdated",
                    created_by: "$created_by",
                    user_contact_no: "$user_contact_no",
                    dept_id: "$dept_id",
                    dept_name: "$department.dept_name",
                    // location_id: "$location_id",
                    role_id: "$role_id",
                    // sitting_id: "$sitting_id",
                    image: "$image",
                    job_type: "$job_type",
                    att_status: "$att_status",
                    PersonalNumber: "$PersonalNumber",
                    Report_L1: "$Report_L1",
                    // Report_L2: "$Report_L2",
                    // Report_L3: "$Report_L3",
                    PersonalEmail: "$PersonalEmail",
                    level: "$level",
                    joining_date: "$joining_date",
                    // releaving_date: "$releaving_date",
                    // room_id: "$room_id",
                    // UID: "$UID",
                    // pan: "$pan",
                    // highest_upload: "$highest_upload",
                    // other_upload: "$other_upload",
                    salary: "$salary",
                    // SpokenLanguages: "$SpokenLanguages",
                    Gender: "$Gender",
                    att_status: "$att_status",
                    Nationality: "$Nationality",
                    DOB: "$DOB",
                    Age: "$Age",
                    // fatherName: "$fatherName",
                    // motherName: "$motherName",
                    // Hobbies: "$Hobbies",
                    // BloodGroup: "$BloodGroup",
                    // MartialStatus: "$MartialStatus",
                    // DateOfMarriage: "$DateOfMarriage",
                    onboard_status: "$onboard_status",
                    tbs_applicable: "$tds_applicable",
                    tds_per: "$tds_per",
                    current_address: "$current_address",
                    current_city: "$current_city",
                    current_state: "$current_state",
                    current_pin_code: "$current_pin_code",
                    // image_remark: "$image_remark",
                    // image_validate: "$image_validate",
                    // uid_remark: "$uid_remark",
                    // uid_validate: "$uid_validate",
                    // pan_remark: "$pan_remark",
                    // pan_validate: "$pan_validate",
                    // highest_upload_remark: "$highest_upload_remark",
                    // highest_upload_validate: "$highest_upload_validate",
                    // other_upload_remark: "$other_upload_remark",
                    // other_upload_validate: "$other_upload_validate",
                    user_status: "$user_status",
                    sub_dept_id: "$sub_dept_id",
                    pan_no: "$pan_no",
                    uid_no: "$uid_no",
                    // spouse_name: "$spouse_name",
                    // current_address: "$current_address",
                    // current_city: "$current_city",
                    // current_state: "$current_state",
                    // current_pin_code: "$current_pin_code",
                    permanent_address: "$permanent_address",
                    permanent_city: "$permanent_city",
                    permanent_state: "$permanent_state",
                    permanent_pin_code: "$permanent_pin_code",
                    // joining_date_extend: "$joining_date_extend",
                    // joining_date_extend_status: "$joining_date_extend_status",
                    // joining_date_extend_reason: "$joining_date_extend_reason",
                    // joining_date_reject_reason: "$joining_date_reject_reason",
                    // joining_extend_document: "$joining_extend_document",
                    invoice_template_no: "$invoice_template_no",
                    userSalaryStatus: "$userSalaryStatus",
                    digital_signature_image: {
                        $concat: [imageUrl, "$digital_signature_image"],
                    },
                    department_name: "$department.dept_name",
                    Role_name: "$role.Role_name",
                    report: "$reportTo.user_name",
                    designation_name: "$designation.desi_name",
                    userSalaryStatus: '$userSalaryStatus',
                    digital_signature_image: "$digital_signature_image",
                    bank_name: "$bank_name",
                    ifsc_code: "$ifsc_code",
                    account_no: "$account_no",
                    // guardian_name: "$guardian_name",
                    // guardian_address: "$guardian_address",
                    // relation_with_guardian: "$relation_with_guardian",
                    // gaurdian_number: "$gaurdian_number",
                    emergency_contact1: "$emergency_contact1",
                    emergency_contact2: "$emergency_contact2",
                    ctc: "$ctc",
                    // offer_letter_send: "$offer_letter_send",
                    // annexure_pdf: "$annexure_pdf",
                    // profileflag: "$profileflag",
                    // nick_name: "$nick_name",
                    // showOnboardingModal: "$showOnboardingModal",
                    // coc_flag: "$coc_flag",
                    // latitude: "$latitude",
                    // longitude: "$longitude",
                    beneficiary: "$beneficiary",
                    emp_id: "$emp_id",
                    alternate_contact: "$alternate_contact",
                    // cast_type: "$cast_type",
                    emergency_contact_person_name1: "$emergency_contact_person_name1",
                    // emergency_contact_person_name2: "$emergency_contact_person_name2",
                    emergency_contact_relation1: "$emergency_contact_relation1",
                    // emergency_contact_relation2: "$emergency_contact_relation2",
                    // document_percentage_mandatory: "$document_percentage_mandatory",
                    // document_percentage_non_mandatory: "$document_percentage_non_mandatory",
                    image: {
                        $concat: [imageUrl, "$image"],
                    }
                }
            }
        ]).exec();

        if (simc.length === 0) {
            res.status(500).send({ success: false, message: "No record found" })
        }

        // const fieldsToCheck = [
        //     'user_name', 'PersonalEmail', 'PersonalNumber', 'fatherName', 'Gender', 'motherName',
        //     'Hobbies', 'BloodGroup', 'SpokenLanguage', 'DO', 'Nationality', 'guardian_name',
        //     'guardian_contact', 'emergency_contact', 'guardian_address', 'relation_with_guardian',
        //     'current_address', 'current_city', 'current_state', 'current_pin_code',
        //     'permanent_address', 'permanent_city', 'permanent_state', 'permanent_pin_code',
        // ];

        // const modifiedUsers = simc.map(user => {
        //     const filledFields = fieldsToCheck.filter(field => user[field] !== null && user[field] !== undefined && user[field] !== '').length;
        //     const percentageFilled = (filledFields / fieldsToCheck.length) * 100;
        //     const percentage = percentageFilled.toFixed(2);

        //     if (user.hasOwnProperty('lastupdated')) {
        //         user.last_updated = user.lastupdated;
        //         delete user.lastupdated;
        //     }
        //     if (user.hasOwnProperty('tds_applicable')) {
        //         user.tbs_applicable = user.tds_applicable;
        //         delete user.tds_applicable;
        //     }

        //     user.profile_status = percentage;
        //     return user;
        // });
        res.status(200).send({ data: simc })
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error getting all wfh users' })
    }
};


exports.loginUserData = async (req, res) => {
    const id = req.body.user_id;
    try {
        const user = await userModel.findOne({ user_id: id });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userObject = {
            user_id: user.user_id,
            user_name: user.user_name,
            user_designation: user.user_designation,
        };

        if (user.image) {
            userObject.image = `${vari.IMAGE_URL}${user.image}`;
        } else {
            userObject.image = null;
        }

        res.status(200).json([userObject]);
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error getting loginuserdata' })
    }
};

exports.forgotPass = async (req, res) => {
    const email = req.body.user_email_id;
    try {
        const user = await userModel.findOne({ user_email_id: email }, 'user_login_password');
        if (!user) {
            return res.status(200).json({ message: "User not found with this email id." });
        }

        const getRandomPassword = helper.generateRandomPassword();

        const encryptedPass = await bcrypt.hash(getRandomPassword, 10);

        const updatePass = await userModel.findOneAndUpdate({ user_email_id: req.body.user_email_id }, {
            user_login_password: encryptedPass
        });

        const templatePath = path.join(__dirname, "forgotemailtemp.ejs");
        const template = await fs.promises.readFile(templatePath, "utf-8");
        const html = ejs.render(template, {
            email,
            password: getRandomPassword
        });

        /* dynamic email temp code start */
        // let contentList = await emailTempModel.findOne({ email_for_id: '65be3461ad52cfd11fa27e54', send_email: true })

        // const filledEmailContent = contentList.email_content
        //     .replace("{{user_email}}", email)
        //     .replace("{{user_password}}", getRandomPassword);

        // const html = filledEmailContent;
        /* dynamic email temp code end */

        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "Reset@creativefuel.io",
                pass: "vjhjvgdvulxaqgbq",
            },
        });

        let mailOptions = {
            from: "Reset@creativefuel.io",
            to: email,
            // subject: contentList.email_sub,
            subject: "Forgot Password",
            html: html,
        };

        await transport.sendMail(mailOptions);
        return res.status(200).send({ message: 'Successfully Sent email.' })
    } catch (err) {
        return res.status(500).send({ error: err.message, message: 'Error Sending Mail' })
    }
};

exports.getLoginHistory = async (req, res) => {
    try {
        // const loginHistory = await userLoginHisModel.find({});
        const loginHistory = await userLoginHisModel.aggregate([
            {
                $lookup: {
                    from: 'usermodels',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: "$user",
                }
            },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    user_name: "$user.user_name",
                    user_email_id: 1,
                    login_date: 1,
                    duration: 1,
                    log_out_date: 1
                }
            }
        ]).sort({ user_id: -1 });
        res.status(200).send({ data: loginHistory });
    } catch (error) {
        res.status(500).send({ error: error.message, sms: "Error getting user login history" });
    }
}

exports.getAllFirstLoginUsers = async (req, res) => {
    try {
        const delv = await userModel.find({ notify_hr: true })
        if (!delv) {
            res.status(500).send({ success: false })
        }
        res.status(200).send({ results: delv })
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'error getting all user who logged in first time' })
    }
}

exports.logOut = async (req, res) => {
    try {
        const { user_id } = req.body
        const userLoginHistory = await userLoginHisModel.findOne({ user_id: user_id }, 'login_date');
        if (!userLoginHistory) {
            return response.returnFalse(200, req, res, "No record found for this user in login history", {})
        }
        const timestamp = Date.parse(userLoginHistory?.login_date);
        let formatedLoginTime = Math.floor(timestamp / 1000)
        let formatedCurrentTime = Math.floor(Date.now() / 1000)

        let diffInSecound = formatedCurrentTime - formatedLoginTime

        let updateLoginHistoryData = await userLoginHisModel.findOneAndUpdate({ user_id: user_id },
            {
                $set: {
                    duration: diffInSecound,
                    log_out_date: Date.now()
                }
            },
            {
                new: true
            })
        if (!updateLoginHistoryData) {
            return response.returnTrue(200, req, res, "Something went wrong no login history found.", {})
        }
        return response.returnTrue(200, req, res, "Successfully capture login duration time", updateLoginHistoryData)
    } catch (error) {
        return response.returnTrue(500, req, res, "Internal Server Error", {})
    }
}

exports.getUserPresitting = async (req, res) => {
    try {
        const userId = req.body.user_id;

        const sittingIds = await OrderRequest
            .find({ User_id: userId })
            .sort({ Sitting_id: -1 })
            .limit(5)
            .distinct('Sitting_id')
            .exec();

        if (!sittingIds || sittingIds.length === 0) {
            return res.status(404).json({ message: "No order requests found" });
        }

        const sittingMastData = await Sitting
            .find({ sitting_id: { $in: sittingIds } })
            .exec();

        res.status(200).json(sittingMastData);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving order requests from the database" });
    }
};

exports.getAllUsersWithDoj = async (req, res) => {
    try {
        const currentDate = new Date();
        const currentDayMonth = currentDate.toISOString().slice(5, 10);

        const allUsers = await userModel.find().select({ user_id: 1, joining_date: 1, user_name: 1, image: 1, DOB: 1 });

        const filteredUsers = allUsers.map(user => {
            const userJoiningDate = user.joining_date?.toISOString().slice(5, 10);

            if (userJoiningDate === currentDayMonth) {
                const joiningYear = user.joining_date.getFullYear();
                const currentYear = currentDate.getFullYear();
                const totalYears = currentYear - joiningYear;
                if (totalYears >= 1) {
                    return {
                        user_id: user.user_id,
                        user_name: user.user_name,
                        joining_date: user.joining_date,
                        DOB: user.DOB,
                        image: user.image,
                        total_years: totalYears
                    };
                }
            }
            return null;
        }).filter(Boolean);

        res.json({ users: filteredUsers });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

exports.getAllUsersWithDoB = async (req, res) => {
    try {
        const currentDate = new Date();
        const currentDayMonth = currentDate.toISOString().slice(5, 10);

        const allUsers = await userModel.find().select({ user_id: 1, DOB: 1, user_name: 1, image: 1 });

        const filteredUsers = allUsers.map(user => {
            const userDOB = user.DOB?.toISOString().slice(5, 10);
            if (userDOB === currentDayMonth) {
                return {
                    user_id: user.user_id,
                    user_name: user.user_name,
                    DOB: user.DOB,
                    image: user.image
                };
            }

            return null;
        }).filter(Boolean);

        res.json({ users: filteredUsers });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

exports.getLastMonthUsers = async (req, res) => {
    try {
        const currentDate = new Date();

        const lastMonthStartDate = new Date(currentDate);
        lastMonthStartDate.setMonth(currentDate.getMonth() - 1);

        const usersFromLastMonth = await userModel.find({
            created_At: {
                $gte: lastMonthStartDate,
                $lt: currentDate,
            }
        }).select({ user_id: 1, user_name: 1, created_At: 1, joining_date: 1, image: 1 });

        res.json(usersFromLastMonth);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message, sms: 'Error getting users from last month' });
    }
}

exports.getAllFilledUsers = async (req, res) => {
    try {
        const userFields = Object.keys(userModel.schema.paths);

        const andConditions = userFields.map(field => ({ [field]: { $exists: true, $ne: null } }));

        const usersWithAllFieldsFilled = await userModel.find({
            $and: andConditions,
        });

        if (!usersWithAllFieldsFilled) {
            res.status(500).send({ success: false });
        }

        res.status(200).send({ results: usersWithAllFieldsFilled });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message, sms: 'Error getting users with all fields filled' });
    }
}

// exports.getFilledPercentage = async (req, res) => {
//     try {
//         const users = await userModel.find({ onboard_status: 2 }).select({
//             user_id: 1,
//             user_name: 1,
//             PersonalEmail: 1,
//             PersonalNumber: 1,
//             fatherName: 1,
//             Gender: 1,
//             motherName: 1,
//             Hobbies: 1,
//             BloodGroup: 1,
//             SpokenLanguage: 1,
//             DO: 1,
//             Nationality: 1,
//             guardian_name: 1,
//             guardian_contact: 1,
//             emergency_contact: 1,
//             guardian_address: 1,
//             relation_with_guardian: 1,
//             current_address: 1,
//             current_city: 1,
//             current_state: 1,
//             current_pin_code: 1,
//             permanent_address: 1,
//             permanent_city: 1,
//             permanent_state: 1,
//             permanent_pin_code: 1,
//             onboard_status: 1,
//             dept_name: 1,
//             desi_name: 1,
//         });

//         if (!users) {
//             return res.status(500).send({ success: false });
//         }

//         const resultArray = [];
//         const percentageResults = users.map(user => {
//             const filledFields = Object.values(user._doc).filter(value => value !== null && value !== "" && value !== 0).length;

//             const filledPercentage = (filledFields / 24) * 100;
//             const result = { user_id: user.user_id, filledPercentage: filledPercentage.toFixed(2) };

//             resultArray.push(result);

//             return result;
//         });

//         const incompleteUsers = resultArray.filter(result => parseFloat(result.filledPercentage) < 100);
//         const incompleteUsersDetails = incompleteUsers.map(incompleteUser => {
//             const userDetail = users.find(user => user.user_id === incompleteUser.user_id);
//             return { ...userDetail._doc, filledPercentage: incompleteUser.filledPercentage };
//         });

//         res.status(200).send({ incompleteUsersDetails });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send({ error: err.message, sms: 'Error calculating filled percentage' });
//     }
// }  

exports.getFilledPercentage = async (req, res) => {
    try {
        const users = await userModel.find({ onboard_status: 2 }).select({
            user_id: 1,
            user_name: 1,
            PersonalEmail: 1,
            PersonalNumber: 1,
            fatherName: 1,
            Gender: 1,
            motherName: 1,
            Hobbies: 1,
            BloodGroup: 1,
            SpokenLanguage: 1,
            DO: 1,
            Nationality: 1,
            guardian_name: 1,
            guardian_contact: 1,
            emergency_contact: 1,
            guardian_address: 1,
            relation_with_guardian: 1,
            current_address: 1,
            current_city: 1,
            current_state: 1,
            current_pin_code: 1,
            permanent_address: 1,
            permanent_city: 1,
            permanent_state: 1,
            permanent_pin_code: 1,
            onboard_status: 1,
            dept_id: 1,
            user_designation: 1,
        });

        if (!users) {
            return res.status(500).send({ success: false });
        }

        const resultArray = [];
        const percentageResults = users.map(user => {
            const filledFields = Object.values(user._doc).filter(value => value !== null && value !== "" && value !== 0).length;

            const filledPercentage = (filledFields / 24) * 100;
            const result = { user_id: user.user_id, filledPercentage: filledPercentage.toFixed(2) };

            resultArray.push(result);

            return result;
        });

        const incompleteUsers = resultArray.filter(result => parseFloat(result.filledPercentage) < 100);
        const incompleteUsersDetails = await Promise.all(incompleteUsers.map(async incompleteUser => {
            const userDetail = await userModel.findOne({ user_id: incompleteUser.user_id }).select({});

            const deptDetail = await departmentModel.findOne({ dept_id: userDetail.dept_id }).select({
                dept_name: 1,
            });

            const desiDetail = await designationModel.findOne({ user_designation: userDetail.user_designation }).select({
                desi_name: 1,
            });

            return { ...userDetail._doc, filledPercentage: incompleteUser.filledPercentage, dept_name: deptDetail.dept_name, desi_name: desiDetail.desi_name };
        }));

        res.status(200).send({ incompleteUsersDetails });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message, sms: 'Error calculating filled percentage' });
    }
}

exports.getUserGraphData = async (req, res) => {
    try {
        let result;

        if (req.body.caseType == 'gender') {
            result = await userModel.aggregate([
                {
                    $group: {
                        _id: {
                            dept_id: "$dept_id",
                            gender: "$Gender",
                        },
                        count: { $sum: 1 },
                    },
                },
                {
                    $group: {
                        _id: "$_id.dept_id",
                        maleCount: {
                            $sum: {
                                $cond: [{ $eq: ["$_id.gender", "Male"] }, "$count", 0],
                            },
                        },
                        femaleCount: {
                            $sum: {
                                $cond: [{ $eq: ["$_id.gender", "Female"] }, "$count", 0],
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: "departmentmodels",
                        localField: "_id",
                        foreignField: "dept_id",
                        as: "department",
                    },
                },
                {
                    $unwind: {
                        path: "$department",
                        preserveNullAndEmptyArrays: true
                    },
                },
                {
                    $project: {
                        _id: 0,
                        dept_id: "$_id",
                        maleCount: 1,
                        dept_name: "$department.dept_name",
                        femaleCount: 1,
                    },
                },
            ]);
        } else if (req.body.caseType == 'job') {
            result = await userModel.aggregate([
                {
                    $group: {
                        _id: {
                            dept_id: "$dept_id",
                            job: "$job_type",
                        },
                        count: { $sum: 1 },
                    },
                },
                {
                    $group: {
                        _id: "$_id.dept_id",
                        wfhCount: {
                            $sum: {
                                $cond: [{ $eq: ["$_id.job", "WFHD"] }, "$count", 0],
                            },
                        },
                        wfoCount: {
                            $sum: {
                                $cond: [{ $eq: ["$_id.job", "WFO"] }, "$count", 0],
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: "departmentmodels",
                        localField: "_id",
                        foreignField: "dept_id",
                        as: "department",
                    },
                },
                {
                    $unwind: {
                        path: "$department",
                        preserveNullAndEmptyArrays: true
                    },
                },
                {
                    $project: {
                        _id: 0,
                        dept_id: "$_id",
                        wfhCount: 1,
                        dept_name: "$department.dept_name",
                        wfoCount: 1,
                    },
                },
            ]);
        } else if (req.body.caseType == 'year') {
            result = await userModel.aggregate([
                {
                    $addFields: {
                        convertedDate: { $toDate: "$joining_date" },
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$convertedDate" },
                        },
                        userjoined: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        year: "$_id.year",
                        userjoined: 1,
                    },
                },
            ]);
        } else if (req.body.caseType == 'experience') {
            result = await userModel.aggregate([
                {
                    $addFields: {
                        convertedDate: { $toDate: "$joining_date" },
                        experience: {
                            $divide: [
                                { $subtract: [new Date(), { $toDate: "$joining_date" }] },
                                31536000000,
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            years: {
                                $subtract: [
                                    { $floor: "$experience" },
                                    { $mod: [{ $floor: "$experience" }, 2] },
                                ],
                            },
                        },
                        userCounts: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        years: "$_id.years",
                        userCounts: 1,
                    },
                }
            ]);
        } else if (req.body.caseType == 'age') {
            result = await userModel.aggregate([
                {
                    $addFields: {
                        birthYear: { $year: { $toDate: "$DOB" } },
                        age: {
                            $subtract: [
                                { $year: new Date() },
                                { $year: { $toDate: "$DOB" } }
                            ]
                        }
                    },
                },
                {
                    $group: {
                        _id: {
                            ageGroup: {
                                $switch: {
                                    branches: [
                                        { case: { $and: [{ $gte: ["$age", 10] }, { $lte: ["$age", 17] }] }, then: "10-17" },
                                        { case: { $and: [{ $gte: ["$age", 18] }, { $lte: ["$age", 24] }] }, then: "18-24" },
                                        { case: { $and: [{ $gte: ["$age", 25] }, { $lte: ["$age", 30] }] }, then: "25-30" },
                                        { case: { $and: [{ $gte: ["$age", 31] }, { $lte: ["$age", 35] }] }, then: "31-35" },
                                        { case: { $and: [{ $gte: ["$age", 36] }, { $lte: ["$age", 40] }] }, then: "36-40" },
                                        { case: { $gte: ["$age", 41] }, then: "41+" }
                                    ],
                                    default: "Unknown"
                                }
                            }
                        },
                        userCount: { $sum: 1 },
                    },
                },
                {
                    $match: {
                        "_id.ageGroup": { $ne: "Unknown" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        age: "$_id.ageGroup",
                        userCount: 1,
                    },
                }
            ]);
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ error: err.message, sms: "Error creating user graph" });
    }
};

exports.getUserGraphDataOfWFHD = async (req, res) => {
    try {
        let result;

        if (req.body.caseType == 'department_wise') {
            result = await userModel.aggregate([
                {
                    $match: { job_type: "WFHD", user_status: "Active", att_status: "onboarded" }
                },
                {
                    $group: {
                        _id: {
                            dept_id: "$dept_id",
                            gender: "$Gender",
                        },
                        count: { $sum: 1 },
                    },
                },
                {
                    $group: {
                        _id: "$_id.dept_id",
                        maleCount: {
                            $sum: {
                                $cond: [{ $eq: ["$_id.gender", "Male"] }, "$count", 0],
                            },
                        },
                        femaleCount: {
                            $sum: {
                                $cond: [{ $eq: ["$_id.gender", "Female"] }, "$count", 0],
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: "departmentmodels",
                        localField: "_id",
                        foreignField: "dept_id",
                        as: "department",
                    },
                },
                {
                    $unwind: {
                        path: "$department",
                        preserveNullAndEmptyArrays: true
                    },
                },
                {
                    $project: {
                        _id: 0,
                        dept_id: "$_id",
                        maleCount: 1,
                        dept_name: "$department.dept_name",
                        femaleCount: 1,
                    },
                },
            ]).sort({ dept_id: 1 });
        }
        else if (req.body.caseType == 'year') {
            // result = await userModel.aggregate([
            //     {
            //         $match: { job_type: "WFHD", user_status: "Active", att_status: "onboarded" }
            //     },
            //     {
            //         $addFields: {
            //             convertedDate: { $toDate: "$joining_date" },
            //         },
            //     },
            //     {
            //         $group: {
            //             _id: {
            //                 month: { $month: "$convertedDate" },
            //             },
            //             userjoined: { $sum: 1 },
            //         },
            //     },
            //     {
            //         $project: {
            //             _id: 0,
            //             month: "$_id.month",
            //             userjoined: 1,
            //         },
            //     },
            // ]).sort({ year: 1 });

            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            const currentYear = new Date().getFullYear();

            const result = await userModel.aggregate([
                {
                    $match: {
                        job_type: "WFHD",
                        user_status: "Active",
                        att_status: "onboarded"
                    }
                },
                {
                    $addFields: {
                        convertedDate: { $toDate: "$joining_date" },
                        joiningYear: { $year: { $toDate: "$joining_date" } }
                    }
                },
                {
                    $match: {
                        joiningYear: currentYear
                    }
                },
                {
                    $group: {
                        _id: {
                            month: { $month: "$convertedDate" }
                        },
                        userjoined: { $sum: 1 }
                    }
                },
                {
                    $addFields: {
                        monthName: { $arrayElemAt: [monthNames, { $subtract: ["$_id.month", 1] }] }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        month: "$_id.month",
                        monthName: 1,
                        userjoined: 1
                    }
                },
            ])
                .sort({ month: 1 });

            return res.send(result);
        }
        else if (req.body.caseType == 'age') {
            result = await userModel.aggregate([
                {
                    $match: { job_type: "WFHD", user_status: "Active", att_status: "onboarded" }
                },
                {
                    $addFields: {
                        birthYear: { $year: { $toDate: "$DOB" } },
                        age: {
                            $subtract: [
                                { $year: new Date() },
                                { $year: { $toDate: "$DOB" } }
                            ]
                        }
                    },
                },
                {
                    $group: {
                        _id: {
                            ageGroup: {
                                $switch: {
                                    branches: [
                                        { case: { $and: [{ $gte: ["$age", 10] }, { $lte: ["$age", 17] }] }, then: "10-17" },
                                        { case: { $and: [{ $gte: ["$age", 18] }, { $lte: ["$age", 24] }] }, then: "18-24" },
                                        { case: { $and: [{ $gte: ["$age", 25] }, { $lte: ["$age", 30] }] }, then: "25-30" },
                                        { case: { $and: [{ $gte: ["$age", 31] }, { $lte: ["$age", 35] }] }, then: "31-35" },
                                        { case: { $and: [{ $gte: ["$age", 36] }, { $lte: ["$age", 40] }] }, then: "36-40" },
                                        { case: { $gte: ["$age", 41] }, then: "41+" }
                                    ],
                                    default: "Unknown"
                                }
                            }
                        },
                        userCount: { $sum: 1 },
                    },
                },
                {
                    $match: {
                        "_id.ageGroup": { $ne: "Unknown" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        age: "$_id.ageGroup",
                        userCount: 1,
                    },
                }
            ]).sort({ age: 1 });
        }
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ error: err.message, sms: "Error creating user graph" });
    }
};

exports.getUsersWithStatus = async (req, res) => {
    try {
        const WFOUsers = await userModel.find({ job_type: "WFO" });
        const CountWFOUsers = WFOUsers.length;

        const responseData = {
            count: CountWFOUsers,
            users: WFOUsers
        };

        res.status(200).json(responseData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message, sms: 'Error getting users from last month' });
    }
}

exports.getAllUsersWithObj = async (req, res) => {
    try {
        const users = await userModel.find({});
        const objects = await objectModel.find({});

        const maxAuthIdUserAuth = await userAuthModel.findOne({}, { auth_id: 1 }).sort({ auth_id: -1 });
        const maxAuthId = maxAuthIdUserAuth ? maxAuthIdUserAuth.auth_id + 1 : 1;

        const insertedObjects = [];

        for (const object of objects) {
            const insertedObject = await userAuthModel.create({
                Juser_id: object.user_id,
                obj_id: object.obj_id,
                insert: 0,
                view: 0,
                update: 0,
                delete_flag: 0,
                creation_date: "2024-01-29T12:23:18.931+00:00",
                created_by: 229,
                Last_updated_by: 0,
                Last_updated_date: "2024-01-29T12:23:18.931+00:00",
                auth_id: maxAuthId
            });
            insertedObjects.push(insertedObject);
        }

        const responseData = {
            insertedObjects: insertedObjects
        };

        res.status(200).json(responseData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message, sms: 'Error getting users from last month' });
    }
}

exports.getAllSalesUsers = async (req, res) => {
    try {
        const salesUsers = await userModel.find({ dept_id: 36 });
        if (!salesUsers) {
            return response.returnFalse(200, req, res, "No Reord Found...", []);
        }
        res.status(200).send(salesUsers)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.assignAllObjInUserAuth = async (req, res) => {
    try {
        const user = await userModel.findOne({ user_id: req.params.user_id });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const existingObjectIds = (await userAuthModel.find({ Juser_id: user.user_id })).map(obj => obj.obj_id);

        const objectData = await objModel.find();

        let objectsToInsert = [];
        for (const object of objectData) {
            if (!existingObjectIds.includes(object.obj_id)) {
                objectsToInsert.push(object);
            }
        }

        for (const object of objectsToInsert) {
            const userAuthDocument = {
                Juser_id: user.user_id,
                obj_id: object.obj_id,
                insert: 0,
                view: 0,
                update: 0,
                delete_flag: 0,
                creation_date: new Date(),
                created_by: user.created_by || 0,
                last_updated_by: user.created_by || 0,
                last_updated_date: new Date(),
            };

            await userAuthModel.create(userAuthDocument);
        }

        res.status(200).send("Objects inserted in userAuth Model");
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.checkLoginExist = async (req, res) => {
    try {
        const findData = await userModel.findOne({ user_login_id: req.body.user_login_id });
        if (findData) {
            return response.returnFalse(200, req, res, "login id not available", []);
        }
        return response.returnFalse(200, req, res, 'login id available', [])
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getAllUsersWithInvoiceNo = async (req, res) => {
    try {
        const findData = await userModel.aggregate([
            {
                $match: {
                    job_type: "WFHD"
                }
            },
            {
                $lookup: {
                    from: "departmentmodels",
                    localField: "dept_id",
                    foreignField: "dept_id",
                    as: "department"
                }
            },
            {
                $unwind: "$department"
            },
            {
                $lookup: {
                    from: "designationmodels",
                    localField: "user_designation",
                    foreignField: "desi_id",
                    as: "designation"
                }
            },
            {
                $unwind: "$designation"
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "Report_L1",
                    foreignField: "user_id",
                    as: "userData"
                }
            },
            {
                $unwind: "$userData"
            },
            {
                $group: {
                    _id: "$invoice_template_no",
                    count: { $sum: 1 },
                    users: {
                        $push: {
                            user_name: "$user_name",
                            dept_id: "$dept_id",
                            dept_name: "$department.dept_name",
                            desi_id: "$user_designation",
                            desi_name: "$designation.desi_name",
                            Report_L1: "$Report_L1",
                            ReportL1_N: "$userData.user_name"
                        }
                    },
                }
            }
        ]);
        if (!findData) {
            return response.returnFalse(200, req, res, "invoice_template_no is not available", []);
        }
        return response.returnTrue(200, req, res, findData)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getUsers = async (req, res) => {
    try {
        const findData = await userModel.find({ job_type: "WFHD", att_status: "onboarded" }).select({ user_id: 1, user_name: 1, dept_id: 1 });
        if (!findData) {
            return response.returnFalse(200, req, res, "login id available", []);
        }
        return response.returnTrue(200, req, res, 'login id not available', findData)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};


function monthNameToNumber(monthName) {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const monthIndex = months.findIndex(
        (m) => m.toLowerCase() === monthName.toLowerCase()
    );

    // Adding 1 because months are zero-indexed in JavaScript (0-11)
    return monthIndex !== -1 ? monthIndex + 1 : null;
}


exports.getAllUsersCountsWithJoiningDate = async (req, res) => {
    try {
        let month = req.body.month;
        let year = req.body.year;
        let deptId = req.body.dept_id;

        const monthNumber = monthNameToNumber(month);
        const joiningMonth = String(monthNumber).padStart(2, "0");

        const bodyMonthYear = `${year}${joiningMonth}`;

        const users = await userModel.find({
            dept_id: deptId,
            user_status: 'Active',
            att_status: 'onboarded'
        }, { joining_date: 1 });

        const usersCount = users.filter(user => {
            const userJoiningDate = new Date(user.joining_date);
            const userMonthYear = userJoiningDate.getFullYear().toString() +
                String(userJoiningDate.getMonth() + 1).padStart(2, '0');
            return userMonthYear <= bodyMonthYear;
        }).length;

        return response.returnTrue(200, req, res, { count: usersCount });
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};


exports.getAllWithDigitalSignatureImageUsers = async (req, res) => {
    try {
        const allData = await userModel.aggregate([
            {
                $match: {
                    job_type: "WFHD",
                    digital_signature_image: ""
                }
            },
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
                    user_id: 1,
                    user_name: 1,
                    dept_id: 1,
                    dept_name: "$department.dept_name"
                }
            }
        ]);

        if (!allData) {
            return response.returnFalse(200, req, res, "No Data Found", []);
        }
        return response.returnTrue(200, req, res, "all Data Fetched Successfully", allData)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};


exports.rejoinUser = async (req, res) => {
    try {
        const user = await userModel.findOne({ user_id: req.body.user_id }).select({ job_type: 1 });

        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }

        const jobType = user.job_type;
        const userData = await userModel.findOneAndUpdate(
            { user_id: req.body.user_id },
            {
                user_status: "Active",
                joining_date: req.body.joining_date,
                att_status: jobType === 'WFHD' ? "onboarded" : ""
            },
            { new: true }
        );

        if (!userData) {
            return res.status(404).send({ success: false, message: "User update failed" });
        }

        res.status(200).send({ success: true, data: userData });
    } catch (err) {
        return res.status(500).send({
            error: err.message,
            message: "Error in user rejoin",
        });
    }
};


exports.getUserTimeLine = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const userData = await userModel.findOne({ user_id: userId });
        if (!userData) {
            return res.status(404).json({ error: "User not found!" });
        }

        const joiningDate = new Date(userData.joining_date);
        const DOB = userData.DOB;
        if (!joiningDate) {
            return res.status(400).json({ error: "Joining date not found for the user" });
        }

        const probationEndDate = new Date(joiningDate);
        probationEndDate.setMonth(probationEndDate.getMonth() + 6);

        const today = new Date();
        const yearsOfWork = today.getFullYear() - joiningDate.getFullYear();

        let nextAnniversaryDate = new Date(today.getFullYear(), joiningDate.getMonth(), joiningDate.getDate());
        // if (today.getFullYear() === nextAnniversaryDate.getFullYear()) {
        //     nextAnniversaryDate = new Date(today.getFullYear(), joiningDate.getMonth(), joiningDate.getDate());
        // }

        const formattedJoiningDate = `${nextAnniversaryDate.getFullYear()}-${(joiningDate.getMonth() + 1).toString().padStart(2, '0')}-${joiningDate.getDate().toString().padStart(2, '0')}`;

        return res.status(200).json({
            status: 200,
            message: "User timeline data fetched successfully!",
            joiningDate: joiningDate,
            DOB: DOB,
            probationEndDate: probationEndDate,
            probationMonthValue: "6 Months",
            workAnniversaryYears: {
                Date: formattedJoiningDate,
                Work_Anniversary_Years: yearsOfWork < 1 ? "0 year" : `${yearsOfWork} years`
            }
        });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.l1l2l3UsersByDept = async (req, res) => {
    const dept_id = req.body.dept_id;
    try {
        const allData = await userModel.aggregate([
            {
                $match: {
                    dept_id: dept_id
                }
            },
            {
                $lookup: {
                    from: "designationmodels",
                    localField: "user_designation",
                    foreignField: "desi_id",
                    as: "designation"
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
                    from: "usermodels",
                    localField: "user_id",
                    foreignField: "Report_L1",
                    as: "Report_L1N"
                }
            },
            {
                $unwind: {
                    path: "$Report_L1N",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "user_id",
                    foreignField: "Report_L2",
                    as: "Report_L2N"
                }
            },
            {
                $unwind: {
                    path: "$Report_L2N",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "user_id",
                    foreignField: "Report_L3",
                    as: "Report_L3N"
                }
            },
            {
                $unwind: {
                    path: "$Report_L3N",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    user_id: 1,
                    user_name: 1,
                    dept_id: 1,
                    Report_L1: 1,
                    Report_L1N: "$Report_L1N.user_name",
                    Report_L2: 1,
                    Report_L2N: "$Report_L2N.user_name",
                    Report_L3: 1,
                    Report_L3N: "$Report_L3N.user_name",
                    dept_name: "$department.dept_name"
                }
            },
            {
                $group: {
                    _id: "$user_id",
                    data: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: {
                    newRoot: "$data"
                }
            }
        ]);
        res.send({ data: allData });
    } catch (error) {
        return res.status(500).send({
            error: error.message,
            message: "Error in user rejoin",
        });
    }
}


exports.reportl1UsersData = async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const imageUrl = vari.IMAGE_URL;
        const allData = await userModel.aggregate([{
            $match: {
                Report_L1: userId
            }
        }, {
            $lookup: {
                from: "usermodels",
                localField: "Report_L1",
                foreignField: "user_id",
                as: "Report_L1N"
            }
        }, {
            $unwind: {
                path: "$Report_L1N",
                preserveNullAndEmptyArrays: true
            }
        }, {
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
                from: "designationmodels",
                localField: "user_designation",
                foreignField: "desi_id",
                as: "designation"
            }
        },
        {
            $unwind: {
                path: "$designation",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                user_id: 1,
                emp_id: 1,
                image_url: 1,
                image: 1,
                user_status: 1,
                user_login_id: 1,
                user_contact_no: 1,
                dept_id: 1,
                job_type: 1,
                document_percentage: 1,
                user_designation: 1,
                user_email_id: 1,
                user_name: 1,
                Report_L1: 1,
                att_status: 1,
                department_name: "$department.dept_name",
                designation_name: "$designation.desi_name",
                image_url: {
                    $concat: [imageUrl, "$image_url"],
                },
                image: {
                    $concat: [imageUrl, "$image"],
                },
                Report_L1N: {
                    $cond: {
                        if: { $eq: ["$Report_L1N.user_id", userId] },
                        then: "$Report_L1N.user_name",
                        else: "$user_name"
                    }
                }
            }
        }
        ]);
        if (allData.length === 0) {
            return res.status(404).send({
                message: "No data found for the provided criteria."
            });
        }
        return res.status(200).json({
            status: 200,
            message: "Report_l1 users data successfully!",
            data: allData
        });
    } catch (error) {
        return res.status(500).send({
            error: error.message,
            message: "Error in user rejoin",
        });
    }
}


exports.userHierarchy = async (req, res) => {
    const dept_id = parseInt(req.params.id);

    try {
        const allData = await userModel.aggregate([{
            $match: {
                dept_id: parseInt(dept_id)
            }
        }, {
            $lookup: {
                from: "usermodels",
                localField: "Report_L1",
                foreignField: "user_id",
                as: "Report_L1N"
            }
        }, {
            $unwind: {
                path: "$Report_L1N",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: 'departmentmodels',
                localField: 'dept_id',
                foreignField: 'dept_id',
                as: 'department'
            }
        }, {
            $unwind: {
                path: "$department",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $group: {
                _id: "$_id",
                // data: { $first: "$$ROOT" },
                Report_L1: { $first: '$Report_L1' },
                Report_L1N: { $first: '$Report_L1N.user_name' },
                user_id: { $first: '$user_id' },
                user_name: { $first: '$user_name' },
                department_name: { $first: '$department.dept_name' },
            }
        }]);
        return res.status(200).json({
            status: 200,
            message: `Report_l1 users data for department ${dept_id} successfully!`,
            data: allData
        });
    } catch (error) {
        console.log("error-------------------------------------------->", error)
        return res.status(500).send({
            error: error.message,
            message: "Error in user rejoin",
        });
    }
}

exports.getAllUsersWithRole = async (req, res) => {
    try {
        const usersData = await userModel.aggregate([
            {
                $group: {
                    _id: "$role_id",
                    count: { $sum: 1 },
                    users: { $push: "$$ROOT" }
                }
            }
        ]);
        return response.returnTrue(200, req, res, { usersData });
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};


exports.ImagetoBase64 = async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ error: 'Missing imageUrl in request body' });
        }

        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        if (response.status !== 200) {
            return res.status(400).json({ error: 'Failed to fetch image' });
        }

        const buffer = Buffer.from(response.data, 'binary');
        const base64String = buffer.toString('base64');

        res.json({ base64String });
    } catch (error) {
        console.error("Error converting image to base64:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


exports.downloadOfferLeterInBucket = async (req, res) => {
    try {
        const bucketName = vari.BUCKET_NAME;
        const bucket = storage.bucket(bucketName);
        const blob = bucket.file(req.params.filename);
        const blobStream = blob.createReadStream();

        blobStream.on('error', (err) => {
            console.error("Error reading file from bucket:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        });

        res.setHeader('Content-Type', 'application/pdf');
        blobStream.pipe(res);
    } catch (error) {
        console.error("Error converting image to base64:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


exports.sendOfferLetter = async (req, res) => {
    try {
        const email = req.body.email;
        const bucketName = vari.BUCKET_NAME;
        const bucket = storage.bucket(bucketName);
        const blob = bucket.file(req.file.originalname);
        const blobStream = blob.createWriteStream();
        blobStream.on('error', (err) => {
            console.error("Error uploading offer letter to bucket:", err);
            return res.status(500).json({ error: 'Internal Server Error' });
        });
        blobStream.on('finish', () => {
            let mailTransporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: constant.EMAIL_ID,
                    pass: constant.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: constant.EMAIL_ID,
                to: email,
                subject: 'Offer Letter',
                text: 'Please find attached the offer letter.',
                attachments: [
                    {
                        filename: req.file.originalname,
                    }
                ]
            };
            mailTransporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                console.log('Email sent:', info.response);
                return res.status(200).send('Offer letter sent successfully.');
            });
        });
        blobStream.end(req.file.buffer);
    } catch (error) {
        console.error("Error sending offer letter:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.sendOfferLetterMail = async (req, res) => {
    try {
        const attachment = req.file;
        const email = req.body.email_id;
        const userId = +req.body.user_id;
        const userData = await userModel.findOne({ user_id: userId }).select({ user_name: 1, emergency_contact_relation1: 1 });
        const userName = userData.user_name;

        const templatePath = path.join(__dirname, "offerlettertemplate.ejs");
        const template = await fs.promises.readFile(templatePath, "utf-8");
        const html = ejs.render(template, { userName });
        //we are using emergency_contact_relation1 as email send status
        if (userId && userData && userData.emergency_contact_relation1 === 'false') {
            const mailTransporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: constant.EMAIL_ID,
                    pass: constant.EMAIL_PASS,
                },
            });
            const mailOptions = {
                from: constant.EMAIL_ID,
                to: [email, constant.EMAIL_ID],
                subject: "Your Offer Letter Inside from Creativefuel!!",
                html: html,
                attachments: attachment
                    ? [
                        {
                            filename: attachment.originalname,
                            path: attachment.path,
                        },
                    ]
                    : [],
            };
            mailTransporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error);
                    return;
                }
                console.log("Email sent:", info.response);
            });
            res.send("Email sending process initiated successfully");
            const edituserstatus = await userModel.findOneAndUpdate(
                { user_id: userId },
                {
                    emergency_contact_relation1: 'true'
                }
            )
        } else {
            res.send("Email already sent");
        }
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error initiating email sending process' });
    }
}

exports.getAllSalesUsersByDepartment = async (req, res) => {
    try {
        //sales department data id get
        const deptDetail = await departmentModel.findOne({
            $or: [{
                dept_name: "Sales"
            }, {
                dept_name: "sales"
            }]
        });

        //all sales users data get from the db collection
        const salesUsersDetails = await userModel.find({
            $or: [{
                dept_id: deptDetail.dept_id,
            }, {
                role_id: 1
            }]
        }, {
            user_name: 1,
            user_id: 1,
        });

        if (!salesUsersDetails) {
            return response.returnFalse(200, req, res, "No Reord Found...", []);
        }
        //send success response
        return res.status(200).send(salesUsersDetails)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.changeAllReportL1BySubDept = async (req, res) => {
    const { sub_dept_id, report_L1 } = req.body;

    if (!sub_dept_id || !report_L1) {
        return res.status(400).json({ message: 'sub_dept_id and report_L1 are required.' });
    }

    try {
        const result = await userModel.updateMany(
            { sub_dept_id: sub_dept_id },
            { $set: { Report_L1: parseInt(report_L1) } }
        );

        res.status(200).send({ success: true, data: result })
    } catch (err) {
        return res.status(500).send({
            error: err.message,
            message: "Error  in user report_L1",
        })
    }
}

function formatDate(dateString) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date(dateString);

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

exports.getAllWfhUsersWithDept = async (req, res) => {
    try {
        const simc = await userModel.aggregate([
            {
                $match: { job_type: 'WFHD', user_status: "Active", att_status: "onboarded" }
            },
            {
                $lookup: {
                    from: 'usermodels',
                    localField: 'Report_L1',
                    foreignField: 'user_id',
                    as: 'userData'
                }
            },
            {
                $unwind: {
                    path: "$userData",
                    preserveNullAndEmptyArrays: true
                }
            },
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
                $group: {
                    _id: {
                        dept_id: "$dept_id",
                        dept_name: "$department.dept_name"
                    },
                    user_count: { $sum: 1 },
                    Report_L1N: { $first: "$userData.user_name" }
                }
            },
            {
                $project: {
                    dept_id: "$_id.dept_id",
                    dept_name: "$_id.dept_name",
                    user_count: 1,
                    Report_L1N: 1,
                    _id: 0
                }
            }
        ]).sort({ dept_id: 1 });

        if (simc.length === 0) {
            return res.status(500).send({ success: false, message: "No record found" });
        }
        res.status(200).send({ data: simc });
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error getting all WFH users' });
    }
};

exports.getWorkAnniversarysForWFHDUsers = async (req, res) => {
    try {
        const currentMonth = new Date().getMonth() + 1;
        const currentDate = new Date();

        const users = await userModel.aggregate([
            {
                $match: { job_type: "WFHD", user_status: "Active", att_status: "onboarded" }
            },
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
                $addFields: {
                    joiningMonth: { $month: "$joining_date" }
                }
            },
            {
                $match: {
                    joiningMonth: currentMonth
                }
            },
            {
                $addFields: {
                    total_years: {
                        $subtract: [
                            { $year: currentDate },
                            { $year: "$joining_date" }
                        ]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    user_name: 1,
                    joining_date: 1,
                    dept_name: "$department.dept_name",
                    total_years: 1
                }
            }
        ]);

        users.forEach(user => {
            user.joining_date = formatDate(user.joining_date);
            user.total_years = `${user.total_years} ${user.total_years > 1 ? "Years" : "Year"}`
        });

        // Send the response
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}

exports.getBirthDaysForWFHDUsers = async (req, res) => {
    try {
        const currentMonth = new Date().getMonth() + 1;
        const currentDate = new Date();

        const users = await userModel.aggregate([
            {
                $match: { job_type: "WFHD", user_status: "Active", att_status: "onboarded" }
            },
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
                $addFields: {
                    joiningMonth: { $month: "$DOB" }
                }
            },
            {
                $match: {
                    joiningMonth: currentMonth,
                }
            },
            {
                $addFields: {
                    age: {
                        $subtract: [
                            { $year: currentDate },
                            { $year: "$DOB" }
                        ]
                    },
                    dayOfMonth: { $dayOfMonth: "$DOB" }
                }
            },
            {
                $sort: { dayOfMonth: 1 }
            },
            {
                $project: {
                    _id: 0,
                    user_name: 1,
                    DOB: 1,
                    dept_name: "$department.dept_name",
                    age: 1
                }
            }
        ]);

        users.forEach(user => {
            user.DOB = formatDate(user.DOB);
        });

        // Send the response
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}

exports.getNewJoineeOfWFHDUsers = async (req, res) => {
    try {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const users = await userModel.aggregate([
            {
                $match: { job_type: "WFHD", user_status: "Active", att_status: "onboarded" }
            },
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
                $addFields: {
                    joiningMonth: { $month: "$joining_date" },
                    joiningYear: { $year: "$joining_date" },
                    joiningDay: { $dayOfMonth: "$joining_date" }
                }
            },
            {
                $match: {
                    joiningMonth: currentMonth,
                    joiningYear: currentYear,
                    joiningDay: { $gte: 16 }
                }
            },
            {
                $project: {
                    _id: 0,
                    user_name: 1,
                    joining_date: 1,
                    dept_name: "$department.dept_name"
                }
            }
        ]);

        users.forEach(user => {
            user.joining_date = formatDate(user.joining_date);
        });

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}

exports.getNewExitOfWFHDUsers = async (req, res) => {
    try {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const users = await userModel.aggregate([
            {
                $match: { job_type: "WFHD", user_status: "Exit", att_status: "onboarded" }
            },
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
                $addFields: {
                    joiningMonth: { $month: "$releaving_date" },
                    joiningYear: { $year: "$releaving_date" },
                    joiningDay: { $dayOfMonth: "$releaving_date" }
                }
            },
            {
                $match: {
                    joiningMonth: currentMonth,
                    joiningYear: currentYear,
                    joiningDay: { $gte: 16 }
                }
            },
            {
                $project: {
                    _id: 0,
                    user_name: 1,
                    releaving_date: 1,
                    dept_name: "$department.dept_name"
                }
            }
        ]);

        users.forEach(user => {
            user.releaving_date = formatDate(user.releaving_date);
        });

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}

exports.getAllExitUsersOfWFHD = async (req, res) => {
    try {
        const allUsers = await userModel.aggregate([
            {
                $match: {
                    job_type: "WFHD",
                    user_status: "Exit",
                    att_status: "onboarded"
                }
            },
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
                    path: "$department"
                }
            },
            {
                $lookup: {
                    from: 'designationmodels',
                    localField: 'desi_id',
                    foreignField: 'user_designation',
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
                $project: {
                    user_id: 1,
                    user_name: 1,
                    Gender: 1,
                    DOB: 1,
                    dept_id: 1,
                    releaving_date: 1,
                    user_designation: 1,
                    dept_name: "$department.dept_name",
                    desi_name: "$designation.desi_name"
                }
            },
            {
                $group: {
                    _id: "$user_id",
                    doc: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: "$doc" }
            }
        ]);

        res.status(200).json({
            success: true,
            data: allUsers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}

exports.updateTraining = async (req, res) => {
    try {
        const editsim = await userModel.findOneAndUpdate({ user_id: req.body.user_id }, {
            att_status: req.body.att_status
        }, { new: true });

        if (!editsim) {
            return res.status(500).send({ success: false })
        }
        return res.status(200).send({ success: true, data: editsim })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}

exports.sendUserMailForJoiningDayExtension = async (req, res) => {
    try {
        const { user_email, name, joining_date, joining_date_extend, joining_date_extend_reason } = req.body;
        console.log("user_email", user_email);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: constant.EMAIL_ID,
                pass: constant.EMAIL_PASS,
            },
        });

        const templatePath = path.join(__dirname, "joiningdayextentemp.ejs");
        const template = await fs.promises.readFile(templatePath, "utf-8");
        const html = ejs.render(template, { name, joining_date, joining_date_extend, joining_date_extend_reason });

        let mailOptions = {
            from: `"${name} <${user_email}>" <${constant.EMAIL_ID}>`,
            to: constant.EMAIL_ID,
            subject: "Request for Joining Date Extension",
            html: html,
            replyTo: user_email,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                res.status(500).send({ error: 'Error sending email', sms: 'Error sending to email' });
            } else {
                console.log('Reminder email sent:', info.response);
                res.status(200).send({ message: 'Email sent successfully', info: info.response });
            }
        });
    } catch (error) {
        res.status(500).send({ error: error.message, sms: 'Error sending to email' });
    }
};

exports.getNewExitOfWFOUsers = async (req, res) => {
    try {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const users = await userModel.aggregate([
            {
                $match: { job_type: "WFO", user_status: "Exit" }
            },
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
                $addFields: {
                    joiningMonth: { $month: "$releaving_date" },
                    joiningYear: { $year: "$releaving_date" },
                    joiningDay: { $dayOfMonth: "$releaving_date" }
                }
            },
            {
                $match: {
                    joiningMonth: currentMonth,
                    joiningYear: currentYear,
                    joiningDay: { $gte: 16 }
                }
            },
            {
                $project: {
                    _id: 0,
                    user_name: 1,
                    releaving_date: 1,
                    dept_name: "$department.dept_name"
                }
            }
        ]);

        users.forEach(user => {
            user.releaving_date = formatDate(user.releaving_date);
        });

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}

exports.getAllWfOUsersWithDept = async (req, res) => {
    try {
        const simc = await userModel.aggregate([
            {
                $match: { job_type: 'WFO', user_status: "Active" }
            },
            {
                $lookup: {
                    from: 'usermodels',
                    localField: 'Report_L1',
                    foreignField: 'user_id',
                    as: 'userData'
                }
            },
            {
                $unwind: {
                    path: "$userData",
                    preserveNullAndEmptyArrays: true
                }
            },
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
                $group: {
                    _id: {
                        dept_id: "$dept_id",
                        dept_name: "$department.dept_name"
                    },
                    user_count: { $sum: 1 },
                    Report_L1N: { $first: "$userData.user_name" }
                }
            },
            {
                $project: {
                    dept_id: "$_id.dept_id",
                    dept_name: "$_id.dept_name",
                    user_count: 1,
                    Report_L1N: 1,
                    _id: 0
                }
            }
        ]).sort({ dept_id: 1 });

        if (simc.length === 0) {
            return res.status(500).send({ success: false, message: "No record found" });
        }
        res.status(200).send({ data: simc });
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error getting all WFH users' });
    }
};

exports.getBirthDaysForWFOUsers = async (req, res) => {
    try {
        const currentMonth = new Date().getMonth() + 1;
        const currentDate = new Date();

        const users = await userModel.aggregate([
            {
                $match: { job_type: "WFO", user_status: "Active" }
            },
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
                $addFields: {
                    joiningMonth: { $month: "$DOB" }
                }
            },
            {
                $match: {
                    joiningMonth: currentMonth,
                }
            },
            {
                $addFields: {
                    age: {
                        $subtract: [
                            { $year: currentDate },
                            { $year: "$DOB" }
                        ]
                    },
                    dayOfMonth: { $dayOfMonth: "$DOB" }
                }
            },
            {
                $sort: { dayOfMonth: 1 }
            },
            {
                $project: {
                    _id: 0,
                    user_name: 1,
                    DOB: 1,
                    dept_name: "$department.dept_name",
                    age: 1
                }
            }
        ]);

        users.forEach(user => {
            user.DOB = formatDate(user.DOB);
        });

        // Send the response
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}

exports.getWorkAnniversarysForWFOUsers = async (req, res) => {
    try {
        const currentMonth = new Date().getMonth() + 1;
        const currentDate = new Date();

        const users = await userModel.aggregate([
            {
                $match: { job_type: "WFO", user_status: "Active" }
            },
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
                $addFields: {
                    joiningMonth: { $month: "$joining_date" }
                }
            },
            {
                $match: {
                    joiningMonth: currentMonth
                }
            },
            {
                $addFields: {
                    total_years: {
                        $subtract: [
                            { $year: currentDate },
                            { $year: "$joining_date" }
                        ]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    user_id: 1,
                    user_name: 1,
                    joining_date: 1,
                    dept_name: "$department.dept_name",
                    total_years: 1
                }
            }
        ]);

        users.forEach(user => {
            user.joining_date = formatDate(user.joining_date);
            user.total_years = `${user.total_years} ${user.total_years > 1 ? "Years" : "Year"}`;
        });

        // Send the response
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}

exports.getNewJoineeOfWFOUsers = async (req, res) => {
    try {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const users = await userModel.aggregate([
            {
                $match: { job_type: "WFO", user_status: "Active" }
            },
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
                $addFields: {
                    joiningMonth: { $month: "$joining_date" },
                    joiningYear: { $year: "$joining_date" },
                    joiningDay: { $dayOfMonth: "$joining_date" }
                }
            },
            {
                $match: {
                    joiningMonth: currentMonth,
                    joiningYear: currentYear,
                    joiningDay: { $gte: 16 }
                }
            },
            {
                $project: {
                    _id: 0,
                    user_id: 1,
                    user_name: 1,
                    joining_date: 1,
                    dept_name: "$department.dept_name"
                }
            }
        ]);

        users.forEach(user => {
            user.joining_date = formatDate(user.joining_date);
        });

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}

exports.getUserGraphDataOfWFO = async (req, res) => {
    try {
        let result;

        if (req.body.caseType == 'department_wise') {
            result = await userModel.aggregate([
                {
                    $match: { job_type: "WFO", user_status: "Active" }
                },
                {
                    $group: {
                        _id: {
                            dept_id: "$dept_id",
                            gender: "$Gender",
                        },
                        count: { $sum: 1 },
                    },
                },
                {
                    $group: {
                        _id: "$_id.dept_id",
                        maleCount: {
                            $sum: {
                                $cond: [{ $eq: ["$_id.gender", "Male"] }, "$count", 0],
                            },
                        },
                        femaleCount: {
                            $sum: {
                                $cond: [{ $eq: ["$_id.gender", "Female"] }, "$count", 0],
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: "departmentmodels",
                        localField: "_id",
                        foreignField: "dept_id",
                        as: "department",
                    },
                },
                {
                    $unwind: {
                        path: "$department",
                        preserveNullAndEmptyArrays: true
                    },
                },
                {
                    $project: {
                        _id: 0,
                        dept_id: "$_id",
                        maleCount: 1,
                        dept_name: "$department.dept_name",
                        femaleCount: 1,
                    },
                },
            ]).sort({ dept_id: 1 });
        }
        else if (req.body.caseType == 'year') {
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            const currentYear = new Date().getFullYear();

            const result = await userModel.aggregate([
                {
                    $match: {
                        job_type: "WFO",
                        user_status: "Active"
                    }
                },
                {
                    $addFields: {
                        convertedDate: { $toDate: "$joining_date" },
                        joiningYear: { $year: { $toDate: "$joining_date" } }
                    }
                },
                {
                    $match: {
                        joiningYear: currentYear
                    }
                },
                {
                    $group: {
                        _id: {
                            month: { $month: "$convertedDate" }
                        },
                        userjoined: { $sum: 1 }
                    }
                },
                {
                    $addFields: {
                        monthName: { $arrayElemAt: [monthNames, { $subtract: ["$_id.month", 1] }] }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        month: "$_id.month",
                        monthName: 1,
                        userjoined: 1
                    }
                },
            ])
                .sort({ month: 1 });

            return res.send(result);
        }
        else if (req.body.caseType == 'age') {
            result = await userModel.aggregate([
                {
                    $match: { job_type: "WFO", user_status: "Active" }
                },
                {
                    $addFields: {
                        birthYear: { $year: { $toDate: "$DOB" } },
                        age: {
                            $subtract: [
                                { $year: new Date() },
                                { $year: { $toDate: "$DOB" } }
                            ]
                        }
                    },
                },
                {
                    $group: {
                        _id: {
                            ageGroup: {
                                $switch: {
                                    branches: [
                                        { case: { $and: [{ $gte: ["$age", 10] }, { $lte: ["$age", 17] }] }, then: "10-17" },
                                        { case: { $and: [{ $gte: ["$age", 18] }, { $lte: ["$age", 24] }] }, then: "18-24" },
                                        { case: { $and: [{ $gte: ["$age", 25] }, { $lte: ["$age", 30] }] }, then: "25-30" },
                                        { case: { $and: [{ $gte: ["$age", 31] }, { $lte: ["$age", 35] }] }, then: "31-35" },
                                        { case: { $and: [{ $gte: ["$age", 36] }, { $lte: ["$age", 40] }] }, then: "36-40" },
                                        { case: { $gte: ["$age", 41] }, then: "41+" }
                                    ],
                                    default: "Unknown"
                                }
                            }
                        },
                        userCount: { $sum: 1 },
                    },
                },
                {
                    $match: {
                        "_id.ageGroup": { $ne: "Unknown" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        age: "$_id.ageGroup",
                        userCount: 1,
                    },
                }
            ]).sort({ age: 1 });
        }
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ error: err.message, sms: "Error creating user graph" });
    }
};

exports.getAllExitUsersOfWFO = async (req, res) => {
    try {
        const allUsers = await userModel.aggregate([
            {
                $match: {
                    job_type: "WFO",
                    user_status: "Exit"
                }
            },
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
                    path: "$department"
                }
            },
            {
                $lookup: {
                    from: 'designationmodels',
                    localField: 'desi_id',
                    foreignField: 'user_designation',
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
                $project: {
                    user_id: 1,
                    user_name: 1,
                    Gender: 1,
                    DOB: 1,
                    dept_id: 1,
                    releaving_date: 1,
                    user_designation: 1,
                    dept_name: "$department.dept_name",
                    desi_name: "$designation.desi_name"
                }
            },
            {
                $group: {
                    _id: "$user_id",
                    doc: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: "$doc" }
            }
        ]);

        res.status(200).json({
            success: true,
            data: allUsers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}

exports.changeUserFromWFHDToWFO = async (req, res) => {
    try {
        const { user_id, onboard_status, offer_letter_send, joining_date, emergency_contact_person_name2, current_address, current_city, current_state, current_pin_code, job_type } = req.body;

        const userData = await userModel.findOne({ user_id: user_id }).select({ user_name: 1, user_email_id: 1, user_login_id: 1 });

        const username = userData.user_email_id.split('@')[0];

        const passwordChanged = username;

        const data = await userModel.findOneAndUpdate({ user_id: user_id }, {
            onboard_status: onboard_status,
            offer_letter_send: offer_letter_send,
            joining_date: joining_date,
            emergency_contact_person_name2: emergency_contact_person_name2,
            current_address: current_address,
            current_city: current_city,
            current_state: current_state,
            current_pin_code: current_pin_code,
            password: passwordChanged,
            job_type: job_type,
            offer_later_status: true,
            att_status: "",
            show_rocket: true
        })

        const transporterOptions = {
            service: "gmail",
            auth: {
                user: constant.EMAIL_ID,
                pass: constant.EMAIL_PASS,
            },
        };

        const createMailOptions = (html) => ({
            from: constant.EMAIL_ID,
            to: "fabhr@creativefuel.io",
            subject: "Welcome To Creativefuel",
            html: html
        });

        const sendMail = async (mailOptions) => {
            const transporter = nodemailer.createTransport(transporterOptions);
            await transporter.sendMail(mailOptions);
        };

        const templatePath = path.join(__dirname, "template.ejs");
        const template = await fs.promises.readFile(templatePath, "utf-8");
        const html = ejs.render(template, {
            email: userData.PersonalEmail,
            password: passwordChanged,
            name: userData.user_name,
            login_id: userData.user_login_id,
            status: "onboarded",
            text: ""
        });
        const mailOptions = createMailOptions(html);
        await sendMail(mailOptions);

        return res.status(200).send(data);
        // res.sendStatus(200);

    } catch (err) {
        return res.status(500).send({ error: err.message, sms: "Error Shifting to user from WFHD to WFO" });
    }
}

exports.loginUserDataWithJarvis2 = async (req, res) => {
    const id = req.params.user_id;
    try {
        const user = await userModel.findOne({ user_id: id });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userObject = {
            user_id: user.user_id,
            user_name: user.user_name,
            user_designation: user.user_designation,
        };

        if (user.image) {
            userObject.image = `${vari.IMAGE_URL}${user.image}`;
        } else {
            userObject.image = null;
        }

        res.status(200).json([userObject]);
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error getting loginuserdata' })
    }
};

exports.getAllUsersWithSomeBasicFields = async (req, res) => {
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
                    user_designation: 1,
                    user_email_id: 1,
                    user_login_id: 1,
                    created_At: 1,
                    created_by: 1,
                    user_contact_no: 1,
                    dept_id: 1,
                    role_id: 1,
                    image: 1,
                    job_type: 1,
                    PersonalNumber: 1,
                    PersonalEmail: 1,
                    user_status: 1,
                    sub_dept_id: 1,
                    department_name: "$department.dept_name",
                    Role_name: "$role.Role_name",
                    report: "$reportTo.user_name",
                    designation_name: "$designation.desi_name",
                    userSalaryStatus: 1,
                    digital_signature_image: 1,
                    alternate_contact: 1,
                    image_url: { $concat: [userImagesBaseUrl, "$image"] },
                    upi_Id: 1,
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

exports.updateUserOtherDetails = async (req, res) => {
    try {
        const editOtherData = await userModel.findOneAndUpdate({ user_id: req.body.user_id }, {
            facebookLink: req.body.facebookLink,
            instagramLink: req.body.instagramLink,
            linkedInLink: req.body.linkedInLink,
            height: req.body.height,
            weight: req.body.weight,
            travelMode: req.body.travelMode,
            sportsTeam: req.body.sportsTeam,
            smoking: req.body.smoking,
            daysSmoking: req.body.daysSmoking,
            alcohol: req.body.alcohol,
            medicalHistory: req.body.medicalHistory,
            bmi: req.body.bmi
        }, { new: true, upsert: true });

        if (!editOtherData) {
            return res.status(500).send({ success: false })
        }
        return res.status(200).send({ success: true, data: editOtherData })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}

exports.updateUserIdentityDetails = async (req, res) => {
    try {
        const editIdentityData = await userModel.findOneAndUpdate({ user_id: req.body.user_id }, {
            passportNumber: req.body.passportNumber,
            passportValidUpto: req.body.passportValidUpto,
            aadharName: req.body.aadharName,
            uid_no: req.body.uid_no,
            pan_no: req.body.pan_no,
            voterName: req.body.voterName,
            panName: req.body.panName,
            vehicleNumber: req.body.vehicleNumber,
            vehicleName: req.body.vehicleName,
            drivingLicenseNumber: req.body.drivingLicenseNumber,
            drivingLicenseValidUpto: req.body.drivingLicenseValidUpto
        }, { new: true, upsert: true });

        if (!editIdentityData) {
            return res.status(500).send({ success: false })
        }
        return res.status(200).send({ success: true, data: editIdentityData })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}