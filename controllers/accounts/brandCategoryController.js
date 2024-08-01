const response = require("../../common/response");
const constant = require("../../common/constant");
const brandCategoryModel = require("../../models/accounts/brandCategoryModel");

/**
 * Api is to used for the Brand Category data add in the DB collection.
 */
exports.createBrandCategory = async (req, res) => {
    try {
        const { brand_category_name, created_by } = req.body;
        const addBrandCategory = await brandCategoryModel.create({
            brand_category_name: brand_category_name,
            created_by: created_by,
        });
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Brand Category Created Successfully",
            addBrandCategory
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the Brand Category data get By ID in the DB collection.
 */
exports.getBrandCategoryDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const brandCategoryDetails = await brandCategoryModel.findOne({
            _id: id,
            status: {
                $ne: constant.DELETED
            }
        });
        if (!brandCategoryDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Brand Category details retrive successfully!",
            brandCategoryDetails
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the Brand Category data update in the DB collection.
 */
exports.updateBrandCategory = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;
        const { brand_category_name, updated_by } = req.body;

        const brandCategoryUpdated = await brandCategoryModel.findByIdAndUpdate({
            _id: id
        }, {
            $set: {
                brand_category_name,
                updated_by
            }
        }, {
            new: true
        });
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Brand Category update successfully!",
            brandCategoryUpdated
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the Brand Category data get_list in the DB collection.
 */
exports.getBrandCategoryList = async (req, res) => {
    try {
        // Extract page and limit from query parameters, default to null if not provided
        const page = req.query?.page ? parseInt(req.query.page) : 1;
        const limit = req.query?.limit ? parseInt(req.query.limit) : Number.MAX_SAFE_INTEGER;
        const sort = { createdAt: -1 };

        // Calculate the number of records to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;

        // Retrieve the list of records with pagination applied
        const brandCategoryList = await brandCategoryModel.find({
            status: {
                $ne: constant.DELETED
            }
        }).skip(skip).limit(limit).sort(sort);

        // Get the total count of records in the collection
        const brandCategoryCount = await brandCategoryModel.countDocuments();

        // If no records are found, return a response indicating no records found
        if (brandCategoryList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of records and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Brand Category list retrieved successfully!",
            brandCategoryList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + brandCategoryList.length : brandCategoryList.length,
                total_records: brandCategoryCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(brandCategoryCount / limit) : 1,
            }
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the Brand Category data delete in the DB collection.
 */
exports.deleteBrandCategory = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;

        // Attempt to find and update the record with the given id and status not equal to DELETED
        const brandCategoryDeleted = await brandCategoryModel.findOneAndUpdate({
            _id: id,
            status: {
                $ne: constant.DELETED
            }
        }, {
            $set: {
                // Update the status to DELETED
                status: constant.DELETED,
            }
        }, {
            new: true
        });
        // If no record is found or updated, return a response indicating no record found
        if (!brandCategoryDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            `Brand Category deleted succesfully! for id ${id}`,
            brandCategoryDeleted
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};