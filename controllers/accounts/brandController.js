const multer = require("multer");
const response = require("../../common/response.js");
const constant = require("../../common/constant.js");
const brandModel = require("../../models/accounts/brandModel.js");
const { uploadImage, deleteImage } = require("../../common/uploadImage.js");

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "brand_image", maxCount: 1 }
]);

/**
 * Api is to used for the Brand data add in the DB collection.
 */
exports.createBrandDetails = [
    upload, async (req, res) => {
        try {
            //get data from body
            const { brand_name, brand_category_id, created_by } = req.body;

            //object Prepare for DB collection
            const addBrandDetails = new brandModel({
                brand_name: brand_name,
                brand_category_id: brand_category_id,
                created_by: created_by,
            });

            // Define the image fields 
            const imageFields = {
                brand_image: 'brandImage',
            };
            for (const [field] of Object.entries(imageFields)) {
                if (req.files[field] && req.files[field][0]) {
                    addBrandDetails[field] = await uploadImage(req.files[field][0], "AccountBrandFiles");
                }
            }

            //save data in db collection
            await addBrandDetails.save();

            // Return a success response with the updated record details
            return response.returnTrue(
                200,
                req,
                res,
                "Brand created successfully",
                addBrandDetails
            );
        } catch (err) {
            // Return an error response in case of any exceptions
            return response.returnFalse(500, req, res, err.message, {});
        }
    }
];

/**
* Api is to used for the get Brand data by ID in the DB collection.
*/
exports.getBrandDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const getBrandDetail = await brandModel.findOne({
            _id: id,
            status: {
                $ne: constant.DELETED
            }
        });
        if (!getBrandDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Brand details retrive successfully!",
            getBrandDetail
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the update Brand data in the DB collection.
 */
exports.updateBrandDeatil = [
    upload, async (req, res) => {
        try {
            const { id } = req.params;
            //get data from body
            const { brand_name, brand_category_id, updated_by } = req.body;
            const updateData = {
                brand_name: brand_name,
                brand_category_id: brand_category_id,
                updated_by: updated_by,
            };

            // Fetch the old document and update it
            const editBrandDetails = await brandModel.findByIdAndUpdate({
                _id: id
            }, updateData, {
                new: true
            });

            if (!editBrandDetails) {
                return response.returnFalse(404, req, res, `Brand data not found`, {});
            }

            // Define the image fields 
            const imageFields = {
                brand_image: 'brandImage',
            };

            // Remove old images not present in new data and upload new images
            for (const [fieldName] of Object.entries(imageFields)) {
                if (req.files && req.files[fieldName] && req.files[fieldName][0]) {

                    // Delete old image if present
                    if (editBrandDetails[fieldName]) {
                        await deleteImage(`AccountBrandFiles/${editBrandDetails[fieldName]}`);
                    }
                    // Upload new image
                    editBrandDetails[fieldName] = await uploadImage(req.files[fieldName][0], "AccountBrandFiles");
                }
            }

            // Save the updated document with the new image URLs
            await editBrandDetails.save();
            //return success response
            return response.returnTrue(
                200,
                req,
                res,
                "Brand data updated successfully!",
                editBrandDetails
            );
        } catch (error) {
            return response.returnFalse(500, req, res, `${error.message}`, {});
        }
    }
]

/**
 * Api is to used for get Brand list data in the DB collection.
*/
exports.getBrandList = async (req, res) => {
    try {
        const page = (req.query?.page && parseInt(req.query.page)) || 1;
        const limit = (req.query?.limit && parseInt(req.query.limit)) || Number.MAX_SAFE_INTEGER;
        const skip = (page && limit) ? (page - 1) * limit : 0;
        const sort = { createdAt: -1 };

        //for match conditions
        let matchQuery = {
            status: {
                $ne: constant.DELETED
            }
        };

        const pipeline = [{
            $match: matchQuery
        }, {
            $lookup: {
                from: "usermodels",
                localField: "created_by",
                foreignField: "user_id",
                as: "userData",
            }
        }, {
            $unwind: {
                path: "$userData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "accountbrandcategorymodels",
                localField: "brand_category_id",
                foreignField: "_id",
                as: "brandCategoryData",
            }
        }, {
            $unwind: {
                path: "$brandCategoryData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $addFields: {
                brand_image_url: {
                    $cond: {
                        if: { $ne: ["$brand_image", ""] },
                        then: {
                            $concat: [
                                constant.GCP_ACCOUNT_BRANDS_FOLDER_URL,
                                "/",
                                "$brand_image",
                            ],
                        },
                        else: "$brand_image",
                    }
                }
            }
        }, {
            $project: {
                brand_name: 1,
                brand_category_id: 1,
                brand_category_name: "$brandCategoryData.brand_category_name",
                brand_image_url: "$brand_image_url",
                created_by: 1,
                created_by_name: "$userData.user_name",
                updated_by: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        }, {
            $sort: sort
        }];

        if (page && limit) {
            pipeline.push(
                { $skip: skip },
                { $limit: limit },
            );
        }

        const brandDetailsList = await brandModel.aggregate(pipeline);
        const brandDetailsCount = await brandModel.countDocuments(matchQuery);

        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Brand list retreive successfully!",
            brandDetailsList,
            {
                start_record: skip + 1,
                end_record: skip + brandDetailsList.length,
                total_records: brandDetailsCount,
                current_page: page || 1,
                total_page: (page && limit) ? Math.ceil(brandDetailsCount / limit) : 1,
            }
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

/** 
 * Api is to used for delete Brand data in the DB collection.
*/
exports.deleteBrandDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const brandDataDeleted = await brandModel.findOneAndUpdate({
            _id: id,
            status: {
                $ne: constant.DELETED
            }
        }, {
            $set: {
                status: constant.DELETED,
            },
        }, {
            new: true
        });
        if (!brandDataDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            `Brand Details deleted successfully id ${id}`,
            brandDataDeleted
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}