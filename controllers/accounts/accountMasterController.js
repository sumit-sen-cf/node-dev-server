const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const accountMaster = require('../../models/accounts/accountMasterModel');
const accountBilling = require('../../models/accounts/accountBillingModel');
const accountPocModel = require('../../models/accounts/accountPocModel');
const accountDocumentOverviewModel = require('../../models/accounts/accountDocumentOverviewModel');

/**
 * POST- Api is to used for the account master data add in the DB collection.
 */
exports.addAccountDetails = async (req, res) => {
    try {
        //body data get for add in db
        const { account_name, account_type_id, company_type_id, category_id, description,
            account_owner_id, website, turn_over, created_by,
            how_many_offices, connected_office, connect_billing_street, connect_billing_city,
            connect_billing_state, connect_billing_country, connect_billing_pin_code, head_office, head_billing_street,
            head_billing_city, head_billing_state, head_billing_country, head_billing_pin_code, company_email,
            account_poc, account_documents
        } = req.body;

        // Check for duplicate contact_no in accountPoc
        if (account_poc && Array.isArray(account_poc)) {
            for (let i = 0; i < account_poc.length; i++) {
                const existingPoc = await accountPocModel.findOne({
                    contact_no: account_poc[i].contact_no
                });
                if (existingPoc) {
                    return res.status(400).json({
                        status: 400,
                        message: `Contact number ${account_poc[i].contact_no} already exists.`
                    });
                }
            }
        }

        //account master data stored in DB collection
        const addAccountMasterData = await accountMaster.create({
            account_name: account_name,
            account_type_id: account_type_id,
            company_type_id: company_type_id,
            category_id: category_id,
            account_owner_id: account_owner_id,
            website: website,
            turn_over: turn_over,
            description: description,
            created_by: created_by
        })

        //account billing data stored in DB collection
        const addAccountBillingData = await accountBilling.create({
            account_id: addAccountMasterData.account_id,
            how_many_offices: how_many_offices,
            connected_office: connected_office,
            connect_billing_street: connect_billing_street,
            connect_billing_city: connect_billing_city,
            connect_billing_state: connect_billing_state,
            connect_billing_country: connect_billing_country,
            connect_billing_pin_code: connect_billing_pin_code,
            head_office: head_office,
            head_billing_street: head_billing_street,
            head_billing_city: head_billing_city,
            head_billing_state: head_billing_state,
            head_billing_country: head_billing_country,
            head_billing_pin_code: head_billing_pin_code,
            company_email: company_email,
            created_by: created_by
        })

        let accountPocDataUpdatedArray = [];
        let accountPocDetails = account_poc || [];

        //account Poc details obj add in array
        if (accountPocDetails.length && Array.isArray(accountPocDetails)) {
            for (let element of accountPocDetails) {
                element.account_id = addAccountMasterData.account_id;
                element.created_by = created_by;
                accountPocDataUpdatedArray.push(element);
            }
        }
        //add data in db collection
        const addAccountPocData = await accountPocModel.insertMany(accountPocDataUpdatedArray);


        let accountDocumentsUpdatedArray = [];
        let accountDocumentsDetails = account_documents || [];

        //account Documents details obj add in array
        if (accountDocumentsDetails.length && Array.isArray(accountDocumentsDetails)) {
            for (let element of accountDocumentsDetails) {
                element.account_id = addAccountMasterData.account_id;
                element.created_by = created_by;
                accountDocumentsUpdatedArray.push(element);
            }
        }

        //add data in db collection
        const addAccountDocumentsData = await accountDocumentOverviewModel.insertMany(accountDocumentsUpdatedArray);

        //send success response
        return res.status(200).json({
            status: 200,
            message: "Account master data added successfully!",
            data: {
                accountMaster: addAccountMasterData,
                accountBilling: addAccountBillingData,
                accountPoc: addAccountPocData,
                accountDocuments: addAccountDocumentsData
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * PUT- Api is to used for the account master data update By-ID in the DB collection.
 */
exports.editAccountDetails = async (req, res) => {
    try {
        //get id from params
        const { id } = req.params;

        //get data from the body
        const { account_name, account_type_id, company_type_id, category_id, description,
            account_owner_id, website, turn_over, updated_by,
            how_many_offices, connected_office, connect_billing_street, connect_billing_city,
            connect_billing_state, connect_billing_country, head_office, connect_billing_pin_code, head_billing_street,
            head_billing_city, head_billing_state, head_billing_country, head_billing_pin_code, company_email
        } = req.body;

        //check data available
        const accountMasterData = await accountMaster.findOne({ _id: id });
        if (!accountMasterData) {
            return res.send("Invalid account master Id...");
        }

        //account master data update in db collection
        await accountMaster.updateOne({
            _id: id
        }, {
            $set: {
                account_name: account_name,
                account_type_id: account_type_id,
                company_type_id: company_type_id,
                category_id: category_id,
                account_owner_id: account_owner_id,
                website: website,
                turn_over: turn_over,
                description: description,
                updated_by: updated_by
            }
        });

        //account billing collection data update in db collection
        await accountBilling.updateOne({
            account_id: accountMasterData.account_id
        }, {
            $set: {
                how_many_offices: how_many_offices,
                connected_office: connected_office,
                connect_billing_street: connect_billing_street,
                connect_billing_city: connect_billing_city,
                connect_billing_state: connect_billing_state,
                connect_billing_country: connect_billing_country,
                connect_billing_pin_code: connect_billing_pin_code,
                head_office: head_office,
                head_billing_street: head_billing_street,
                head_billing_city: head_billing_city,
                head_billing_state: head_billing_state,
                head_billing_country: head_billing_country,
                head_billing_pin_code: head_billing_pin_code,
                company_email: company_email,
                updated_by: updated_by
            }
        });
        //send success response
        return res.status(200).json({
            status: 200,
            message: "account master data updated successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * GET- Api is to used to get account master data By-ID from DB collection.
 */
exports.getSingleAccountDetails = async (req, res) => {
    try {

        //get id wise data from DB collection
        const accountMasterData = await accountMaster.findOne({
            _id: mongoose.Types.ObjectId(req.params.id),
            deleted: false
        });

        if (!accountMasterData) {
            return res.status(200).json({
                status: 200,
                message: message.DATA_NOT_FOUND,
            });
        }
        //send success response
        return res.status(200).json({
            status: 200,
            message: "account master details by Id fatched successfully!",
            data: accountMasterData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * GET- Api is to used to get all account master data from DB collection.
 */
exports.getAllAccountDetails = async (req, res) => {
    try {
        //filter for pagination page wise data = page=1 & limit=2 
        let page = parseInt(req.query?.page) || 1;
        let limit = 10;
        let skip = limit * (page - 1);
        let sort = {
            createdAt: -1
        };
        //for match conditions
        let matchQuery = {
            deleted: false
        };
        //Search by filter
        if (req.query.search) {
            //Regex Condition for search 
            matchQuery['$or'] = [{
                "account_name": {
                    "$regex": req.query.search,
                    "$options": "i"
                }
            }]
        }

        //data get from the db collection
        const accountMasterData = await accountMaster.aggregate([{
            $match: matchQuery
        }, {
            $project: {
                account_id: 1,
                account_name: 1,
                account_type_id: 1,
                company_type_id: 1,
                category_id: 1,
                account_owner_id: 1,
                website: 1,
                turn_over: 1,
                description: 1,
                created_by: 1,
                updated_by: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        }, {
            $sort: sort
        }, {
            $skip: skip
        }, {
            $limit: limit
        }])

        // Query to get counts of record of account types
        const totalAccountMasterCounts = await accountMaster.countDocuments(matchQuery);
        //send success response
        return res.status(200).send({
            succes: true,
            message: "account Master data list fetched successfully!",
            data: accountMasterData,
            start_record: skip + 1,
            end_record: skip + accountMasterData.length,
            total_records: totalAccountMasterCounts,
            pagination: {
                currentPage: page,
                totalPage: Math.ceil(totalAccountMasterCounts / limit),
                url: req.originalUrl
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * DELETE- Api is to used delete account master data By-ID from DB collection.
 */
exports.deleteAccountDetails = async (req, res) => {
    try {
        const { id } = req.params;
        //get data from db collection
        const accountMasterData = await accountMaster.findOne({ _id: id });
        if (!accountMasterData) {
            return res.status(200).json({
                status: 200,
                message: message.DATA_NOT_FOUND,
            });
        }

        //delete data from the db collection by ID
        await accountMaster.updateOne({
            _id: id
        }, {
            deleted: true
        });

        //delete data from the db collection by ID
        await accountBilling.updateOne({
            account_id: accountMasterData.account_id
        }, {
            deleted: true
        });

        //send success response
        return res.status(200).json({
            status: 200,
            message: "account master data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * GET- Api is to used to get all account Billing data from DB collection.
 */
exports.getAllAccountBillingDetails = async (req, res) => {
    try {
        //data get from the db collection
        const accountBillingData = await accountBilling.find({
            deleted: false
        });

        //send success response
        return res.status(200).send({
            succes: true,
            message: "account billing data list fetched successfully!",
            data: accountBillingData
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * GET- Api is to used to get account billing data By-ID from DB collection.
 */
exports.getSingleAccountBillingDetails = async (req, res) => {
    try {
        let matchQuery = {};
        if (req.query?._id == (true || 'true')) {
            matchQuery = {
                _id: mongoose.Types.ObjectId(req.params.id),
                deleted: false
            }
        } else if (req.query?._id == (false || 'false')) {
            matchQuery = {
                account_id: Number(req.params.id),
                deleted: false
            }
        } else {
            matchQuery = {
                _id: mongoose.Types.ObjectId(req.params.id),
                deleted: false
            }
        }
        //data get from the db collection
        const accountBillingData = await accountBilling.findOne(matchQuery);

        //send success response
        return res.status(200).send({
            succes: true,
            message: "account billing data fetched successfully!",
            data: accountBillingData
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};