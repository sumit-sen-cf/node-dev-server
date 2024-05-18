const phpPaymentBalListModel = require("../models/phpPaymentBalListModel.js");
const axios = require('axios');
const FormData = require('form-data');

async function checkIfDataExists(sale_booking_id) {
    const query = { sale_booking_id: sale_booking_id };
    const result = await phpPaymentBalListModel.findOne(query);
    return result !== null;
}

// exports.savePhpSaleBookingTdsDataInNode = async (req, res) => {
//     try {
//         // const loggedin_user_id = req.body.loggedin_user_id;
//         const sendData = new FormData();
//         sendData.append("loggedin_user_id", 36);
//         const response = await axios.post(
//             'https://sales.creativefuel.io/webservices/RestController.php?view=sales-sale_booking_for_tds', sendData,
//             {
//                 headers: {
//                     ...sendData.getHeaders(),
//                 },
//             }
//         )
//         const responseData = response.data.body;

//         await Promise.all(responseData.map(async (data) => {
//             const existingData = await checkIfDataExists(data.sale_booking_id)

//             if (!existingData) {

//                 const creators = new phpPaymentBalListModel({
//                     sno: data.sno,
//                     sale_booking_id: data.sale_booking_id,
//                     cust_name: data.cust_name,
//                     sales_exe_name: data.sales_exe_name,
//                     sale_booking_date: data.sale_booking_date,
//                     campaign_amount: data.campaign_amount,
//                     base_amount: data.base_amount,
//                     gst_amount: data.gst_amount,
//                     net_amount: data.net_amount,
//                     total_paid_amount: data.total_paid_amount,
//                     total_refund_amount: data.total_refund_amount,
//                     balance_refund_amount: data.balance_refund_amount,
//                     net_balance_amount_to_pay_percentage: data.net_balance_amount_to_pay_percentage,
//                     booking_created_date: data.booking_created_date,
//                     show_fstatus: data.show_fstatus
//                 })
//                 const instav = await creators.save();
//             } else {
//                 await phpPaymentBalListModel.findOneAndUpdate(
//                     { sale_booking_id: data.sale_booking_id },
//                     {
//                         $set: {
//                             sno: data.sno,
//                             sale_booking_id: data.sale_booking_id,
//                             cust_name: data.cust_name,
//                             sales_exe_name: data.sales_exe_name,
//                             sale_booking_date: data.sale_booking_date,
//                             campaign_amount: data.campaign_amount,
//                             base_amount: data.base_amount,
//                             gst_amount: data.gst_amount,
//                             net_amount: data.net_amount,
//                             total_paid_amount: data.total_paid_amount,
//                             total_refund_amount: data.total_refund_amount,
//                             balance_refund_amount: data.balance_refund_amount,
//                             net_balance_amount_to_pay_percentage: data.net_balance_amount_to_pay_percentage,
//                             booking_created_date: data.booking_created_date,
//                             show_fstatus: data.show_fstatus
//                         }
//                     },
//                     { new: true }
//                 );
//                 res.status(200).json({ msg: "Data already insterted there is no new data available to insert." });
//             }
//         }));

//         return res.send({ sms: "data copied in local db", status: 200 })
//     } catch (error) {
//         return res.status(500).send({ error: error.message, sms: 'error while adding data' })
//     }
// }

exports.savePhpSaleBookingTdsDataInNode = async (req, res) => {
    try {
        const sendData = new FormData();
        sendData.append("loggedin_user_id", 36);

        const response = await axios.post(
            'https://sales.creativefuel.io/webservices/RestController.php?view=sales-sale_booking_for_tds',
            sendData,
            {
                headers: {
                    ...sendData.getHeaders(),
                },
            }
        );

        const responseData = response.data.body;

        await Promise.all(responseData.map(async (data) => {
            const existingData = await checkIfDataExists(data.sale_booking_id);

            if (!existingData) {
                await phpPaymentBalListModel.findOneAndUpdate(
                    { sale_booking_id: data.sale_booking_id },
                    {
                        $set: {
                            sno: data.sno,
                            sale_booking_id: data.sale_booking_id,
                            cust_name: data.cust_name,
                            sales_exe_name: data.sales_exe_name,
                            sale_booking_date: data.sale_booking_date,
                            campaign_amount: data.campaign_amount,
                            base_amount: data.base_amount,
                            gst_amount: data.gst_amount,
                            net_amount: data.net_amount,
                            total_paid_amount: data.total_paid_amount,
                            total_refund_amount: data.total_refund_amount,
                            balance_refund_amount: data.balance_refund_amount,
                            net_balance_amount_to_pay_percentage: data.net_balance_amount_to_pay_percentage,
                            booking_created_date: data.booking_created_date,
                            show_fstatus: data.show_fstatus
                        }
                    },
                    { upsert: true, new: true }
                );
            } else {
                console.log("Data already inserted. Sale Booking ID: ", data.sale_booking_id);
            }
        }));

        return res.status(200).send({ message: "Data copied to the local database." });
    } catch (error) {
        console.error("Error while adding data:", error);
        return res.status(500).send({ error: error.message, message: 'Error while adding data' });
    }
};

