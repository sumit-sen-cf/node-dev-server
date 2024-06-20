const constant = require("../../common/constant");
const response = require("../../common/response");
const incentivePlanModel = require("../../models/Sales/incentivePlanModel");
const mongoose = require("mongoose");
const recordServiceModel = require("../../models/Sales/recordServiceModel");

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

exports.getIncentiveCalculationStatusWiseData = async (req, res) => {
    try {
        //current year and month get from date Obj
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        //get query and parms data for searching data
        let year = (req.query && req.query.year) ? Number(req.query.year) : currentYear;
        let month = (req.query && req.query.month) ? Number(req.query.month) : currentMonth;
        let userId = req.params?.user_id;
        let incentiveEarningStatus = req.query?.incentive_earning_status; // added this line

        //incentive data
        const autoIncentiveCalculationMonthWise = await recordServiceModel.aggregate([{
            $match: {
                sale_executive_id: Number(userId),
                $expr: {
                    $and: [
                        { $eq: [{ $year: "$sale_booking_date" }, year] },
                        { $eq: [{ $month: "$sale_booking_date" }, month] }
                    ]
                }
            }
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