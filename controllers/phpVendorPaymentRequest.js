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
const mail = require("../common/sendMail.js");


exports.addPhpVendorPaymentRequestAdd = async (req, res) => {
    try {
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
            { request_id: req.body.request_id },
            {
                status: 1,
                evidence: req.files?.evidence,
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

<<<<<<< Updated upstream
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
=======

exports.getVendorPaymentRequestList = async (req, res) => {
    try {
        console.log("req.params")
        console.log(req.params)
        const { status } = req.params;

        const paymentRequsetData = await phpVendorPaymentRequestModel.aggregate(
            [
                {
                    $group:
                    {
                        _id: "$status",
                        totalPaymentAmount: { $sum: "$payment_amount" },
                        totalRequestAmount: { $sum: "$request_amount" },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group:
                    {
                        _id: "$_id",
                        totalSuccRej: { $sum: "$payment_amount" },
                        count: { $sum: 1 },
                        data: { $first: "$$ROOT" },
                    }
                },
                {
                    $project: {
                        _id: 1,
                        totalPaymentAmount: "$data.totalPaymentAmount",
                        totalRequestAmount: "$data.totalRequestAmount",
                        count: "$data.count",
                        totalSuccRej: {
                            $add: ["$data.totalPaymentAmount", "$data.totalRequestAmount"]
                        },
                        totaldisbursedAmount: { $sum: "$data.totalPaymentAmount" },
                        countDisbursedAmount: { $sum: 1 }
                    }
                },
            ]
        )
        if (!paymentRequsetData) {
            return res.status(500).send({
                succes: true,
                message: "Payment request data list not found!",
            });
        }
        // Construct email message
        const totalPaymentAmount = paymentRequsetData[1].totalPaymentAmount;
        const totalRequestAmount = paymentRequsetData[1].totalRequestAmount;
        const count = paymentRequsetData[1].count;
        const totaldisbursedAmount = paymentRequsetData[1].totaldisbursedAmount
        let message;
        if (status === '1') {
            message = `Success Message : Payment request successfully!\nTotal Payment Amount: ${totalPaymentAmount}, \nTotal Payment Count: ${count}, \nTotal Request Amount: ${totalRequestAmount}, \nTotal Payment Disbursed Amount: ${totaldisbursedAmount}`;
        } else if (status === '2') {
            message = `Rejected Message : Payment request rejected!\nTotal Payment Amount: ${totalPaymentAmount}, \nTotal Payment Count: ${count}, \nTotal Request Amount: ${totalRequestAmount}`;
        } else {
            message = "Unknown status!";
        }
        // Send email
        const emailsend = await sendEmail(message, totalPaymentAmount, totalRequestAmount, count, totaldisbursedAmount);

        return res.status(200).send({
            succes: true,
            message: "Payment request data list successfully!",
            data: paymentRequsetData
        });
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}
async function sendEmail(message, totalPaymentAmount, totalRequestAmount, count, totaldisbursedAmount) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "ankigupta1254@gmail.com",
            pass: "ptxbqtjmcaghogcg",
        }
    });
    const templatePath = path.join(__dirname, "vendorPhpPaymentRequest.ejs");
    const template = await fs.promises.readFile(templatePath, "utf-8");
    const html = ejs.render(template, {
        totalPaymentAmount,
        totalRequestAmount,
        count,
        totaldisbursedAmount
    });
    console.log("html----------------------------", html)
    try {
        await transporter.sendMail({
            from: "ankigupta1254@gmail.com",
            to: "ankigupta1254@gmail.com",
            subject: 'Payment Request Data',
            text: message, // Plain text body
            html: html
        });
        console.log("Email sent successfully");
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }

};


// const emailCronJob = async () => {
//     const paymentRequsetData = await phpVendorPaymentRequestModel.aggregate([{
//         $group:
//         {
//             _id: "$status",
//             totalAmount: { $sum: "$payment_amount" },
//             request_amount: { $first: "$request_amount" },
//             count: { $sum: 1 }
//         }
//     }, {
//         $project: {
//             _id: 1,
//             totalAmount: 1,
//             count:1
//         }
//     }]);
//     console.log("paymentRequsetData")
//     console.log(paymentRequsetData)

//     const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: "ankigupta1254@gmail.com",
//         pass: "ptxbqtjmcaghogcg",
//     }
// });

// const sendMail = async (to, vendor_name, request_by,request_amount,paymentRequsetData) => {
//     const templatePath = path.join(__dirname, "userAnnouncement.ejs");
//     const template = await fs.promises.readFile(templatePath, "utf-8");
//     const html = ejs.render(template, {
//         vendor_name,
//         request_by,
//         request_amount,
//         paymentRequsetData
//     });
//     console.log("666------------------------", html)
// }
//     try {
//         await transporter.sendMail({
//             from: "ankigupta1254@gmail.com",
//             to: "ankigupta1254@gmail.com",
//             subject: vendor_name,
//             text: request_amount

//         });
//         console.log('Email sent successfully');
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// };
// paymentRequsetData.map(async (request) => {
//     const { vendor_name, request_by, request_amount } = request;
//     const html = `<p>Vendor: ${vendor_name}</p><p>Requested by: ${request_by}</p><p>Requested amount: ${request_amount}</p>`;
//     await sendMail("ankigupta1254@gmail.com", vendor_name, request_amount, html);
// });
// Iterate through payment request data and send emails

// console.log("fffffffffff", emailCronJob)
// const cron = require('node-cron');
// function logMessage() {
//     console.log('Cron job executed at:', new Date().toLocaleString());
// }
// // Schedule the cron job to run every minute
// cron.schedule('* * * * *', () => {
//     console.log("emai--------------")
//     emailCronJob();
// });





// exports.getVendorPaymentRequestList = async (req, res) => {
//     try {
//         const currentDate = new Date().toISOString(); // Get current date in ISO format
//         console.log("Current Date:", currentDate);

//         const query = await phpVendorPaymentRequestModel.find({}, { request_date: 1 })
//         console.log("queryyyyyyyy", query);
//         const paymentRequsetData = await phpVendorPaymentRequestModel.aggregate([
//             {
//                 $addFields: {
//                     "parsed_request_date": {
//                         $dateFromString: {
//                             dateString: {
//                                 $substr: ["$request_date", 0, 10] // Extract date part from string
//                             },
//                             format: "%Y-%m-%d" // Specify the format of the extracted date
//                         }
//                     }
//                 }
//             },
//             {
//                 $project: {
//                     parsed_request_date: 1,
//                 }
//             }
//             // {
//             //     $match: {
//             //         $expr: {
//             //             $eq: ["$parsed_request_date", currentDate]
//             //         }
//             //     }
//             // }

//         ]);

//         console.log("Payment Request Data--------------------------------------------", paymentRequsetData);
//         if (!paymentRequsetData) { // Check if no documents found
//             return res.status(500).send({
//                 success: false,
//                 message: "Payment request data list not found for today!",
//             });
//         }

//         return res.status(200).send({
//             success: true,
//             message: "Payment request data list successfully fetched for today!",
//             data: paymentRequsetData
//         });
//     } catch (err) {
//         return res.status(500).send({
//             success: false,
//             message: "Internal server error",
//             error: err.message
//         });
//     }
// }


exports.getVendorPaymentRequestMatchList = async (req, res) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        console.log("Current Date:", currentDate);

        const paymentRequsetData = await phpVendorPaymentRequestModel.aggregate([
            {
                $addFields: {
                    "parsed_request_date": {
                        $dateFromString: {
                            dateString: {
                                $substr: ["$request_date", 0, 10]
                            },
                            format: "%Y-%m-%d"
                        },
                    }
                }
            },

            // {
            //     $project: {
            //         parsed_request_date: { $dateToString: { format: "%Y-%m-%d", date: "$parsed_request_date" } },
            //         request_id: 1,
            //         vendor_id: 1,
            //         request_amount: 1,
            //         payment_amount: {$sum: "$payment_amount"},
            //         count: { $sum: 1 },
            //     }
            // },

            {
                $group:
                {
                    _id: "$status",
                    totalPaymentAmount: { $sum: "$payment_amount" },
                    totalRequestAmount: { $sum: "$request_amount" },
                    count: { $sum: 1 },
                    data: { $first: "$$ROOT" },
                }
            },
            {
                $group:
                {
                    _id: "$_id",
                    count: { $sum: 1 },
                    data: { $first: "$$ROOT" },
                }
            },
            {
                $project: {
                    _id: 1,
                    parsed_request_date: { $dateToString: { format: "%Y-%m-%d", date: "$parsed_request_date" } },
                    totalPaymentAmount: "$data.totalPaymentAmount",
                    totalRequestAmount: "$data.totalRequestAmount",
                    count: "$data.count",
                    totaldisbursedAmount: { $sum: "$data.totalPaymentAmount" },
                    countDisbursedAmount: { $sum: 1 }
                }
            },
        ]);
        console.log("Payment Request Data:", paymentRequsetData);
        const matchingData = paymentRequsetData.filter(doc => {
            return doc.parsed_request_date === currentDate;
        });

        console.log("matchingData", matchingData)

        if (!matchingData || matchingData.length === 0) { // Check if no documents found
            return res.status(500).send({
                success: false,
                message: "Payment request data list not found for today!",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Payment request data list successfully fetched for today!",
            data: matchingData
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
}
>>>>>>> Stashed changes
