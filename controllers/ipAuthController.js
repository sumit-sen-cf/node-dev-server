const constant = require("../common/constant");
const response = require("../common/response");
const { getNetworkIP } = require("../helper/helper");
const ipAuthModel = require("../models/ipAuthModel");

exports.addIpAuthDetail = async (req, res) => {
    try {
        const { ip, type, description, created_by } = req.body;
        const savingObj = ipAuthModel({
            ip, type, description, created_by
        });
        const savedObj = await savingObj.save();
        if (!savedObj) {
            return response.returnFalse(
                500,
                req,
                res,
                `Oop's Something went wrong while saving Ip Configuration data.`,
                {}
            );
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Saved Ip Configuration Data",
            savedObj
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getSingleIpAuthDetailDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const ipAuthDetail = await ipAuthModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!ipAuthDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch Ip Configuration Data",
            ipAuthDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllIpAuthDetailDetails = async (req, res) => {
    try {
        const ipAuthDetails = await ipAuthModel.find({
            status: { $ne: constant.DELETED },
        });
        if (ipAuthDetails?.length <= 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch Ip Configuration Details",
            ipAuthDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.updateSingleIpAuthDetailDetails = async (req, res) => {
    try {
        const { id } = req.body;
        const ipAuthDetail = await ipAuthModel.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true }
        );
        if (!ipAuthDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Update Ip Configuration Data",
            ipAuthDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.deleteIpAuthDetailDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const ipAuthDetailDeleted = await ipAuthModel.findOneAndUpdate(
            { _id: id, status: { $ne: constant.DELETED } },
            {
                $set: {
                    status: constant.DELETED,
                },
            },
            { new: true }
        );
        if (!ipAuthDetailDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            `Successfully Delete Ip Configuration Data for id ${id}`,
            ipAuthDetailDeleted
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllIpAuthDetailDeletedData = async (req, res) => {
    try {
        const ipAuthDetailDeletedData = await ipAuthModel.find({
            status: constant.DELETED,
        });

        if (!ipAuthDetailDeletedData) {
            return response.returnFalse(200, req, res, "No Records Found", {});
        }

        return response.returnTrue(
            200,
            req,
            res,
            "Ip Configuration retrieved successfully!",
            ipAuthDetailDeletedData
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getMyNetworkIp = async (req, res) => {
    try {
      let ip = await getNetworkIP();
      if (!ip) {
        return response.returnFalse(
          200,
          req,
          res,
          "There is somethin error please contact your IT manager or connect to internate",
          {}
        );
      }
      return response.returnTrue(200, req, res, "success", ip);
    } catch (error) {
      console.log(error);
      return response.returnFalse(200, req, res, error.message, {});
    }
  };