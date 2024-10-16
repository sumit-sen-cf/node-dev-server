const constant = require("../../common/constant");
const response = require("../../common/response");
const pageCategoryModel = require("../../models/PMS2/pageCategoryModel");
const pageMasterModel = require("../../models/PMS2/pageMasterModel");

exports.createPageCategory = async (req, res) => {
    try {
        const { page_category, description, created_by } = req.body;
        const addPageCategory = await pageCategoryModel.create({
            page_category,
            description,
            created_by,
        });
        if (!addPageCategory) {
            return response.returnFalse(
                req,
                res,
                `Oop's "Something went wrong while saving page category data.`,
                {}
            );
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Page category added successfully!",
            addPageCategory
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

exports.getPageCategoryDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const pageCategoryDetails = await pageCategoryModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!pageCategoryDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Page category data retrieve successfully!",
            pageCategoryDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getPageCategoryList = async (req, res) => {
    try {
        const pageCategoryList = await pageCategoryModel.find({
            status: { $ne: constant.DELETED },
        });
        if (pageCategoryList?.length <= 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Page category list retrive successfully!",
            pageCategoryList
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.updatePageCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { page_category, description, last_updated_by } = req.body;
        const updatePageCategoryData = await pageCategoryModel.updateOne(
            { _id: id },
            {
                $set: {
                    page_category,
                    description,
                    last_updated_by,
                },
            }
        );

        if (updatePageCategoryData.matchedCount === 0) {
            return response.returnTrue(500, req, res, `Page category failed successfully.`);
        } else if (updatePageCategoryData.modifiedCount === 0) {
            return response.returnFalse(200, req, res, `Page category are not updated.`);
        } else {
            return response.returnTrue(200, req, res, `Page category updated successfully.`);
        }
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.deletePageCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const pageData = await pageMasterModel.find({ page_category_id: id });

        if (pageData.length === 0) {
            const pageCategoryDataDelete = await pageCategoryModel.findOneAndUpdate(
                { _id: id, status: { $ne: constant.DELETED } },
                {
                    $set: {
                        status: constant.DELETED,
                    },
                },
                { new: true }
            );
            if (!pageCategoryDataDelete) {
                return response.returnFalse(200, req, res, `No Record Found`, {});
            }
            return response.returnTrue(
                200,
                req,
                res,
                `Page category deleted successfully! ${id}`,
                pageCategoryDataDelete
            );
        } else {
            return res.status(400).json({ message: "You Can not Delete this Category because this category is assigned in PageMaster Data " })
        }
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllPageCategoryDeleted = async (req, res) => {
    try {
        // Find all Page Category that are not deleted
        const pageCategoryDeletedData = await pageCategoryModel.find({ status: constant.DELETED });

        if (!pageCategoryDeletedData) {
            return response.returnFalse(200, req, res, 'No Records Found', {});
        }

        return response.returnTrue(200, req, res, 'Page category retrieved successfully!', pageCategoryDeletedData);
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};


exports.mergePageCategory = async (req, res) => {
    try {
        const { preference_id, removed_id, start_date, end_date } = req.body;

        if (!preference_id || !removed_id || !start_date || !end_date) {
            return res.status(400).json({ message: "Invalid input" });
        }

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        if (startDate > endDate) {
            return res.status(400).json({ message: "Invalid date range" });
        }

        const filter = {
            page_category_id: removed_id,
            createdAt: { $gte: startDate, $lte: endDate }
        };
        const update = {
            $set: { page_category_id: preference_id }
        };

        const result = await pageMasterModel.updateMany(filter, update);

        return res.status(200).json({
            message: "Categories merged successfully",
            modifiedCount: result.nModified
        });
    } catch (error) {
        console.error("Error merging categories: ", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};