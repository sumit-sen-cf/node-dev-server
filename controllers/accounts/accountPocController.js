const accountPocModel = require("../../models/accounts/accountPocModel");
const { message } = require("../../common/message")
const mongoose = require("mongoose");

/**
 * Api is to used for the add_account_poc data in the DB collection.
 */
exports.addAccountPoc = async (req, res) => {
    try {
        const checkDuplicacy = await accountPocModel.findOne({ contact_name: req.body.contact_name });
        // if check duplicacy contact_name
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "Contact name alredy exist!",
            });
        }
        const { account_id, contact_name, contact_no, alternative_contact_no, email, department, designation, description, created_by } = req.body;
        //add account data
        const createAccountPocData = await accountPocModel.create({
            account_id: account_id,
            contact_name: contact_name,
            contact_no: contact_no,
            description: description,
            alternative_contact_no: alternative_contact_no,
            email: email,
            department: department,
            designation: designation,
            created_by: created_by
        });
        //send success response
        return res.status(200).json({
            status: 200,
            message: "Account poc data added successfully!",
            data: createAccountPocData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
}

/**
 * Api is to used for the get_account_poc data in the DB collection.
 */
exports.getAccountPocDetails = async (req, res) => {
    try {
        const accountPocData = await accountPocModel.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(req.params.id) },
            }, {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            }, {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $lookup: {
                    from: "usermodels",
                    localField: "updated_by",
                    foreignField: "user_id",
                    as: "user",
                },
            }, {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $project: {
                    account_id: 1,
                    contact_name: 1,
                    contact_no: 1,
                    description: 1,
                    alternative_contact_no: 1,
                    email: 1,
                    department: 1,
                    designation: 1,
                    createdAt: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    updatedAt: 1,
                    updated_by: "$user.user_name",
                }
            }
        ])
        if (!accountPocData) {
            return res.status(404).json({
                status: 404,
                message: "Account poc data not found!"
            });
        }
        //send success response
        return res.status(200).json({
            status: 200,
            messgae: "Account poc data retrive successfully!",
            data: accountPocData
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
}

/**
 * Api is to used for the update_account_poc data in the DB collection.
 */
exports.updateAccountPoc = async (req, res) => {
    try {
        const { id } = req.params
        const { account_id, contact_name, contact_no, alternative_contact_no, email, department, designation, description, updated_by } = req.body;
        const editAccountPocData = await accountPocModel.findOne({ _id: id })
        // if check by account_poc_id 
        if (!editAccountPocData) {
            return res.status(400).json({ message: "Account poc id invalid, please check!" });
        }
        //update account poc data
        await accountPocModel.updateOne({ _id: editAccountPocData.id }, {
            $set: {
                account_id,
                contact_name,
                description,
                contact_no,
                alternative_contact_no,
                email,
                department,
                designation,
                updated_by
            }
        })
        //send success response
        return res.status(200).json({
            status: 200,
            message: "Account poc data updated successfully!",
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
}

/**
 * Api is to used for the update_account_poc data in the DB collection.
 */
exports.getAccountPocList = async (req, res) => {
    try {
        //filter pagination page wise data = page=1 & limit=2 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        // Get filter parameters
        const filters = {};
        if (req.query.search) {
            // search by account_poc_name
            filters.account_type_name = { $regex: new RegExp(req.query.search, 'i') };
        }
        //account_poc_list get
        const accountPocList = await accountPocModel.aggregate([{
            $lookup: {
                from: "usermodels",
                localField: "created_by",
                foreignField: "user_id",
                as: "user_created",
            }
        }, {
            $unwind: {
                path: "$user_created",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "usermodels",
                localField: "updated_by",
                foreignField: "user_id",
                as: "user_updated",
            },
        }, {
            $unwind: {
                path: "$user_updated",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $match: filters // Apply filters
        }, {
            $project: {
                account_id: 1,
                contact_name: 1,
                contact_no: 1,
                description: 1,
                alternative_contact_no: 1,
                email: 1,
                department: 1,
                designation: 1,
                createdAt: 1,
                created_by: 1,
                created_by_name: "$user.user_name",
                updatedAt: 1,
                updated_by: "$user.user_name",
            }
        }, {
            $skip: skip
        }, {
            $limit: limit
        }]);
        const totalAccountPocListCountData = await accountPocModel.countDocuments();
        if (!totalAccountPocListCountData) {
            return res.status(404).json({
                status: 404,
                message: "Account poc list data not found!"
            });
        }
        //send success response
        return res.status(200).json({
            status: 200,
            message: "Account poc list data successfully!",
            totalAccountPoc: totalAccountPocListCountData,
            totalPages: Math.ceil(totalAccountPocListCountData / limit),
            currentPage: page,
            data: accountPocList
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
}

/**
 * Api is to used for the delete_account_poc_list data in the DB collection.
 */
exports.deleteAccountPoc = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const accountPocData = await accountPocModel.findOne({ _id: id });
        // if check the accounPoc_id
        if (!accountPocData) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        // account_Poc data deleted
        await accountPocModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Account poc data deleted successfully!",
            data: accountPocData
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};