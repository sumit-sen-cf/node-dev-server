//db models
const response = require("../common/response");
const autoIncentiveCalculationModel = require("../models/Sales/autoIncentiveCalculationModel");
const incentivePlanModel = require("../models/Sales/incentivePlanModel");

module.exports = {
    /**
     * Function for get Incentive amount calculate from record services
     * @param {ObjectId} salesServiceMasterId : for service master data get
     * @param {Number} recordServiceAmount : for incentive data get
     * @returns as promise to return amount or reject error 
     */
    async getIncentiveAmountRecordServiceWise(salesServiceMasterId, recordServiceAmount = 0) {
        return new Promise(async function (resolve, reject) {
            try {
                //get incentive plan details from DB
                const incentivePlanDetails = await incentivePlanModel.findOne({
                    sales_service_master_id: salesServiceMasterId
                })

                //if plan data not found
                if (!incentivePlanDetails) {
                    return resolve(0);
                }

                const percentage = incentivePlanDetails?.value;
                //if value is fixed 
                let incentiveAmount = incentivePlanDetails?.value;

                //if value is variable then calculate incentive amount
                if (incentivePlanDetails.incentive_type == "variable") {
                    incentiveAmount = (recordServiceAmount * percentage) / 100;
                }

                //return incentive amount
                return resolve(incentiveAmount);
            } catch (err) {
                console.log('Error While get incentive amount details', err);
                return resolve(0);
            }
        })
    },

    async getAutoIncentiveCalculationData() {
        try {
            const autoIncentiveCalculationDetails = await autoIncentiveCalculationModel.aggregate([
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
                    $project: {
                        _id: 1,
                        created_by_name: "$user.user_name",
                        month_year: 1,
                        sales_executive_id: 1,
                        campaign_amount: 1,
                        paid_amount: 1,
                        incentive_amount: 1,
                        earned_incentive: 1,
                        unearned_incentive: 1,
                        created_by: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        created_by: 1,
                        // total_sale_booking_amount: { $sum: "$campaign_amount" },
                        // total_incentive_amount: { $sum: "$incentive_amount" },
                    },
                },
                {
                    $group: {
                        _id: {
                            created_by_name: "$created_by_name",
                            userName: "$user.user_name",
                            month_year: "$month_year"
                        },
                        auto_incentive_calculation: { $push: "$$ROOT" },
                    },
                },
            ]);

            if (!autoIncentiveCalculationDetails.length) {
                return {
                    success: false,
                    statusCode: 200,
                    message: "No Record Found...",
                    data: []
                };
            }

            return {
                success: true,
                statusCode: 200,
                message: "Sales Booking Status data retrieved",
                data: autoIncentiveCalculationDetails
            };

        } catch (err) {
            console.error('Error While getting incentive amount details', err);
            return {
                success: false,
                statusCode: 500,
                message: err.message,
                data: {}
            };
        }
    }
};
