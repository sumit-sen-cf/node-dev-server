const { message } = require("../../common/message")
const mongoose = require("mongoose");
const multer = require("multer");
const vari = require("../../variables.js");
const response = require("../../common/response");
const { storage } = require('../../common/uploadFile.js');
const { uploadImage, deleteImage } = require("../../common/uploadImage.js");
const documentDetailsModel = require("../../models/PMS2/documentDetailsModel.js");
const constant = require("../../common/constant.js");
const imageUrl = vari.IMAGE_URL; // Retrieve the base URL for image storage from configuration

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "document_image_upload", maxCount: 5 },
]);

/**
 * Api is to used for the add_account_document_overview data in the DB collection.
 */

exports.addDocumentDetails = [
    upload, async (req, res) => {
        try {
            const { vendor_id, document_master_id, document_name, document_no, document_type, created_by } = req.body;
            // Store data in the database collection
            const addDocumentData = new documentDetailsModel({
                vendor_id,
                document_master_id,
                document_name,
                document_no,
                document_type,
                created_by,
            });
            // Define the image fields 
            const imageFields = {
                document_image_upload: 'DocumentImages',
            };
            for (const [field] of Object.entries(imageFields)) {            //itreates 
                if (req.files[field] && req.files[field][0]) {
                    addDocumentData[field] = await uploadImage(req.files[field][0], "PMS2DocumentImage");
                }
            }
            await addDocumentData.save();
            // Return a success response with the created document data
            return response.returnTrue(
                200,
                req,
                res,
                "Document data add successfully!",
                addDocumentData
            );
        } catch (error) {
            return response.returnFalse(500, req, res, `${error.message}`, {});
        }
    }
]

/**
 * Api is to used for the get Document overview data in the DB collection.
 */
exports.getDocumentDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const documentDetails = await documentDetailsModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!documentDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Document details data retrieve successfully!",
            documentDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}


/**
 * Api is to used for the update_document_overview data in the DB collection.
 */

exports.updateDocumentDetails = [
    upload, async (req, res) => {
        try {
            const { id } = req.params;
            // Fetch the old document and update it
            const documentDetailsUpdated = await documentDetailsModel.findByIdAndUpdate(
                { _id: id },
                { ...req.body },
                { new: true }
            );

            if (!documentDetailsUpdated) {
                return response.returnFalse(404, req, res, `Page states not found`, {});
            }

            // Define the image fields 
            const imageFields = {
                document_image_upload: 'DocumentImages',
            };

            // Remove old images not present in new data and upload new images
            for (const [fieldName] of Object.entries(imageFields)) {
                if (req.files && req.files[fieldName] && req.files[fieldName][0]) {

                    // Delete old image if present
                    if (documentDetailsUpdated[fieldName]) {
                        await deleteImage(`PMS2DocumentImage/${documentDetailsUpdated[fieldName]}`);
                    }
                    // Upload new image
                    documentDetailsUpdated[fieldName] = await uploadImage(req.files[fieldName][0], "PMS2DocumentImage");
                }
            }

            // Save the updated document with the new image URLs
            await documentDetailsUpdated.save();
            return response.returnTrue(
                200,
                req,
                res,
                "Document details data updated successfully!",
                documentDetailsUpdated
            );
        } catch (error) {
            return response.returnFalse(500, req, res, `${error.message}`, {});
        }
    }
]

/**
 * Api is to used for the get_document_overview_list data in the DB collection.
 */
exports.getDocumentDetailsList = async (req, res) => {
    try {
        const page = (req.query.page && parseInt(req.query.page)) || null;
        const limit = (req.query.limit && parseInt(req.query.limit)) || null;
        const skip = (page && limit) ? (page - 1) * limit : 0;
        let documentDetailsList;

        let matchQuery = {
            status: { $ne: constant.DELETED }
        };

        let addFieldsObj = {
            $addFields: {
                document_image_upload_url: {
                    $cond: {
                        if: { $ne: ["$document_image_upload", ""] },
                        then: {
                            $concat: [
                                constant.GCP_PMS2_Document_FOLDER_URL,
                                "/",
                                "$document_image_upload",
                            ],
                        },
                        else: "$document_image_upload",
                    },
                },
            },
        };

        const pipeline = [{ $match: matchQuery }, addFieldsObj];

        if (page && limit) {
            pipeline.push(
                { $skip: skip },
                { $limit: limit }
            );
        }

        documentDetailsList = await documentDetailsModel.aggregate(pipeline);
        const documentDetailsCount = await documentDetailsModel.countDocuments(matchQuery);

        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Document data list retreive successfully!",
            documentDetailsList,
            {
                start_record: skip + 1,
                end_record: skip + documentDetailsList.length,
                total_records: documentDetailsCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(documentDetailsCount / limit) : 1,
            }
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

/**
 * Api is to used for the delete_document_master data in the DB collection.
 */
exports.deleteDocumentDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const documentDetailsDeleted = await documentDetailsModel.findOneAndUpdate({ _id: id, status: { $ne: constant.DELETED } },
            {
                $set: {
                    status: constant.DELETED,
                },
            },
            { new: true }
        );
        if (!documentDetailsDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            `Document data deleted successfully id ${id}`,
            documentDetailsDeleted
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getDocumentVendorWiseDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const vendorWisedocumentDetails = await documentDetailsModel.findOne({
            vendor_id: id,
            status: { $ne: constant.DELETED },
        });
        if (!vendorWisedocumentDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Vendor id wise document details data retrieve successfully!",
            vendorWisedocumentDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}