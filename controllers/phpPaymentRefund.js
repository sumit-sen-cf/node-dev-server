const phpPaymentRefundModel = require("../models/phpPaymentRefundModel.js");
const axios = require('axios');
const FormData = require('form-data');
const vari = require('../variables.js');
const {storage} = require('../common/uploadFile.js')

async function checkIfDataExists(sale_booking_refund_id) {
    const query = { sale_booking_refund_id: sale_booking_refund_id };
    const result = await phpPaymentRefundModel.findOne(query);
    return result !== null;
}

exports.savePhpPaymentRefundInNode = async (req, res) => {
    try {
        // const loggedin_user_id = req.body.loggedin_user_id;
        const sendData = new FormData();
        sendData.append("loggedin_user_id",36);
        const response = await axios.post(
            'https://salesdev.we-fit.in/webservices/RestController.php?view=sales-payment_refund_action',  sendData,
            {
                headers: {
                    ...sendData.getHeaders(),
                },
            }
        )
        const responseData = response.data.body;
        
        for (const data of responseData) {
          
            const existingData = await checkIfDataExists(data.sale_booking_refund_id)
            
            if (!existingData) {

                const creators = new phpPaymentRefundModel({
                    sale_booking_id: data.sale_booking_id,
                    sale_booking_refund_id: data.sale_booking_refund_id,
                    refund_amount: data.refund_amount,
                    refund_files: data.refund_files,
                    manager_refund_status: data.manager_refund_status,
                    manager_refund_reason: data.manager_refund_reason,
                    finance_refund_status: data.finance_refund_status,
                    finance_refund_reason: data.finance_refund_reason,
                    creation_date: data.creation_date,
                    last_updated_date: data.last_updated_date,
                    cust_id: data.cust_id,
                    campaign_amount: data.campaign_amount,
                    sale_booking_date: data.sale_booking_date,
                    cust_name: data.cust_name,
                    sno: data.sno
                })
                const instav = await creators.save();
             
                
            }else{
                const updateExistingData = Object.keys(data).some(key => existingData[key] !== data[key])
                if (updateExistingData) {
                    await phpPaymentRefundModel.updateOne({ sale_booking_refund_id: data.sale_booking_refund_id },
                        {
                            $set: {
                                sale_booking_id: data.sale_booking_id,
                                refund_amount: data.refund_amount,
                                refund_files: data.refund_files,
                                manager_refund_status: data.manager_refund_status,
                                manager_refund_reason: data.manager_refund_reason,
                                finance_refund_status: data.finance_refund_status,
                                finance_refund_reason: data.finance_refund_reason,
                                creation_date: data.creation_date,
                                last_updated_date: data.last_updated_date,
                                cust_id: data.cust_id,
                                campaign_amount: data.campaign_amount,
                                sale_booking_date: data.sale_booking_date,
                                cust_name: data.cust_name,
                                sno: data.sno
                            }
                        }
                    )
                } else {
                    return res.status(200).json({ msg: "Data already insterted there is no new data available to insert." })
                }
            //   return  res.status(200).json({msg:"Data already insterted there is no new data available to insert."})
            }
        }
        res.send({ sms:"data copied in local db", status: 200 })
    } catch (error) {
        return res.status(500).send({ error: error.message, sms: 'error while adding data' })
    }
}

exports.getAllphpPaymentRefundData = async (req, res) => {
    try {
        const getData = await phpPaymentRefundModel.find({})
        res.status(200).send({data:getData})
    } catch (error) {
        res.status(500).send({error: error.message, sms:"error getting php payment refund data"})
    }
}


exports.getAllphpPaymentRefundDataStatus = async (req, res) => {
    try {
        const getData = await phpPaymentRefundModel.find({finance_refund_status : 0});
        res.status(200).send({data:getData})
    } catch (error) {
        res.status(500).send({error: error.message, sms:"error getting php payment refund data"})
    }
}

exports.pendingApprovalRefundUpdate = async (req,res) => {
    try {
        let payment_screenshot;

        const bucketName = vari.BUCKET_NAME;
        const bucket = storage.bucket(bucketName);
        const blob = bucket.file(req.file.originalname);
        payment_screenshot = blob.name;
        const blobStream = blob.createWriteStream();
        blobStream.on("finish", () => { res.status(200).send("Success") });
        blobStream.end(req.file.buffer);

        const editPendingApprovalRefundData = await phpPaymentAccListModel.findOneAndUpdate(
            { sale_booking_refund_id: parseInt(req.body.sale_booking_refund_id) },
            {
               status : req.body.status,
               payment_screenshot
            },
            { new: true }
        );
        if (!editPendingApprovalRefundData) {
            return response.returnFalse(
                200,
                req,
                res,
                "No Reord Found ",
                {}
            );
        }
        return response.returnTrue(200, req, res, "Updation Successfully", editPendingApprovalRefundData);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}

