const response = require("../common/response.js");
const phpVendorPaymentRequestModel = require("../models/phpVendorPaymentRequestModel.js");
const { storage } = require("../common/uploadFile.js")
const vari = require("../variables.js")
const constant = require('../common/constant.js');
const axios = require("axios")
const FormData = require('form-data');
const nodemailer = require('nodemailer');
const path = require("path");
const fs = require("fs");
const ejs = require('ejs');
const moment = require('moment');
const mail = require("../common/sendMail.js");


exports.addPhpVendorPaymentRequestAdd = async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "demo1245@gmail.com",
                pass: "ptxogcg",
            }
        });
        async function sendEmail(to, subject, text) {
            const templatePath = path.join(__dirname, "vendorPhpPaymentRequest2.ejs");
            const template = await fs.promises.readFile(templatePath, "utf-8");
            const html = ejs.render(template, {
                subject,
                request_by: phpVendorPaymentRequestData.request_by,
                vendor_name: phpVendorPaymentRequestData.vendor_name,
                request_date: phpVendorPaymentRequestData.request_date,
                request_amount: phpVendorPaymentRequestData.request_amount,
                payment_amount: phpVendorPaymentRequestData.payment_amount,
                payment_date: phpVendorPaymentRequestData.payment_date,
                payment_by: phpVendorPaymentRequestData.payment_by,
                status: phpVendorPaymentRequestData.status,
                mobile: phpVendorPaymentRequestData.mobile
            });
            try {
                await transporter.sendMail({
                    from: "abc22@gmail.com",
                    to: "abc22@gmail.com",
                    subject: subject,
                    html: html
                });
                console.log('Email sent successfully');
            } catch (error) {
                console.error('Error sending email:', error);
            }
        };
        const data = new phpVendorPaymentRequestModel({
            request_id: req.body.request_id,
            vendor_id: req.body.vendor_id,
            request_by: req.body.request_by,
            request_amount: req.body.request_amount,
            priority: req.body.priority,
            status: req.body.status,
            payment_mode: req.body.payment_mode,
            payment_amount: req.body.payment_amount,
            payment_by: req.body.payment_by,
            remark_finance: req.body.remark_finance,
            invc_no: req.body.invc_no,
            invc_remark: req.body.invc_remark,
            remark_audit: req.body.remark_audit,
            outstandings: req.body.outstandings,
            name: req.body.name,
            vendor_name: req.body.vendor_name,
            request_date: req.body.request_date,
            payment_date: req.body.payment_date,
            tds_deduction: req.body.tds_deduction,
            gst_hold: req.body.gst_hold,
            gst_Hold_Bool: req.body.gst_Hold_Bool,
            tds_Deduction_Bool: req.body.tds_Deduction_Bool,
            zoho_status: req.body.zoho_status,
            zoho_date: req.body.zoho_date,
            zoho_remark: req.body.zoho_remark,
            tds_status: req.body.tds_status,
            tds_date: req.body.tds_date,
            tds_remark: req.body.tds_remark,
            gst_status: req.body.gst_status,
            gst_date: req.body.gst_date,
            gst_remark: req.body.gst_remark,
            gst_hold_amount: req.body.gst_hold_amount
        });

        if (req.file) {
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);
            const blob = bucket.file(req.file.originalname);
            data.evidence = blob.name;
            const blobStream = blob.createWriteStream();
            blobStream.
                on("finish", () => {
                    // res.status(200).send("Success")
                });
            blobStream.end(req.file.buffer);
        }
        const phpVendorPaymentRequestData = await data.save();

        let message;
        if (phpVendorPaymentRequestData.status === '1') {
            message = `Success Message : Payment request successfully!\nRequest_By: ${phpVendorPaymentRequestData.request_by},
             \nVendor_name: ${phpVendorPaymentRequestData.vendor_name}, \nRequest_Date: ${phpVendorPaymentRequestData.request_date}, 
             \nRequest_Amount: ${phpVendorPaymentRequestData.request_amount}, \nPayment_Amount: ${phpVendorPaymentRequestData.payment_amount}
             \nMobile: ${phpVendorPaymentRequestData.mobile}, \n Payment_Date: ${phpVendorPaymentRequestData.payment_date},
             \nPayment_Pay: ${phpVendorPaymentRequestData.payment_by},\nStatus: ${phpVendorPaymentRequestData.status}`;

        } else if (phpVendorPaymentRequestData.status === '2') {
            message = `Rejected Message: Payment request rejected!\nRequest_By: ${phpVendorPaymentRequestData.request_by}, 
            \nVendor_name: ${phpVendorPaymentRequestData.vendor_name}, \nRequest_Date: ${phpVendorPaymentRequestData.request_date}   
             \n Payment_Date: ${phpVendorPaymentRequestData.payment_date}, 
             \nPayment_Pay: ${phpVendorPaymentRequestData.payment_by}, \nStatus: ${phpVendorPaymentRequestData.status}`;
        }

        // Send email
        const emailsend = await sendEmail(message, phpVendorPaymentRequestData.request_by, phpVendorPaymentRequestData.vendor_name,
            phpVendorPaymentRequestData.request_date, phpVendorPaymentRequestData.request_amount, phpVendorPaymentRequestData.payment_amount,
            phpVendorPaymentRequestData.mobile, phpVendorPaymentRequestData.status, phpVendorPaymentRequestData.payment_date,
            phpVendorPaymentRequestData.payment_by, phpVendorPaymentRequestData.status);

        return response.returnTrue(
            200,
            req,
            res,
            "phpVendorPaymentRequestData Created Successfully",
            phpVendorPaymentRequestData,

        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}

