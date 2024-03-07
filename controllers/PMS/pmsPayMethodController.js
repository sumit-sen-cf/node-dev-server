const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const pmsPayModel = require('../../models/PMS/pmsPayMethodModel');

//POST- PMS_Pay_Method
exports.createPayMethod = async (req, res) => {
    try {
        const checkDuplicacy = await pmsPayModel.findOne({ payMethod_name: req.body.payMethod_name });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "PMS pay-method data alredy exist!",
            });
        }
        const { payMethod_name, description, created_date_time, created_by, last_updated_date, last_updated_by } = req.body;
        const addPayData = new pmsPayModel({
            payMethod_name: payMethod_name,
            description: description,
            created_date_time: created_date_time,
            created_by: created_by,
            last_updated_date: last_updated_date,
            last_updated_by: last_updated_by
        });
        await addPayData.save();
        return res.status(200).json({
            status: 200,
            message: "PMS pay-method data added successfully!",
            data: addPayData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_PayMethod-By-ID
exports.getPayDetail = async (req, res) => {
    try {
        const pmsPayMethodData = await pmsPayModel.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(req.params.id) },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    pay_method_id: 1,
                    payMethod_name: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (pmsPayMethodData) {
            return res.status(200).json({
                status: 200,
                message: "PMS pay-method details successfully!",
                data: pmsPayMethodData,
            });
        }
        return res.status(404).json({
            status: 404,
            message: message.DATA_NOT_FOUND,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};

//PUT - updateVendorType_By-ID
exports.updatePayData = async (req, res) => {
    try {
        const { id } = req.params;
        const { payMethod_name, description, created_date_time, created_by, last_updated_date, last_updated_by } = req.body;
        const payData = await pmsPayModel.findOne({ _id: id });
        if (!payData) {
            return res.send("Invalid pay-method Id...");
        }
        await payData.save();
        const payUpdatedData = await pmsPayModel.findOneAndUpdate({ _id: id }, {
            $set: {
                payMethod_name,
                description,
                created_date_time,
                created_by,
                last_updated_date,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "PMS pay-method data updated successfully!",
            data: payUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_Platform_List
exports.getAllPayList = async (req, res) => {
    try {
        const pmsPayData = await pmsPayModel.aggregate([
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "last_updated_by",
                    foreignField: "user_id",
                    as: "user_data",
                },
            },
            {
                $unwind: {
                    path: "$user_data",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    payMethod_name: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    last_updated_by_name: "$user_data.user_name",
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                }
            }
        ])
        if (!pmsPayData) {
            return res.status(500).send({
                succes: true,
                message: "PMS pay-method data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "PMS pay-method data list successfully!",
            data: pmsPayData
        });
    } catch (err) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//DELETE - PMS_Pay-method By-ID
exports.deletePayData = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const payDataDelete = await pmsPayModel.findOne({ _id: id });
        if (!payDataDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await pmsPayModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "PMS pay-method data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};