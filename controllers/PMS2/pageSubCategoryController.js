const constant = require("../../common/constant");
const response = require("../../common/response");
const pms2PageSubCatModel = require("../../models/PMS2/pms2PageSubCatModel");
const pageMasterModel = require("../../models/PMS2/pageMasterModel");

exports.createPageSubCategory = async (req, res) => {
    try {
        const { page_sub_category, description, created_by } = req.body;
        const addPageSubCategory = await pms2PageSubCatModel.create({
            page_sub_category,
            description,
            created_by,
        });
        if (!addPageSubCategory) {
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
            "Page sub category added successfully!",
            addPageSubCategory
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

exports.getPageSubCategoryDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const pageSubCategoryDetails = await pms2PageSubCatModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!pageSubCategoryDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Page sub category data retrieve successfully!",
            pageSubCategoryDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getPageSubCategoryList = async (req, res) => {
    try {
        const pageSubCategoryList = await pms2PageSubCatModel.find({
            status: { $ne: constant.DELETED },
        });
        if (pageSubCategoryList?.length <= 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Page sub category list retrive successfully!",
            pageSubCategoryList
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.updatePageSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { page_sub_category, description, last_updated_by } = req.body;
        const updatePageSubCategoryData = await pms2PageSubCatModel.updateOne(
            { _id: id },
            {
                $set: {
                    page_sub_category,
                    description,
                    last_updated_by,
                },
            }
        );

        if (updatePageSubCategoryData.matchedCount === 0) {
            return response.returnTrue(500, req, res, `Page sub category failed successfully.`);
        } else if (updatePageSubCategoryData.modifiedCount === 0) {
            return response.returnFalse(200, req, res, `Page sub category are not updated.`);
        } else {
            return response.returnTrue(200, req, res, `Page sub category updated successfully.`);
        }
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.deletePageSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const pageData = await pageMasterModel.find({ page_category_id: id });
        if (pageData.length === 0) {
            const pageSubCategoryDataDelete = await pms2PageSubCatModel.findOneAndUpdate(
                { _id: id, status: { $ne: constant.DELETED } },
                {
                    $set: {
                        status: constant.DELETED,
                    },
                },
                { new: true }
            );
            if (!pageSubCategoryDataDelete) {
                return response.returnFalse(200, req, res, `No Record Found`, {});
            }
            return response.returnTrue(
                200,
                req,
                res,
                `Page sub category deleted successfully! ${id}`,
                pageSubCategoryDataDelete
            );
        } else {
            return res.status(400).json({ message: "You Can not Delete this Sub Category because this Sub Category is assigned in PageMaster Data " })
        }
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllPageSubCategoryDeleted = async (req, res) => {
    try {
        // Find all Page Category that are not deleted
        const pageSubCategoryDeletedData = await pms2PageSubCatModel.find({ status: constant.DELETED });

        if (!pageSubCategoryDeletedData) {
            return response.returnFalse(200, req, res, 'No Records Found', {});
        }

        return response.returnTrue(200, req, res, 'Page sub category retrieved successfully!', pageSubCategoryDeletedData);
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.mergePageSubCategory = async (req, res) => {
    try {
        const { preference_id, removed_id, flag, start_date, end_date } = req.body;

        if (!preference_id || !removed_id || !start_date || !end_date) {
            return res.status(400).json({ message: "Invalid input" });
        }

        const subcategoryA = await pms2PageSubCatModel.findOne({ page_sub_category_id: preference_id });
        const subcategoryB = await pms2PageSubCatModel.findOne({ page_sub_category_id: removed_id });

        if (!subcategoryA || !subcategoryB) {
            return res.status(404).json({ message: "Category not found" });
        }

        const start = new Date(start_date);
        const end = new Date(end_date);

        const data = await pms2PageSubCatModel.updateMany(
            {
                page_sub_category_id: removed_id,
                createdAt: { $gte: start, $lte: end }
            },
            { $set: { page_sub_category_id: preference_id } }
        );

        if (flag === 2) {
            const pageData = await pageMasterModel.find({
                page_sub_category_id: subcategoryB._id,
                createdAt: { $gte: start, $lte: end }
            });

            if (pageData.length === 0) {
                const data = await pms2PageSubCatModel.findByIdAndUpdate(
                    subcategoryB._id,
                    { $set: { status: constant.DELETED } }
                );
                return res.status(200).json({ message: "Page Sub Category Data Deleted Successfully Which is not exit this sub category id in PageMaster" })
            }
        }

        return res.status(200).json({ message: "Sub Categories merged successfully" });
    } catch (error) {
        console.error("Error merging sub categories: ", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};