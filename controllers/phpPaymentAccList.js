const phpPaymentAccListModel = require("../models/phpPaymentAccListModel.js");
const phpFinanceModel = require("../models/phpFinanceModel.js");
const axios = require('axios');
const FormData = require('form-data');

async function checkIfDataExists(id) {
    const query = { id: id };
    const result = await phpPaymentAccListModel.findOne(query);
    return result !== null;
}

exports.savePhpPaymentAccDataInNode = async (req, res) => {
    try {
        // const loggedin_user_id = req.body.loggedin_user_id;
        const sendData = new FormData();
        sendData.append("loggedin_user_id", 36);
        const response = await axios.post(
            'https://sales.creativefuel.io/webservices/RestController.php?view=sales-payment_account_list', sendData,
            {
                headers: {
                    ...sendData.getHeaders(),
                },
            }
        )
        const responseData = response.data.body;

        for (const data of responseData) {

            const existingData = await checkIfDataExists(data.id)

            if (!existingData) {

                const creators = new phpPaymentAccListModel({
                    id: data.id,
                    title: data.title,
                    detail: data.detail,
                    gst_bank: data.gst_bank,
                    payment_type: data.payment_type,
                    status: data.status,
                    created_at: data.created_at,
                    sno: data.sno
                })
                const instav = await creators.save();


            } else {
                const updateExistingData = Object.keys(data).some(key => existingData[key] !== data[key])
                if (updateExistingData) {
                    await phpPaymentAccListModel.updateOne({ id: data.id },
                        {
                            $set: {
                                title: data.title,
                                detail: data.detail,
                                gst_bank: data.gst_bank,
                                payment_type: data.payment_type,
                                status: data.status,
                                created_at: data.created_at,
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
        res.send({ sms: "data copied in local db", status: 200 })
    } catch (error) {
        return res.status(500).send({ error: error.message, sms: 'error while adding data' })
    }
}

exports.getAllphpPaymentAccData = async (req, res) => {
    try {
        const getData = await phpPaymentAccListModel.find({})
        res.status(200).send({ data: getData })
    } catch (error) {
        res.status(500).send({ error: error.message, sms: "error getting php payment account data" })
    }
}

exports.getAllphpPaymentAccDataForStatus = async (req, res) => {
    try {
        const getData = await phpPaymentAccListModel.find({ status: 0 })
        res.status(200).send({ data: getData })
    } catch (error) {
        res.status(500).send({ error: error.message, sms: "error getting php payment account data" })
    }
}

exports.pendingApprovalUpdate = async (req, res) => {
    try {
        const editPendingApprovalData = await phpPaymentAccListModel.findOneAndUpdate(
            { payment_update_id: parseInt(req.body.payment_update_id) },
            {
                status: req.body.status
            },
            { new: true }
        );
        if (!editPendingApprovalData) {
            return response.returnFalse(
                200,
                req,
                res,
                "No Reord Found ",
                {}
            );
        }
        return response.returnTrue(200, req, res, "Updation Successfully", editPendingApprovalData);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}

exports.getAccListDataFromCustId = async (req, res) => {
    try {
        const getData = await phpFinanceModel.find({
            $or: [
                { cust_id: String(req.params.cust_id) },
                { cust_id: Number(req.params.cust_id) }
            ]
        })
        res.status(200).send({ data: getData })
    } catch (error) {
        res.status(500).send({ error: error.message, sms: "error getting php payment account data of customer details" })
    }
}