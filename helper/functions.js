const vari = require("../variables");
const incentivePlanModel = require("../models/Sales/incentivePlanModel");
// Check if the environment is local or server
// Set the day based on the environment (1st locally, 2nd on server)
const startDay = vari.NODE_ENV === 'development' ? 0 : 1;

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

    /**
     * Function to get the start and end dates of a week (Monday to Sunday)
     * @param {*} date :for the date range find
     * @param {*} offset : for the last week get
     * @returns : start and end dates of a week Range
     */
    async getWeekDateRange(date, offset = 0) {
        return new Promise(async function (resolve, reject) {
            try {
                const startOfWeek = new Date(date);
                startOfWeek.setDate(date.getDate() - date.getDay() + startDay + offset * 7); // Adjust for local or server
                startOfWeek.setHours(0, 0, 0, 0);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
                endOfWeek.setHours(23, 59, 59, 999);
                //return week date range
                return resolve({ startOfWeek, endOfWeek });
            } catch (err) {
                console.log('Error While get Week Date Range details', err);
                return resolve({});
            }
        })
    },

    /**
     * Function to get the start and end dates of a month 
     * @param {*} date :for the date range find
     * @param {*} offset : for the last month get
     * @returns : start and end dates of a month Range
     */
    async getMonthDateRange(date, offset = 0) {
        return new Promise(async function (resolve, reject) {
            try {
                const startOfMonth = new Date(date.getFullYear(), date.getMonth() + offset, startDay);
                startOfMonth.setHours(0, 0, 0, 0);
                const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1 + offset, 0);
                endOfMonth.setHours(23, 59, 59, 999);
                //return month date range
                return resolve({ startOfMonth, endOfMonth });
            } catch (err) {
                console.log('Error While get Month Date Range details', err);
                return resolve({});
            }
        })
    },

    /**
     * Function to get the start and end dates of a quarter 
     * @param {*} date :for the date range find
     * @param {*} offset : for the last quarter get
     * @returns : start and end dates of a quarter Range
     */
    async getQuarterDateRange(date, offset = 0) {
        return new Promise(async function (resolve, reject) {
            try {
                const quarter = Math.floor((date.getMonth() / 3)) + offset;
                const startOfQuarter = new Date(date.getFullYear(), quarter * 3, startDay);
                startOfQuarter.setHours(0, 0, 0, 0);
                const endOfQuarter = new Date(date.getFullYear(), quarter * 3 + 3, 0);
                endOfQuarter.setHours(23, 59, 59, 999);
                //return quarter date range
                return resolve({ startOfQuarter, endOfQuarter });
            } catch (err) {
                console.log('Error While get Quarter Date Range details', err);
                return resolve({});
            }
        })
    },

};
