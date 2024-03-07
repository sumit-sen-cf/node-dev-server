const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const pmsPayCycleModel = require('../../models/PMS/pmsPayCycleModel');

//POST- PMS_Pay_Cycle
exports.createPayCycle = async (req, res) => {
    try {
        const checkDuplicacy = await pmsPayCycleModel.findOne({ cycle_name: req.body.cycle_name });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "PMS pay-cycle data alredy exist!",
            });
        }
        const { cycle_name, description, created_date_time, created_by, last_updated_date, last_updated_by } = req.body;
        const addPayCycleData = new pmsPayCycleModel({
            cycle_name: cycle_name,
            description: description,
            created_date_time: created_date_time,
            created_by: created_by,
            last_updated_date: last_updated_date,
            last_updated_by: last_updated_by
        });
        await addPayCycleData.save();
        return res.status(200).json({
            status: 200,
            message: "PMS pay-cycle data added successfully!",
            data: addPayCycleData,
        });
    } catch (error) {
        console.log("error-----", error)
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_Cycle-By-ID
exports.getPayCycleDetail = async (req, res) => {
    try {
        const pmsPayCycledData = await pmsPayCycleModel.aggregate([
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
                    pay_cycle_id: 1,
                    cycle_name: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (pmsPayCycledData) {
            return res.status(200).json({
                status: 200,
                message: "PMS pay-cycle details successfully!",
                data: pmsPayCycledData,
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
exports.updatePayCycle = async (req, res) => {
    try {
        const { id } = req.params;
        const { cycle_name, description, created_date_time, created_by, last_updated_date, last_updated_by } = req.body;
        const payCycleData = await pmsPayCycleModel.findOne({ _id: id });
        if (!payCycleData) {
            return res.send("Invalid pay-method Id...");
        }
        await payCycleData.save();
        const payCycleUpdatedData = await pmsPayCycleModel.findOneAndUpdate({ _id: id }, {
            $set: {
                cycle_name,
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
            message: "PMS pay-cycle data updated successfully!",
            data: payCycleUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_Platform_List
exports.getAllPayCycleList = async (req, res) => {
    try {
        const pmsPayCycleData = await pmsPayCycleModel.aggregate([
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
                    cycle_name: 1,
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
        if (!pmsPayCycleData) {
            return res.status(500).send({
                succes: true,
                message: "PMS pay-cycle data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "PMS pay-cycle data list successfully!",
            data: pmsPayCycleData
        });
    } catch (err) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//DELETE - PMS_Pay-method By-ID
exports.deletePayCycleData = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const payCycleDataDelete = await pmsPayCycleModel.findOne({ _id: id });
        if (!payCycleDataDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await pmsPayCycleModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "PMS pay-cycle data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};