const constant = require("../../common/constant");
const response = require("../../common/response");
const incentiveRequestModel = require("../../models/Sales/incentiveRequestModel");
const salesBookingModel = require("../../models/Sales/salesBookingModel");
const { incentiveCalculationUserLimit } = require("../../helper/status");

/**
 * Api is to used for the incentive request create by sales executive user.
 */
exports.createIncentiveRequest = async (req, res) => {
    try {
        const { sales_executive_id, user_requested_amount, created_by,
            admin_action_reason, account_number, payment_ref_no,
            payment_date, payment_type, partial_payment_reason, remarks
        } = req.body;
        const sale_booking_ids = req.body?.sale_booking_ids.map(id => Number(id)); // Convert each ID to Number

        const addIncentiveRequestDetails = await incentiveRequestModel.create({
            sales_executive_id: Number(sales_executive_id),
            user_requested_amount: user_requested_amount,
            admin_approved_amount: user_requested_amount,
            admin_status: "pending",
            created_by: created_by,
            // admin_action_reason: admin_action_reason,
            // account_number: account_number,
            // payment_ref_no: payment_ref_no,
            // payment_date: payment_date,
            // payment_type: payment_type,
            // partial_payment_reason: partial_payment_reason,
            // remarks: remarks,
        });

        await salesBookingModel.updateMany({
            sale_booking_id: {
                $in: sale_booking_ids
            }
        }, {
            $set: {
                incentive_request_id: addIncentiveRequestDetails?._id,
                incentive_request_status: "requested"
            }
        });

        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Incentive Request Created Successfully!",
            addIncentiveRequestDetails
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the get all incentive Request data
 */
exports.getAllIncentiveRequestList = async (req, res) => {
    try {
        // Extract page and limit from query parameters, default to null if not provided
        const page = req.query?.page ? parseInt(req.query.page) : 1;
        const limit = req.query?.limit ? parseInt(req.query.limit) : Number.MAX_SAFE_INTEGER;
        const sort = { createdAt: -1 };

        // Calculate the number of records to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;

        //for match conditions
        let matchQuery = {
            status: {
                $ne: constant.DELETED
            }
        }

        //if userId get in query 
        if (req.query?.userId) {
            matchQuery["sales_executive_id"] = req.query.userId;
        }

        //data get from the db collection
        const incentiveRequestList = await incentiveRequestModel.aggregate([{
            $match: matchQuery
        }, {
            $lookup: {
                from: "usermodels",
                localField: "sales_executive_id",
                foreignField: "user_id",
                as: "userData",
            }
        }, {
            $unwind: {
                path: "$userData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $project: {
                sales_executive_id: 1,
                sales_executive_name: "$userData.user_name",
                user_requested_amount: 1,
                admin_approved_amount: 1,
                finance_released_amount: 1,
                admin_status: 1,
                admin_action_reason: 1,
                account_number: 1,
                payment_ref_no: 1,
                payment_date: 1,
                remarks: 1,
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
        const incentiveRequestCount = await incentiveRequestModel.countDocuments();

        // If no records are found, return a response indicating no records found
        if (incentiveRequestList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of records and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Incentive Request list retrieved successfully!",
            incentiveRequestList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + incentiveRequestList.length : incentiveRequestList.length,
                total_records: incentiveRequestCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(incentiveRequestCount / limit) : 1,
            }
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    };
};

/**
 * Api is to used for the incentive Request approve by admin.
 */
exports.updateIncentiveRequestByAdmin = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;
        const { admin_approved_amount, admin_status, admin_action_reason, updated_by
        } = req.body;
        const sale_booking_ids = req.body?.sale_booking_ids.map(id => Number(id)); // Convert each ID to Number


        //dynamic obj prepared for update data
        let updateObj = {
            admin_status: admin_status,
            admin_action_reason: admin_action_reason,
            updated_by: updated_by,
        }

        //if status is approved so amoubt add in obj
        if (admin_status == "approved") {
            updateObj["admin_approved_amount"] = admin_approved_amount;
        }

        const incentiveRequestUpdated = await incentiveRequestModel.findByIdAndUpdate({
            _id: id
        }, {
            $set: updateObj
        }, {
            new: true
        });

        //update sale booking ids in Sale booking collection
        await salesBookingModel.updateMany({
            sale_booking_id: {
                $in: sale_booking_ids
            }
        }, {
            $set: {
                incentive_request_id: incentiveRequestUpdated._id,
                incentive_request_status: "requested"
            }
        });

        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Incentive Request status update by admin successfully!",
            incentiveRequestUpdated
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    };
}

/**
 * Api is to used for the get incentive Request data for admin 
 */
exports.getIncentiveRequestListForAdmin = async (req, res) => {
    try {
        // Extract page and limit from query parameters, default to null if not provided
        const page = req.query?.page ? parseInt(req.query.page) : 1;
        const limit = req.query?.limit ? parseInt(req.query.limit) : 50;
        const sort = { createdAt: -1 };

        // Calculate the number of records to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;

        //for match conditions
        let matchQuery = {
            status: {
                $ne: constant.DELETED
            }
        }

        //if status get in query 
        if (req.query?.status) {
            matchQuery["admin_status"] = req.query.status;
        }

        //if userId get in query 
        if (req.query?.userId) {
            matchQuery["sales_executive_id"] = req.query.userId;
        }

        //data get from the db collection
        const incentiveRequestList = await incentiveRequestModel.aggregate([{
            $match: matchQuery
        }, {
            $lookup: {
                from: "usermodels",
                localField: "sales_executive_id",
                foreignField: "user_id",
                as: "userData",
            }
        }, {
            $unwind: {
                path: "$userData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $project: {
                sales_executive_id: 1,
                sales_executive_name: "$userData.user_name",
                user_requested_amount: 1,
                admin_approved_amount: 1,
                finance_released_amount: 1,
                admin_status: 1,
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
        const incentiveRequestCount = await incentiveRequestModel.countDocuments();

        // If no records are found, return a response indicating no records found
        if (incentiveRequestList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of records and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Incentive Request list for admin retrieved successfully!",
            incentiveRequestList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + incentiveRequestList.length : incentiveRequestList.length,
                total_records: incentiveRequestCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(incentiveRequestCount / limit) : 1,
            }
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    };
};

/**
 * Api is used for the incentive Request Release by finance.
 */
exports.incentiveRequestReleaseByFinance = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;
        //get data from body
        const { finance_released_amount, account_number, payment_ref_no,
            payment_date, remarks, updated_by
        } = req.body;

        //dynamic obj prepared for update data
        let updateObj = {
            finance_released_amount: finance_released_amount,
            account_number: account_number,
            payment_ref_no: payment_ref_no,
            payment_date: payment_date,
            remarks: remarks,
            updated_by: updated_by,
        }

        //incentive request release data from finance in db collection.
        const incentiveRequestUpdated = await incentiveRequestModel.findByIdAndUpdate({
            _id: id
        }, {
            $set: updateObj
        }, {
            new: true
        });

        //update sale booking ids in Sale booking collection
        await salesBookingModel.updateMany({
            incentive_request_id: id
        }, {
            $set: {
                incentive_request_status: "released"
            }
        });
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Incentive Request Relese by finance successfully!",
            incentiveRequestUpdated
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    };
}

/**
 * Api is to used for the get incentive Request data for finance 
 */
exports.getIncentiveRequestListForFinance = async (req, res) => {
    try {
        // Extract page and limit from query parameters, default to null if not provided
        const page = req.query?.page ? parseInt(req.query.page) : 1;
        const limit = req.query?.limit ? parseInt(req.query.limit) : 50;
        const sort = { createdAt: -1 };

        // Calculate the number of records to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;

        //for match conditions
        let matchQuery = {
            status: {
                $ne: constant.DELETED
            },
            admin_status: "approved"
        }

        //if userId get in query 
        if (req.query?.userId) {
            matchQuery["sales_executive_id"] = req.query.userId;
        }

        //data get from the db collection
        const incentiveRequestList = await incentiveRequestModel.aggregate([{
            $match: matchQuery
        }, {
            $lookup: {
                from: "usermodels",
                localField: "sales_executive_id",
                foreignField: "user_id",
                as: "userData",
            }
        }, {
            $unwind: {
                path: "$userData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $project: {
                sales_executive_id: 1,
                sales_executive_name: "$userData.user_name",
                user_requested_amount: 1,
                admin_approved_amount: 1,
                finance_released_amount: 1,
                admin_status: 1,
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
        const incentiveRequestCount = await incentiveRequestModel.countDocuments();

        // If no records are found, return a response indicating no records found
        if (incentiveRequestList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of records and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Incentive Request Release list for finance retrieved successfully!",
            incentiveRequestList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + incentiveRequestList.length : incentiveRequestList.length,
                total_records: incentiveRequestCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(incentiveRequestCount / limit) : 1,
            }
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    };
};

/**
 * Api is to used for the get incentive Request list status wise. 
 */
exports.getIncentiveRequestListUserAndStatusWise = async (req, res) => {
    try {
        let userId = req.params?.id
        //for match conditions
        let matchQuery = {
            sales_executive_id: Number(userId),
            admin_status: {
                $ne: "rejected",
            },
            status: {
                $ne: constant.DELETED
            }
        }

        //if status get in query 
        if (req.query?.status) {
            matchQuery["admin_status"] = req.query.status;
        }

        //data get from the db collection
        const incentiveRequestList = await incentiveRequestModel.aggregate([{
            $match: matchQuery
        }, {
            $lookup: {
                from: "usermodels",
                localField: "sales_executive_id",
                foreignField: "user_id",
                as: "userData",
            }
        }, {
            $unwind: {
                path: "$userData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $project: {
                sales_executive_id: 1,
                sales_executive_name: "$userData.user_name",
                user_requested_amount: 1,
                admin_approved_amount: 1,
                finance_released_amount: 1,
                admin_status: 1,
                created_by: 1,
                updated_by: 1,
                createdAt: 1,
                updatedAt: 1,
                balanceReleaseAmount: {
                    $subtract: [
                        { $ifNull: ["$admin_approved_amount", 0] },
                        { $ifNull: ["$finance_released_amount", 0] }
                    ]
                },
                payment_date: 1,
                payment_ref_no: 1,
                account_number: 1
            }
        }, {
            $group: {
                _id: null,
                totalUserRequestedAmount: { $sum: "$user_requested_amount" },
                totalAdminApprovedAmount: { $sum: "$admin_approved_amount" },
                totalFinanceReleasedAmount: { $sum: "$finance_released_amount" },
                totalBalanceReleaseAmount: { $sum: "$balanceReleaseAmount" },
                incentiveRequestList: { $push: "$$ROOT" },
            }
        }])

        // If no records are found, return a response indicating no records found
        if (incentiveRequestList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response 
        return response.returnTrue(
            200,
            req,
            res,
            "Incentive Request list retrieved successfully!",
            incentiveRequestList
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

/**
 * incentive settlement dashboard data calculate user's wise.
 */
exports.getIncentiveSettlementCalculationDashboard = async (req, res) => {
    try {
        //for match conditions
        let matchQuery = {
            incentive_status: "incentive",
        };
        if (req.query?.userId) {
            matchQuery["created_by"] = Number(req.query.userId);
        }

        // Get distinct sale booking IDs from the database
        const distinctSaleBookingIds = await salesBookingModel.distinct('sale_booking_id', matchQuery);

        //match condition obj prepare
        let matchCondition = {
            sale_booking_id: {
                $in: distinctSaleBookingIds
            }
        };

        //incentive calculation limit set
        let incentiveCalculationLimit = incentiveCalculationUserLimit || 50000;

        //incentive settlement dashboard data calculation
        const incentiveSettlementDashboard = await salesBookingModel.aggregate([{
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
            $addFields: {
                is_gst_status: "$gst_status"
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
                _id: "$sale_booking_id",
                year: { $first: "$year" },
                month: { $first: "$month" },
                created_by: { $first: "$created_by" },
                user_name: { $first: "$user_name" },
                totalDocuments: { $sum: 1 },
                recordServiceAmount: { $sum: "$salesRecordServiceData.amount" },
                gstRecordServiceAmount: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$is_gst_status", true] },
                            then: "$salesRecordServiceData.amount",
                            else: 0
                        }
                    }
                },
                nonGstRecordServiceAmount: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$is_gst_status", false] },
                            then: "$salesRecordServiceData.amount",
                            else: 0
                        }
                    }
                },
                incentiveAmount: { $first: "$incentive_amount" },
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
                recordServiceAmount: { $sum: "$recordServiceAmount" },
                gstRecordServiceAmount: { $sum: "$gstRecordServiceAmount" },
                nonGstRecordServiceAmount: { $sum: "$nonGstRecordServiceAmount" },
                incentiveAmount: { $sum: "$incentiveAmount" },
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
                recordServiceAmount: { $sum: "$recordServiceAmount" },
                gstRecordServiceAmount: { $sum: "$gstRecordServiceAmount" },
                nonGstRecordServiceAmount: { $sum: "$nonGstRecordServiceAmount" },
                incentiveAmount: { $sum: "$incentiveAmount" },
            }
        }, {
            $sort: {
                "_id.created_by": 1,
            }
        }, {
            $project: {
                _id: 0,
                user_id: "$_id.created_by",
                user_name: "$_id.user_name",
                totalDocuments: "$totalDocuments",
                recordServiceAmount: "$recordServiceAmount",
                gstRecordServiceAmount: "$gstRecordServiceAmount",
                nonGstRecordServiceAmount: "$nonGstRecordServiceAmount",
                incentiveAmount: "$incentiveAmount",
            }
        }]);

        //if data not present
        if (!incentiveSettlementDashboard) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }

        //return success response
        return response.returnTrue(200, req, res,
            "Incentive settlement Dashboard data retrieved successfully",
            incentiveSettlementDashboard
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}