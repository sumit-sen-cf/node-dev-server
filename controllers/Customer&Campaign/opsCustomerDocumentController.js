const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const opsCustomerDocumentModel = require('../../models/Customer&Campaign/opsCustomerDocumentModel');
const multer = require("multer");
const vari = require("../../variables.js");
const { storage } = require('../../common/uploadFile.js')

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "doc_upload", maxCount: 1 },
]);

//POST- OPS_Customer_Document
exports.createCustomerDocument = [
    upload, async (req, res) => {
        try {
            const { customer_id, doc_id, doc_no, description, created_by, last_updated_by } = req.body;
            const addCustomerDocumentData = new opsCustomerDocumentModel({
                customer_id: customer_id,
                doc_id: doc_id,
                doc_no: doc_no,
                description: description,
                created_by: created_by,
                last_updated_by: last_updated_by
            });
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName); 

            if (req.files.doc_upload && req.files.doc_upload[0].originalname) {
                const blob1 = bucket.file(req.files.doc_upload[0].originalname);
                addCustomerDocumentData.doc_upload = blob1.name;
                const blobStream1 = blob1.createWriteStream(); 
                blobStream1.on("finish", () => {
                });
                blobStream1.end(req.files.doc_upload[0].buffer);
            }
            await addCustomerDocumentData.save();
            return res.status(200).json({
                status: 200,
                message: "OPS customer-document data added successfully!",
                data: addCustomerDocumentData,
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message ? error.message : message.ERROR_MESSAGE,
            });
        }
    }];

//GET - OPS_getCustomerDocument - BY_ID
exports.getcustomerDocumentDetail = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const customerDocumentData = await opsCustomerDocumentModel.aggregate([
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
                    customer_id: 1,
                    doc_id: 1,
                    doc_no: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    doc_upload: {
                        $concat: [imageUrl, "$doc_upload"],
                    },
                },
            },
        ])
        if (customerDocumentData) {
            return res.status(200).json({
                status: 200,
                message: "OPS customer document details successfully!",
                data: customerDocumentData,
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

//PUT - updateCustomerDocument_By-ID
exports.updateCustomerDocument = [
    upload,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { customer_id, doc_id, doc_no, description, created_by, last_updated_by } = req.body;
            const customerDocumentData = await opsCustomerDocumentModel.findOne({ _id: id });
            if (!customerDocumentData) {
                return res.send("Invalid customer-document Id...");
            }
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            if (req.files.doc_upload && req.files.doc_upload[0].originalname) {
                const blob1 = bucket.file(req.files.doc_upload[0].originalname);
                customerDocumentData.doc_upload = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => {
                });
                blobStream1.end(req.files.doc_upload[0].buffer);
            }
            await customerDocumentData.save();
            const customerDocumentUpdatedData = await opsCustomerDocumentModel.findOneAndUpdate({ _id: id }, {
                $set: {
                    customer_id,
                    doc_id,
                    doc_no,
                    description,
                    created_by,
                    last_updated_by
                },
            },
                { new: true }
            );
            return res.status(200).json({
                message: "OPS customer document data updated successfully!",
                data: customerDocumentUpdatedData,
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message ? error.message : message.ERROR_MESSAGE,
            });
        }
    }];

//GET - OPS_CustomerDocument_List
exports.getCustomerDocumentList = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const customerDocumentData = await opsCustomerDocumentModel.aggregate([
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
                $lookup: {
                    from: "customermasts",
                    localField: "customer_id",
                    foreignField: "customer_id",
                    as: "customermast_data",
                },
            },
            {
                $unwind: {
                    path: "$customermast_data",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "docmasts",
                    localField: "doc_id",
                    foreignField: "_id",
                    as: "docmast",
                },
            },
            {
                $unwind: {
                    path: "$docmast",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    customer_id: 1,
                    doc_id: 1,
                    doc_no: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    last_updated_by_name: "$user_data.user_name",
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    doc_upload: {
                        $concat: [imageUrl, "$doc_upload"],
                    },
                    OPS_CustomerMast_data: {
                        _id: "$customermast_data._id",
                        customermast_id: "$customermast_data.customer_id",
                        customer_type_id: "$customermast_data.customer_type_id",
                        account_type_id: "$customermast_data.account_type_id",
                        ownership_id: "$customermast_data.ownership_id",
                        industry_id: "$customermast_data.industry_id",
                        account_owner_id: "$customermast_data.account_owner_id",
                        parent_account_id: "$customermast_data.parent_account_id",
                        company_size: "$customermast_data.company_size",
                        company_email: "$customermast_data.company_email",
                        primary_contact_no: "$customermast_data.primary_contact_no",
                        alternative_no: "$customermast_data.alternative_no",
                        website: "$customermast_data.website",
                        turn_over: "$customermast_data.turn_over",
                        establishment_year: "$customermast_data.establishment_year",
                        employees_Count: "$customermast_data.employees_Count",
                        how_many_offices: "$customermast_data.how_many_offices",
                        company_gst_no: "$customermast_data.company_gst_no",
                        company_pan_no: "$customermast_data.company_pan_no",
                        connected_office: "$customermast_data.connected_office",
                        connect_billing_street: "$customermast_data.connect_billing_street",
                        connect_billing_city: "$customermast_data.connect_billing_city",
                        connect_billing_state: "$customermast_data.connect_billing_state",
                        connect_billing_country: "$customermast_data.connect_billing_country",
                        head_office: "$customermast_data.head_office",
                        head_billing_street: "$customermast_data.head_billing_street",
                        head_billing_city: "$customermast_data.head_billing_city",
                        head_billing_state: "$customermast_data.head_billing_state",
                        head_billing_country: "$customermast_data.head_billing_country",
                        description: "$customermast_data.description",
                        created_by: "$customermast_data.created_by",
                        created_by_name: "$user.user_name",
                        last_updated_by: "$customermast_data.last_updated_by",
                        pan_upload: {
                            $concat: [imageUrl, "$customermast_data.pan_upload"],
                        },
                        gst_upload: {
                            $concat: [imageUrl, "$customermast_data.gst_upload"],
                        },
                    },
                    OPS_Doc_Mast: {
                        _id: "$docmast._id",
                        doc_name: "$docmast.doc_name",
                        description: "$docmast.description",
                        created_date_time: "$docmast.created_date_time",
                        created_by: "$docmast._id",
                    }
                }
            }
        ])
        if (!customerDocumentData) {
            return res.status(500).send({
                succes: true,
                message: "OPS customer document data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "OPS customer document data list successfully!",
            data: customerDocumentData
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//DELETE - OPS_CustomerDocument- By-ID
exports.deleteCustomerDocument = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const custoemrDocumentData = await opsCustomerDocumentModel.findOne({ _id: id });
        if (!custoemrDocumentData) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await opsCustomerDocumentModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "OPS customer document data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};