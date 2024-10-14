const constant = require("../../common/constant");
const response = require("../../common/response");
const pagePriceLogModel = require("../../models/PMS2/pagePriceLogModel");
const pageFollowerCountLogModel = require("../../models/PMS2/pageFollowerCountLogModel");

// exports.getAllPagePriceLogs = async (req, res) => {
//     try {

//         const pagePricLogsDetails = await pagePriceLogModel
//             .aggregate([
//                 {
//                     $lookup: {
//                         from: "pms2pagemastermodels",
//                         localField: "page_master_id",
//                         foreignField: "_id",
//                         as: "pageData",
//                     },
//                 },
//                 {
//                     $unwind: {
//                         path: "$pageData",
//                         preserveNullAndEmptyArrays: true,
//                     },
//                 },
//                 {
//                     $lookup: {
//                         from: "pms2pagepricetypemodels",
//                         localField: "page_price_type_id",
//                         foreignField: "_id",
//                         as: "pagePriceTypeData",
//                     },
//                 },
//                 {
//                     $unwind: {
//                         path: "$pagePriceTypeData",
//                         preserveNullAndEmptyArrays: true,
//                     },
//                 },
//                 {
//                     $lookup: {
//                         from: "usermodels",
//                         localField: "created_by",
//                         foreignField: "user_id",
//                         as: "userCreatedData",
//                     },
//                 },
//                 {
//                     $unwind: {
//                         path: "$userCreatedData",
//                         preserveNullAndEmptyArrays: true,
//                     },
//                 },
//                 {
//                     $project: {
//                         _id: 1,
//                         page_master_id: 1,
//                         page_name: "$pageData.page_name",
//                         page_price_type_id: 1,
//                         page_price_type_name: "$pagePriceTypeData.name",
//                         price: 1,
//                         created_by: 1,
//                         created_by_name: "$userCreatedData.user_name"
//                     },
//                 },
//             ]);

//         if (pagePricLogsDetails?.length <= 0) {
//             return response.returnFalse(200, req, res, `No Record Found`, []);
//         }
//         return response.returnTrue(
//             200,
//             req,
//             res,
//             "Successfully Fetch Page Price Logs Datas",
//             pagePricLogsDetails
//         );
//     } catch (error) {
//         return response.returnFalse(500, req, res, `${error.message}`, {});
//     }
// };


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
        const pageFollowerCountLogs = await pageFollowerCountLogModel.find().lean();
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