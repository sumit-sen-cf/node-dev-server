const response = require("../common/response.js");
const phpVendorPaymentRequestModel = require("../models/phpVendorPaymentRequestModel.js");
const { storage } = require("../common/uploadFile.js")
const vari = require("../variables.js")
const constant = require('../common/constant.js');

exports.addPhpVendorPaymentRequest = async (req, res) => {
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
            request_date: req.body.request_date
        });

        if (req.file) {
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);
            const blob = bucket.file(req.file.originalname);
            data.evidence = blob.name;
            const blobStream = blob.createWriteStream();
            blobStream.on("finish", () => res.status(200).send("Success"));
            blobStream.end(req.file.buffer);

        }

        const phpVendorPaymentRequestData = await data.save();
        return response.returnTrue(
            200,
            req,
            res,
            "phpVendorPaymentRequestData Created Successfully",
            phpVendorPaymentRequestData
        );
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
            evidence: `https://storage.cloud.google.com/node-dev-server-bucket/${vendorPaymentRequest.evidence}`
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
    try{
        const updatedData = phpVendorPaymentRequestModel.findOneAndUpdate({request_id: req.body.request_id},{
            status: 1,
            evidence: req.files?.evidence,
            payment_date: req.body.payment_date,
            payment_mode: req.body.payment_mode,
            payment_amount: req.body.payment_amount,
            payment_by: req.body.payment_by,
            remark_finance: req.body.remark_finance
        });
        if (req.file && req.file.originalname) {
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);
            const blob = bucket.file(req.file.originalname);
            updatedData.evidence = blob.name;
            const blobStream = blob.createWriteStream();
            blobStream.on("finish", () => { res.status(200).send("Success") });
            blobStream.end(req.file.buffer);
        }else{
            updatedData.save();
            return response.returnTrue(
                200, req, res, "phpVendor Payment Request data updated", updatedData
            )
        }
    }catch (err){
        return response.returnFalse(500, req, res, err.message, {});
    }
}