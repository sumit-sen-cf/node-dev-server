const phpIncentiveModel = require("../models/phpIncentiveModel.js");
const axios = require('axios');
const FormData = require('form-data');

async function checkIfDataExists(incentive_request_id) {
    const query = { incentive_request_id: incentive_request_id };
    const result = await phpIncentiveModel.findOne(query);
    return result !== null;
}

exports.savePhpIncentiveInNode = async (req, res) => {
    try {
        // const loggedin_user_id = req.body.loggedin_user_id;
        const sendData = new FormData();
        sendData.append("loggedin_user_id", 36);
        const response = await axios.post(
            'https://sales.creativefuel.io/webservices/RestController.php?view=sales-incentive_request_list', sendData,
            {
                headers: {
                    ...sendData.getHeaders(),
                },
            }
        )
        const responseData = response.data.body;
      
        for (const data of responseData) {

            const existingData = await checkIfDataExists(data.incentive_request_id)

            if (!existingData) {

                const creators = new phpIncentiveModel({
                    incentive_request_id: data.incentive_request_id,
                    sales_executive_id: data.sales_executive_id,
                    request_amount: data.request_amount,
                    finance_status: data.finance_status,
                    account_number: data.account_number,
                    payment_ref_no: data.payment_ref_no,
                    remarks: data.remarks,
                    creation_date: data.creation_date,
                    last_updated_date: data.last_updated_date,
                    name: data.name,
                    sno: data.sno
                })
                const instav = await creators.save();


            } else {
                const updateExistingData = Object.keys(data).some(key => existingData[key] !== data[key])
                if (updateExistingData) {
                    await phpIncentiveModel.updateOne({ incentive_request_id: data.incentive_request_id },
                        {
                            $set: {
                                sales_executive_id: data.sales_executive_id,
                                request_amount: data.request_amount,
                                finance_status: data.finance_status,
                                account_number: data.account_number,
                                payment_ref_no: data.payment_ref_no,
                                remarks: data.remarks,
                                creation_date: data.creation_date,
                                last_updated_date: data.last_updated_date,
                                name: data.name,
                                sno: 1
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

exports.getAllphpIncentiveData = async (req, res) => {
    try {
        const getData = await phpIncentiveModel.find({})
        res.status(200).send({ data: getData })
    } catch (error) {
        res.status(500).send({ error: error.message, sms: "error getting php incentive refund data" })
    }
}