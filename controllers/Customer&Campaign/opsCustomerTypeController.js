const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const opsCustomerTypeModel = require('../../models/Customer&Campaign/opsCustomerTypeModel');

//POST- OPS_Customer_Type
exports.createCustomerType = async (req, res) => {
    try {
        const checkDuplicacy = await opsCustomerTypeModel.findOne({ customer_type_name: req.body.customer_type_name });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "OPS customer type data alredy exist!",
            });
        }
        const { customer_type_name, description, created_by, last_updated_by } = req.body;
        const addCustomerTypeData = new opsCustomerTypeModel({
            customer_type_name: customer_type_name,
            description: description,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addCustomerTypeData.save();
        return res.status(200).json({
            status: 200,
            message: "OPS customer type data added successfully!",
            data: addCustomerTypeData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - OPS_get_Customer_Type - BY_ID
exports.getcustomerTypeDetail = async (req, res) => {
    try {
        const customerTypeData = await opsCustomerTypeModel.aggregate([
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
                    customer_type_name: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (customerTypeData) {
            return res.status(200).json({
                status: 200,
                message: "OPS customer type details successfully!",
                data: customerTypeData,
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

//PUT - updateCustomerType_By-ID
exports.updateCustomerType = async (req, res) => {
    try {
        const { id } = req.params;
        const { customer_type_name, description, created_by, last_updated_by } = req.body;
        const customerTypeData = await opsCustomerTypeModel.findOne({ _id: id });
        if (!customerTypeData) {
            return res.send("Invalid customer-type Id...");
        }
        await customerTypeData.save();
        const customerTypeUpdatedData = await opsCustomerTypeModel.findOneAndUpdate({ _id: id }, {
            $set: {
                customer_type_name,
                description,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "OPS customer type data updated successfully!",
            data: customerTypeUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - OPS_CustomerType_List
exports.getCustomerTypeList = async (req, res) => {
    try {
        const customerTypeData = await opsCustomerTypeModel.aggregate([
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
                    customer_type_name: 1,
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
        if (!customerTypeData) {
            return res.status(500).send({
                succes: true,
                message: "OPS customer type data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "OPS customer type data list successfully!",
            data: customerTypeData
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//DELETE - OPS_CustomerType- By-ID
exports.deleteCustomerType = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const custoemrTypeData = await opsCustomerTypeModel.findOne({ _id: id });
        if (!custoemrTypeData) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await opsCustomerTypeModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "OPS customer type data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};