const constant = require("../../common/constant");
const response = require("../../common/response");
const { incentiveCalculationUserLimit } = require("../../helper/status");
const incentivePlanModel = require("../../models/Sales/incentivePlanModel");
const recordServiceModel = require("../../models/Sales/recordServiceModel");
const salesBookingModel = require("../../models/Sales/salesBookingModel");
const { distinctSaleBookingIdsForIncentive } = require("../../helper/functions");

/**
 * Api is to used for the incentive_plan data add in the DB collection.
 */
exports.createIncentivePlan = async (req, res) => {
    try {
        const { sales_service_master_id, incentive_type, value, remarks, created_by } = req.body;
        const addIncentivePlanDetails = await incentivePlanModel.create({
            sales_service_master_id,
            incentive_type,
            value,
            remarks,
            created_by,
        });
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Incentive plan Created Successfully!",
            addIncentivePlanDetails
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the incentive_plan data get_ByID in the DB collection.
 */
exports.getIncentivePlanDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const incentivePlanDetails = await incentivePlanModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED }
        });
        if (!incentivePlanDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }

        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Incentive plan details retreive Successfully!",
            incentivePlanDetails
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};
/**
 * Api is to used for the incentive_plan data update in the DB collection.
 */
exports.updateIncentivePlan = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;
        const { sales_service_master_id, incentive_type, value, remarks, status, updated_by } = req.body;

        const incentivePlanUpdated = await incentivePlanModel.findByIdAndUpdate({
            _id: id
        }, {
            $set: {
                sales_service_master_id,
                incentive_type,
                value,
                remarks,
                status,
                updated_by
            },
        }, {
            new: true
        });
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Incentive plan update successfully!",
            incentivePlanUpdated
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    };
};

/**
 * Api is to used for the incentive_plan data get_list in the DB collection.
 */
exports.getIncentivePlanList = async (req, res) => {
    try {
        // Extract page and limit from query parameters, default to null if not provided
        const page = req.query?.page ? parseInt(req.query.page) : 1;
        const limit = req.query?.limit ? parseInt(req.query.limit) : Number.MAX_SAFE_INTEGER;
        const sort = { createdAt: -1 };

        // Calculate the number of records to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;
        let matchQuery = {
            status: {
                $ne: constant.DELETED
            }
        }

        // Retrieve the list of records with pagination applied
        const incentivePlanList = await incentivePlanModel.aggregate([{
            $match: matchQuery
        }, {
            $lookup: {
                from: "salesservicemastermodels",
                localField: "sales_service_master_id",
                foreignField: "_id",
                as: "salesServiceMasterData",
            }
        }, {
            $unwind: {
                path: "$salesServiceMasterData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $project: {
                sales_service_master_id: 1,
                sales_service_master_Data: {
                    _id: "$salesServiceMasterData._id",
                    service_name: "$salesServiceMasterData.service_name",
                    status: "$salesServiceMasterData.status"
                },
                incentive_type: 1,
                value: 1,
                remarks: 1,
                status: 1,
                created_by: 1,
                updated_by: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        }, {
            $sort: sort
        }, {
            $skip: skip
        }, {
            $limit: limit
        }])

        // Get the total count of records in the collection
        const incentivePlanCount = await incentivePlanModel.countDocuments(matchQuery);

        // If no records are found, return a response indicating no records found
        if (incentivePlanList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of records and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Incentive plan list retrieved successfully!",
            incentivePlanList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + incentivePlanList.length : incentivePlanList.length,
                total_records: incentivePlanCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(incentivePlanCount / limit) : 1,
            }
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    };
};

/**
 * Api is to used for the incentive_plan data delete in the DB collection.
 */
exports.deleteIncentivePlan = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;

        // Attempt to find and update the record with the given id and status not equal to DELETED
        const incentivePlanDeleted = await incentivePlanModel.findOneAndUpdate(
            {
                _id: id,
                status: { $ne: constant.DELETED }
            },
            {
                $set: {
                    // Update the status to DELETED
                    status: constant.DELETED,
                },
            },
            { new: true }
        );
        // If no record is found or updated, return a response indicating no record found
        if (!incentivePlanDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            `Incentive plan deleted succesfully! for id ${id}`,
            incentivePlanDeleted
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    };
};

