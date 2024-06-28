const constant = require("../../common/constant");
const response = require("../../common/response");
const incentiveRequestModel = require("../../models/Sales/incentiveRequestModel");

/**
 * Api is to used for the incentive request create by sales executive user.
 */
exports.createIncentiveRequest = async (req, res) => {
    try {
        const { sales_executive_id, user_requested_amount, created_by,
            admin_action_reason, account_number, payment_ref_no,
            payment_date, payment_type, partial_payment_reason, remarks
        } = req.body;

        const addIncentiveRequestDetails = await incentiveRequestModel.create({
            sales_executive_id: sales_executive_id,
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
 * Api is to used for the incentive Request approve by admin.
 */
exports.updateIncentiveRequestByAdmin = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;
        const { admin_approved_amount, admin_status, admin_action_reason, updated_by
        } = req.body;

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