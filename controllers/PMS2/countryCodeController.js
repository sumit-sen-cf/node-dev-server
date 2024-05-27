const constant = require("../../common/constant");
const response = require("../../common/response");
const countryCodeModel = require("../../models/PMS2/countryCodeModel");

exports.addCountryCode = async (req, res) => {
    try {
        const { country_name, code, phone, created_by } = req.body;
        const savingObj = countryCodeModel({
            country_name,
            code,
            phone,
            created_by,
        });
        const savedObj = await savingObj.save();
        if (!savedObj) {
            return response.returnFalse(
                500,
                req,
                res,
                `Oop's Something went wrong while saving country code data.`,
                {}
            );
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Saved country code  Data",
            savedObj
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getSingleCountryCodeDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const detail = await countryCodeModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!detail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch country code  Data",
            detail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllCountryCodeDetails = async (req, res) => {
    try {
        const details = await countryCodeModel.find({
            status: { $ne: constant.DELETED },
        });
        if (details?.length <= 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch country code  Details",
            details
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.updateSingleCountryCodeDetails = async (req, res) => {
    try {
        const { id } = req.body;
        const detail = await countryCodeModel.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true }
        );
        if (!detail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Update country code  Data",
            detail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.deleteCountryCodeDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const detailDeleted = await countryCodeModel.findOneAndUpdate(
            { _id: id, status: { $ne: constant.DELETED } },
            {
                $set: {
                    status: constant.DELETED,
                },
            },
            { new: true }
        );
        if (!detailDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            `Successfully Delete country code  Data for id ${id}`,
            detailDeleted
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllCountryCodeDeletedData = async (req, res) => {
    try {
        // Find all vendor type that are not deleted
        const detailDeletedData = await countryCodeModel.find({
            status: constant.DELETED,
        });

        if (!detailDeletedData) {
            return response.returnFalse(200, req, res, "No Records Found", {});
        }

        return response.returnTrue(
            200,
            req,
            res,
            "Country code  retrieved successfully!",
            detailDeletedData
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};
