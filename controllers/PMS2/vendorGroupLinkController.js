const constant = require("../../common/constant");
const response = require("../../common/response");
const vendorGroupLinkModel = require("../../models/PMS2/vendorGroupLinkModel");

exports.addVendorGroupLink = async (req, res) => {
    try {
        const { vendor_id, link, created_by } = req.body;
        const savingObj = vendorGroupLinkModel({
            vendor_id,
            link,
            created_by,
        });
        const savedObj = await savingObj.save();
        if (!savedObj) {
            return response.returnFalse(
                500,
                req,
                res,
                `Oop's Something went wrong while saving group link data.`,
                {}
            );
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Saved group link Data",
            savedObj
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getSingleVendorGroupLinkDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const groupLinkDetail = await vendorGroupLinkModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!groupLinkDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch group link Data",
            groupLinkDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllVendorGroupLinkDetails = async (req, res) => {
    try {
        const groupLinkDetails = await vendorGroupLinkModel.find({
            status: { $ne: constant.DELETED },
        });
        if (groupLinkDetails?.length <= 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch Group link Details",
            groupLinkDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.updateSingleVendorGroupLinkDetails = async (req, res) => {
    try {
        const { id } = req.body;
        const groupLinkDetail = await vendorGroupLinkModel.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true }
        );
        if (!groupLinkDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Update Group link Data",
            groupLinkDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.deleteVendorGroupLinkDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const groupLinkDetailDeleted = await vendorGroupLinkModel.findOneAndUpdate(
            { _id: id, status: { $ne: constant.DELETED } },
            {
                $set: {
                    status: constant.DELETED,
                },
            },
            { new: true }
        );
        if (!groupLinkDetailDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            `Successfully Delete Group Link Data for id ${id}`,
            groupLinkDetailDeleted
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};