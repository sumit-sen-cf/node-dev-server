const constant = require("../../common/constant");
const response = require("../../common/response");
const pms2PageSubCatModel = require("../../models/PMS2/pms2PageSubCatModel");

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