const { message } = require("../../common/message")
const mongoose = require("mongoose");
const accountDocumentOverviewModel = require("../../models/accounts/accountDocumentOverviewModel");
const multer = require("multer");
const vari = require("../../variables.js");
const { storage } = require('../../common/uploadFile.js');
const imageUrl = vari.IMAGE_URL; // Retrieve the base URL for image storage from configuration

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "document_image_upload", maxCount: 1 },
]);

/**
 * Api is to used for the add_account_document_overview data in the DB collection.
 */
exports.addDocumentOverview = [
    upload, async (req, res) => {
        try {
            const { account_id, document_master_id, document_no, description, created_by } = req.body;
            // Store data in the database collection
            const addCustomerDocumentData = new accountDocumentOverviewModel({
                account_id: account_id,
                document_master_id: document_master_id,
                document_no: document_no,
                description: description,
                created_by: created_by,
            });
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            if (req.files.document_image_upload && req.files.document_image_upload[0].originalname) {
                const blob1 = bucket.file(req.files.document_image_upload[0].originalname);
                addCustomerDocumentData.document_image_upload = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => {
                });
                blobStream1.end(req.files.document_image_upload[0].buffer);
            }
            await addCustomerDocumentData.save();
            // Return a success response with the created document data
            return res.status(200).json({
                status: 200,
                message: "Document overview data added successfully!",
                data: addCustomerDocumentData,
            });
        } catch (error) {
            // If an error occurs, return a 500 status code with an error message
            return res.status(500).json({
                status: 500,
                message: error.message ? error.message : "An error occurred while adding the document overview data.",
            });
        }
    }
];

/**
 * Api is to used for the get_account_poc data in the DB collection.
 */
exports.getDocumentOverviewDetails = async (req, res) => {
    try {
        // Aggregate pipeline to fetch document overview details along with the user who created the document
        const documentOverviewData = await accountDocumentOverviewModel.aggregate([
            {
                // Match the document by its unique ID from request parameters
                $match: { _id: mongoose.Types.ObjectId(req.params.id) },
            }, {
                // Lookup to join with the usermodels collection on created_by and user_id fields
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            }, {
                // Unwind the resulting user array to handle the case where no user is found
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                // Project the necessary fields from the document_overview 
                $project: {
                    account_id: 1,
                    document_master_id: 1,
                    document_no: 1,
                    description: 1,
                    createdAt: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    updatedAt: 1,
                    document_image_upload: {
                        $concat: [imageUrl, "$document_image_upload"],
                    },
                }
            }
        ])
        if (!documentOverviewData) {
            return res.status(200).json({
                status: 200,
                message: "Document overview data not found!"
            });
        }
        //send success response
        return res.status(200).json({
            status: 200,
            messgae: "Document overview data retrive successfully!",
            data: documentOverviewData
        })
    } catch (error) {
        return res.status(500).json({
            // If an error occurs, return a 500 status code with an error message
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
}


/**
 * Api is to used for the update_document_overview data in the DB collection.
 */
exports.updateDocumentOverview = async (req, res) => {
    try {
        const { id } = req.params;
        const { account_id, document_master_id, document_no, description, updated_by } = req.body;
        const editDocumentOverview = await accountDocumentOverviewModel.findOne({ _id: id });

        if (!editDocumentOverview) {
            return res.status(400).json({ message: "Document overview id invalid, please check!" });
        }

        const bucketName = vari.BUCKET_NAME;
        const bucket = storage.bucket(bucketName);

        // Check if files were uploaded
        if (req.files && req.files.document_image_upload && req.files.document_image_upload[0].originalname) {
            const blob1 = bucket.file(req.files.document_image_upload[0].originalname);
            editDocumentOverview.document_image_upload = blob1.name;
            const blobStream1 = blob1.createWriteStream();
            blobStream1.on("finish", () => {
                //after file upload finishes
            });
            blobStream1.end(req.files.document_image_upload[0].buffer);
        }

        // Update account document overview data
        await accountDocumentOverviewModel.updateOne({ _id: editDocumentOverview.id }, {
            $set: {
                account_id,
                document_master_id,
                document_no,
                description,
                updated_by
            }
        });

        // Send success response
        return res.status(200).json({
            status: 200,
            message: "Document overview data updated successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            // If an error occurs, return a 500 status code with an error message
            status: 500,
            message: error.message ? error.message : "An error occurred while updating the document overview data.",
        });
    }
};


/**
 * Api is to used for the get_document_overview_list data in the DB collection.
 */
exports.getDocumentOverviewList = async (req, res) => {
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
                "account_id": {
                    "$regex": req.query.search,
                    "$options": "i"
                }
            }]
        }
        // Aggregate pipeline to fetch document overview details along with the user who created the document
        const documentOverviewMasterList = await accountDocumentOverviewModel.aggregate([{
            $match: matchQuery
        }, {
            $project: {
                account_id: 1,
                document_master_id: 1,
                document_no: 1,
                description: 1,
                created_by: 1,
                updated_by: 1,
                createdAt: 1,
                updatedAt: 1,
                document_image_upload: {
                    $concat: [imageUrl, "$document_image_upload"],
                }
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
        const totalDocumentOverviewMasterListCounts = await accountDocumentOverviewModel.countDocuments(matchQuery);
        // send account types page and passing data
        return res.status(200).json({
            status: 200,
            message: "Document overview list data fatched successfully!",
            data: documentOverviewMasterList,
            start_record: skip + 1,
            end_record: skip + documentOverviewMasterList.length,
            total_records: totalDocumentOverviewMasterListCounts,
            pagination: {
                currentPage: page,
                totalPage: Math.ceil(totalDocumentOverviewMasterListCounts / limit),
                url: req.originalUrl
            }
        });
    } catch (error) {
        // If an error occurs, return a 500 status code with an error message
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : "An error occurred while retrieving the document master data.",
        });
    }
}

/**
 * Api is to used for the delete_document_master data in the DB collection.
 */
exports.deleteDocumentOverview = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const documentOverviewDelete = await accountDocumentOverviewModel.findOne({ _id: id });
        // if check the document_master_id
        if (!documentOverviewDelete) {
            return res.status(200).json({
                status: 200,
                message: message.DATA_NOT_FOUND,
            });
        }
        // document_master data deleted
        await accountDocumentOverviewModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Document overview data deleted successfully!",
            data: documentOverviewDelete
        });
    } catch (error) {
        // If an error occurs, return a 500 status code with an error message
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : "An error occurred while retrieving the document master data.",
        });
    }
};