const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const opsDocMastModel = require('../../models/Customer&Campaign/opsDocMastModel');

//POST- OPS_Doc_Mast
exports.createDocMast = async (req, res) => {
    try {
        const checkDuplicacy = await opsDocMastModel.findOne({ doc_name: req.body.doc_name });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "OPS doc-name data alredy exist!",
            });
        }
        const { doc_name, description, created_by, last_updated_by } = req.body;
        const addDocMastData = new opsDocMastModel({
            doc_name: doc_name,
            description: description,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addDocMastData.save();
        return res.status(200).json({
            status: 200,
            message: "OPS doc-mast data added successfully!",
            data: addDocMastData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - OPS_get_DocMast - BY_ID
exports.getDocMastDetail = async (req, res) => {
    try {
        const docMastData = await opsDocMastModel.aggregate([
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
                    doc_name: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (docMastData) {
            return res.status(200).json({
                status: 200,
                message: "OPS doc-mast details successfully!",
                data: docMastData,
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

//PUT - updateDocMast_By-ID
exports.updateDocMast = async (req, res) => {
    try {
        const { id } = req.params;
        const { doc_name, description, created_by, last_updated_by } = req.body;
        const docMastData = await opsDocMastModel.findOne({ _id: id });
        if (!docMastData) {
            return res.send("Invalid Doc-Mast Id...");
        }
        await docMastData.save();
        const docMastUpdatedData = await opsDocMastModel.findOneAndUpdate({ _id: id }, {
            $set: {
                doc_name,
                description,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "OPS doc-mast data updated successfully!",
            data: docMastUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - OPS_DocMast_List
exports.getDocMastList = async (req, res) => {
    try {
        const docMastData = await opsDocMastModel.aggregate([
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
                    doc_name: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    last_updated_by_name: "$user.user_name",
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                }
            }
        ])
        if (!docMastData) {
            return res.status(500).send({
                succes: true,
                message: "OPS doc-mast data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "OPS doc-mast data list successfully!",
            data: docMastData
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//DELETE - OPS_DocMast- By-ID
exports.deleteDocMast = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const docMastData = await opsDocMastModel.findOne({ _id: id });
        if (!docMastData) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await opsDocMastModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "OPS doc-mast data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};