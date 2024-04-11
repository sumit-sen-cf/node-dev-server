const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const opsCustomerContactModel = require('../../models/Customer&Campaign/opsCustomerContactModel');
const vari = require("../../variables.js");

//POST- OPS_Customer_Contact
exports.createCustomerContact = async (req, res) => {
    try {
        const checkDuplicacy = await opsCustomerContactModel.findOne({ contact_no: req.body.contact_no });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "OPS customer contact data alredy exist!",
            });
        }
        const { customer_id, closed_by, contact_name, contact_no, alternative_contact_no, email_Id, department,
            designation, description, created_by, last_updated_by } = req.body;
        const addCustomerContactData = new opsCustomerContactModel({
            customer_id: customer_id,
            closed_by: closed_by,
            contact_name: contact_name,
            contact_no: contact_no,
            alternative_contact_no: alternative_contact_no,
            email_Id: email_Id,
            department: department,
            designation: designation,
            description: description,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addCustomerContactData.save();
        return res.status(200).json({
            status: 200,
            message: "OPS customer contact data added successfully!",
            data: addCustomerContactData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - OPS_get_Customer_Contact - BY_ID
exports.getCustomerContactDetail = async (req, res) => {
    try {
        const customerContactData = await opsCustomerContactModel.aggregate([
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
                    closed_by: 1,
                    contact_name: 1,
                    contact_no: 1,
                    alternative_contact_no: 1,
                    email_Id: 1,
                    department: 1,
                    designation: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (customerContactData) {
            return res.status(200).json({
                status: 200,
                message: "OPS customer contact details successfully!",
                data: customerContactData,
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

//PUT - updateCustomerContact_By-ID
exports.updateCustomerContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { customer_id, closed_by, contact_name, contact_no, alternative_contact_no, email_Id, department,
            designation, description, created_by, last_updated_by } = req.body;
        const customerContactData = await opsCustomerContactModel.findOne({ _id: id });
        if (!customerContactData) {
            return res.send("Invalid customer-contact Id...");
        }
        await customerContactData.save();
        const customerContactUpdatedData = await opsCustomerContactModel.findOneAndUpdate({ _id: id }, {
            $set: {
                customer_id,
                closed_by,
                contact_name,
                contact_no,
                alternative_contact_no,
                email_Id,
                department,
                designation,
                description,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "OPS customer-contact data updated successfully!",
            data: customerContactUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - OPS_Customer_Contact_List
exports.getCustomerContactList = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const customerContactData = await opsCustomerContactModel.aggregate([
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
                    localField: "closed_by",
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
                $project: {
                    _id: 1,
                    customer_id: 1,
                    closed_by: "$closed_by",
                    closed_by_id: "$user_data.user_id",
                    contact_name: 1,
                    contact_no: 1,
                    alternative_contact_no: 1,
                    email_Id: 1,
                    department: 1,
                    designation: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    last_updated_by_name: "$user_data.user_name",
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    OPS_CustomerMast_data: {
                        _id: "$customermast_data._id",
                        customermast_id: "$customermast_data.customer_id",
                        customer_id: "$customermast_data.customer_id",
                        customer_name:"$customermast_data.customer_name",
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
                }
            }
        ])
        if (!customerContactData) {
            return res.status(500).send({
                succes: true,
                message: "OPS customer-contact data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "OPS customer-contact data list successfully!",
            data: customerContactData
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

exports.getListCustomerContactData = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const customerContactDataList = await opsCustomerContactModel.aggregate([
            {
                $match: { customer_id: Number(req.params.id) },
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
                $project: {
                    _id: 1,
                    customer_id: 1,
                    closed_by: "$closed_by",
                    closed_by_id: "$user_data.user_id",
                    contact_name: 1,
                    contact_no: 1,
                    alternative_contact_no: 1,
                    email_Id: 1,
                    department: 1,
                    designation: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    last_updated_by_name: "$user_data.user_name",
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    OPS_CustomerMast_data: {
                        _id: "$customermast_data._id",
                        customermast_id: "$customermast_data.customer_id",
                        customer_id: "$customermast_data.customer_id",
                        account_type_id: "$customermast_data.account_type_id",
                        ownership_id: "$customermast_data.ownership_id",
                        industry_id: "$customermast_data.industry_id",
                        customer_name: "$customermast_data.customer_name",
                        pin_code: "$customermast_data.pin_code",
                        gst_address: "$customermast_data.gst_address",
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
                }
            }
        ])
        if (!customerContactDataList) {
            return res.status(500).send({
                succes: true,
                message: "OPS customer-contact data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "OPS customer-contact data list successfully!",
            data: customerContactDataList
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//DELETE - OPS_CustomerConatct- By-ID
exports.deleteCustomerContact = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const custoemrContactData = await opsCustomerContactModel.findOne({ _id: id });
        if (!custoemrContactData) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await opsCustomerContactModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "OPS customer contact data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};