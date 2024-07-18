const accountTypesModel = require("../../models/accounts/accountTypesModel");
const { message } = require("../../common/message")
const mongoose = require("mongoose");

/**
 * Api is to used for the add_account_type data in the DB collection.
 */
exports.addAccountType = async (req, res) => {
    try {
        const checkDuplicacy = await accountTypesModel.findOne({ account_type_name: req.body.account_type_name });
        // if check duplicacy account_type_name
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "Account type name alredy exist!",
            });
        }
        const { account_type_name, description, created_by } = req.body;
        //data stored in DB collection
        const createAccountTypeData = await accountTypesModel.create({
            account_type_name: account_type_name,
            description: description,
            created_by: created_by,
        })
        return res.status(200).json({
            status: 200,
            message: "Account type data added successfully!",
            data: createAccountTypeData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the get_account_type data in the DB collection.
 */
exports.getAccountTypeData = async (req, res) => {
    try {
        const accountTypeData = await accountTypesModel.findOne({
            _id: mongoose.Types.ObjectId(req.params.id)
        })

        if (!accountTypeData) {
            return res.status(200).json({
                status: 200,
                message: "Account type data not found!"
            });
        }

        //send success response
        return res.status(200).json({
            status: 200,
            messgae: "Account type data retrieved successfully!",
            data: accountTypeData
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
}

/**
 * Api is to used for the update_account_type data in the DB collection.
 */

exports.updateAccountTypeData = async (req, res) => {
    try {
        const { id } = req.params;
        const { account_type_name, description, updated_by } = req.body;

        // update account type data
        const updatedAccountTypeData = await accountTypesModel.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    account_type_name,
                    description,
                    updated_by,
                }
            },
            { new: true }
        );

        // if account type not found
        if (!updatedAccountTypeData) {
            return res.status(400).json({ message: "Account type id invalid, please check!" });
        }

        // send success response
        return res.status(200).json({
            status: 200,
            message: "Account type data updated successfully!",
            data: updatedAccountTypeData
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : "An error occurred while updating account type data.",
        });
    }
};

/**
 * Api is to used for the get_account_type_list data in the DB collection.
 */
exports.getAccountTypeList = async (req, res) => {
    try {
        //filter for pagination page wise data = page=1 & limit=2 
        let page = parseInt(req.query?.page) || 1;
        let limit = 10;
        let skip = limit * (page - 1);
        let sort = {
            createdAt: -1
        };

        //for match conditions
        let matchQuery = {};
        //Search by filter
        if (req.query.search) {
            //Regex Condition for search 
            matchQuery['$or'] = [{
                "account_type_name": {
                    "$regex": req.query.search,
                    "$options": "i"
                }
            }]
        }

        //account_type_list get
        const accountTypeList = await accountTypesModel.aggregate([{
            $match: matchQuery
        }, {
            $project: {
                account_type_name: 1,
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
        }]);

        // Query to get counts of record of account types
        const totalAccountTypeListCounts = await accountTypesModel.countDocuments(matchQuery);
        // send account types page and passing data
        return res.status(200).json({
            status: 200,
            message: "Account type list data fatched successfully!",
            data: accountTypeList,
            start_record: skip + 1,
            end_record: skip + accountTypeList.length,
            total_records: totalAccountTypeListCounts,
            pagination: {
                currentPage: page,
                totalPage: Math.ceil(totalAccountTypeListCounts / limit),
                url: req.originalUrl
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
}

/**
 * Api is to used for the delete_account_type data in the DB collection.
 */
exports.deleteAccountType = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const accountTypeData = await accountTypesModel.findOne({ _id: id });
        // if check the accountype_id
        if (!accountTypeData) {
            return res.status(200).json({
                status: 200,
                message: message.DATA_NOT_FOUND,
            });
        }
        // account_type data deleted
        await accountTypesModel.deleteOne({ _id: id });
        //send success response
        return res.status(200).json({
            status: 200,
            message: "Account type data deleted successfully!",
            data: accountTypeData
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};