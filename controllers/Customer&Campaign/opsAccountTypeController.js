const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const opsAccountTypeModel = require('../../models/Customer&Campaign/opsAccountTypeModel');

//POST- OPS_Account_Type
exports.createAccountType = async (req, res) => {
    try {
        const checkDuplicacy = await opsAccountTypeModel.findOne({ account_type_name: req.body.account_type_name });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "OPS account type data alredy exist!",
            });
        }
        const { account_type_name, description, created_by, last_updated_by } = req.body;
        const addAccountTypeData = new opsAccountTypeModel({
            account_type_name: account_type_name,
            description: description,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addAccountTypeData.save();
        return res.status(200).json({
            status: 200,
            message: "OPS account type data added successfully!",
            data: addAccountTypeData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - OPS_get_Account_Type - BY_ID
exports.getAccountTypeDetail = async (req, res) => {
    try {
        const accountTypeData = await opsAccountTypeModel.aggregate([
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
                    account_type_name: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (accountTypeData) {
            return res.status(200).json({
                status: 200,
                message: "OPS account type details successfully!",
                data: accountTypeData,
            });
        }
        return res.status(404).json({
            status: 404,
            message: message.DATA_NOT_FOUND,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//PUT - updateAccountType_By-ID
exports.updateAccountType = async (req, res) => {
    try {
        const { id } = req.params;
        const { account_type_name, description, created_by, last_updated_by } = req.body;
        const accountTypeData = await opsAccountTypeModel.findOne({ _id: id });
        if (!accountTypeData) {
            return res.send("Invalid account-type Id...");
        }
        await accountTypeData.save();
        const accountTypeUpdatedData = await opsAccountTypeModel.findOneAndUpdate({ _id: id }, {
            $set: {
                account_type_name,
                description,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "OPS account type data updated successfully!",
            data: accountTypeUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - OPS_AccountType_List
exports.getAccountTypeList = async (req, res) => {
    try {
        const accountTypeData = await opsAccountTypeModel.aggregate([
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
                    _id: 1,
                    account_type_name: 1,
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
        if (!accountTypeData) {
            return res.status(500).send({
                succes: true,
                message: "OPS account type data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "OPS account type data list successfully!",
            data: accountTypeData
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//DELETE - OPS_AccountType- By-ID
exports.deleteAccountType = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const accountTypeData = await opsAccountTypeModel.findOne({ _id: id });
        if (!accountTypeData) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await opsAccountTypeModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "OPS account type data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};