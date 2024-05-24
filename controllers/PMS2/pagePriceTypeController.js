const constant = require("../../common/constant");
const response = require("../../common/response");
const pagePriceTypeModel = require("../../models/PMS2/pagePriceTypeModel");

exports.addPagePriceType = async (req, res) => {
    try {
        const { name, description, platfrom_id, created_by } = req.body;
        //save data in Db collection
        const savingObj = await pagePriceTypeModel.create({
            name,
            description,
            platfrom_id,
            created_by,
        });
        if (!savingObj) {
            return response.returnFalse(
                500,
                req,
                res,
                `Oop's Something went wrong while saving page price type data.`,
                {}
            );
        }
        //success response send
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Saved page price type Data",
            savingObj
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getSinglePagePriceTypeDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const pagePriceTypeDetail = await pagePriceTypeModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!pagePriceTypeDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch page price type detail Data",
            pagePriceTypeDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllPagePriceTypeDetails = async (req, res) => {
    try {
        const pagePriceTypeDetails = await pagePriceTypeModel.find({
            status: { $ne: constant.DELETED },
        });
        if (pagePriceTypeDetails?.length <= 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch Page Price Type Details",
            pagePriceTypeDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.updateSinglePagePriceTypeDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const pagePriceTypeDetails = await pagePriceTypeModel.findOneAndUpdate({
            _id: id
        }, {
            $set: req.body
        }, {
            new: true
        });
        if (!pagePriceTypeDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Update Page Price Type Details Data",
            pagePriceTypeDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.deletePagePriceTypeDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const pagePriceTypeDeleted = await pagePriceTypeModel.findOneAndUpdate({
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
        if (!pagePriceTypeDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            `Successfully Delete Page Price Type Data for id ${id}`,
            pagePriceTypeDeleted
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};
