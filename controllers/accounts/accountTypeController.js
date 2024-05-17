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
        const accountTypeData = await accountTypesModel.aggregate([
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
                $lookup: {
                    from: "usermodels",
                    localField: "updated_by",
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
                    account_type_name: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    updated_by: "$user.user_name",
                }
            }
        ])
        if (!accountTypeData) {
            return res.status(404).json({
                status: 404,
                message: "Account type data not found!"
            });
        }
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
        const { id } = req.params
        const { account_type_name, description, updated_by } = req.body;
        const editAccountTypeData = await accountTypesModel.findOne({ _id: id })
        // if check by account_type_id 
        if (!editAccountTypeData) {
            return res.status(400).json({ message: "Account type id invalid, please check!" });
        }
        //update account type data
        await accountTypesModel.updateOne({ _id: editAccountTypeData.id }, {
            $set: {
                account_type_name,
                description,
                updated_by
            }
        })
        return res.status(200).json({
            status: 200,
            message: "Account type data updated successfully!",
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
}

/**
 * Api is to used for the get_account_type_list data in the DB collection.
 */
exports.getAccountTypeList = async (req, res) => {
    try {
        //filter pagination page wise data = page=1 & limit=2 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        // Get filter parameters
        const filters = {};
        if (req.query.search) {
            // search by account_type_name
            filters.account_type_name = { $regex: new RegExp(req.query.search, 'i') };
        }
        //account_type_list get
        const accountTypeList = await accountTypesModel.aggregate([{
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
                account_type_name: 1,
                description: 1,
                created_date_time: 1,
                created_by: 1,
                created_by_name: "$user_created.user_name",
                last_updated_date: 1,
                updated_by: "$user_updated.user_name",
            }
        }, {
            $skip: skip
        }, {
            $limit: limit
        }, {
            $sort: { createdAt: -1 }
        }
        ]);
        const totalAccountTypeListCountData = await accountTypesModel.countDocuments();
        if (!accountTypeList.length) {
            return res.status(404).json({
                status: 404,
                message: "Account type list data not found!"
            });
        }
        return res.status(200).json({
            status: 200,
            message: "Account type list data successfully!",
            totalAccountType: totalAccountTypeListCountData,
            totalPages: Math.ceil(totalAccountTypeListCountData / limit),
            currentPage: page,
            data: accountTypeList
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
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        // account_type data deleted
        await accountTypesModel.deleteOne({ _id: id });
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