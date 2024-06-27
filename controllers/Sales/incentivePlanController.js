const constant = require("../../common/constant");
const response = require("../../common/response");
const { incentiveCalculationUserLimit } = require("../../helper/status");
const incentivePlanModel = require("../../models/Sales/incentivePlanModel");
const recordServiceModel = require("../../models/Sales/recordServiceModel");
const salesBookingModel = require("../../models/Sales/salesBookingModel");

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
        const { sales_service_master_id, incentive_type, value, remarks, updated_by } = req.body;

        const incentivePlanUpdated = await incentivePlanModel.findByIdAndUpdate({
            _id: id
        }, {
            $set: {
                sales_service_master_id,
                incentive_type,
                value,
                remarks,
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
        const page = req.query?.page ? parseInt(req.query.page) : null;
        const limit = req.query?.limit ? parseInt(req.query.limit) : null;
        const sort = { createdAt: -1 };

        // Calculate the number of records to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;

        // Retrieve the list of records with pagination applied
        const incentivePlanList = await incentivePlanModel.find({
            status: { $ne: constant.DELETED }
        }).skip(skip).limit(limit).sort(sort);

        // Get the total count of records in the collection
        const incentivePlanCount = await incentivePlanModel.countDocuments();

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
 * Month and year wise incentive data calculate user's wise.
 */
exports.getIncentiveCalculationMonthWise = async (req, res) => {
    try {
        //incentive calculation limit set
        let monthWiseIncentiveCalculationLimit = incentiveCalculationUserLimit || 50000;

        //month wise sale booking incentive data calculation
        const incentiveCalculationMonthWise = await salesBookingModel.aggregate([{
            $match: {
                created_by: Number(req.params.user_id)
            }
        }, {
            $group: {
                _id: {
                    year: { $year: "$sale_booking_date" },
                    month: { $month: "$sale_booking_date" }
                },
                totalDocuments: { $sum: 1 },
                campaignAmount: { $sum: "$campaign_amount" },
                paidAmount: { $sum: "$approved_amount" },
                recordServiceAmount: { $sum: "$record_service_amount" },
                incentiveAmount: { $sum: "$incentive_amount" },
                earnedIncentiveAmount: { $sum: "$earned_incentive_amount" },
                unEarnedIncentiveAmount: { $sum: "$unearned_incentive_amount" },
            }
        }, {
            $match: {
                campaignAmount: { $gte: monthWiseIncentiveCalculationLimit }
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
            incentiveCalculationMonthWise
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}

/**
 * incentive dashboard data calculate user's wise.
 */
exports.getIncentiveCalculationDashboard = async (req, res) => {
    try {
        let matchCondition = {};
        //create dynamic match condition
        if (req.body?.user_ids) {
            matchCondition = {
                created_by: { $in: req.body.user_ids } // assuming req.body.user_ids is an array of user IDs
            };
        }

        //body to year and month get and create match condition
        if (req.body?.year && req.body?.month) {
            let expr = {
                $and: [
                    { $eq: [{ $year: "$sale_booking_date" }, Number(req.body.year)] },
                    { $eq: [{ $month: "$sale_booking_date" }, Number(req.body.month)] }
                ]
            }
            matchCondition["$expr"] = expr;
        }

        //incentive calculation limit set
        let incentiveCalculationLimit = incentiveCalculationUserLimit || 50000;

        //incentive dashboard data calculation
        const incentiveCalculationDashboard = await salesBookingModel.aggregate([{
            $match: matchCondition
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
            $group: {
                _id: {
                    created_by: "$created_by",
                    user_name: "$userData.user_name"
                },
                totalDocuments: { $sum: 1 },
                campaignAmount: { $sum: "$campaign_amount" },
                paidAmount: { $sum: "$approved_amount" },
                recordServiceAmount: { $sum: "$record_service_amount" },
                incentiveAmount: { $sum: "$incentive_amount" },
                earnedIncentiveAmount: { $sum: "$earned_incentive_amount" },
                unEarnedIncentiveAmount: { $sum: "$unearned_incentive_amount" },
                incentiveRequestedAmount: { $sum: 0 },
                incentiveRequestPendingAmount: { $sum: 0 },
                incentiveReleasedAmount: { $sum: 0 },
            }
        }, {
            $match: {
                campaignAmount: { $gte: incentiveCalculationLimit }
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
            incentiveCalculationDashboard[0]
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}