exports.getAllphpSaleBookingTdsData = async (req, res) => {
    try {
        const getData = await phpPaymentBalListModel.find({}).select({
            _id: 1,
            sno: 1,
            sale_booking_id: 1,
            cust_name: 1,
            sales_exe_name: 1,
            sale_booking_date: 1,
            campaign_amount: 1,
            base_amount: 1,
            gst_amount: 1,
            net_amount: 1,
            total_paid_amount: 1,
            total_refund_amount: 1,
            balance_refund_amount: 1,
            net_balance_amount_to_pay_percentage: 1,
            booking_created_date: 1,
            show_fstatus: 1
        });
        res.status(200).send({ data: getData })
    } catch (error) {
        res.status(500).send({ error: error.message, sms: "error getting php payment account data" })
    }
}



/*Sale Booking Tds Verificaton */
exports.savePhpSaleBookingTdsVerificationDataInNode = async (req, res) => {
    try {
        // const loggedin_user_id = req.body.loggedin_user_id;
        const sendData = new FormData();
        sendData.append("loggedin_user_id", 36);
        const response = await axios.post(
            'https://sales.creativefuel.io/webservices/RestController.php?view=sales-sale_booking_tds_verification', sendData,
            {
                headers: {
                    ...sendData.getHeaders(),
                },
            }
        )
        const responseData = response.data.body;
        const promise = responseData.map(async (data) => {

            const existingData = await checkIfDataExists(data.sale_booking_id)

            if (!existingData) {
                const creators = new phpPaymentBalListModel({
                    sale_booking_id: data.sale_booking_id,
                    sales_exe_name: data.sales_exe_name,
                    total_refund_amount: data.total_refund_amount,
                    balance_refund_amount: data.balance_refund_amount,
                    net_balance_amount_to_pay_percentage: data.net_balance_amount_to_pay_percentage,
                    booking_created_date: data.booking_created_date,
                    show_fstatus: data.show_fstatus,
                    execution_status: data.execution_status,
                    full_or_partial: data.full_or_partial,
                    payment_approval_status: data.payment_approval_status,
                    total_record_services: data.total_record_services,
                    total_record_services_amount: data.total_record_services_amount,
                    total_execution_approval: data.total_execution_approval,
                    total_execution_approval_pending: data.total_execution_approval,
                    total_execution_approval_sent: data.total_execution_approval_sent,
                    total_execution_approval_done: data.total_execution_approval_done,
                    total_execution_approval_pending_amount: data.total_execution_approval_pending_amount,
                    total_execution_approval_sent_amount: data.total_execution_approval_sent_amount,
                    total_execution_approval_done_amount: data.total_execution_approval_done_amount,
                    total_refund_amount: data.total_refund_amount,
                    manager_refund_reason: data.manager_refund_reason,
                    credit_limit: data.credit_limit,
                    access: data.acsess
                })
                const instav = await creators.save();
            } else {
                await phpPaymentBalListModel.findOneAndUpdate(
                    { sale_booking_id: data.sale_booking_id },
                    {
                        $set: {
                            sales_exe_name: data.sales_exe_name,
                            total_refund_amount: data.total_refund_amount,
                            balance_refund_amount: data.balance_refund_amount,
                            net_balance_amount_to_pay_percentage: data.net_balance_amount_to_pay_percentage,
                            booking_created_date: data.booking_created_date,
                            show_fstatus: data.show_fstatus,
                            execution_status: data.execution_status,
                            full_or_partial: data.full_or_partial,
                            payment_approval_status: data.payment_approval_status,
                            total_record_services: data.total_record_services,
                            total_record_services_amount: data.total_record_services_amount,
                            total_execution_approval: data.total_execution_approval,
                            total_execution_approval_pending: data.total_execution_approval,
                            total_execution_approval_sent: data.total_execution_approval_sent,
                            total_execution_approval_done: data.total_execution_approval_done,
                            total_execution_approval_pending_amount: data.total_execution_approval_pending_amount,
                            total_execution_approval_sent_amount: data.total_execution_approval_sent_amount,
                            total_execution_approval_done_amount: data.total_execution_approval_done_amount,
                            total_refund_amount: data.total_refund_amount,
                            manager_refund_reason: data.manager_refund_reason,
                            credit_limit: data.credit_limit,
                            access: data.acsess
                        }
                    },
                    { new: true }
                );

            }
        })

        let resResult = await Promise.all(promise);

        return res.send({ sms: "data copied in local db", status: 200 })
    } catch (error) {
        return res.status(500).send({ error: error.message, sms: 'error while adding data' })
    }
}


exports.getAllphpSaleBookingTdsVerificationData = async (req, res) => {
    try {
        const getData = await phpPaymentBalListModel.find({}).select({
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
            full_or_partial: 1,
            payment_approval_status: 1,
            total_record_services: 1,
            total_record_services_amount: 1,
            total_execution_approval: 1,
            total_execution_approval_pending: 1,
            total_execution_approval_sent: 1,
            total_execution_approval_done: 1,
            total_execution_approval_pending_amount: 1,
            total_execution_approval_sent_amount: 1,
            total_execution_approval_done_amount: 1,
            total_refund_amount: 1,
            manager_refund_reason: 1,
            credit_limit: 1,
            access: 1,
            sno: 1
        });
        res.status(200).send({ data: getData })
    } catch (error) {
        res.status(500).send({ error: error.message, sms: "error getting php payment account data" })
    }
}