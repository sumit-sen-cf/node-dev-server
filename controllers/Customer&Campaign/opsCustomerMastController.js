const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const opsCustomerMastModel = require('../../models/Customer&Campaign/opsCustomerMastModel');
const multer = require("multer");
const vari = require("../../variables.js");
const { storage } = require('../../common/uploadFile.js')


const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "pan_upload", maxCount: 1 },
    { name: "gst_upload", maxCount: 1 },
    { name: "pan_upload", maxCount: 1 },
    { name: "gst_upload", maxCount: 1 }
]);

//POST- OPS_Customer_Mast
exports.createCustomerMast = [
    upload, async (req, res) => {
        try {
            const checkDuplicacy = await opsCustomerMastModel.findOne({
                customer_type_id: req.body.customer_type_id
                , account_type_id: req.body.account_type_id, ownership_id: req.body.ownership_id, industry_id: req.body.industry_id
            });
            if (checkDuplicacy) {
                return res.status(403).json({
                    status: 403,
                    message: "OPS customer-mast data alredy exist!",
                });
            }
            const { customer_type_id, account_type_id, ownership_id, industry_id, account_owner_id, parent_account_id, customer_name,
                pin_code, gst_address, company_size, company_email, primary_contact_no, alternative_no, website, turn_over,
                establishment_year, employees_Count, how_many_offices, company_gst_no, company_pan_no, connected_office, connect_billing_street, connect_billing_city, connect_billing_state, connect_billing_country, head_office,
                head_billing_street, head_billing_city, head_billing_state, head_billing_country, description, created_by, last_updated_by } = req.body;
            const addAccountTypeData = new opsCustomerMastModel({
                customer_type_id: customer_type_id,
                account_type_id: account_type_id,
                ownership_id: ownership_id,
                industry_id: industry_id,
                account_owner_id: account_owner_id,
                parent_account_id: parent_account_id,
                customer_name: customer_name,
                pin_code: pin_code,
                gst_address: gst_address,
                company_size: company_size,
                company_email: company_email,
                primary_contact_no: primary_contact_no,
                alternative_no: alternative_no,
                website: website,
                turn_over: turn_over,
                establishment_year: establishment_year,
                employees_Count: employees_Count,
                how_many_offices: how_many_offices,
                company_gst_no: company_gst_no,
                company_pan_no: company_pan_no,
                connected_office: connected_office,
                connect_billing_street: connect_billing_street,
                connect_billing_city: connect_billing_city,
                connect_billing_state: connect_billing_state,
                connect_billing_country: connect_billing_country,
                head_office: head_office,
                head_billing_street: head_billing_street,
                head_billing_city: head_billing_city,
                head_billing_state: head_billing_state,
                head_billing_country: head_billing_country,
                description: description,
                created_by: created_by,
                last_updated_by: last_updated_by
            });
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            if (req.files.gst_upload && req.files.gst_upload[0].originalname) {
                const blob1 = bucket.file(req.files.gst_upload[0].originalname);
                addAccountTypeData.gst_upload = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => {
                });
                blobStream1.end(req.files.gst_upload[0].buffer);
            }
            if (req.files.pan_upload && req.files.pan_upload[0].originalname) {
                const blob2 = bucket.file(req.files.pan_upload[0].originalname);
                addAccountTypeData.pan_upload = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                });
                blobStream2.end(req.files.pan_upload[0].buffer);
            }
            await addAccountTypeData.save();
            return res.status(200).json({
                status: 200,
                message: "OPS customer-mast data added successfully!",
                data: addAccountTypeData,
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message ? error.message : message.ERROR_MESSAGE,
            });
        }
    }];

