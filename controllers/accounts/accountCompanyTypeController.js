const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const accountCompanyType = require('../../models/accounts/accountCompanyTypeModel');

/**
 * POST- Api is to used for the company type data add in the DB collection.
 */
exports.addAccountCompanyType = async (req, res) => {
    try {
        //duplicacy check get from db
        const checkDuplicacy = await accountCompanyType.findOne({ company_type_name: req.body.company_type_name });

        //check if dupliacte data
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "Account Company type name alredy exist!",
            });
        }

        //body data get for add in db
        const { company_type_name, description, created_by } = req.body;

        //data stored in DB collection
        const addAccountCompanyTypeData = await accountCompanyType.create({
            company_type_name: company_type_name,
            description: description,
            created_by: created_by,
        })
        //send success response
        return res.status(200).json({
            status: 200,
            message: "Account Company type data added successfully!",
            data: addAccountCompanyTypeData
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * PUT- Api is to used for the company type data update By-ID in the DB collection.
 */
// exports.editAccountCompanyType = async (req, res) => {
//     try {
//         //get id from params
//         const { id } = req.params;

//         //get data from the body
//         const { company_type_name, description, updated_by } = req.body;

//         //check data available
//         const accountCompanyTypeData = await accountCompanyType.findOne({ _id: id });
//         if (!accountCompanyTypeData) {
//             return res.send("Invalid company-type Id...");
//         }

//         //data update in db collection
//         await accountCompanyType.updateOne({
//             _id: id
//         }, {
//             $set: {
//                 company_type_name,
//                 description,
//                 updated_by
//             }
//         });
//         //send success response
//         return res.status(200).json({
//             status: 200,
//             message: "account company type data updated successfully!",
//         });
//     } catch (error) {
//         return res.status(500).json({
//             status: 500,
//             message: error.message ? error.message : message.ERROR_MESSAGE,
//         });
//     }
// };


exports.editAccountCompanyType = async (req, res) => {
    try {
        // Get ID from params
        const { id } = req.params;

        // Get data from the body
        const { company_type_name, description, updated_by } = req.body;

        // Update data in db collection
        const updatedAccountCompanyType = await accountCompanyType.findByIdAndUpdate(
            id,
            {
                $set: {
                    company_type_name,
                    description,
                    updated_by
                }
            },
            { new: true } // Option to return the modified document rather than the original
        );

        // Check if the update was successful
        if (!updatedAccountCompanyType) {
            return res.status(404).send("Invalid company-type ID...");
        }

        // Send success response
        return res.status(200).json({
            status: 200,
            message: "Account company type data updated successfully!",
            data: updatedAccountCompanyType
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : "An error occurred while updating the account company type data.",
        });
    }
}


/**
 * GET- Api is to used to get company type data By-ID from DB collection.
 */
exports.getSingleAccountCompanyType = async (req, res) => {
    try {
        //get id wise data from DB collection
        const accountCompanyTypeData = await accountCompanyType.findOne({
            _id: mongoose.Types.ObjectId(req.params.id)
        })

        //If data is not available
        if (!accountCompanyTypeData) {
            return res.status(200).json({
                status: 200,
                message: message.DATA_NOT_FOUND,
            });
        }
        //send success response
        return res.status(200).json({
            status: 200,
            message: "account company type details fatch successfully!",
            data: accountCompanyTypeData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * GET- Api is to used to get all company type data from DB collection.
 */
exports.getAllAccountCompanyType = async (req, res) => {
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
                "company_type_name": {
                    "$regex": req.query.search,
                    "$options": "i"
                }
            }]
        }

        //data get from the db collection
        const accountCompanyTypeData = await accountCompanyType.aggregate([{
            $match: matchQuery
        }, {
            $project: {
                _id: 1,
                company_type_name: 1,
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
        const totalAccountCompanyTypeCounts = await accountCompanyType.countDocuments(matchQuery);
        //send success response
        return res.status(200).send({
            succes: true,
            message: "account company type data list fetched successfully!",
            data: accountCompanyTypeData,
            start_record: skip + 1,
            end_record: skip + accountCompanyTypeData.length,
            total_records: totalAccountCompanyTypeCounts,
            pagination: {
                currentPage: page,
                totalPage: Math.ceil(totalAccountCompanyTypeCounts / limit),
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
 * DELETE- Api is to used delete company type data By-ID from DB collection.
 */
exports.deleteAccountCompanyType = async (req, res) => {
    try {
        const { id } = req.params;
        //get data from db collection
        const accountCompanyTypeData = await accountCompanyType.findOne({ _id: id });
        if (!accountCompanyTypeData) {
            return res.status(200).json({
                status: 200,
                message: message.DATA_NOT_FOUND,
            });
        }

        //delete data from the db collection by ID
        await accountCompanyType.deleteOne({ _id: id });

        //send success response
        return res.status(200).json({
            status: 200,
            message: "account company type data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};