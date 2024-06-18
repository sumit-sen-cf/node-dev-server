//db models
const response = require("../common/response");
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

};
