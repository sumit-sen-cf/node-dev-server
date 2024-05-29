const { message } = require("../../common/message")
const mongoose = require("mongoose");
const accountDocumentMasterModel = require("../../models/accounts/accountDocumentMasterModel");

/**
 * Api is to used for the add_account_document_master data in the DB collection.
 */
exports.addDocumentMaster = async (req, res) => {
    try {
        // Check if a document with the same name already exists
        const checkDuplicacy = await accountDocumentMasterModel.findOne({ document_name: req.body.document_name });

        // if check duplicacy document_name
        if (checkDuplicacy) {
            // If a document with the same name exists, return a 403 status code with a message
            return res.status(403).json({
                status: 403,
                message: "Document master name already exists!",
            });
        }
        const { document_name, description, created_by } = req.body;

        // Store data in the database collection
        const createDocumentMaster = await accountDocumentMasterModel.create({
            document_name: document_name,
            description: description,
            created_by: created_by,
        });

        // Return a success response with the created document data
        return res.status(200).json({
            status: 200,
            message: "Document data added successfully!",
            data: createDocumentMaster,
        });
    } catch (error) {
        // If an error occurs, return a 500 status code with an error message
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : "An error occurred while retrieving the document master data.",
        });
    }
};

/**
 * Api is to used for the get_account_document_master data in the DB collection.
 */
exports.getDocumentMasterDetails = async (req, res) => {
    try {
        // Use aggregate to fetch document master details by ID
        const documentMasterData = await accountDocumentMasterModel.findOne({
            $match: {
                _id: mongoose.Types.ObjectId(req.params.id)
            }
        })

        // If no document master data is found, return a 404 status with a message
        if (!documentMasterData) {
            return res.status(200).json({
                status: 200,
                message: "Document master data not found!"
            });
        }

        // Return a success response with the retrieved document master data
        return res.status(200).json({
            status: 200,
            message: "Document master retrieved successfully!",
            data: documentMasterData
        });
    } catch (error) {
        // If an error occurs, return a 500 status code with the error message
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : "An error occurred while retrieving the document master data.",
        });
    }
};

/**
 * Api is to used for the update_document_master data in the DB collection.
 */
// exports.updateDocumentMaster = async (req, res) => {
//     try {
//         const { id } = req.params
//         const { document_name, is_visible, description, updated_by } = req.body;
//         const editDocumentMaster = await accountDocumentMasterModel.findOne({ _id: id })
//         // if check duplicacy document_name
//         if (!editDocumentMaster) {
//             return res.status(400).json({ message: "Document master id invalid, please check!" });
//         }
//         // update data in the database collection
//         await accountDocumentMasterModel.updateOne({ _id: editDocumentMaster.id }, {
//             $set: {
//                 document_name,
//                 is_visible,
//                 description,
//                 updated_by
//             }
//         })
//         // Return a success response with the created document data
//         return res.status(200).json({
//             status: 200,
//             message: "Document master data updated successfully!",
//         })
//     } catch (error) {
//         // If an error occurs, return a 500 status code with an error message
//         return res.status(500).json({
//             status: 500,
//             message: error.message ? error.message : "An error occurred while retrieving the document master data.",
//         });
//     }
// }

exports.updateDocumentMaster = async (req, res) => {
    try {
        const { id } = req.params
        const { document_name, description, updated_by } = req.body;
        const editDocumentMaster = await accountDocumentMasterModel.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    document_name,
                    description,
                    updated_by
                }
            },
            { new: true }
        );
        // if check duplicacy document_name
        if (!editDocumentMaster) {
            return res.status(400).json({ message: "Document master id invalid, please check!" });
        }
        // Return a success response with the updated document data
        return res.status(200).json({
            status: 200,
            message: "Document master data updated successfully!",
            data: editDocumentMaster
        });
    } catch (error) {
        // If an error occurs, return a 500 status code with an error message
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : "An error occurred while updating the document master data.",
        });
    }
}


/**
 * Api is to used for the get_document_master_list data in the DB collection.
 */
exports.getDocumentMasterList = async (req, res) => {
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
                "document_name": {
                    "$regex": req.query.search,
                    "$options": "i"
                }
            }]
        }
        //document_master_list get
        const documentMasterList = await accountDocumentMasterModel.aggregate([{
            $match: matchQuery
        }, {
            $project: {
                document_name: 1,
                description: 1,
                created_by: 1,
                updated_by: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        }, {
            $skip: skip
        }, {
            $limit: limit
        }, {
            $sort: sort
        }
        ]);
        // Query to get counts of record of account types
        const totalDocumentMasterListCounts = await accountDocumentMasterModel.countDocuments(matchQuery);
        // send account types page and passing data
        return res.status(200).json({
            status: 200,
            message: "Document master list data fatched successfully!",
            data: documentMasterList,
            start_record: skip + 1,
            end_record: skip + documentMasterList.length,
            total_records: totalDocumentMasterListCounts,
            pagination: {
                currentPage: page,
                totalPage: Math.ceil(totalDocumentMasterListCounts / limit),
                url: req.originalUrl
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : "An error occurred while retrieving the document master data.",
        });
    }
}

/**
 * Api is to used for the delete_document_master data in the DB collection.
 */
exports.deleteDocumentMaster = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const documentMasterDelete = await accountDocumentMasterModel.findOne({ _id: id });
        // if check the document_master_id
        if (!documentMasterDelete) {
            return res.status(200).json({
                status: 200,
                message: message.DATA_NOT_FOUND,
            });
        }
        // document_master data deleted
        await accountDocumentMasterModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Document master data deleted successfully!",
            data: documentMasterDelete
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : "An error occurred while retrieving the document master data.",
        });
    }
};