//GET - OPS-Customer_Mast- By-ID
exports.getCustomerMastDetail = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const customerMastData = await opsCustomerMastModel.aggregate([
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
                    customer_type_id: 1,
                    account_type_id: 1,
                    ownership_id: 1,
                    industry_id: 1,
                    account_owner_id: 1,
                    parent_account_id: 1,
                    customer_name: 1,
                    pin_code: 1,
                    gst_address: 1,
                    company_size: 1,
                    company_email: 1,
                    primary_contact_no: 1,
                    alternative_no: 1,
                    website: 1,
                    turn_over: 1,
                    establishment_year: 1,
                    employees_Count: 1,
                    how_many_offices: 1,
                    company_gst_no: 1,
                    company_pan_no: 1,
                    connected_office: 1,
                    connect_billing_street: 1,
                    connect_billing_city: 1,
                    connect_billing_state: 1,
                    connect_billing_country: 1,
                    head_office: 1,
                    head_billing_street: 1,
                    head_billing_city: 1,
                    head_billing_state: 1,
                    head_billing_country: 1,
                    description: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_by: 1,
                    pan_upload: {
                        $concat: [imageUrl, "$pan_upload"],
                    },
                    gst_upload: {
                        $concat: [imageUrl, "$gst_upload"],
                    },
                },
            },
        ])
        if (customerMastData) {
            return res.status(200).json({
                status: 200,
                message: "PMS customer-mast details successfully!",
                data: customerMastData,
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

//PUT - updateCustomerMast_By-ID
exports.updateCustomerMast = [
    upload,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { customer_type_id, account_type_id, ownership_id, industry_id, account_owner_id, customer_name, pin_code,
                gst_address, company_size, company_email, primary_contact_no, alternative_no, website, turn_over, establishment_year, employees_Count, how_many_offices, company_gst_no,
                company_pan_no, connected_office, connect_billing_street, connect_billing_city, connect_billing_state, connect_billing_country, head_office,
                head_billing_street, head_billing_city, head_billing_state, head_billing_country, description, created_by, last_updated_by } = req.body;
            const customerMastData = await opsCustomerMastModel.findOne({ _id: id });
            if (!customerMastData) {
                return res.send("Invalid Customer-Mast Id...");
            }
            if (req.files) {
                customerMastData.pan_upload = req.files["pan_upload"] ? req.files["pan_upload"][0].filename : customerMastData.pan_upload;
                customerMastData.gst_upload = req.files["gst_upload"] ? req.files["gst_upload"][0].filename : customerMastData.gst_upload;
            }
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            if (req.files?.pan_upload && req.files?.pan_upload[0].originalname) {
                const blob1 = bucket.file(req.files.pan_upload[0].originalname);
                customerMastData.pan_upload = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => {
                });
                blobStream1.end(req.files.pan_upload[0].buffer);
            }
            if (req.files?.gst_upload && req.files?.gst_upload[0].originalname) {
                const blob2 = bucket.file(req.files.gst_upload[0].originalname);
                customerMastData.gst_upload = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                });
                blobStream2.end(req.files.gst_upload[0].buffer);
            }
            await customerMastData.save();
            const vendorData = await opsCustomerMastModel.findOneAndUpdate({ _id: id }, {
                $set: {
                    customer_type_id,
                    account_type_id,
                    ownership_id,
                    industry_id,
                    account_owner_id,
                    customer_name,
                    pin_code,
                    gst_address,
                    company_size,
                    company_email,
                    primary_contact_no,
                    alternative_no,
                    website,
                    turn_over,
                    establishment_year,
                    employees_Count,
                    how_many_offices,
                    company_gst_no,
                    company_pan_no,
                    connected_office,
                    connect_billing_street,
                    connect_billing_city,
                    connect_billing_state,
                    connect_billing_country,
                    head_office,
                    head_billing_street,
                    head_billing_city,
                    head_billing_state,
                    head_billing_country,
                    description,
                    created_by,
                    last_updated_by
                },
            },
                { new: true }
            );
            return res.status(200).json({
                message: "PMS customer-mast data updated successfully!",
                data: vendorData,
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message ? error.message : message.ERROR_MESSAGE,
            });
        }
    }];


