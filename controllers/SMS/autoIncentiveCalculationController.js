const { message } = require("../../common/message")
const mongoose = require("mongoose");
const autoIncentiveCalculationModel = require("../../models/SMS/autoIncentiveCalculationModel");

/**
 * Api is to used for the auto_incentive_calculation data add in the DB collection.
 */
exports.createAutoIncentiveCalculation = async (req, res) => {
    try {
        const { month_year, sales_executive_id, campaign_amount, paid_amount, incentive_amount, earned_incentive, unearned_incentive, created_by, } = req.body;
        const addAutoIncentiveCalculation = new autoIncentiveCalculationModel({
            month_year: month_year,
            sales_executive_id: sales_executive_id,
            campaign_amount: campaign_amount,
            paid_amount: paid_amount,
            incentive_amount: incentive_amount,
            earned_incentive: earned_incentive,
            unearned_incentive: unearned_incentive,
            created_by: created_by,
        });
        await addAutoIncentiveCalculation.save();
        return res.status(200).json({
            status: 200,
            message: "Auto incentive calculation data added successfully!",
            data: addAutoIncentiveCalculation,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the auto_incentive_calculation data get_ByID in the DB collection.
 */
exports.getAutoIncentiveCalculationDetails = async (req, res) => {
    try {
        const autoIcentiveCalculationData = await autoIncentiveCalculationModel.aggregate([
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
                    localField: "sales_executive_id",
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
                    month_year: 1,
                    sales_executive_id: 1,
                    sales_executive_name: "$user.user_name",
                    campaign_amount: 1,
                    paid_amount: 1,
                    incentive_amount: 1,
                    earned_incentive: 1,
                    unearned_incentive: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    created_date_time: 1,
                },
            },
        ])
        if (autoIcentiveCalculationData) {
            return res.status(200).json({
                status: 200,
                message: "Auto incentive calculation details successfully!",
                data: autoIcentiveCalculationData,
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
 * Api is to used for the auto_incentive_calculation data update in the DB collection.
 */
exports.updateAutoIncentiveCalculation = async (req, res) => {
    try {
        const { id } = req.params;
        const { month_year, sales_executive_id, campaign_amount, paid_amount, incentive_amount, earned_incentive, unearned_incentive, created_by } = req.body;
        const autoIncentiveCalculationData = await autoIncentiveCalculationModel.findOne({ _id: id });
        if (!autoIncentiveCalculationData) {
            return res.send("Invalid auto_incentive_calculation Id...");
        }
        await autoIncentiveCalculationData.save();
        const autoIncentiveCalculationUpdated = await autoIncentiveCalculationModel.findOneAndUpdate({ _id: id }, {
            $set: {
                month_year,
                sales_executive_id,
                campaign_amount,
                paid_amount,
                incentive_amount,
                earned_incentive,
                unearned_incentive,
                created_by,
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "Auto incentive calculation data updated successfully!",
            data: autoIncentiveCalculationUpdated,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the auto_incentive_calculation data get_list in the DB collection.
 */
exports.getAutoIncentiveCalculationList = async (req, res) => {
    try {
        const autoInsentiveCalculationListData = await autoIncentiveCalculationModel.aggregate([
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
            }, {
                $lookup: {
                    from: "usermodels",
                    localField: "sales_executive_id",
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
                    month_year: 1,
                    sales_executive_id: 1,
                    sales_executive_name: "$user.user_name",
                    campaign_amount: 1,
                    paid_amount: 1,
                    incentive_amount: 1,
                    earned_incentive: 1,
                    unearned_incentive: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    created_date_time: 1,
                },
            },
        ])
        if (autoInsentiveCalculationListData) {
            return res.status(200).json({
                status: 200,
                message: "Auto incentive calculation details list successfully!",
                data: autoInsentiveCalculationListData,
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
 * Api is to used for the auto_incentive_calculation data delete in the DB collection.
 */
exports.deleteAutoIncentiveCalculation = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const autoIncentiveCalculationDelete = await autoIncentiveCalculationModel.findOne({ _id: id });
        if (!autoIncentiveCalculationDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await autoIncentiveCalculationModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Auto incentive calculation data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};