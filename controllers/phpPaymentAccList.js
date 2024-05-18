const response = require("../common/response.js");
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

exports.updateHideStatusForPhpPaymentAccData = async (req, res) => {
    try {
        //fields update in the collection
        const editHideStatusForPhpPaymentAccData = await phpPaymentAccListModel.findOneAndUpdate({
            _id: req.params.id
        }, {
            is_hide: req.body.is_hide
        }, {
            new: true
        });

        //if not found check
        if (!editHideStatusForPhpPaymentAccData) {
            return response.returnFalse(200, req, res, "No Reord Found ", {});
        }

        //success response send
        return response.returnTrue(200, req, res, "Updation Successfully", editHideStatusForPhpPaymentAccData);
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

async function callPhpApi(sendData) {
    try {
        const phpResponse = await axios.post(
            'https://sales.creativefuel.io/webservices/RestController.php?view=create_update_payment_detail',
            sendData,
            {
                headers: {
                    ...sendData.getHeaders(),
                },
            }
        );
        return phpResponse.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error("PHP API Endpoint Not Found:", error.response.data);
            throw new Error("PHP API Endpoint Not Found");
        } else {
            throw new Error(`Error calling PHP API: ${error.message}`);
        }
    }
}

exports.addAccListData = async (req, res) => {
    try {
        const existingTitle = await phpPaymentAccListModel.findOne({ title: req.body.title });
        if (existingTitle) {
            return response.returnFalse(409, req, res, "Title Name already exists", {});
        }
        const latestId = await phpPaymentAccListModel.findOne().sort({ id: -1 }).select({ id: 1 });
        const latestSno = await phpPaymentAccListModel.findOne().sort({ sno: -1 }).select({ sno: 1 });
        const latestIdVal = latestId ? latestId.id : 0;
        const latestSnoVal = latestSno ? latestSno.sno : 0;

        const currDate = new Date();

        const accData = new phpPaymentAccListModel({
            id: latestIdVal + 1,
            title: req.body.title,
            detail: req.body.detail,
            gst_bank: req.body.gst_bank,
            payment_type: req.body.payment_type,
            created_at: currDate,
            sno: latestSnoVal + 1
        });
        const result = await accData.save();

        //call api to save php Data
        const sendData = new FormData();
        sendData.append("insert_id", result.id)
        sendData.append('title', result.title);
        sendData.append('detail', result.detail);
        sendData.append('gst_bank', result.gst_bank);
        sendData.append('payment_type', result.payment_type);
        const phpResponse = await callPhpApi(sendData);
        return response.returnTrue(
            200,
            req,
            res,
            "AccListData Created Successfully",
            result
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};


exports.updateAccListData = async (req, res) => {
    try {
        const editaccdata = await phpPaymentAccListModel.findOneAndUpdate(
            { id: parseInt(req.body.id) },
            {
                title: req.body.title,
                detail: req.body.detail,
                gst_bank: req.body.gst_bank,
                payment_type: req.body.payment_type,
            },
            { new: true }
        );
        if (!editaccdata) {
            return response.returnFalse(
                200,
                req,
                res,
                "No Reord Found With This Vendor Id",
                {}
            );
        }

        //call api to save php Data
        const sendData = new FormData();
        sendData.append("update_id", result.id)
        sendData.append('title', result.title);
        sendData.append('detail', result.detail);
        sendData.append('gst_bank', result.gst_bank);
        sendData.append('payment_type', result.payment_type);

        const phpResponse = await callPhpApi(sendData);
        return response.returnTrue(200, req, res, "Updation Successfully", editaccdata);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}

exports.deleteAccListData = async (req, res) => {
    const id = req.params.id;
    const condition = { id };
    try {
        const result = await phpPaymentAccListModel.deleteOne(condition, { is_deleted: true });
        if (result.deletedCount === 1) {
            return res.status(200).json({
                success: true,
                message: `Payment Mode with ID ${id} deleted successfully`,
            });
        } else {
            return res.status(200).json({
                success: false,
                message: `Payment Mode with ID ${id} not found`,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the Payment Mode",
            error: error.message,
        });
    }
};  
