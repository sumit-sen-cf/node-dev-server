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

    async autoIncentiveCalculationDetailsUpdate(filterObj, incentiveDetailsObj) {
        return new Promise(async function (resolve, reject) {
            try {
                const month = filterObj.month || 4;
                const year = filterObj.year || 2024;
                const userId = filterObj.userId || 712;

                const formattedMonth = ("0" + month).slice(-2);
                const yearMonth = `${year}-${formattedMonth}`;

                const oldAutoIncentiveData = await autoIncentiveCalculationModel.findOne({
                    month_year: yearMonth
                });

                let autoIncentiveObj = {
                    campaign_amount: incentiveDetailsObj.campaign_amount,
                    paid_amount: incentiveDetailsObj.paid_amount,
                    record_service_amount: incentiveDetailsObj.record_service_amount,
                    incentive_amount: incentiveDetailsObj.incentive_amount,
                    earned_incentive: incentiveDetailsObj.earned_incentive,
                    unearned_incentive: incentiveDetailsObj.unearned_incentive
                }

                //if year_month found then add in older data.
                if (oldAutoIncentiveData && Object.keys(oldAutoIncentiveData)) {
                    //previous data add in new obj
                    autoIncentiveObj["campaign_amount"] = oldAutoIncentiveData.campaign_amount + incentiveDetailsObj.campaign_amount;
                    autoIncentiveObj["paid_amount"] = oldAutoIncentiveData.paid_amount + incentiveDetailsObj.paid_amount;
                    autoIncentiveObj["record_service_amount"] = oldAutoIncentiveData.record_service_amount + incentiveDetailsObj.record_service_amount;
                    autoIncentiveObj["incentive_amount"] = oldAutoIncentiveData.incentive_amount + incentiveDetailsObj.incentive_amount;
                    autoIncentiveObj["earned_incentive"] = oldAutoIncentiveData.earned_incentive + incentiveDetailsObj.earned_incentive;
                    autoIncentiveObj["unearned_incentive"] = oldAutoIncentiveData.unearned_incentive + incentiveDetailsObj.unearned_incentive;

                    //month_year and user wise data update in db collection.
                    await autoIncentiveCalculationModel.updateOne({
                        month_year: yearMonth
                    }, {
                        $set: autoIncentiveObj
                    })
                } else {
                    autoIncentiveObj["sales_executive_id"] = userId;
                    autoIncentiveObj["month_year"] = yearMonth;

                    //month_year and user wise data create in db collection. 
                    await autoIncentiveCalculationModel.create(autoIncentiveObj)
                }
                return resolve(autoIncentiveObj);
            } catch (err) {
                console.log('Error While calculate auto incentive calculation', err);
                return resolve({});
            }
        })
    }
};
