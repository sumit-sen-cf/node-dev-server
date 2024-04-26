const { message } = require("../../common/message")
const mongoose = require("mongoose");
const salesBookingExecutionModel = require("../../models/SMS/salesBookingExecutionModel");

/**
 * Api is to used for the sales_booking_execution data add in the DB collection.
 */
exports.createSalesBookingExecution = async (req, res) => {
    try {
        const { sale_booking_id, record_service_mast_id, start_date, end_date, execution_status, execution_time, execution_date,
            execution_excel, execution_done_by, execution_remark, commitment, execution_sent_date, created_by, last_updated_by } = req.body;
        const addSalesBookingExecution = new salesBookingExecutionModel({
            sale_booking_id: sale_booking_id,
            record_service_mast_id: record_service_mast_id,
            start_date: start_date,
            end_date: end_date,
            execution_status: execution_status,
            execution_time: execution_time,
            execution_date: execution_date,
            execution_excel: execution_excel,
            execution_done_by: execution_done_by,
            execution_remark: execution_remark,
            commitment: commitment,
            execution_sent_date: execution_sent_date,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addSalesBookingExecution.save();
        return res.status(200).json({
            status: 200,
            message: "Sales booking data add successfully!",
            data: addSalesBookingExecution,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
* Api is to used for the sales_booking_execution data get_ByID in the DB collection.
*/
exports.getSalesBookingExecutionDetails = async (req, res) => {
    try {
        const salesBookingExecution = await salesBookingExecutionModel.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(req.params.id) },
            }, {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            }, {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $lookup: {
                    from: "usermodels",
                    localField: "last_updated_by",
                    foreignField: "user_id",
                    as: "user",
                },
            }, {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $project: {
                    sale_booking_id: 1,
                    record_service_mast_id: 1,
                    start_date: 1,
                    end_date: 1,
                    execution_status: 1,
                    execution_time: 1,
                    execution_date: 1,
                    execution_excel: 1,
                    execution_done_by: 1,
                    execution_remark: 1,
                    commitment: 1,
                    execution_sent_date: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    created_date_time: 1,
                    last_updated_by: 1,
                    last_updated_by_name: "$user.user_name",
                    last_updated_date: 1,
                },
            },
        ])
        if (salesBookingExecution) {
            return res.status(200).json({
                status: 200,
                message: "Sales booking execution data details successfully!",
                data: salesBookingExecution,
            });
        }
        return res.status(404).json({
            status: 404,
            message: message.DATA_NOT_FOUND,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the sales_booking_execution data update in the DB collection.
 */
exports.updateSalesBookingExecution = async (req, res) => {
    try {
        const { id } = req.params;
        const { sale_booking_id, record_service_mast_id, start_date, end_date, execution_status, execution_time, execution_date,
            execution_excel, execution_done_by, execution_remark, commitment, execution_sent_date, created_by, last_updated_by } = req.body;
        const salesBookingExecution = await salesBookingExecutionModel.findOne({ _id: id });
        if (!salesBookingExecution) {
            return res.send("Invalid sales_booking_execution Id...");
        }
        await salesBookingExecution.save();
        const salesBookingExecutionUpdated = await salesBookingExecutionModel.findOneAndUpdate({ _id: id }, {
            $set: {
                sale_booking_id,
                record_service_mast_id,
                start_date,
                end_date,
                execution_status,
                execution_time,
                execution_date,
                execution_excel,
                execution_done_by,
                execution_remark,
                commitment,
                execution_sent_date,
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "Sales booking execution data updated successfully!",
            data: salesBookingExecutionUpdated,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the sales_booking_execution data get_list in the DB collection.
 */
exports.getSalesBookingExcutionList = async (req, res) => {
    try {
        const salesBookingExecutionListData = await salesBookingExecutionModel.aggregate([
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            }, {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $lookup: {
                    from: "usermodels",
                    localField: "last_updated_by",
                    foreignField: "user_id",
                    as: "user",
                },
            }, {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $lookup: {
                    from: "salesbookings",
                    localField: "sale_booking_id",
                    foreignField: "sale_booking_id",
                    as: "salesbooking",
                },
            }, {
                $unwind: {
                    path: "$salesbooking",
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $lookup: {
                    from: "recordservicemasters",
                    localField: "record_service_mast_id",
                    foreignField: "_id",
                    as: "recordservicemaster",
                },
            }, {
                $unwind: {
                    path: "$recordservicemaster",
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $project: {
                    sale_booking_id: 1,
                    record_service_mast_id: 1,
                    start_date: 1,
                    end_date: 1,
                    execution_status: 1,
                    execution_time: 1,
                    execution_date: 1,
                    execution_excel: 1,
                    execution_done_by: 1,
                    execution_remark: 1,
                    commitment: 1,
                    execution_sent_date: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    created_date_time: 1,
                    last_updated_by: 1,
                    last_updated_by_name: "$user.user_name",
                    last_updated_date: 1,
                    Sales_Booking: "$salesbooking",
                    Record_Service_Master: "$recordservicemaster",
                }
            },
        ])
        if (salesBookingExecutionListData) {
            return res.status(200).json({
                status: 200,
                message: "Sales booking execution list successfully!",
                data: salesBookingExecutionListData,
            });
        }
        return res.status(404).json({
            status: 404,
            message: message.DATA_NOT_FOUND,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the sales_booking_execution data delete in the DB collection.
 */
exports.deleteSalesBookingExecution = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const salesBookingExecutionDelete = await salesBookingExecutionModel.findOne({ _id: id });
        if (!salesBookingExecutionDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await salesBookingExecutionModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Sales booking execution data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};