/**
 * incentive dashboard data calculate user's wise.
 */
exports.getIncentiveCalculationDashboard = async (req, res) => {
    try {
        //match condition obj prepare
        let searchQuery = {
            incentive_status: "incentive"
        };
        //get user id from query
        if (req.query?.userId) {
            searchQuery["created_by"] = req.query.userId;
        }
        // Get distinct sale booking IDs from the database
        const distinctSaleBookingIds = await distinctSaleBookingIdsForIncentive(searchQuery);

        //match condition obj prepare
        let matchCondition = {
            _id: {
                $in: distinctSaleBookingIds
            }
        };
        //create dynamic match condition
        if (req.body?.user_ids && (req.body.user_ids).length) {
            matchCondition["created_by"] = { $in: req.body.user_ids };
        }

        //body to year and month get and create match condition
        if (req.body?.monthYearArray && (req.body.monthYearArray).length) {
            let expr = {
                $or: []
            };
            req.body.monthYearArray.forEach((date) => {
                let [month, year] = date.split('-');
                expr.$or.push({
                    $and: [
                        { $eq: [{ $year: "$sale_booking_date" }, Number(year)] },
                        { $eq: [{ $month: "$sale_booking_date" }, Number(month)] }
                    ]
                });
            });
            matchCondition["$expr"] = expr;
        }

        //incentive calculation limit set
        let incentiveCalculationLimit = incentiveCalculationUserLimit || 50000;

        //incentive dashboard data calculation
        const incentiveCalculationDashboard = await salesBookingModel.aggregate([{
            $match: matchCondition
        }, {
            $unionWith: {
                coll: "salessharedincentivesalebookingmodels",
                pipeline: [{
                    $match: matchCondition
                }]
            }
        }, {
            $lookup: {
                from: "usermodels",
                let: {
                    created_by: "$created_by"
                },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$$created_by", "$user_id"] },
                            ]
                        }
                    }
                }, {
                    $project: {
                        user_id: 1,
                        user_name: 1,
                    }
                }],
                as: "userData"
            }
        }, {
            $unwind: {
                path: "$userData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "salesrecordservicemodels",
                localField: "sale_booking_id",
                foreignField: "sale_booking_id",
                as: "salesRecordServiceData"
            }
        }, {
            $unwind: "$salesRecordServiceData",
        }, {
            $lookup: {
                from: "salesincentiveplanmodels",
                localField: "salesRecordServiceData.sales_service_master_id",
                foreignField: "sales_service_master_id",
                as: "salesIncentivePlanDetails"
            }
        }, {
            $addFields: {
                salesIncentivePlan: {
                    $cond: {
                        if: { $gt: [{ $size: "$salesIncentivePlanDetails" }, 0] },
                        then: true,
                        else: false
                    }
                }
            }
        }, {
            $match: {
                salesIncentivePlan: true
            }
        }, {
            $addFields: {
                year: { $year: "$sale_booking_date" },
                month: { $month: "$sale_booking_date" },
                created_by: "$created_by",
                user_name: "$userData.user_name",
            }
        }, {
            $group: {
                _id: {
                    sale_booking_id: "$sale_booking_id",
                    created_by: "$created_by",
                    // incentive_amount: "$incentive_amount"
                },
                // _id: "$sale_booking_id",
                year: { $first: "$year" },
                month: { $first: "$month" },
                created_by: { $first: "$created_by" },
                user_name: { $first: "$user_name" },
                totalDocuments: { $sum: 1 },
                campaignAmount: { $first: "$campaign_amount" },
                paidAmount: { $first: "$approved_amount" },
                recordServiceAmount: { $sum: "$salesRecordServiceData.amount" },
                incentiveAmount: { $first: "$incentive_amount" },
                earnedIncentiveAmount: { $first: "$earned_incentive_amount" },
                unEarnedIncentiveAmount: { $first: "$unearned_incentive_amount" }
            }
        }, {
            $group: {
                _id: {
                    created_by: "$created_by",
                    user_name: "$user_name",
                    year: "$year",
                    month: "$month",
                },
                totalDocuments: { $first: "$totalDocuments" },
                campaignAmount: { $sum: "$campaignAmount" },
                paidAmount: { $sum: "$paidAmount" },
                recordServiceAmount: { $sum: "$recordServiceAmount" },
                incentiveAmount: { $sum: "$incentiveAmount" },
                earnedIncentiveAmount: { $sum: "$earnedIncentiveAmount" },
                unEarnedIncentiveAmount: { $sum: "$unEarnedIncentiveAmount" },
            }
        }, {
            $match: {
                campaignAmount: { $gte: incentiveCalculationLimit }
            }
        }, {
            $group: {
                _id: {
                    created_by: "$_id.created_by",
                    user_name: "$_id.user_name",
                },
                totalDocuments: { $first: "$totalDocuments" },
                campaignAmount: { $sum: "$campaignAmount" },
                paidAmount: { $sum: "$paidAmount" },
                recordServiceAmount: { $sum: "$recordServiceAmount" },
                incentiveAmount: { $sum: "$incentiveAmount" },
                earnedIncentiveAmount: { $sum: "$earnedIncentiveAmount" },
                unEarnedIncentiveAmount: { $sum: "$unEarnedIncentiveAmount" },
            }
        }, {
            $sort: {
                "_id.created_by": 1,
            }
        }, {
            $lookup: {
                from: "salesincentiverequestmodels",
                let: { created_by: "$_id.created_by" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$sales_executive_id", "$$created_by"] },
                                    { $in: ["$admin_status", ["pending", "approved"]] }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            incentiveRequestedAmount: { $sum: "$user_requested_amount" },
                            incentiveReleasedAmount: { $sum: "$finance_released_amount" }
                        }
                    }
                ],
                as: "incentiveRequestData"
            }
        }, {
            $unwind: {
                path: "$incentiveRequestData",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $addFields: {
                incentiveRequestedAmount: { $ifNull: ["$incentiveRequestData.incentiveRequestedAmount", 0] },
                incentiveRequestPendingAmount: {
                    $subtract: [
                        { $ifNull: ["$earnedIncentiveAmount", 0] },
                        { $ifNull: ["$incentiveRequestData.incentiveReleasedAmount", 0] }
                    ]
                },
                incentiveReleasedAmount: { $ifNull: ["$incentiveRequestData.incentiveReleasedAmount", 0] },
            }
        }, {
            $lookup: {
                from: "salesincentiverequestmodels",
                let: { created_by: "$_id.created_by" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$sales_executive_id", "$$created_by"] },
                                    { $in: ["$finance_status", ["pending"]] }
                                ]
                            }
                        }
                    }
                ],
                as: "incentiveButtonShowCondition"
            }
        }, {
            $project: {
                _id: 0,
                user_id: "$_id.created_by",
                user_name: "$_id.user_name",
                totalDocuments: "$totalDocuments",
                campaignAmount: "$campaignAmount",
                paidAmount: "$paidAmount",
                recordServiceAmount: "$recordServiceAmount",
                incentiveAmount: "$incentiveAmount",
                earnedIncentiveAmount: "$earnedIncentiveAmount",
                unEarnedIncentiveAmount: "$unEarnedIncentiveAmount",
                incentiveRequestedAmount: "$incentiveRequestedAmount",
                incentiveRequestPendingAmount: "$incentiveRequestPendingAmount",
                incentiveReleasedAmount: "$incentiveReleasedAmount",
                incentiveButtonShowCondition: "$incentiveButtonShowCondition"
            }
        }, {
            $group: {
                _id: null,
                totalCampaignAmount: { $sum: "$campaignAmount" },
                totalPaidAmount: { $sum: "$paidAmount" },
                totalRecordServiceAmount: { $sum: "$recordServiceAmount" },
                totalIncentiveAmount: { $sum: "$incentiveAmount" },
                totalEarnedIncentiveAmount: { $sum: "$earnedIncentiveAmount" },
                totalUnEarnedIncentiveAmount: { $sum: "$unEarnedIncentiveAmount" },
                totalIncentiveRequestedAmount: { $sum: "$incentiveRequestedAmount" },
                totalIncentiveRequestPendingAmount: { $sum: "$incentiveRequestPendingAmount" },
                totalIncentiveReleasedAmount: { $sum: "$incentiveReleasedAmount" },
                userWiseIncentiveCalculation: { $push: "$$ROOT" },
            }
        }]);

        //if data not present
        if (!incentiveCalculationDashboard) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }

        //return success response
        return response.returnTrue(200, req, res,
            "Incentive calculation Dashboard data retrieved successfully",
            incentiveCalculationDashboard
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}

