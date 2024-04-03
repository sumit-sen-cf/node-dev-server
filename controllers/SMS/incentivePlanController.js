const incentivePlanModel = require("../../models/SMS/incentivePlanModel");
const { message } = require("../../common/message")
const mongoose = require("mongoose");

/**
 * Api is to used for the incentive_plan data add in the DB collection.
 */
exports.createIncentivePlan = async (req, res) => {
    try {
        const { sales_service_master_id, incentive_type, value, remarks, managed_by, created_by, last_updated_by } = req.body;
        const addIncentivePlanDetails = new incentivePlanModel({
            sales_service_master_id: sales_service_master_id,
            incentive_type: incentive_type,
            value: value,
            remarks: remarks,
            managed_by: managed_by,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addIncentivePlanDetails.save();
        return res.status(200).json({
            status: 200,
            message: "Incentive plan details data added successfully!",
            data: addIncentivePlanDetails,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the incentive_plan data get_ByID in the DB collection.
 */
exports.getIncentivePlanDetails = async (req, res) => {
    try {
        const incentivePlanData = await incentivePlanModel.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(req.params.id) },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "managed_by",
                    foreignField: "user_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    sales_service_master_id: 1,
                    incentive_type: 1,
                    value: 1,
                    remarks: 1,
                    managed_by: 1,
                    created_by: 1,
                    last_updated_by: 1,
                    managed_by_name: "$user.user_name",
                    created_by_name: "$user.user_name",
                    created_date_time: 1,
                    last_updated_date: 1,
                },
            },
        ])
        if (incentivePlanData) {
            return res.status(200).json({
                status: 200,
                message: "Incentive plan details successfully!",
                data: incentivePlanData,
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
 * Api is to used for the incentive_plan data update in the DB collection.
 */
exports.updateIncentivePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { sales_service_master_id, incentive_type, value, remarks, managed_by, created_by, last_updated_by } = req.body;
        const incentivePlanData = await incentivePlanModel.findOne({ _id: id });
        if (!incentivePlanData) {
            return res.send("Invalid incentive_plan Id...");
        }
        await incentivePlanData.save();
        const incentivePlanUpdated = await incentivePlanModel.findOneAndUpdate({ _id: id }, {
            $set: {
                sales_service_master_id,
                incentive_type,
                value,
                managed_by,
                remarks,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "Incentive plan data updated successfully!",
            data: incentivePlanUpdated,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the incentive_plan data get_list in the DB collection.
 */
exports.getIncentivePlanList = async (req, res) => {
    try {
        const incentivePlanListData = await incentivePlanModel.aggregate([
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "salesservicemasters",
                    localField: "sales_service_master_id",
                    foreignField: "_id",
                    as: "salesservicemaster",
                },
            },
            {
                $unwind: {
                    path: "$salesservicemaster",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    sales_service_master_id: 1,
                    incentive_type: 1,
                    value: 1,
                    remarks: 1,
                    managed_by: 1,
                    managed_by_name: "$user.user_name",
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    Sales_Service_Master: {
                        service_name: "$salesservicemaster.service_name",
                        post_type: "$salesservicemaster.post_type",
                        amount_status: "$salesservicemaster.amount_status",
                        is_excel_upload: "$salesservicemaster.is_excel_upload",
                        no_of_hours_status: "$salesservicemaster.no_of_hours_status",
                        goal_status: "$salesservicemaster.goal_status",
                        day_status: "$salesservicemaster.day_status",
                        quantity_status: "$salesservicemaster.quantity_status",
                        brand_name_status: "$salesservicemaster.brand_name_status",
                        hashtag: "$salesservicemaster.hashtag",
                        indiviual_amount_status: "$salesservicemaster.indiviual_amount_status",
                        start_end_date_status: "$salesservicemaster.start_end_date_status",
                        per_month_amount_status: "$salesservicemaster.per_month_amount_status",
                        no_of_creators: "$salesservicemaster.no_of_creators",
                        deliverables_info: "$salesservicemaster.deliverables_info",
                        remarks: "$salesservicemaster.remarks",
                        created_date_time: "$salesservicemaster.created_date_time",
                        created_by: "$salesservicemaster.created_by",
                        created_by_name: "$user.user_name",
                        last_updated_date: "$salesservicemaster.last_updated_date",
                        last_updated_by: "$salesservicemaster.last_updated_by",
                    }
                },
            },
        ])
        if (incentivePlanListData) {
            return res.status(200).json({
                status: 200,
                message: "Incentive plan details list successfully!",
                data: incentivePlanListData,
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
 * Api is to used for the incentive_plan data delete in the DB collection.
 */
exports.deleteIncentivePlan = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const incentivePlanDelete = await incentivePlanModel.findOne({ _id: id });
        if (!incentivePlanDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await incentivePlanModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Incentive plan data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};