async function checkIfDataExists(request_id) {
    const query = { request_id: request_id };
    const result = await phpVendorPaymentRequestModel.findOne(query);
    return result !== null;
}

exports.addPhpVendorPaymentRequestSet = async (req, res) => {
    try {

        const response = await axios.get(
            'https://sales.creativefuel.io/webservices/RestController.php?view=getpaymentrequest'
        )
        const responseData = response.data.body;

        for (const data of responseData) {
            const existingData = await checkIfDataExists(data.request_id)
            if (!existingData) {

                const creators = new phpVendorPaymentRequestModel({
                    request_id: data.request_id,
                    vendor_id: data.vendor_id,
                    request_by: data.request_by,
                    request_amount: data.request_amount,
                    priority: data.priority,
                    status: data.status,
                    payment_mode: data.payment_mode,
                    payment_amount: data.payment_amount,
                    payment_by: data.payment_by,
                    remark_finance: data.remark_finance,
                    invc_no: data.invc_no,
                    invc_remark: data.invc_remark,
                    invc_Date: data.invc_Date,
                    remark_audit: data.remark_audit,
                    outstandings: data.outstandings,
                    name: data.name,
                    vendor_name: data.vendor_name,
                    request_date: data.request_date,
                    payment_date: data.payment_date,
                    gst_Hold_Bool: data.gst_Hold_Bool,
                    tds_Deduction_Bool: data.tds_Deduction_Bool
                });

                if (req.file) {
                    const bucketName = vari.BUCKET_NAME;
                    const bucket = storage.bucket(bucketName);
                    const blob = bucket.file(req.file.originalname);
                    data.evidence = blob.name;
                    const blobStream = blob.createWriteStream();
                    blobStream.on("finish", () => {
                        // res.status(200).send("Success")
                    });
                    blobStream.end(req.file.buffer);
                }
                const phpVendorPaymentRequestData = await creators.save();
            } else {
                const updateExistingData = Object.keys(data).some(key => existingData[key] !== data[key]);
                if (updateExistingData) {
                    await phpVendorPaymentRequestModel.updateOne({ request_id: data.request_id },
                        {
                            $set: {
                                request_id: data.request_id,
                                vendor_id: data.vendor_id,
                                request_by: data.request_by,
                                request_amount: data.request_amount,
                                priority: data.priority,
                                status: data.status,
                                payment_mode: data.payment_mode,
                                payment_amount: data.payment_amount,
                                payment_by: data.payment_by,
                                remark_finance: data.remark_finance,
                                invc_no: data.invc_no,
                                invc_remark: data.invc_remark,
                                invc_Date: data.invc_Date,
                                remark_audit: data.remark_audit,
                                outstandings: data.outstandings,
                                name: data.name,
                                vendor_name: data.vendor_name,
                                request_date: data.request_date,
                                payment_date: data.payment_date,
                                gst_Hold_Bool: data.gst_Hold_Bool,
                                tds_Deduction_Bool: data.tds_Deduction_Bool
                            }
                        }
                    )
                } else {
                    return res.status(200).json({ msg: 'Data already inserted there is not new data available to insert' })
                }
            }
        }
        res.send({ sms: "data copied in local db", status: 200 })
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}

exports.getPhpVendorPaymentRequests = async (req, res) => {
    try {
        const vendorpaymentdata = await phpVendorPaymentRequestModel.find({});
        if (!vendorpaymentdata) {
            return res.status(500).send({
                succes: true,
                message: "Vendor Payment Request Not Found"
            });
        }

        const modifiedData = vendorpaymentdata.map(vendorPaymentRequest => ({
            ...vendorPaymentRequest.toObject(),
            evidence: `${vari.IMAGE_URL}${vendorPaymentRequest.evidence}`
        }));

        return res.status(200).send({
            succes: true,
            message: "All Vendor Payment Request Successfully",
            modifiedData
        });
    } catch (err) {
        return res.status(500).send({
            succes: false,
            message: "Error getting all Vendor Payment Request "
        });
    }
};

exports.getSinglePhpVendorPaymentRequest = async (req, res) => {
    try {
        const singlePhpVendorPaymentRequest = await phpVendorPaymentRequestModel.findOne({
            request_id: parseInt(req.params.request_id),
        });
        if (!singlePhpVendorPaymentRequest) {
            return res.status(500).send({
                succes: true,
                message: "Single Vendor Payment Request Not Found"
            });
        }

        singlePhpVendorPaymentRequest.evidence = `${constant.base_url}` + singlePhpVendorPaymentRequest.evidence;

        return res.status(200).send({
            succes: true,
            message: "Single Vendor Payment Request Successfully",
            singlePhpVendorPaymentRequest
        });
    } catch (err) {
        return res.status(500).send({
            succes: false,
            message: "Error getting single Vendor Payment Request "
        });
    }
};

exports.updatePhpVendorPaymentRequest = async (req, res) => {
    try {
        const updatedData = await phpVendorPaymentRequestModel.findOneAndUpdate(
            { _id: req.body._id },
            {
                status: 1,
                // evidence: req.files?.evidence,
                payment_date: req.body.payment_date,
                payment_mode: req.body.payment_mode,
                payment_amount: req.body.payment_amount,
                payment_by: req.body.payment_by,
                remark_finance: req.body.remark_finance,
                tds_deduction: req.body.tds_deduction,
                gst_hold: req.body.gst_hold,
                zoho_status: req.body.zoho_status,
                zoho_date: req.body.zoho_date,
                zoho_remark: req.body.zoho_remark,
                tds_status: req.body.tds_status,
                tds_date: req.body.tds_date,
                tds_remark: req.body.tds_remark,
                gst_status: req.body.gst_status,
                gst_date: req.body.gst_date,
                gst_remark: req.body.gst_remark,
                gst_hold_amount: req.body.gst_hold_amount
            },
            { new: true }
        );

        if (req.file && req.file.originalname) {
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);
            const blob = bucket.file(req.file.originalname);
            updatedData.evidence = blob.name;
            const blobStream = blob.createWriteStream();
            blobStream.on("finish", () => {
                // res.status(200).send("Success") 
            });
            blobStream.end(req.file.buffer);
        } else {
            await updatedData.save();
            return response.returnTrue(
                200, req, res, "phpVendor Payment Request data updated", updatedData
            );
        }
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.deletePhpVendorPaymentRequest = async (req, res) => {
    phpVendorPaymentRequestModel.deleteOne({ request_id: req.params.request_id }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'Php Vendor Payment Request deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'Php Vendor Payment Request not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
};

exports.updatePhpVendorPaymentRequestImage = async (req, res) => {
    try {
        const updatedData = await phpVendorPaymentRequestModel.findOneAndUpdate(
            { _id: req.body._id },
            { evidence: req.file.originalname },
            { new: true }
        );

        if (req.file && req.file.originalname) {
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);
            const blob = bucket.file(req.file.originalname);
            const blobStream = blob.createWriteStream();
            blobStream.on("finish", async () => {
                await updatedData.save();
                return response.returnTrue(
                    200, req, res, "phpVendor Payment Request data updated", updatedData
                );
            });
            blobStream.end(req.file.buffer);
        } else {
            await updatedData.save();
            return response.returnTrue(
                200, req, res, "phpVendor Payment Request data updated", updatedData
            );
        }
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};



exports.getVendorPaymentRequestDayWiseListData = async () => {
    try {
        // const currentDate = new Date().toISOString().split('T')[0];
        const currentDate = new Date();
        let startDate = moment(currentDate).format('YYYY-MM-DD 00:00:00');
        let endtDate = moment(currentDate).format('YYYY-MM-DD 23:59:59');
        const paymentRequestData = await phpVendorPaymentRequestModel.aggregate([{
            $match: {
                request_date: {
                    $gte: startDate, // Start of current day in UTC
                    $lt: endtDate, // Start of next day in UTC
                }
            }
        }, {
            $addFields: {
                "isRequestAmountGreaterThanZero": {
                    $cond: {
                        if: {
                            $gt: ["$request_amount", 0]
                        },
                        then: 1,
                        else: 0
                    }
                },
                "isDisbursedAmountGreaterThanZero": {
                    $cond: {
                        if: {
                            $gt: ["$payment_amount", 0]
                        },
                        then: 1,
                        else: 0
                    }
                }
            }
        }, {
            $group: {
                _id: "$status",
                totalRequestAmount: {
                    $sum: {
                        $cond: {
                            if: {
                                $gt: ["$request_amount", 0]
                            },
                            then: "$request_amount",
                            else: 0
                        }
                    }
                },
                totalDisbursedAmount: {
                    $sum: {
                        $cond: {
                            if: {
                                $gt: ["$payment_amount", 0]
                            },
                            then: "$payment_amount",
                            else: 0
                        }
                    }
                },
                totalRequestCounts: { $sum: "$isRequestAmountGreaterThanZero" },
                totalDisbursedCounts: { $sum: "$isDisbursedAmountGreaterThanZero" },
                data: { $first: "$$ROOT" },
            }
        }, {
            $project: {
                _id: 1,
                totalRequestAmount: 1,
                totalRequestCounts: 1,
                totalDisbursedAmount: 1,
                totalDisbursedCounts: 1,
            }
        }]);
        let emailDataObj = {
            totalRejectAmount: 0,
            totalRejectCounts: 0
        };
        for (const data of paymentRequestData) {
            if (data && data._id == 1) {
                console.log("in if status 1");
                emailDataObj.totalRequestedCount = data.totalRequestCounts;
                emailDataObj.totalRequestedAmount = data.totalRequestAmount;
                emailDataObj.totalDisbursedCounts = data.totalDisbursedCounts;
                emailDataObj.totalDisbursedAmount = data.totalDisbursedAmount;
            }
            if (data && data._id == 2) {
                console.log("in else status 2");
                emailDataObj.totalRejectAmount = data.totalRequestAmount;
                emailDataObj.totalRejectCounts = data.totalRequestCounts;
            }
        }

        //php pending payment req get
        const response = await axios.get(
            'https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest'
        )
        const phpResonseData = response?.data?.body
        let totalPendingAmount = 0;
        let totalPendingCounts = 0;
        let currentDateFormat = moment(currentDate).format('YYYY-MM-DD');
        for (const phpData of phpResonseData) {
            let pendingReqDate = moment(phpData.request_date).format('YYYY-MM-DD');
            //status wise current date php data compare 
            if (pendingReqDate == currentDateFormat && phpData && phpData.status == 0) {
                totalPendingAmount = totalPendingAmount + parseInt(phpData.request_amount);
                totalPendingCounts++;
            }
        }
        emailDataObj.totalPendingAmount = totalPendingAmount;
        emailDataObj.totalPendingCounts = totalPendingCounts;

        //Send email
        const emailsend = await emailSends(emailDataObj);

        return res.status(200).send({
            success: true,
            description: "Payment request data list successfully fetched for today!",
            data: emailDataObj,
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            description: "Internal server error",
            error: err.description
        });
    }
}


async function emailSends(emailData) {
    try {
        let htmlData = ``
        if (emailData) {
            htmlData = `\nTotal Requested Count: ${emailData.totalRequestedCount}, Total Requested Amount: ${emailData.totalRequestedAmount},
            \nTotal Disbursed Count: ${emailData.totalDisbursedCounts}, Total Disbursed Amount: ${emailData.totalDisbursedAmount},
            \nTotal Pending Count: ${emailData.totalPendingCounts}, Total Pending Amount: ${emailData.totalPendingAmount},
            \nTotal Rejected Count: ${emailData.totalRejectCounts}, Total Rejected Amount: ${emailData.totalRejectAmount},
         `;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "demo1245@gmail.com",
                pass: "ptxogcg",
            }
        });

        // Email content
        const mailOptions = {
            from: "demo1234@gmail.com",
            to: "demo1234@gmail.com",
            subject: 'day_wise_data Report',
            html: htmlData,
        };

        await transporter.sendMail(mailOptions);

        console.log("email sent successfully");
    } catch (error) {
        console.error('Error in sending  email:', error);
    }
}


exports.getVendorPaymentRequestWeeklyList = async () => {
    try {

        const currentDate = new Date();
        let startDate = moment(currentDate).subtract(6, 'days').startOf('day').format('YYYY-MM-DD 00:00:00');
        let endtDate = moment(currentDate).startOf('day').format('YYYY-MM-DD 23:59:59');

        const paymentRequestData = await phpVendorPaymentRequestModel.aggregate([{
            $match: {
                request_date: {
                    $gte: startDate, // Start of current day in UTC
                    $lt: endtDate, // Start of next day in UTC
                }
            }
        }, {
            $addFields: {
                "isRequestAmountGreaterThanZero": {
                    $cond: {
                        if: {
                            $gt: ["$request_amount", 0]
                        },
                        then: 1,
                        else: 0
                    }
                },
                "isDisbursedAmountGreaterThanZero": {
                    $cond: {
                        if: {
                            $gt: ["$payment_amount", 0]
                        },
                        then: 1,
                        else: 0
                    }
                }
            }
        }, {
            $group: {
                _id: "$status",
                totalRequestAmount: {
                    $sum: {
                        $cond: {
                            if: {
                                $gt: ["$request_amount", 0]
                            },
                            then: "$request_amount",
                            else: 0
                        }
                    }
                },
                totalDisbursedAmount: {
                    $sum: {
                        $cond: {
                            if: {
                                $gt: ["$payment_amount", 0]
                            },
                            then: "$payment_amount",
                            else: 0
                        }
                    }
                },
                totalRequestCounts: { $sum: "$isRequestAmountGreaterThanZero" },
                totalDisbursedCounts: { $sum: "$isDisbursedAmountGreaterThanZero" },
                data: { $first: "$$ROOT" },
            }
        }, {
            $project: {
                _id: 1,
                totalRequestAmount: 1,
                totalRequestCounts: 1,
                totalDisbursedAmount: 1,
                totalDisbursedCounts: 1,
            }
        }]);
        let emailDataObj = {
            totalRejectAmount: 0,
            totalRejectCounts: 0
        };
        for (const data of paymentRequestData) {
            if (data && data._id == 1) {
                console.log("in if status 1");
                emailDataObj.totalRequestedCount = data.totalRequestCounts;
                emailDataObj.totalRequestedAmount = data.totalRequestAmount;
                emailDataObj.totalDisbursedCounts = data.totalDisbursedCounts;
                emailDataObj.totalDisbursedAmount = data.totalDisbursedAmount;
            }
            if (data && data._id == 2) {
                console.log("in else status 2");
                emailDataObj.totalRejectAmount = data.totalRequestAmount;
                emailDataObj.totalRejectCounts = data.totalRequestCounts;
            }
        }

        //php pending payment req get
        const response = await axios.get(
            'https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest'
        )
        const phpResonseData = response?.data?.body
        let totalPendingAmount = 0;
        let totalPendingCounts = 0;

        for (const phpData of phpResonseData) {
            let pendingReqDate = moment(phpData.request_date).format('YYYY-MM-DD');
            if (
                pendingReqDate >= startDate &&
                pendingReqDate <= endtDate &&
                phpData &&
                phpData.status == 0
            ) {
                totalPendingAmount += parseInt(phpData.request_amount);
                totalPendingCounts++;
            }
        }

        emailDataObj.totalPendingAmount = totalPendingAmount;
        emailDataObj.totalPendingCounts = totalPendingCounts;

        //Send email
        const emailsend = await emailSends(emailDataObj);

        return res.status(200).send({
            success: true,
            description: "Payment request weekly data list successfully!",
            data: emailDataObj,
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            description: "Internal server error",
            error: err.description
        });
    }
}


exports.getVendorPaymentRequestMonthlyList = async () => {
    try {
        const currentDate = new Date();

        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        let startDate = moment(firstDayOfMonth).format('YYYY-MM-DD 00:00:00');
        let endtDate = moment(lastDayOfMonth).format('YYYY-MM-DD 23:59:59');
        const paymentRequestData = await phpVendorPaymentRequestModel.aggregate([{
            $match: {
                request_date: {
                    $gte: startDate,
                    $lt: endtDate,
                }
            }
        }, {
            $addFields: {
                "isRequestAmountGreaterThanZero": {
                    $cond: {
                        if: {
                            $gt: ["$request_amount", 0]
                        },
                        then: 1,
                        else: 0
                    }
                },
                "isDisbursedAmountGreaterThanZero": {
                    $cond: {
                        if: {
                            $gt: ["$payment_amount", 0]
                        },
                        then: 1,
                        else: 0
                    }
                }
            }
        }, {
            $group: {
                _id: "$status",
                totalRequestAmount: {
                    $sum: {
                        $cond: {
                            if: {
                                $gt: ["$request_amount", 0]
                            },
                            then: "$request_amount",
                            else: 0
                        }
                    }
                },
                totalDisbursedAmount: {
                    $sum: {
                        $cond: {
                            if: {
                                $gt: ["$payment_amount", 0]
                            },
                            then: "$payment_amount",
                            else: 0
                        }
                    }
                },
                totalRequestCounts: { $sum: "$isRequestAmountGreaterThanZero" },
                totalDisbursedCounts: { $sum: "$isDisbursedAmountGreaterThanZero" },
                data: { $first: "$$ROOT" },
            }
        }, {
            $project: {
                _id: 1,
                totalRequestAmount: 1,
                totalRequestCounts: 1,
                totalDisbursedAmount: 1,
                totalDisbursedCounts: 1,
            }
        }]);
        let emailDataObj = {
            totalRejectAmount: 0,
            totalRejectCounts: 0
        };
        for (const data of paymentRequestData) {
            if (data && data._id == 1) {
                console.log("in if status 1");
                emailDataObj.totalRequestedCount = data.totalRequestCounts;
                emailDataObj.totalRequestedAmount = data.totalRequestAmount;
                emailDataObj.totalDisbursedCounts = data.totalDisbursedCounts;
                emailDataObj.totalDisbursedAmount = data.totalDisbursedAmount;
            }
            if (data && data._id == 2) {
                console.log("in else status 2");
                emailDataObj.totalRejectAmount = data.totalRequestAmount;
                emailDataObj.totalRejectCounts = data.totalRequestCounts;
            }
        }

        //php pending payment req get
        const response = await axios.get(
            'https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest'
        )
        const phpResonseData = response?.data?.body
        let totalPendingAmount = 0;
        let totalPendingCounts = 0;
        let currentDateFormat = moment(currentDate).format('YYYY-MM');
        for (const phpData of phpResonseData) {
            let pendingReqDate = moment(phpData.request_date).format('YYYY-MM');
            //status wise current date php data compare 
            if (pendingReqDate == currentDateFormat && phpData && phpData.status == 0) {
                totalPendingAmount = totalPendingAmount + parseInt(phpData.request_amount);
                totalPendingCounts++;
            }
        }
        emailDataObj.totalPendingAmount = totalPendingAmount;
        emailDataObj.totalPendingCounts = totalPendingCounts;

        //Send email
        const emailsend = await emailSends(emailDataObj);

        return res.status(200).send({
            success: true,
            description: "Payment request monthly data list successfully!",
            data: emailDataObj,
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            description: "Internal server error",
            error: err.description
        });
    }
}


exports.getVendorPaymentRequestQuatrlyList = async () => {
    try {

        const currentDate = new Date();
        const currentQuarter = Math.floor((currentDate.getMonth() / 3));
        const currentYear = currentDate.getFullYear();
        const quarterStartDate = new Date(currentYear, currentQuarter * 3, 1);
        const quarterEndDate = new Date(currentYear, currentQuarter * 3 + 3, 0, 23, 59, 59);

        const startDate = moment(quarterStartDate).format('YYYY-MM-DD 00:00:00');
        const endDate = moment(quarterEndDate).format('YYYY-MM-DD 23:59:59');

        const paymentRequestData = await phpVendorPaymentRequestModel.aggregate([{
            $match: {
                request_date: {
                    $gte: startDate, // Start of current day in UTC
                    $lt: endDate, // Start of next day in UTC
                }
            }
        }, {
            $addFields: {
                "isRequestAmountGreaterThanZero": {
                    $cond: {
                        if: {
                            $gt: ["$request_amount", 0]
                        },
                        then: 1,
                        else: 0
                    }
                },
                "isDisbursedAmountGreaterThanZero": {
                    $cond: {
                        if: {
                            $gt: ["$payment_amount", 0]
                        },
                        then: 1,
                        else: 0
                    }
                }
            }
        }, {
            $group: {
                _id: "$status",
                totalRequestAmount: {
                    $sum: {
                        $cond: {
                            if: {
                                $gt: ["$request_amount", 0]
                            },
                            then: "$request_amount",
                            else: 0
                        }
                    }
                },
                totalDisbursedAmount: {
                    $sum: {
                        $cond: {
                            if: {
                                $gt: ["$payment_amount", 0]
                            },
                            then: "$payment_amount",
                            else: 0
                        }
                    }
                },
                totalRequestCounts: { $sum: "$isRequestAmountGreaterThanZero" },
                totalDisbursedCounts: { $sum: "$isDisbursedAmountGreaterThanZero" },
                data: { $first: "$$ROOT" },
            }
        }, {
            $project: {
                _id: 1,
                totalRequestAmount: 1,
                totalRequestCounts: 1,
                totalDisbursedAmount: 1,
                totalDisbursedCounts: 1,
            }
        }]);
        let emailDataObj = {
            totalRejectAmount: 0,
            totalRejectCounts: 0
        };
        for (const data of paymentRequestData) {

            if (data && data._id == 1) {
                console.log("in if status 1");
                emailDataObj.totalRequestedCount = data.totalRequestCounts;
                emailDataObj.totalRequestedAmount = data.totalRequestAmount;
                emailDataObj.totalDisbursedCounts = data.totalDisbursedCounts;
                emailDataObj.totalDisbursedAmount = data.totalDisbursedAmount;
            }
            if (data && data._id == 2) {
                console.log("in else status 2");
                emailDataObj.totalRejectAmount = data.totalRequestAmount;
                emailDataObj.totalRejectCounts = data.totalRequestCounts;
            }
        }

        //php pending payment req get
        const response = await axios.get(
            'https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest'
        )
        const phpResonseData = response?.data?.body
        let totalPendingAmount = 0;
        let totalPendingCounts = 0;

        for (const phpData of phpResonseData) {
            let date = new Date(phpData.request_date);
            console.log(phpData.request_date);
            let pendingReqDate = new Date(moment(phpData.request_date).format('YYYY-MM-DD'));
            if (
                pendingReqDate >= quarterStartDate &&
                pendingReqDate <= quarterEndDate &&
                phpData &&
                phpData.status == 0
            ) {
                totalPendingAmount += parseInt(phpData.request_amount);
                totalPendingCounts++;
            }
        }
        emailDataObj.totalPendingAmount = totalPendingAmount;
        emailDataObj.totalPendingCounts = totalPendingCounts;

        //Send email
        const emailsend = await emailSends(emailDataObj);

        return res.status(200).send({
            success: true,
            description: "Payment request weekly data list successfully!",
            data: emailDataObj,
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            description: "Internal server error",
            error: err.description
        });
    }
}