//GET - OPS_Customer_Mast_List
exports.getCustomerMastList = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const customerMastList = await opsCustomerMastModel.aggregate([
            {
                $lookup: {
                    from: "customertypes",
                    localField: "customer_type_id",
                    foreignField: "_id",
                    as: "customertype",
                },
            },
            {
                $unwind: {
                    path: "$customertype",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "accounttypes",
                    localField: "account_type_id",
                    foreignField: "_id",
                    as: "accounttype",
                },
            },
            {
                $unwind: {
                    path: "$accounttype",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "opsownerships",
                    localField: "ownership_id",
                    foreignField: "_id",
                    as: "ownership",
                },
            },
            {
                $unwind: {
                    path: "$ownership",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "industrymasters",
                    localField: "industry_id",
                    foreignField: "_id",
                    as: "industrymaster",
                },
            },
            {
                $unwind: {
                    path: "$industrymaster",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "account_owner_id",
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
                    customer_type_id: 1,
                    customer_id: 1,
                    account_type_id: 1,
                    ownership_id: 1,
                    industry_id: 1,
                    account_owner_id: 1,
                    parent_account_id: 1,
                    customer_name: 1,
                    pin_code: 1,
                    gst_address: 1,
                    company_size: 1,
                    company_email: 1,
                    primary_contact_no: 1,
                    alternative_no: 1,
                    website: 1,
                    turn_over: 1,
                    establishment_year: 1,
                    employees_Count: 1,
                    how_many_offices: 1,
                    company_gst_no: 1,
                    company_pan_no: 1,
                    connected_office: 1,
                    connect_billing_street: 1,
                    connect_billing_city: 1,
                    connect_billing_state: 1,
                    connect_billing_country: 1,
                    head_office: 1,
                    head_billing_street: 1,
                    head_billing_city: 1,
                    head_billing_state: 1,
                    head_billing_country: 1,
                    description: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_by: 1,
                    pan_upload: {
                        $concat: [imageUrl, "$pan_upload"],
                    },
                    gst_upload: {
                        $concat: [imageUrl, "$gst_upload"],
                    },
                    Customer_type_data: {
                        customer_type_id: "$customertype._id",
                        customer_id: "$customertype.customer_id",
                        customer_type_name: "$customertype.customer_type_name",
                        description_type: "$customertype.description",
                        created_by: "$customertype.created_by",
                        last_updated_by: "$customertype.last_updated_by",
                        created_by_name: "$user_data.user_name",
                    },
                    Account_type_data: {
                        account_id: "$accounttype._id",
                        account_type_name: "$accounttype.account_type_name",
                        account_description: "$accounttype.description",
                        created_by: "$accounttype.created_by",
                        last_updated_by: "$accounttype.last_updated_by",
                        created_by_name: "$user_data.user_name",
                    },
                    Ownership_data: {
                        ownership_id: "$ownership._id",
                        ownership_name: "$ownership.ownership_name",
                        description_ownership: "$ownership.description",
                        created_by: "$ownership.created_by",
                        last_updated_by: "$ownership.last_updated_by",
                        created_by_name: "$user_data.user_name",
                    },
                    Industry_data: {
                        industry_id: "$industrymaster._id",
                        industry_name: "$industrymaster.name",
                        description: "$industrymaster.description",
                        created_by: "$industrymaster.created_by",
                        last_updated_by: "$industrymaster.last_updated_by",
                        created_by_name: "$user_data.user_name",
                    }
                }
            },
        ])
        const totalCustomerMastList = await opsCustomerMastModel.countDocuments(customerMastList);
        if (!totalCustomerMastList) {
            return res.status(404).send({
                succes: true,
                message: "OPS Customer-mast data request list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "Customer-mast list created successfully!",
            task_data: totalCustomerMastList, customerMastList
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//DELETE - PMS_Customer_Mast_ By-ID
exports.customerMastDelete = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const customerMastData = await opsCustomerMastModel.findOne({ _id: id });
        if (!customerMastData) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await opsCustomerMastModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "OPS customer-mast data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};