const executionModel = require("../../models/Sales/executionModel");
const recordServiceModel = require("../../models/Sales/recordServiceModel");
const constant = require("../../common/constant");
const response = require("../../common/response");
const vari = require("../../variables.js");
const { storage } = require('../../common/uploadFile.js');
const { saleBookingStatus } = require("../../helper/status.js");
const salesBookingModel = require("../../models/Sales/salesBookingModel.js");

/**
 * Api is to used for the sales_booking_execution data add in the DB collection.
 */
exports.createExecution = async (req, res) => {
    try {
        const { sale_booking_id, start_date, end_date, commitment, created_by,
            reach, impression, engagement, story_view
        } = req.body;

        // Get distinct IDs from the database
        const recordServiceDetail = await recordServiceModel.distinct('_id', {
            sale_booking_id: sale_booking_id,
            status: {
                $ne: constant.DELETED
            }
        });

        let exeDataArray = [];
        for (const element of recordServiceDetail) {
            const randomNumber = Math.floor(1000000 + Math.random() * 90000);
            let exeDataObj = {
                sale_booking_id: sale_booking_id,
                record_service_id: element,
                start_date: start_date,
                end_date: end_date,
                execution_token: randomNumber,
                commitment: commitment,
                reach: Number(reach),
                impression: Number(impression),
                engagement: Number(engagement),
                story_view: Number(story_view),
                created_by: created_by
            }
            //obj push in array
            exeDataArray.push(exeDataObj);
        }
        //data insert into the db
        const exeDetails = await executionModel.insertMany(exeDataArray);

        //check the execution req is generated then status update in sale booking
        if (exeDetails && exeDetails.length) {
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
            exeDetails
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