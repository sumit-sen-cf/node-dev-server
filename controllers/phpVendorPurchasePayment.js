const { storage } = require("../common/uploadFile.js")
const vari = require("../variables.js")
const constant = require('../common/constant.js');
const phpVendorPurchasePaymentRequestModel = require("../models/phpVendorPurchasePaymentRequestModel.js");
const axios = require("axios")
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "invc_img", maxCount: 1 },
    { name: "pan_img", maxCount: 1 }
]);

async function checkIfDataExists(request_id) {
    const query = { request_id: request_id };
    const result = await phpVendorPurchasePaymentRequestModel.findOne(query);
    return result !== null;
}

exports.addPhpVendorPurchasePaymentRequestSet = [
    upload,
    async (req, res) => {
        try {

            const response = await axios.get(
                'https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest'
            )
            const responseData = response.data.body;

            for (const data of responseData) {
                const existingData = await checkIfDataExists(data.request_id)
                if (!existingData) {

                    const creators = new phpVendorPurchasePaymentRequestModel({
                        request_id: data.request_id,
                        vendor_name: data.vendor_name,
                        vendor_id: data.vendor_id,
                        request_by: data.request_by,
                        request_date: data.request_date,
                        name: data.name,
                        remark_audit: data.remark_audit,
                        outstandings: data.outstandings,
                        priority: data.priority,
                        invc_no: data.invc_no,
                        invc_Date: data.invc_Date,
                        invc_remark: data.invc_remark,
                        request_amount: data.request_amount,
                        base_amount: data.base_amount,
                        gst_amount: data.gst_amount,
                        status: data.status,
                        mob1: data.mob1,
                        address: data.addresss,
                        pan: data.pan,
                        gst: data.gst,
                        payment_details: data.payment_details,
                        payment_cycle: data.payment_cycle,
                        gst_hold: data.gst_hold,
                        tds_deduction: data.tds_deduction,
                        gstHold: data.gstHold,
                        TDSDeduction: data.TDSDeduction,
                        gst_hold_amount: data.gst_hold_amount,
                        page_name: data.page_name
                    });

                    if (req.file) {
                        const bucketName = vari.BUCKET_NAME;
                        const bucket = storage.bucket(bucketName);
                        const blob = bucket.file(req.file.originalname);
                        data.invc_img = blob.name;
                        const blobStream = blob.createWriteStream();
                        blobStream.on("finish", () => {
                            // res.status(200).send("Success")
                        });
                        blobStream.end(req.file.buffer);
                    }

                    if (req.file) {
                        const bucketName = vari.BUCKET_NAME;
                        const bucket = storage.bucket(bucketName);
                        const blob = bucket.file(req.file.originalname);
                        data.pan_img = blob.name;
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
                        await phpVendorPurchasePaymentRequestModel.updateOne({ request_id: data.request_id },
                            {
                                $set: {
                                    request_id: data.request_id,
                                    vendor_name: data.vendor_name,
                                    vendor_id: data.vendor_id,
                                    request_by: data.request_by,
                                    request_date: data.request_date,
                                    name: data.name,
                                    remark_audit: data.remark_audit,
                                    outstandings: data.outstandings,
                                    priority: data.priority,
                                    invc_no: data.invc_no,
                                    invc_Date: data.invc_Date,
                                    invc_remark: data.invc_remark,
                                    request_amount: data.request_amount,
                                    base_amount: data.base_amount,
                                    gst_amount: data.gst_amount,
                                    status: data.status,
                                    mob1: data.mob1,
                                    address: data.addresss,
                                    pan: data.pan,
                                    gst: data.gst,
                                    payment_details: data.payment_details,
                                    payment_cycle: data.payment_cycle,
                                    gst_hold: data.gst_hold,
                                    tds_deduction: data.tds_deduction,
                                    gstHold: data.gstHold,
                                    TDSDeduction: data.TDSDeduction,
                                    gst_hold_amount: data.gst_hold_amount,
                                    page_name: data.page_name
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
];

exports.getPhpVendorPurchasePaymentRequests = async (req, res) => {
    try {
        const vendorpaymentdata = await phpVendorPurchasePaymentRequestModel.find({});
        if (!vendorpaymentdata) {
            return res.status(500).send({
                succes: true,
                message: "Vendor Payment Request Not Found"
            });
        }

        const modifiedData = vendorpaymentdata.map(vendorPaymentRequest => ({
            ...vendorPaymentRequest.toObject(),
            invc_img_url: `https://storage.cloud.google.com/dev-backend-bucket/${vendorPaymentRequest.invc_img}`,
            pan_img_url: `https://storage.cloud.google.com/dev-backend-bucket/${vendorPaymentRequest.pan_img}`
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