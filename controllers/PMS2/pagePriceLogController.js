const constant = require("../../common/constant");
const response = require("../../common/response");
const pagePriceLogModel = require("../../models/PMS2/pagePriceLogModel");
const pageFollowerCountLogModel = require("../../models/PMS2/pageFollowerCountLogModel");

exports.getAllPagePriceLogs = async (req, res) => {
    try {

        const pagePricLogsDetails = await pagePriceLogModel.find(req.query)

        if (pagePricLogsDetails?.length <= 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch Page Price Logs Datas",
            pagePricLogsDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllPageFollowerCountLog = async (req, res) => {
    try {
        const pageFollowerCountLogs = await pageFollowerCountLogModel.find(req.query);
        if (pageFollowerCountLogs?.length <= 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch Page Follower Count Logs Details",
            pageFollowerCountLogs
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};