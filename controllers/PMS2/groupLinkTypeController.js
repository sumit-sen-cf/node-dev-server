const constant = require("../../common/constant");
const response = require("../../common/response");
const groupLinkTypeModel = require("../../models/PMS2/groupLinkTypeModel");

exports.addGroupLink = async (req, res) => {
    try {
        const { link_type, description, created_by } = req.body;
        const savingObj = groupLinkTypeModel({
            link_type,
            description,
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

exports.getSingleGroupLinkDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const groupLinkDetail = await groupLinkTypeModel.findOne({
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

exports.getAllGroupLinkDetails = async (req, res) => {
    try {
        const groupLinkDetails = await groupLinkTypeModel.find({
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

exports.updateSingleGroupLinkDetails = async (req, res) => {
    try {
        const { id } = req.body;
        const groupLinkDetail = await groupLinkTypeModel.findOneAndUpdate(
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

exports.deleteGroupLinkDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const groupLinkDetailDeleted = await groupLinkTypeModel.findOneAndUpdate(
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

exports.getGroupLinkDeletedData = async (req, res) => {
    try {
        // Find all group link that are not deleted
        const groupLinkTypeData = await groupLinkTypeModel.find({ status: constant.DELETED });

        if (!groupLinkTypeData) {
            return response.returnFalse(200, req, res, 'No Records Found', {});
        }

        return response.returnTrue(200, req, res, 'Group link data retrive successfully!', groupLinkTypeData);
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};