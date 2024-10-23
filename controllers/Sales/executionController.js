const executionModel = require("../../models/Sales/executionModel");
const recordServiceModel = require("../../models/Sales/recordServiceModel");
const constant = require("../../common/constant");
const response = require("../../common/response");
const { saleBookingStatus } = require("../../helper/status.js");
const salesBookingModel = require("../../models/Sales/salesBookingModel.js");

/**
 * Api is to used for the sales_booking_execution data add in the DB collection.
 */
exports.createExecution = async (req, res) => {
    try {
        const { sale_booking_id, start_date, end_date, commitment, created_by,
        } = req.body;
        const reach = (req.body && req.body.reach) ? Number(req.body.reach) : 0;
        const impression = (req.body && req.body.impression) ? Number(req.body.impression) : 0;
        const engagement = (req.body && req.body.engagement) ? Number(req.body.engagement) : 0;
        const story_view = (req.body && req.body.story_view) ? Number(req.body.story_view) : 0;

        // Get distinct IDs from the database
        const recordServiceDetail = await recordServiceModel.find({
            sale_booking_id: sale_booking_id,
            is_execution_request_sent: false,
            status: {
                $ne: constant.DELETED
            }
        });

        //if the record service not found then return data
        if (recordServiceDetail.length == 0) {
            //Return a success response
            return response.returnFalse(
                400,
                req,
                res,
                "Record Service Data Not Found.",
                {}
            );
        }

        let exeDataArray = [];
        for (const element of recordServiceDetail) {
            const randomNumber = Math.floor(1000000 + Math.random() * 90000);
            let exeDataObj = {
                sale_booking_id: sale_booking_id,
                record_service_id: element._id,
                start_date: start_date,
                end_date: end_date,
                execution_token: randomNumber,
                commitment: commitment,
                reach: reach,
                impression: impression,
                engagement: engagement,
                story_view: story_view,
                created_by: created_by
            }
            //data insert into the db
            const exeDetails = await executionModel.create(exeDataObj);
            //obj push in array
            exeDataArray.push(exeDetails);
            //update record service execution sent status
            await recordServiceModel.updateOne({
                _id: element._id,
            }, {
                is_execution_request_sent: true,
            });
        }

        //check the execution req is generated then status update in sale booking
        if (exeDataArray && exeDataArray.length) {
            //update booking status in sale booking collection
            await salesBookingModel.updateOne({
                sale_booking_id: sale_booking_id
            }, {
                $set: {
                    booking_status: saleBookingStatus['06'].status,
                    is_execution_token_show: true
                }
            });
        }

        //Return a success response
        return response.returnTrue(
            200,
            req,
            res,
            "Sales booking execution created successfully",
            exeDataArray
        );

    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
* Api is to used for the sales_booking_execution data get_ByID in the DB collection.
*/
exports.getExecutionDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const executionDetail = await executionModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!executionDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Execution details retrive successfully!",
            executionDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the sales_booking_execution data update_By-Id in the DB collection.
 */
exports.updateExecutionDetial = async (req, res) => {
    try {
        const { id } = req.params;
        const { sale_booking_id, record_service_id, start_date, end_date, execution_time, execution_date,
            execution_done_by, execution_remark, commitment, updated_by,
            reach, impression, engagement, story_view
        } = req.body;

        const executionUpdated = await executionModel.findByIdAndUpdate({
            _id: id
        }, {
            $set: {
                sale_booking_id,
                record_service_id,
                start_date,
                end_date,
                execution_time,
                execution_date,
                execution_done_by,
                execution_remark,
                commitment,
                reach: Number(reach),
                impression: Number(impression),
                engagement: Number(engagement),
                story_view: Number(story_view),
                updated_by,
                execution_status: req.body.status,
            }
        }, {
            new: true
        });
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Execution detail update successfully!",
            executionUpdated
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the sales_booking_execution data get_list in the DB collection.
 */
exports.getExcutionList = async (req, res) => {
    try {
        let matchCondition = {
            status: {
                $ne: constant.DELETED
            }
        }
        if (req.query?.status) {
            matchCondition["execution_status"] = req.query.status
        }

        const executionList = await executionModel.aggregate([{
            $match: matchCondition
        }, {
            $lookup: {
                from: "salesbookingmodels",
                localField: "sale_booking_id",
                foreignField: "sale_booking_id",
                as: "salesbookingmodelsData",
            },
        }, {
            $unwind: {
                path: "$salesbookingmodelsData",
                preserveNullAndEmptyArrays: true,
            },
        }, {
            $project: {
                execution_time: 1,
                start_date: 1,
                end_date: 1,
                sale_booking_id: 1,
                execution_token: 1,
                execution_status: 1,
                reach: 1,
                impression: 1,
                engagement: 1,
                story_view: 1,
                case_study_status: 1,
                campaign_name: "$salesbookingmodelsData.campaign_name",
                account_id: "$salesbookingmodelsData.account_id",
                brand_id: "$salesbookingmodelsData.brand_id",
                sale_booking_date: "$salesbookingmodelsData.sale_booking_date",
                campaign_id: "$salesbookingmodelsData.campaign_id",
                sales_executive: "$salesbookingmodelsData.sales_executive",
                booking_status: "$salesbookingmodelsData.booking_status",
                booking_date: "$salesbookingmodelsData.booking_date",
                campaign_amount: "$salesbookingmodelsData.campaign_amount",
                record_service_file: "$salesbookingmodelsData.record_service_file",
                page_count: "$salesbookingmodelsData.page_count",
                summary: "$salesbookingmodelsData.summary",
                reason_credit_approval: "$salesbookingmodelsData.reason_credit_approval",
                payment_credit_status: "$salesbookingmodelsData.payment_credit_status",
                created_by: "$salesbookingmodelsData.created_by",
                execution_excel: {
                    $concat: [
                        constant.GCP_SALES_BOOKING_FOLDER_URL,
                        "/",
                        "$salesbookingmodelsData.record_service_file",
                    ],
                },
            },
        },
        ])
        // If no exectuion are found, return a response indicating no exectuion found
        if (executionList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of exectuion and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Execution list retrieved successfully!",
            executionList,
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the sales_booking_execution data delete_By-Id in the DB collection.
 */
exports.deleteExecution = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;

        // Attempt to find and update the record with the given id and status not equal to DELETED
        const executionDeleted = await executionModel.findOneAndUpdate({
            _id: id,
            status: {
                $ne: constant.DELETED
            }
        }, {
            $set: {
                // Update the status to DELETED
                status: constant.DELETED,
            }
        }, {
            new: true
        });
        // If no record is found or updated, return a response indicating no record found
        if (!executionDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            `Sales booking execution deleted succesfully! for id ${id}`,
            executionDeleted
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.updateStatusExecution = async (req, res) => {
    try {
        const { id } = req.params;
        const { execution_status, sale_booking_id } = req.body;
        const executionStatusUpdated = await executionModel.findByIdAndUpdate({
            _id: id
        }, {
            $set: {
                execution_status,
                // sale_booking_id
            }
        }, {
            new: true
        });
        let updateObj = {};
        // if (execution_status == "execution_in_progress") {
        //     updateObj["booking_status"] = saleBookingStatus['04'].status;
        // }
        if (execution_status == "execution_accepted") {
            updateObj["booking_status"] = saleBookingStatus['07'].status;
        }
        if (execution_status == "execution_completed") {
            updateObj["booking_status"] = saleBookingStatus['09'].status;
        }
        if (execution_status == "execution_rejected") {
            updateObj["booking_status"] = saleBookingStatus['08'].status;
        }
        if (execution_status == "execution_paused") {
            updateObj["booking_status"] = saleBookingStatus['10'].status;
        }

        //update incentive amount in sale booking collection
        await salesBookingModel.updateOne({
            sale_booking_id: executionStatusUpdated.sale_booking_id
        }, {
            $set: updateObj
        })

        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Execution status update successfully!",
            executionStatusUpdated
        );

    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

exports.countTheDataStatusWise = async (req, res) => {
    try {
        const counts = await executionModel.aggregate([
            {
                $group: {
                    _id: "$execution_status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = {
            sales_for_execution: 0,
            execution_accepted: 0,
            execution_completed: 0,
            execution_rejected: 0,
            execution_paused: 0,
            case_study_close: 0
        };

        counts.forEach((item) => {
            result[item._id] = item.count;
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while counting statuses" });
    }
};
/**
 * Api is to used for the execution token data data in the DB collection.
 */
exports.getExcutionTokenData = async (req, res) => {
    try {
        let matchCondition = {
            status: {
                $ne: constant.DELETED
            },
            execution_token: Number(req.params?.id)
        }

        // get token to execution data from db
        const executionList = await executionModel.aggregate([{
            $match: matchCondition
        }, {
            $lookup: {
                from: "salesbookingmodels",
                localField: "sale_booking_id",
                foreignField: "sale_booking_id",
                as: "salesBookingData",
            }
        }, {
            $unwind: {
                path: "$salesBookingData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "salesrecordservicemodels",
                localField: "record_service_id",
                foreignField: "_id",
                as: "recordserviceData",
            }
        }, {
            $unwind: {
                path: "$recordserviceData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "accountmastermodels",
                localField: "salesBookingData.account_id",
                foreignField: "account_id",
                as: "accountsData",
            }
        }, {
            $unwind: {
                path: "$accountsData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "usermodels",
                localField: "created_by",
                foreignField: "user_id",
                as: "usersData",
            }
        }, {
            $unwind: {
                path: "$usersData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "accountbrandmodels",
                localField: "salesBookingData.brand_id",
                foreignField: "_id",
                as: "brandData",
            }
        }, {
            $unwind: {
                path: "$brandData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $project: {
                execution_time: 1,
                start_date: 1,
                end_date: 1,
                sale_booking_id: 1,
                execution_token: 1,
                execution_status: 1,
                reach: 1,
                impression: 1,
                engagement: 1,
                story_view: 1,
                created_by: 1,
                sales_executive_name: "$usersData.user_name",
                account_id: "$accountsData.account_id",
                account_name: "$accountsData.account_name",
                recordServiceAmount: "$recordserviceData.amount",
                brand_id: "$salesBookingData.brand_id",
                brand_name: "$brandData.brand_name",
                campaign_id: "$salesBookingData.campaign_id",
                campaign_name: "$salesBookingData.campaign_name",
                sale_booking_date: "$salesBookingData.sale_booking_date",
                campaign_amount: "$salesBookingData.campaign_amount",
                base_amount: "$salesBookingData.base_amount",
                gst_amount: "$salesBookingData.gst_amount",
                requested_amount: "$salesBookingData.requested_amount",
                approved_amount: "$salesBookingData.approved_amount",
                execution_excel: {
                    $concat: [
                        constant.GCP_SALES_BOOKING_FOLDER_URL,
                        "/",
                        "$salesBookingData.record_service_file",
                    ]
                },
            }
        }])
        // If no exectuion are found, return a response indicating no exectuion found
        if (executionList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of exectuion and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Token wise execution data retrieved successfully!",
            executionList,
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};