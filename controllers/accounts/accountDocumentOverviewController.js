const { message } = require("../../common/message")
const mongoose = require("mongoose");
const accountDocumentOverviewModel = require("../../models/accounts/accountDocumentOverviewModel");
const multer = require("multer");
const vari = require("../../variables.js");
const { storage } = require('../../common/uploadFile.js');
const { uploadImage, deleteImage } = require("../../common/uploadImage.js");
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
            // Define the image fields 
            const imageFields = {
                document_image_upload: 'DocumentImagesUpload',
            };
            for (const [field] of Object.entries(imageFields)) {            //itreates 
                if (req.files[field] && req.files[field][0]) {
                    addCustomerDocumentData[field] = await uploadImage(req.files[field][0], "AccountDocument");
                }
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
]

/**
 * Api is to used for the get Document overview data in the DB collection.
 */
exports.getDocumentOverviewDetails = async (req, res) => {
    try {
        const documentOverviewData = await accountDocumentOverviewModel.aggregate([{
            $match: {
                account_id: Number(req.params.id)
            },
        }, {
            $lookup: {
                from: "accountdocumentmastermodels",
                localField: "document_master_id",
                foreignField: "_id",
                as: "documentMaster",
            }
        }, {
            $unwind: {
                path: "$documentMaster",
                preserveNullAndEmptyArrays: true,
            }
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
                document_name: "$documentMaster.document_name",
                document_image_upload: {
                    $concat: [imageUrl, "$document_image_upload"],
                }
            }
        }]);

        //data not get check
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
            data: documentOverviewData,
            imageUrl: imageUrl
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
}

/**
 * Api is to used for the update_document_overview data in the DB collection.
 */

exports.updateDocumentOverview = [
    upload, async (req, res) => {
        try {
            const { id } = req.params;
            // Fetch the old document and update it
            const updatedDocumentOverview = await accountDocumentOverviewModel.findByIdAndUpdate(
                { _id: id },
                { ...req.body },
            );

            if (!updatedDocumentOverview) {
                return response.returnFalse(404, req, res, `Page states not found`, {});
            }

            // Define the image fields 
            const imageFields = {
                document_image_upload: 'DocumentImagesUpload',
            };

            // Remove old images not present in new data and upload new images
            for (const [fieldName] of Object.entries(imageFields)) {
                if (req.files && req.files[fieldName] && req.files[fieldName][0]) {

                    // Delete old image if present
                    if (updatedDocumentOverview[fieldName]) {
                        await deleteImage(`AccountDocument/${updatedDocumentOverview[fieldName]}`);
                    }
                    // Upload new image
                    updatedDocumentOverview[fieldName] = await uploadImage(req.files[fieldName][0], "AccountDocument");
                }
            }

            // Save the updated document with the new image URLs
            await updatedDocumentOverview.save();

            return res.status(200).json({
                status: 200,
                messgae: "Document overview data update successfully!",
                data: updatedDocumentOverview,
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message ? error.message : message.ERROR_MESSAGE,
            });
        }
    }
]

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
        },
        {
            $lookup: {
                from: "accountdocumentmastermodels",
                localField: "document_master_id",
                foreignField: "_id",
                as: "documentMaster",
            }
        },
        {
            $unwind: {
                path: "$documentMaster",
                preserveNullAndEmptyArrays: true,
            }
        },
        {
            $project: {
                account_id: 1,
                document_master_id: 1,
                document_no: 1,
                description: 1,
                created_by: 1,
                updated_by: 1,
                createdAt: 1,
                updatedAt: 1,
                document_name: "$documentMaster.document_name",
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

/**
 * Api is to used for multiple update_account_documents data in the DB collection.
 */
exports.updateMultipleAccountDocuments = async (req, res) => {
    try {
        // Get doc data from body
        let accountDocumentsDetails = (req.body?.account_documents) || [];
        const { updated_by } = req.body;
        const accountId = Number(req.params.id);

        // Get distinct IDs from the database
        const distinctIds = await accountDocumentOverviewModel.distinct('_id', {
            account_id: accountId
        });

        // Create a set of IDs from accountDocumentsDetails
        const documentIds = new Set(accountDocumentsDetails.map(doc => doc?._id));

        // Delete documents that are not included in accountDocumentsDetails
        for (let id of distinctIds) {
            if (!documentIds.has(id.toString())) {
                await accountDocumentOverviewModel.deleteOne({ _id: id });
            }
        }

        // Update or insert documents
        if (accountDocumentsDetails.length && Array.isArray(accountDocumentsDetails)) {
            for (let element of accountDocumentsDetails) {
                if (element?._id) {
                    // Existing document: update it
                    element.updated_by = updated_by;
                    await accountDocumentOverviewModel.updateOne({
                        _id: element._id
                    }, {
                        $set: element
                    });
                } else {
                    // New document: insert it
                    element.created_by = updated_by;
                    element.account_id = accountId;
                    await accountDocumentOverviewModel.create(element);
                }
            }
        }
        // Send success response
        return res.status(200).json({
            status: 200,
            message: "Account Documents multiple data updated successfully!",
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
}