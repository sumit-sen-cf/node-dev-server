const phpPaymentBalListModel = require("../models/phpPaymentBalListModel.js");
const axios = require('axios');
const FormData = require('form-data');
const response = require("../common/response.js");
const vari = require('../variables.js');
const { storage } = require('../common/uploadFile.js')


exports.savePhpPaymentPendingInvoiceDataInNode = async (req, res) => {
    try {
        // const loggedin_user_id = req.body.loggedin_user_id;
        const sendData = new FormData();
        sendData.append("loggedin_user_id", 36);
        const response = await axios.post(
            'https://sales.creativefuel.io/webservices/RestController.php?view=sales-pending_invoice_creation_list', sendData,
            {
                headers: {
                    ...sendData.getHeaders(),
                },
            }
        )
        const responseData = response.data.body;
        await Promise.all(responseData.map(async (data) => {
            await phpPaymentBalListModel.findOneAndUpdate(
                { sale_booking_id: data.sale_booking_id },
                {
                    $set: {
                        sale_booking_id: data.sale_booking_id,
                        cust_id: data.cust_id,
                        base_amount: data.base_amount,
                        gst_amount: data.gst_amount,
                        net_amount: data.net_amount,
                        campaign_amount_without_gst: data.campaign_amount_without_gst,
                        balance: data.balance,
                        description: data.description,
                        status_desc: data.status_desc,
                        invoice: data.invoice,
                        invoice_particular: data.invoice_particular,
                        invoice_action_reason: data.invoice_action_reason,
                        salesexe_credit_used: data.salesexe_credit_used,
                        execution_approval: data.execution_approval,
                        last_action_reason: data.last_action_reason,
                        execution_date: data.execution_date,
                        execution_remark: data.execution_remark,
                        execution_done_by: data.execution_done_by,
                        execution_summary: data.execution_summary,
                        reason_credit_approval: data.reason_credit_approval,
                        fixed_credit_approval_reason: data.fixed_credit_approval_reason,
                        balance_payment_ondate: data.balance_payment_ondate,
                        gst_status: data.gst_status,
                        tds_status: data.tds_status,
                        close_date: data.close_date,
                        verified_amount: data.verified_amount,
                        verified_remark: data.verified_remark,
                        sale_booking_file: data.sale_booking_file,
                        remarks: data.remarks,
                        no_incentive: data.no_incentive,
                        old_sale_booking_id: data.old_sale_booking_id,
                        sale_booking_type: data.sale_booking_date,
                        rs_sale_booking_id: data.rs_sale_booking_id,
                        service_taken_amount: data.service_taken_amount,
                        last_updated_by: data.last_updated_by,
                        creation_date: data.creation_date,
                        last_updated_date: data.last_updated_date,
                        invoice_particular_id: data.invoice_particular_id,
                        invoice_particular_name: data.invoice_particular_name,
                        sales_person_username: data.sales_person_username,
                        invoice_mnj_number: data.invoice_mnj_number,
                        invoice_mnj_date: data.invoice_mnj_date,
                        party_mnj_name: data.party_mnj_name
                    }
                },
                { new: true }
            );
        }));

        res.send({ sms: "Data copied in local db", status: 200 });
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error updating city details' })
    }
};

exports.getAllphpPaymentPendingInvoiceData = async (req, res) => {
    try {
        const getData = await phpPaymentBalListModel.find({})
            .select({
                _id: 1,
                sale_booking_id: 1,
                cust_id: 1,
                sale_booking_date: 1,
                campaign_amount: 1,
                base_amount: 1,
                gst_amount: 1,
                net_amount: 1,
                campaign_amount_without_gst: 1,
                total_paid_amount: 1,
                balance: 1,
                description: 1,
                status_desc: 1,
                invoice_creation_status: 1,
                invoice: 1,
                invoice_particular: 1,
                invoice_action_reason: 1,
                manager_approval: 1,
                salesexe_credit_approval: 1,
                salesexe_credit_used: 1,
                execution_approval: 1,
                last_action_reason: 1,
                execution_date: 1,
                execution_remark: 1,
                execution_done_by: 1,
                execution_status: 1,
                execution_summary: 1,
                reason_credit_approval: 1,
                fixed_credit_approval_reason: 1,
                balance_payment_ondate: 1,
                gst_status: 1,
                tds_status: 1,
                close_date: 1,
                verified_amount: 1,
                verified_remark: 1,
                sale_booking_file: 1,
                remarks: 1,
                no_incentive: 1,
                old_sale_booking_id: 1,
                sale_booking_type: 1,
                rs_sale_booking_id: 1,
                service_taken_amount: 1,
                user_id: 1,
                created_by: 1,
                last_updated_by: 1,
                creation_date: 1,
                last_updated_date: 1,
                cust_name: 1,
                invoice_particular_id: 1,
                invoice_particular_name: 1,
                sno: 1,
                invoice_mnj_number: 1,
                invoice_mnj_date: 1,
                party_mnj_name: 1
            });

        res.status(200).send({ data: getData })
    } catch (error) {
        res.status(500).send({ error: error.message, sms: "error getting php payment account data" })
    }
}

exports.pendingInvoiceUpdate = async (req, res) => {
    try {
        const editPendingApprovalData = await phpPaymentBalListModel.findOneAndUpdate(
            { sale_booking_id: parseInt(req.body.sale_booking_id) },
            {
                invoice: req.file?.originalname,
                loggedin_user_id: req.body.loggedin_user_id,
                status: req.body.status,
                invoice_mnj_number: req.body.invoice_mnj_number,
                invoice_mnj_date: req.body.invoice_mnj_date,
                party_mnj_name: req.body.party_mnj_name
            },
            { new: true }
        );

        if (!editPendingApprovalData) {
            return response.returnFalse(
                200,
                req,
                res,
                "No Record Found ",
                {}
            );
        }

        if (req.file && req.file.originalname) {
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);
            const blob = bucket.file(req.file.originalname);
            editPendingApprovalData.invoice = blob.name;
            const blobStream = blob.createWriteStream();
            blobStream.on("finish", () => {
                // res.status(200).send("Success") 
            });
            blobStream.end(req.file.buffer);
        }
        return response.returnTrue(200, req, res, "Updation Successfully", editPendingApprovalData);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}