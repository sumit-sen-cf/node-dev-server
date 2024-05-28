const constant = require("../../common/constant");
const response = require("../../common/response");
const pagePriceMultipleModel = require("../../models/PMS2/pagePriceMultipleModel");

exports.addPagePriceMultiple = async (req, res) => {
    try {
        const { page_master_id, page_price_type_id, price, created_by } = req.body;
        //save data in Db collection
        const savingObj = await pagePriceMultipleModel.create({
            page_master_id,
            page_price_type_id,
            price,
            created_by,
        });
        if (!savingObj) {
            return response.returnFalse(
                500,
                req,
                res,
                `Oop's Something went wrong while saving page price multiple data.`,
                {}
            );
        }
        //success response send
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Saved page price multiple Data",
            savingObj
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getSinglePagePriceMultipleDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const pagePriceMultipleDetail = await pagePriceMultipleModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!pagePriceMultipleDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch page price multiple detail Data",
            pagePriceMultipleDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

//@2 Get Data Based 
exports.getPagePriceMultipleDetailsBasedOnPageId = async (req, res) => {
    try {
        const { id } = req.params;
        const pagePriceMultipleDetails = await pagePriceMultipleModel.find({
            page_master_id: id,
            status: { $ne: constant.DELETED },
        });
        if (pagePriceMultipleDetails?.length <= 0) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch page price multiple detail Data",
            pagePriceMultipleDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllPagePriceMultipleDetails = async (req, res) => {
    try {
        const pagePriceMultipleDetails = await pagePriceMultipleModel.find({
            status: { $ne: constant.DELETED },
        });
        if (pagePriceMultipleDetails?.length <= 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch Page Price Multiple Details",
            pagePriceMultipleDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.updateSinglePagePriceMultipleDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const pagePriceMultipleDetails = await pagePriceMultipleModel.findOneAndUpdate({
            _id: id
        }, {
            $set: req.body
        }, {
            new: true
        });
        if (!pagePriceMultipleDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Update Page Price multiple Details Data",
            pagePriceMultipleDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.deletePagePriceMultipleDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const pagePriceMultipleDeleted = await pagePriceMultipleModel.findOneAndUpdate({
            _id: id,
            status: {
                $ne: constant.DELETED
            }
        }, {
            $set: {
                status: constant.DELETED,
            }
        }, {
            new: true
        });
        if (!pagePriceMultipleDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            `Successfully Delete Page Price Multiple Data for id ${id}`,
            pagePriceMultipleDeleted
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};
