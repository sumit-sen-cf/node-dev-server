const phpPaymentBalListModel = require("../models/phpPaymentBalListModel.js");
const axios = require('axios');
const FormData = require('form-data');
const vari = require('../variables.js');
const {storage} = require('../common/uploadFile.js')

async function checkIfDataExists(sale_booking_id) {
    const query = { sale_booking_id: sale_booking_id };
    const result = await phpPaymentBalListModel.findOne(query);
    return result !== null;
}

exports.savePhpPaymentBalDataInNode = async (req, res) => {
    try {
        // const loggedin_user_id = req.body.loggedin_user_id;
        const sendData = new FormData();
        sendData.append("loggedin_user_id", 36);
        const response = await axios.post(
            'https://salesdev.we-fit.in/webservices/RestController.php?view=sales-balance_payment_list', sendData,
            {
                headers: {
                    ...sendData.getHeaders(),
                },
            }
        )
        const responseData = response.data.body;

        await Promise.all(responseData.map(async (data) => {
            const existingData = await checkIfDataExists(data.sale_booking_id)

            if (!existingData) {

                const creators = new phpPaymentBalListModel({
                    sale_booking_id: data.sale_booking_id,
                    campaign_amount: data.campaign_amount,
                    sale_booking_date: data.sale_booking_date,
                    user_id: data.user_id,
                    created_by: data.created_by,
                    manager_approval: data.manager_approval,
                    invoice_creation_status: data.invoice_creation_status,
                    salesexe_credit_approval: data.salesexe_credit_approval,
                    payment_update_id: data.payment_update_id,
                    payment_amount: data.payment_amount,
                    payment_type: data.payment_type,
                    cust_name: data.cust_name,
                    total_paid_amount: data.total_paid_amount,
                    sno: data.sno
                })
                const instav = await creators.save();
            } else {
                const updateExistingData = Object.keys(data).some(key => existingData[key] !== data[key])
                if (updateExistingData) {
                    await phpPaymentBalListModel.updateOne({ sale_booking_id: data.sale_booking_id },
                        {
                            $set: {
                                campaign_amount: data.campaign_amount,
                                sale_booking_date: data.sale_booking_date,
                                user_id: data.user_id,
                                created_by: data.created_by,
                                manager_approval: data.manager_approval,
                                invoice_creation_status: data.invoice_creation_status,
                                salesexe_credit_approval: data.salesexe_credit_approval,
                                payment_update_id: data.payment_update_id,
                                payment_amount: data.payment_amount,
                                payment_type: data.payment_type,
                                cust_name: data.cust_name,
                                total_paid_amount: data.total_paid_amount,
                                sno: data.sno
                            }
                        }
                    )
                } else {
                    return res.status(200).json({ msg: "Data already insterted there is no new data available to insert." })
                }
                // return res.status(200).json({ msg: "Data already insterted there is no new data available to insert." })
            }
        }));

        res.send({ sms: "data copied in local db", status: 200 })
    } catch (error) {
        return res.status(500).send({ error: error.message, sms: 'error while adding data' })
    }
}

exports.getAllphpPaymentBalData = async (req, res) => {
    try {
        const getData = await phpPaymentBalListModel.find({})
        // .select( { _id: 1,
        //     sale_booking_id: 1,
        //     campaign_amount: 1,
        //     sale_booking_date: 1,
        //     user_id: 1,
        //     created_by: 1,
        //     manager_approval: 1,
        //     invoice_creation_status: 1,
        //     salesexe_credit_approval: 1,
        //     payment_update_id: 1,
        //     payment_amount: 1,
        //     payment_type: 1,
        //     cust_name: 1,
        //     total_paid_amount: 1,
        //     sno: 1})
        res.status(200).send({ data: getData })
    } catch (error) {
        res.status(500).send({ error: error.message, sms: "error getting php payment account data" })
    }
}

exports.balancePaymentListUpdate = async (req, res) => {
    try {
        let payment_screenshot;
        
        const bucketName = vari.BUCKET_NAME;
        const bucket = storage.bucket(bucketName);
        const blob = bucket.file(req.file.originalname);
        payment_screenshot = blob.name;
        const blobStream = blob.createWriteStream();
        blobStream.on("finish", () => { res.status(200).send("Success") });
        blobStream.end(req.file.buffer);

        const editPendingApprovalRefundData = await phpPaymentBalListModel.findOneAndUpdate(
            { sale_booking_id: parseInt(req.body.sale_booking_id) },
            {

                status: req.body.status,
                payment_screenshot
            },
            { new: true }
        );
        if (!editPendingApprovalRefundData) {
            return response.returnFalse(
                200,
                req,
                res,
                "No Record Found ",
                {}
            );
        }
        return response.returnTrue(200, req, res, "Updation Successfully", editPendingApprovalRefundData);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}