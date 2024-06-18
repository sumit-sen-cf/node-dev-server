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

    async getSalesBookingIncentiveData() {
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
                        sale_booking_date: 1,
                        campaign_name: 1,
                        campaign_amount: 1,
                        description: 1,
                        credit_approval_status: 1,
                        reason_credit_approval: 1,
                        gst_status: 1,
                        balance_payment_ondate: 1,
                        payment_credit_status: 1,
                        booking_status: 1,
                        sale_booking_id: 1,
                        account_id: 1,
                        account_name: 1,
                        requested_amount: 1,
                        registered_by_name: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        created_by: 1,
                        total_sale_booking_amount: { $sum: "$campaign_amount" },
                        total_incentive_amount: { $sum: "$incentive_amount" },
                    },
                },
                {
                    $group: {
                        _id: {
                            created_by_name: "$created_by_name",
                            userName: "$user.user_name",
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        sale_booking: { $push: "$$ROOT" },
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
