const phpFinanceModel = require("../models/phpFinanceModel.js");
const axios = require('axios');
const FormData = require('form-data');

async function checkIfDataExists(payment_update_id) {
    const query = { payment_update_id: payment_update_id };
    const result = await phpFinanceModel.findOne(query);
    return result !== null;
}

exports.savePhpFinanceDataInNode = async (req, res) => {
    try {
        // const loggedin_user_id = req.body.loggedin_user_id;
        const sendData = new FormData();
        sendData.append("loggedin_user_id", 36);
        const response = await axios.post(
            'https://production.sales.creativefuel.io/webservices/RestController.php?view=pending_payment_list', sendData,
            {
                headers: {
                    ...sendData.getHeaders(),
                },
            }
        )
        const responseData = response.data.body;

        for (const data of responseData) {

            const existingData = await checkIfDataExists(data.payment_update_id)

            if (!existingData) {

                const creators = new phpFinanceModel({
                    payment_update_id: data.payment_update_id,
                    payment_date: data.payment_date,
                    sale_booking_id: data.sale_booking_id,
                    payment_amount: data.payment_amount,
                    payment_amount_show: data.payment_amount_show,
                    payment_mode: data.payment_mode,
                    payment_detail_id: data.payment_detail_id,
                    payment_screenshot: data.payment_screenshot,
                    payment_type: data.payment_type,
                    payment_ref_no: data.payment_ref_no,
                    credit_limit_check: data.credit_limit_check,
                    user_credit_limit_check: data.user_credit_limit_check,
                    payment_approval_status: data.payment_approval_status,
                    reason_credit_approval: data.reason_credit_approval,
                    balance_payment_ondate: data.balance_payment_ondate,
                    action_reason: data.action_reason,
                    remarks: data.remarks,
                    created_by: data.created_by,
                    last_updated_by: data.last_updated_by,
                    creation_date: data.creation_date,
                    last_updated_date: data.last_updated_date,
                    cust_id: parseInt(data.cust_id),
                    sale_booking_date: data.sale_booking_date,
                    campaign_amount: data.campaign_amount,
                    base_amount: data.base_amount,
                    gst_amount: data.gst_amount,
                    net_amount: data.net_amount,
                    campaign_amount_without_gst: data.campaign_amount_without_gst,
                    total_paid_amount: data.total_paid_amount,
                    balance: data.balance,
                    description: data.description,
                    status_desc: data.status_desc,
                    invoice_creation_status: data.invoice_creation_status,
                    invoice: data.invoice,
                    invoice_particular: data.invoice_particular,
                    invoice_action_reason: data.invoice_action_reason,
                    manager_approval: data.manager_approval,
                    salesexe_credit_approval: data.salesexe_credit_approval,
                    salesexe_credit_used: data.salesexe_credit_used,
                    execution_approval: data.execution_approval,
                    last_action_reason: data.last_action_reason,
                    execution_date: data.execution_date,
                    execution_remark: data.execution_remark,
                    execution_done_by: data.execution_done_by,
                    execution_status: data.execution_status,
                    execution_summary: data.execution_summary,
                    fixed_credit_approval_reason: data.fixed_credit_approval_reason,
                    gst_status: data.gst_status,
                    tds_status: data.tds_status,
                    close_date: data.close_date,
                    verified_amount: data.verified_amount,
                    verified_remark: data.verified_remark,
                    sale_booking_file: data.sale_booking_file,
                    no_incentive: data.no_incentive,
                    old_sale_booking_id: data.old_sale_booking_id,
                    sale_booking_type: data.sale_booking_type,
                    rs_sale_booking_id: data.rs_sale_booking_id,
                    service_taken_amount: data.service_taken_amount,
                    user_id: data.user_id,
                    cust_type: data.cust_type,
                    cust_name: data.cust_name,
                    mobile_no: data.mobile_no,
                    alternative_no: data.alternative_no,
                    email_id: data.email_id,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    website: data.website,
                    instagram_username: data.instagram_username,
                    lead_source_id: data.lead_source_id,
                    new_type: data.new_type,
                    sales_category_id: data.sales_category_id,
                    sales_sub_category_id: data.sales_sub_category_id,
                    company_name: data.company_name,
                    gst_no: data.gst_no,
                    pancard_no: data.pancard_no,
                    contact_person_name: data.contact_person_name,
                    gst_doc: data.gst_doc,
                    pancard_doc: data.pancard_doc,
                    other_doc: data.other_doc,
                    other_doc_name: data.other_doc_name,
                    id: data.id,
                    title: data.title,
                    detail: data.detail,
                    gst_bank: data.gst_bank,
                    status: data.status,
                    created_at: data.created_at,
                    sno: data.sno,
                    user_name: data.user_name
                })
                const instav = await creators.save();


            } else {
                const updateExistingData = Object.keys(data).some(key => existingData[key] !== data[key])
                if (updateExistingData) {
                    await phpFinanceModel.updateOne({ payment_update_id: data.payment_update_id },
                        {
                            $set: {
                                payment_date: data.payment_date,
                                sale_booking_id: data.sale_booking_id,
                                payment_amount: data.payment_amount,
                                payment_amount_show: data.payment_amount_show,
                                payment_mode: data.payment_mode,
                                payment_detail_id: data.payment_detail_id,
                                payment_screenshot: data.payment_screenshot,
                                payment_type: data.payment_type,
                                payment_ref_no: data.payment_ref_no,
                                credit_limit_check: data.credit_limit_check,
                                user_credit_limit_check: data.user_credit_limit_check,
                                payment_approval_status: data.payment_approval_status,
                                reason_credit_approval: data.reason_credit_approval,
                                balance_payment_ondate: data.balance_payment_ondate,
                                action_reason: data.action_reason,
                                remarks: data.remarks,
                                created_by: data.created_by,
                                last_updated_by: data.last_updated_by,
                                creation_date: data.creation_date,
                                last_updated_date: data.last_updated_date,
                                cust_id: parseInt(data.cust_id),
                                sale_booking_date: data.sale_booking_date,
                                campaign_amount: data.campaign_amount,
                                base_amount: data.base_amount,
                                gst_amount: data.gst_amount,
                                net_amount: data.net_amount,
                                campaign_amount_without_gst: data.campaign_amount_without_gst,
                                total_paid_amount: data.total_paid_amount,
                                balance: data.balance,
                                description: data.description,
                                status_desc: data.status_desc,
                                invoice_creation_status: data.invoice_creation_status,
                                invoice: data.invoice,
                                invoice_particular: data.invoice_particular,
                                invoice_action_reason: data.invoice_action_reason,
                                manager_approval: data.manager_approval,
                                salesexe_credit_approval: data.salesexe_credit_approval,
                                salesexe_credit_used: data.salesexe_credit_used,
                                execution_approval: data.execution_approval,
                                last_action_reason: data.last_action_reason,
                                execution_date: data.execution_date,
                                execution_remark: data.execution_remark,
                                execution_done_by: data.execution_done_by,
                                execution_status: data.execution_status,
                                execution_summary: data.execution_summary,
                                fixed_credit_approval_reason: data.fixed_credit_approval_reason,
                                gst_status: data.gst_status,
                                tds_status: data.tds_status,
                                close_date: data.close_date,
                                verified_amount: data.verified_amount,
                                verified_remark: data.verified_remark,
                                sale_booking_file: data.sale_booking_file,
                                no_incentive: data.no_incentive,
                                old_sale_booking_id: data.old_sale_booking_id,
                                sale_booking_type: data.sale_booking_type,
                                rs_sale_booking_id: data.rs_sale_booking_id,
                                service_taken_amount: data.service_taken_amount,
                                user_id: data.user_id,
                                cust_type: data.cust_type,
                                cust_name: data.cust_name,
                                mobile_no: data.mobile_no,
                                alternative_no: data.alternative_no,
                                email_id: data.email_id,
                                address: data.address,
                                city: data.city,
                                state: data.state,
                                country: data.country,
                                website: data.website,
                                instagram_username: data.instagram_username,
                                lead_source_id: data.lead_source_id,
                                new_type: data.new_type,
                                sales_category_id: data.sales_category_id,
                                sales_sub_category_id: data.sales_sub_category_id,
                                company_name: data.company_name,
                                gst_no: data.gst_no,
                                pancard_no: data.pancard_no,
                                contact_person_name: data.contact_person_name,
                                gst_doc: data.gst_doc,
                                pancard_doc: data.pancard_doc,
                                other_doc: data.other_doc,
                                other_doc_name: data.other_doc_name,
                                id: data.id,
                                title: data.title,
                                detail: data.detail,
                                gst_bank: data.gst_bank,
                                status: data.status,
                                created_at: data.created_at,
                                sno: data.sno,
                                user_name: data.user_name
                            }
                        }
                    )
                } else {
                    return res.status(200).json({ msg: "Data already insterted there is no new data available to insert." })
                }
                //   return  res.status(200).json({msg:"Data already insterted there is no new data available to insert."})
            }
        }
        res.send({ sms: "data copied in local db", status: 200 })
    } catch (error) {
        return res.status(500).send({ error: error.message, sms: 'error while adding data' })
    }
}

exports.getAllphpFinanceData = async (req, res) => {
    try {
        const getData = await phpFinanceModel.find({})
        res.status(200).send({ data: getData })
    } catch (error) {
        res.status(500).send({ error: error.message, sms: "error getting php finance data" })
    }
}

exports.getAllphpFinanceDataPending = async (req, res) => {
    try {
        const getData = await phpFinanceModel.find({ payment_approval_status: 0 });
        res.status(200).send({ data: getData })
    } catch (error) {
        res.status(500).send({ error: error.message, sms: "error getting php payment refund data" })
    }
}