/**
 * Month and year wise incentive data calculate user's wise.
 */
exports.getIncentiveCalculationMonthWise = async (req, res) => {
    try {
        //get user id from params
        let userId = req.params?.user_id;
        const filterQuery = {
            created_by: Number(userId),
            incentive_status: "incentive"
        }
        // Get distinct sale booking IDs from the database
        const distinctSaleBookingIds = await distinctSaleBookingIdsForIncentive(filterQuery);

        //match condition obj prepare
        let matchCondition = {
            _id: {
                $in: distinctSaleBookingIds
            }
        };

        //body to year and month get and create match condition
        if (req.body?.monthYearArray && (req.body.monthYearArray).length) {
            let expr = {
                $or: []
            };
            req.body.monthYearArray.forEach((date) => {
                let [month, year] = date.split('-');
                expr.$or.push({
                    $and: [
                        { $eq: [{ $year: "$sale_booking_date" }, Number(year)] },
                        { $eq: [{ $month: "$sale_booking_date" }, Number(month)] }
                    ]
                });
            });
            matchCondition["$expr"] = expr;
        }

        //incentive calculation limit set
        let monthWiseIncentiveCalculationLimit = incentiveCalculationUserLimit || 50000;

        //month wise sale booking incentive data calculation
        const incentiveCalculationMonthWise = await salesBookingModel.aggregate([{
            $match: matchCondition
        }, {
            $unionWith: {
                coll: "salessharedincentivesalebookingmodels",
                pipeline: [{
                    $match: matchCondition
                }]
            }
        }, {
            $lookup: {
                from: "salesrecordservicemodels",
                localField: "sale_booking_id",
                foreignField: "sale_booking_id",
                as: "salesRecordServiceData"
            }
        }, {
            $unwind: "$salesRecordServiceData"
        }, {
            $lookup: {
                from: "salesincentiveplanmodels",
                localField: "salesRecordServiceData.sales_service_master_id",
                foreignField: "sales_service_master_id",
                as: "salesIncentivePlanDetails"
            }
        }, {
            $addFields: {
                salesIncentivePlan: {
                    $cond: {
                        if: { $gt: [{ $size: "$salesIncentivePlanDetails" }, 0] },
                        then: true,
                        else: false
                    }
                }
            }
        }, {
            $match: {
                salesIncentivePlan: true
            }
        }, {
            $addFields: {
                year: { $year: "$sale_booking_date" },
                month: { $month: "$sale_booking_date" }
            }
        }, {
            $group: {
                _id: {
                    sale_booking_id: "$sale_booking_id",
                    created_by: "$created_by",
                    // incentive_amount: "$incentive_amount"
                },
                // _id: "$sale_booking_id",
                year: { $first: "$year" },
                month: { $first: "$month" },
                totalDocuments: { $sum: 1 },
                campaignAmount: { $first: "$campaign_amount" },
                paidAmount: { $first: "$approved_amount" },
                recordServiceAmount: { $sum: "$salesRecordServiceData.amount" },
                incentiveAmount: { $first: "$incentive_amount" },
                earnedIncentiveAmount: { $first: "$earned_incentive_amount" },
                unEarnedIncentiveAmount: { $first: "$unearned_incentive_amount" }
            }
        }, {
            $group: {
                _id: {
                    year: "$year",
                    month: "$month"
                },
                totalDocuments: { $first: "$totalDocuments" },
                campaignAmount: { $sum: "$campaignAmount" },
                paidAmount: { $sum: "$paidAmount" },
                recordServiceAmount: { $sum: "$recordServiceAmount" },
                incentiveAmount: { $sum: "$incentiveAmount" },
                earnedIncentiveAmount: { $sum: "$earnedIncentiveAmount" },
                unEarnedIncentiveAmount: { $sum: "$unEarnedIncentiveAmount" }
            }
        }, {
            $match: {
                campaignAmount: { $gte: monthWiseIncentiveCalculationLimit }
            }
        }, {
            $sort: {
                "_id.year": -1,
                "_id.month": -1
            }
        }, {
            $addFields: {
                monthName: {
                    $switch: {
                        branches: [
                            { case: { $eq: ["$_id.month", 1] }, then: "January" },
                            { case: { $eq: ["$_id.month", 2] }, then: "February" },
                            { case: { $eq: ["$_id.month", 3] }, then: "March" },
                            { case: { $eq: ["$_id.month", 4] }, then: "April" },
                            { case: { $eq: ["$_id.month", 5] }, then: "May" },
                            { case: { $eq: ["$_id.month", 6] }, then: "June" },
                            { case: { $eq: ["$_id.month", 7] }, then: "July" },
                            { case: { $eq: ["$_id.month", 8] }, then: "August" },
                            { case: { $eq: ["$_id.month", 9] }, then: "September" },
                            { case: { $eq: ["$_id.month", 10] }, then: "October" },
                            { case: { $eq: ["$_id.month", 11] }, then: "November" },
                            { case: { $eq: ["$_id.month", 12] }, then: "December" }
                        ]
                    }
                }
            }
        }, {
            $addFields: {
                monthYear: { $concat: ["$monthName", " ", { $toString: "$_id.year" }] }
            }
        }, {
            $addFields: {
                balanceAmount: { $subtract: ["$campaignAmount", "$paidAmount"] }
            }
        }, {
            $project: {
                _id: 0,
                monthYear: "$monthYear",
                totalDocuments: "$totalDocuments",
                campaignAmount: "$campaignAmount",
                paidAmount: "$paidAmount",
                recordServiceAmount: "$recordServiceAmount",
                incentiveAmount: "$incentiveAmount",
                earnedIncentiveAmount: "$earnedIncentiveAmount",
                unEarnedIncentiveAmount: "$unEarnedIncentiveAmount",
                balanceAmount: "$balanceAmount",
            }
        }, {
            $group: {
                _id: null,
                totalCampaignAmount: { $sum: "$campaignAmount" },
                totalPaidAmount: { $sum: "$paidAmount" },
                totalRecordServiceAmount: { $sum: "$recordServiceAmount" },
                totalIncentiveAmount: { $sum: "$incentiveAmount" },
                totalEarnedIncentiveAmount: { $sum: "$earnedIncentiveAmount" },
                totalUnEarnedIncentiveAmount: { $sum: "$unEarnedIncentiveAmount" },
                balanceAmount: { $sum: "$balanceAmount" },
                monthYearWiseIncentiveCalculation: { $push: "$$ROOT" },
            }
        }]);

        //if data not present
        if (!incentiveCalculationMonthWise) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }

        //return success response
        return response.returnTrue(200, req, res,
            "Incentive calculation month and year wise data retrieved successfully",
            incentiveCalculationMonthWise.length ? incentiveCalculationMonthWise[0] : {}
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}

/**
 * earned and unearned status wise user's perticular month incentive calculate.
 */
exports.getIncentiveCalculationStatusWiseData = async (req, res) => {
    try {
        //get query and parms data for searching data
        let incentiveEarningStatus = req.query?.incentive_earning_status; // added this line

        //create dynamic match condition
        let matchCondition = {
            sale_executive_id: Number(req.params.user_id),
        };

        //query to year and month and create match condition
        if (req.query?.year && req.query?.month) {
            let expr = {
                $and: [
                    { $eq: [{ $year: "$sale_booking_date" }, Number(req.query.year)] },
                    { $eq: [{ $month: "$sale_booking_date" }, Number(req.query.month)] }
                ]
            }
            matchCondition["$expr"] = expr;
        }

        //incentive data calculation
        const autoIncentiveCalculationMonthWise = await recordServiceModel.aggregate([{
            $match: matchCondition
        }, {
            $lookup: {
                from: "usermodels",
                localField: "sale_executive_id",
                foreignField: "user_id",
                as: "userData",
            }
        }, {
            $unwind: {
                path: "$userData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "salesservicemastermodels",
                localField: "sales_service_master_id",
                foreignField: "_id",
                as: "serviceMasterData",
            }
        }, {
            $unwind: {
                path: "$serviceMasterData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "salesincentiveplanmodels",
                localField: "sales_service_master_id",
                foreignField: "sales_service_master_id",
                as: "salesIncentivePlanDetails",
            }
        }, {
            $addFields: {
                salesIncentivePlan: {
                    $cond: {
                        if: { $gt: [{ $size: "$salesIncentivePlanDetails" }, 0] },
                        then: true,
                        else: false
                    }
                }
            }
        }, {
            $match: {
                salesIncentivePlan: true
            }
        }, {
            $unwind: {
                path: "$salesIncentivePlanDetails",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "salesbookingmodels",
                let: {
                    sale_booking_id: "$sale_booking_id"
                },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$$sale_booking_id", "$sale_booking_id"] },
                                { $eq: ["$incentive_status", "incentive"] }
                            ]
                        }
                    }
                }, {
                    $project: {
                        sale_booking_id: 1,
                        account_id: 1,
                        sale_booking_date: 1,
                        campaign_amount: 1,
                        approved_amount: 1,
                        requested_amount: 1,
                        record_service_amount: 1,
                        base_amount: 1,
                        gst_status: 1,
                        incentive_earning_status: 1,
                        incentive_amount: 1,
                        earned_incentive_amount: 1,
                        unearned_incentive_amount: 1
                    }
                }],
                as: "saleBookingDetails"
            }
        }, {
            $unwind: {
                path: "$saleBookingDetails",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "accountmastermodels",
                let: {
                    account_id: "$saleBookingDetails.account_id"
                },
                pipeline: [{
                    $match: {
                        $expr: {
                            $eq: ["$account_id", "$$account_id"]
                        }
                    }
                }, {
                    $project: {
                        account_name: 1,
                    }
                }],
                as: "accountDetails"
            },
        }, {
            $unwind: {
                path: "$accountDetails",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $project: {
                sale_executive_id: 1,
                sale_executive_name: "$userData.user_name",
                sale_booking_id: "$saleBookingDetails.sale_booking_id",
                account_id: "$saleBookingDetails.account_id",
                account_name: "$accountDetails.account_name",
                sale_booking_date: "$saleBookingDetails.sale_booking_date",
                gst_status: "$saleBookingDetails.gst_status",
                service_id: "$sales_service_master_id",
                service_name: "$serviceMasterData.service_name",
                campaign_amount: "$saleBookingDetails.campaign_amount",
                paid_amount: "$saleBookingDetails.approved_amount",
                record_service_amount: "$amount",
                incentive_percentage: "$salesIncentivePlanDetails.value",
                incentive_amount: {
                    $cond: {
                        if: { $eq: ["$salesIncentivePlanDetails.incentive_type", "fixed"] },
                        then: "$salesIncentivePlanDetails.value",
                        else: {
                            $divide: [
                                { $multiply: ["$amount", "$salesIncentivePlanDetails.value"] },
                                100
                            ]
                        }
                    }
                },
                incentive_earning_status: "$saleBookingDetails.incentive_earning_status",
                paid_percentage: {
                    $cond: {
                        if: { $eq: ["$saleBookingDetails.campaign_amount", 0] },
                        then: 0,
                        else: {
                            $multiply: [
                                { $divide: ["$saleBookingDetails.approved_amount", "$saleBookingDetails.campaign_amount"] },
                                100
                            ]
                        }
                    }
                },
                createdAt: 1,
                updatedAt: 1
            }
        }]);

        //if data not found
        if (!autoIncentiveCalculationMonthWise) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }

        let earnedArray = [];
        let unEarnedArray = [];
        let totalEarnRecordServiceAmount = 0;
        let totalUnearnRecordServiceAmount = 0;
        let totalEarnIncentiveAmount = 0;
        let totalUnearnIncentiveAmount = 0;

        //status wise data differentiate.
        for (let element of autoIncentiveCalculationMonthWise) {
            //if status is earned
            if (element.incentive_earning_status == "earned") {
                totalEarnRecordServiceAmount += element.record_service_amount;
                totalEarnIncentiveAmount += element.incentive_amount;
                earnedArray.push(element);
            }
            //if status is un-earned
            if (element.incentive_earning_status == "un-earned") {
                totalUnearnRecordServiceAmount += element.record_service_amount;
                totalUnearnIncentiveAmount += element.incentive_amount;
                unEarnedArray.push(element);
            }
        }

        let dataObj = {};
        //status wise total record service and incentive calulate
        if (incentiveEarningStatus == "earned") {
            dataObj["dataArray"] = earnedArray;
            dataObj["totalRecordServiceAmount"] = totalEarnRecordServiceAmount;
            dataObj["totalIncentiveAmount"] = totalEarnIncentiveAmount;
        } else if (incentiveEarningStatus == "un-earned") {
            dataObj["dataArray"] = unEarnedArray;
            dataObj["totalRecordServiceAmount"] = totalUnearnRecordServiceAmount;
            dataObj["totalIncentiveAmount"] = totalUnearnIncentiveAmount;
        } else {
            let dataArray = [...earnedArray, ...unEarnedArray];
            dataObj["dataArray"] = dataArray;
            dataObj["totalRecordServiceAmount"] = totalEarnRecordServiceAmount + totalUnearnRecordServiceAmount;
            dataObj["totalIncentiveAmount"] = totalEarnIncentiveAmount + totalUnearnIncentiveAmount;
        }

        //return success response
        return response.returnTrue(200, req, res,
            "Incentive calculation status wise data retrieved successfully",
            dataObj
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}

