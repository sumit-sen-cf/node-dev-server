const multer = require("multer");
const vari = require("../../variables.js");
const badgesMasterModel = require("../../models/Sales/badgesMasterModel.js");
const salesBookingModel = require("../../models/Sales/salesBookingModel.js");
const { uploadImage, deleteImage } = require("../../common/uploadImage.js");
const response = require("../../common/response.js");
const constant = require("../../common/constant.js");

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "badge_image", maxCount: 1 }
]);

/**
 * Api is to used for the sales_badges_master data add in the DB collection.
 */
exports.createBadgesMaster = [
    upload, async (req, res) => {
        try {
            const addBadgesMaster = new badgesMasterModel({
                badge_name: req.body.badge_name,
                min_rate_amount: req.body.min_rate_amount,
                max_rate_amount: req.body.max_rate_amount,
                created_by: req.body.created_by,
            });
            // // Define the image fields 
            // const imageFields = {
            //     badge_image: 'BadgeImages',
            // };
            // for (const [field] of Object.entries(imageFields)) {            //itreates 
            //     if (req.files[field] && req.files[field][0]) {
            //         addBadgesMaster[field] = await uploadImage(req.files[field][0], "SalesBadgeImages");
            //     }
            // }
            await addBadgesMaster.save();
            // Return a success response with the updated record details
            return response.returnTrue(
                200,
                req,
                res,
                "Sales badges master created successfully",
                addBadgesMaster
            );

        } catch (error) {
            // Return an error response in case of any exceptions
            return response.returnFalse(500, req, res, `${error.message}`, {});
        }
    }];

/**
* Api is to used for the sales_badges_master data get_ByID in the DB collection.
*/
exports.getBadgesMasterDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const badgesMasterDetail = await badgesMasterModel.findOne({
            _id: id,
            status: {
                $ne: constant.DELETED
            }
        });
        if (!badgesMasterDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Badges master details retrive successfully!",
            badgesMasterDetail
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the sales_badges_master data update in the DB collection.
 */
exports.updateBadgesMaster = [
    upload, async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = {
                badge_name: req.body.badge_name,
                min_rate_amount: req.body.min_rate_amount,
                max_rate_amount: req.body.max_rate_amount,
                updated_by: req.body.updated_by,
            };

            // Fetch the old document and update it
            const updatedBadgesMaster = await badgesMasterModel.findByIdAndUpdate({
                _id: id
            },
                updateData,
                {
                    new: true
                });

            if (!updatedBadgesMaster) {
                return response.returnFalse(404, req, res, `Badges master data not found`, {});
            }
            // // Define the image fields 
            // const imageFields = {
            //     badge_image: 'BadgeImages',
            // };

            // // Remove old images not present in new data and upload new images
            // for (const [fieldName] of Object.entries(imageFields)) {
            //     if (req.files && req.files[fieldName] && req.files[fieldName][0]) {

            //         // Delete old image if present
            //         if (updatedBadgesMaster[fieldName]) {
            //             await deleteImage(`SalesBadgeImages/${updatedBadgesMaster[fieldName]}`);
            //         }
            //         // Upload new image
            //         updatedBadgesMaster[fieldName] = await uploadImage(req.files[fieldName][0], "SalesBadgeImages");
            //     }
            // }
            // Save the updated document with the new image URLs
            await updatedBadgesMaster.save();

            // Return a success response with the updated record details
            return response.returnTrue(200, req, res, "Badges master data updated successfully!", updatedBadgesMaster);
        } catch (error) {
            // Return an error response in case of any exceptions
            return response.returnFalse(500, req, res, `${error.message}`, {});
        }
    }];


/**
 * Api is to used for the sales_badges_master data get_list in the DB collection.
 */
exports.getBadgesMasterList = async (req, res) => {
    try {
        // Extract page and limit from query parameters, default to null if not provided
        const page = req.query?.page ? parseInt(req.query.page) : null;
        const limit = req.query?.limit ? parseInt(req.query.limit) : null;
        const sort = { createdAt: 1 };

        // Calculate the number of records to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;

        // Retrieve the list of records with pagination applied
        const badgesMasterList = await badgesMasterModel.find({
            status: {
                $ne: constant.DELETED
            }
        }).skip(skip).limit(limit).sort(sort);

        const badgesMasterCount = await badgesMasterModel.countDocuments({
            status: {
                $ne: constant.DELETED
            }
        });

        // Return a success response with the list of records and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Badges master list retreive successfully!",
            badgesMasterList,
            {
                start_record: skip + 1,
                end_record: skip + badgesMasterList.length,
                total_records: badgesMasterCount,
                current_page: page || 1,
                total_page: (page && limit) ? Math.ceil(badgesMasterCount / limit) : 1,
            }
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the sales_badges_master data delete in the DB collection.
 */
exports.deleteBadgesMaster = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;

        // Attempt to find and update the record with the given id and status not equal to DELETED
        const badgesMasterDeleted = await badgesMasterModel.findOneAndUpdate(
            {
                _id: id,
                status: { $ne: constant.DELETED }
            }, {
            $set: {
                // Update the status to DELETED
                status: constant.DELETED,
            },
        }, {
            new: true
        });
        // If no record is found or updated, return a response indicating no record found
        if (!badgesMasterDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            `Badges master deleted succesfully! for id ${id}`,
            badgesMasterDeleted
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
* Api is to used for total sales booking amount and outstanding amount.
*/
exports.totalSaleBookingAmountForBadge = async (req, res) => {
    try {
        let matchQuery = {};
        //check if user id is available
        if (req.query?.userId) {
            matchQuery["created_by"] = Number(req.query.userId);
        }
        //sales booking data fetch from db collection
        const saleBookingDetails = await salesBookingModel.aggregate([{
            $match: matchQuery
        }, {
            $group: {
                _id: null,
                totalCampaignAmount: {
                    $sum: '$campaign_amount'
                },
                totalApprovedAmount: {
                    $sum: '$approved_amount'
                },
                totalSaleBookingCounts: {
                    $sum: 1
                }
            }
        }, {
            $project: {
                _id: 0,
                totalSaleBookingCounts: 1,
                totalCampaignAmount: 1,
                totalApprovedAmount: 1,
                totalOutstandingAmount: {
                    $subtract: ['$totalCampaignAmount', '$totalApprovedAmount']
                }
            }
        }]);
        if (!saleBookingDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Sales Booking details for badges retrive successfully!",
            (saleBookingDetails && saleBookingDetails.length) ? saleBookingDetails[0] : {}
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};