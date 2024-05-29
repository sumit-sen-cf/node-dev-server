const accountPocModel = require("../../models/accounts/accountPocModel");
const { message } = require("../../common/message")
const mongoose = require("mongoose");

/**
 * Api is to used for the add_account_poc data in the DB collection.
 */
exports.addAccountPoc = async (req, res) => {
    try {
        const checkDuplicacy = await accountPocModel.findOne({ contact_no: req.body.contact_no });
        // if check duplicacy contact_no
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "Contact number alredy exist!",
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
        const accountPocData = await accountPocModel.findOne({
            _id: mongoose.Types.ObjectId(req.params.id)
        });

        //data not get check
        if (!accountPocData) {
            return res.status(200).json({
                status: 200,
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
// exports.updateAccountPoc = async (req, res) => {
//     try {
//         const { id } = req.params
//         const { account_id, contact_name, contact_no, alternative_contact_no, email, department, designation, description, updated_by } = req.body;
//         const editAccountPocData = await accountPocModel.findOne({ _id: id })
//         // if check by account_poc_id 
//         if (!editAccountPocData) {
//             return res.status(400).json({ message: "Account poc id invalid, please check!" });
//         }
//         //update account poc data
//         await accountPocModel.updateOne({ _id: editAccountPocData.id }, {
//             $set: {
//                 account_id,
//                 contact_name,
//                 description,
//                 contact_no,
//                 alternative_contact_no,
//                 email,
//                 department,
//                 designation,
//                 updated_by
//             }
//         })
//         //send success response
//         return res.status(200).json({
//             status: 200,
//             message: "Account poc data updated successfully!",
//         })
//     } catch (error) {
//         return res.status(500).json({
//             status: 500,
//             message: error.message ? error.message : message.ERROR_MESSAGE,
//         });
//     }
// }

exports.updateAccountPoc = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            account_id,
            contact_name,
            contact_no,
            alternative_contact_no,
            email,
            department,
            designation,
            description,
            updated_by
        } = req.body;

        // update account poc data
        const updatedAccountPocData = await accountPocModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    account_id,
                    contact_name,
                    contact_no,
                    alternative_contact_no,
                    email,
                    department,
                    designation,
                    description,
                    updated_by
                }
            },
            { new: true }
        );

        // if account poc not found
        if (!updatedAccountPocData) {
            return res.status(400).json({ message: "Account poc id invalid, please check!" });
        }

        // send success response
        return res.status(200).json({
            status: 200,
            message: "Account poc data updated successfully!",
            data: updatedAccountPocData
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : "An error occurred while updating account poc data.",
        });
    }
};


/**
 * Api is to used for the update_account_poc data in the DB collection.
 */
exports.getAccountPocList = async (req, res) => {
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
                "contact_name": {
                    "$regex": req.query.search,
                    "$options": "i"
                }
            }]
        }
        //account_poc_list get
        const accountPocList = await accountPocModel.aggregate([{
            $match: matchQuery
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

        // Query to get counts of record of account poc
        const totalAccountPocListCounts = await accountPocModel.countDocuments(matchQuery);
        // send account types page and passing data
        return res.status(200).json({
            status: 200,
            message: "Account Poc list data fatched successfully!",
            data: accountPocList,
            start_record: skip + 1,
            end_record: skip + accountPocList.length,
            total_records: totalAccountPocListCounts,
            pagination: {
                currentPage: page,
                totalPage: Math.ceil(totalAccountPocListCounts / limit),
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
 * Api is to used for the delete_account_poc_list data in the DB collection.
 */
exports.deleteAccountPoc = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const accountPocData = await accountPocModel.findOne({ _id: id });
        // if check the accounPoc_id
        if (!accountPocData) {
            return res.status(200).json({
                status: 200,
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


/**
 * Api is to used for multiple update_account_poc data in the DB collection.
 */
exports.updateMultipleAccountPoc = async (req, res) => {
    try {
        // get poc data from body
        let accountPocDetails = (req.body?.account_poc) || [];
        const { updated_by } = req.body;

        // Check for duplicate contact_no in accountPoc
        if (accountPocDetails && Array.isArray(accountPocDetails)) {
            for (let i = 0; i < accountPocDetails.length; i++) {
                const existingPoc = await accountPocModel.findOne({
                    contact_no: accountPocDetails[i].contact_no
                });
                if (existingPoc) {
                    return res.status(400).json({
                        status: 400,
                        message: `Contact number ${accountPocDetails[i].contact_no} already exists.`
                    });
                }
            }
        }

        //account Poc details obj add in array
        if (accountPocDetails.length && Array.isArray(accountPocDetails)) {
            for (let element of accountPocDetails) {
                element.updated_by = updated_by;

                //update data in db collection
                await accountPocModel.updateOne({
                    _id: element._id
                }, {
                    $set: element
                }, {
                    upsert: true
                });
            }
        }
        //send success response
        return res.status(200).json({
            status: 200,
            message: "Account poc multiple data updated successfully!",
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
}