/**
 * incentive Released button data calculate user's wise.
 */
exports.getIncentiveReleasedButtonData = async (req, res) => {
    try {
        //get user id from params
        let userId = req.params?.user_id;
        const filterQuery = {
            created_by: Number(userId),
            incentive_status: "incentive",
            incentive_request_status: {
                $nin: ['requested', 'released']
            }
        }
        // Get distinct sale booking IDs from the database
        const distinctSaleBookingIds = await distinctSaleBookingIdsForIncentive(filterQuery);

        //match condition obj prepare
        let matchCondition = {
            _id: {
                $in: distinctSaleBookingIds
            }
        };

        //incentive calculation limit set
        let incentiveCalculationLimit = incentiveCalculationUserLimit || 50000;

        //Sale booking wise incentive calculation data
        const incentiveCalculationDashboard = await salesBookingModel.aggregate([{
            $match: matchCondition
        }, {
            $unionWith: {
                coll: "salessharedincentivesalebookingmodels",
                pipeline: [{
                    $match: matchCondition
                }]
            }
        }, {
            $lookup: {
                from: "usermodels",
                let: {
                    created_by: "$created_by"
                },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$$created_by", "$user_id"]
                            }]
                        }
                    }
                }, {
                    $project: {
                        user_id: 1,
                        user_name: 1,
                    }
                }],
                as: "userData"
            }
        }, {
            $unwind: {
                path: "$userData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "salesrecordservicemodels",
                localField: "sale_booking_id",
                foreignField: "sale_booking_id",
                as: "salesRecordServiceData"
            }
        }, {
            $unwind: "$salesRecordServiceData",
        }, {
            $lookup: {
                from: "salesincentiveplanmodels",
                localField: "salesRecordServiceData.sales_service_master_id",
                foreignField: "sales_service_master_id",
                as: "salesIncentivePlanDetails"
            }
        }, {
            $addFields: {
                salesIncentivePlan: {
                    $cond: {
                        if: { $gt: [{ $size: "$salesIncentivePlanDetails" }, 0] },
                        then: true,
                        else: false
                    }
                }
            }
        }, {
            $match: {
                salesIncentivePlan: true
            }
        }, {
            $addFields: {
                year: { $year: "$sale_booking_date" },
                month: { $month: "$sale_booking_date" }
            }
        }, {
            $group: {
                _id: {
                    sale_booking_id: "$sale_booking_id",
                    created_by: "$created_by",
                    // incentive_amount: "$incentive_amount",
                },
                // _id: "$sale_booking_id",
                year: { $first: "$year" },
                month: { $first: "$month" },
                totalDocuments: { $sum: 1 },
                id: { $first: "$_id" },
                saleBookingDate: { $first: "$sale_booking_date" },
                gstStatus: { $first: "$gst_status" },
                campaignAmount: { $first: "$campaign_amount" },
                baseAmount: { $first: "$base_amount" },
                paidAmount: { $first: "$approved_amount" },
                recordServiceAmount: { $sum: "$salesRecordServiceData.amount" },
                incentiveAmount: { $first: "$incentive_amount" },
                earnedIncentiveAmount: { $first: "$earned_incentive_amount" },
                unEarnedIncentiveAmount: { $first: "$unearned_incentive_amount" }
            }
        }, {
            $group: {
                _id: {
                    year: "$year",
                    month: "$month"
                },
                year: { $first: "$year" },
                month: { $first: "$month" },
                totalDocuments: { $sum: "$totalDocuments" },
                totalCampaignAmount: { $sum: "$campaignAmount" },
                saleBookings: {
                    $push: {
                        _id: "$id",
                        sale_booking_id: "$_id.sale_booking_id",
                        saleBookingDate: "$saleBookingDate",
                        gstStatus: "$gstStatus",
                        campaignAmount: "$campaignAmount",
                        baseAmount: "$baseAmount",
                        paidAmount: "$paidAmount",
                        recordServiceAmount: "$recordServiceAmount",
                        incentiveAmount: "$incentiveAmount",
                        earnedIncentiveAmount: "$earnedIncentiveAmount",
                        unEarnedIncentiveAmount: "$unEarnedIncentiveAmount"
                    }
                }
            }
        }, {
            $match: {
                totalCampaignAmount: {
                    $gte: incentiveCalculationLimit
                }
            }
        }, {
            $unwind: "$saleBookings"
        }, {
            $replaceRoot: { newRoot: "$saleBookings" }
        }, {
            $sort: {
                "sale_booking_id": 1,
            }
        }]);

        //if data not present
        if (!incentiveCalculationDashboard) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }

        //return success response
        return response.returnTrue(200, req, res,
            "Incentive Released button data retrieved successfully",
            incentiveCalculationDashboard
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}