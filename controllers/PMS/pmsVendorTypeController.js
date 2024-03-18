const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const pmsVendorModel = require('../../models/PMS/pmsVendoreTypeModel');

//POST- PMS_Vendor_type
exports.createPmsVendor = async (req, res) => {
    try {
        const checkDuplicacy = await pmsVendorModel.findOne({ type_name: req.body.type_name });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "PMS vendore type alredy exist!",
            });
        }
        const { type_name, description, created_by, last_updated_by } = req.body;
        const addVendorData = new pmsVendorModel({
            type_name: type_name,
            description: description,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addVendorData.save();
        return res.status(200).json({
            status: 200,
            message: "PMS vendor data added successfully!",
            data: addVendorData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_Vendor_Type-By-ID
exports.getVendorDetail = async (req, res) => {
    try {
        const pmsVedorTypeData = await pmsVendorModel.aggregate([
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
                    type_id: 1,
                    type_name: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (pmsVedorTypeData) {
            return res.status(200).json({
                status: 200,
                message: "PMS vendor type details successfully!",
                data: pmsVedorTypeData,
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

//PUT - updateVendorType_By-ID
exports.updateVendorType = async (req, res) => {
    try {
        const { id } = req.params;
        const { type_name, description, created_by, last_updated_by } = req.body;
        const editVendorData = await pmsVendorModel.findOne({ _id: id });
        if (!editVendorData) {
            return res.send("Invalid Vendore Id...");
        }
        await editVendorData.save();
        const vendorUpdatedData = await pmsVendorModel.findOneAndUpdate({ _id: id }, {
            $set: {
                type_name,
                description,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "PMS vendor data updated successfully!",
            data: vendorUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_Vendo_List
exports.getAllVendorData = async (req, res) => {
    try {
        const pmsVendorData = await pmsVendorModel.aggregate([
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
                    type_name: 1,
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
        if (!pmsVendorData) {
            return res.status(500).send({
                succes: true,
                message: "PMS vendor data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "PMS vendor data list successfully!",
            data: pmsVendorData
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//DELETE - PMS_vendor_Type_ By-ID
exports.deleteVendorType = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const vendorDataDelete = await pmsVendorModel.findOne({ _id: id });
        if (!vendorDataDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await pmsVendorModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "PMS vendor data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};