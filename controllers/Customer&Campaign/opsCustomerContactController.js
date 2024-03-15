const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const opsCustomerContactModel = require('../../models/Customer&Campaign/opsCustomerContactModel');

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
        const { customer_type_id, closed_by, contact_name, contact_no, alternative_contact_no, email_Id, department,
            designation, description, created_by, last_updated_by } = req.body;
        const addCustomerContactData = new opsCustomerContactModel({
            customer_type_id: customer_type_id,
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