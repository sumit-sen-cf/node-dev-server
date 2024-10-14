const fs = require("fs");
const ejs = require('ejs');
const path = require('path');
const moment = require('moment');
const vari = require("../variables");
const nodemailer = require("nodemailer");
const constant = require("../common/constant.js");
const { salesEmail } = require("../helper/status.js");
const salesBookingModel = require("../models/Sales/salesBookingModel");
const incentivePlanModel = require("../models/Sales/incentivePlanModel");
const sharedIncentiveSaleBookingModel = require("../models/Sales/sharedIncentiveSaleBookingModel");
const userModel = require("../models/userModel.js");
const brandModel = require("../models/accounts/brandModel.js");
const accountTypesModel = require("../models/accounts/accountTypesModel.js");
const accountMasterModel = require("../models/accounts/accountMasterModel.js");
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
                return resolve(Math.round(incentiveAmount));
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

    /**
     * Api is used for the user wise incentive data calcualtion.
     * @param {Array} incentiveSharingArray : users array to get percentage.
     * @param {Number} totalIncentiveAmount : for the user wise incentive calculation
     * @param {Number} createdById : for created user incentive calcuation
     * @returns : as promise to return object or reject error 
     */
    async calculateIncentiveSharingUserWise(incentiveSharingArray = [], totalIncentiveAmount, createdById) {
        return new Promise(async function (resolve, reject) {
            try {
                let sharedIncentiveDetailsArray = [];
                let incentiveCopyData = totalIncentiveAmount;
                for (const element of incentiveSharingArray) {
                    //amount to percentage share calculate.
                    const sharedIncentiveAmount = ((incentiveCopyData * element.user_percentage) / 100);
                    //data push in array
                    sharedIncentiveDetailsArray.push({
                        user_id: element.user_id,
                        user_percentage: element.user_percentage,
                        incentive_amount: sharedIncentiveAmount
                    });

                    //if sharing user is to creted by user so incentive amount replace with shared amount  
                    if (createdById == Number(element.user_id)) {
                        totalIncentiveAmount = sharedIncentiveAmount;
                    }
                }
                //return incentive amount
                return resolve({
                    cretedByIncentiveShareAmount: totalIncentiveAmount,
                    sharedIncentiveDetailsArray: sharedIncentiveDetailsArray,
                });
            } catch (err) {
                console.log('Error While get incentive sharing user wise data', err);
                return resolve({});
            }
        })
    },

    /**
     * Api is used for the incentive sharing data add in copy db collection.
     * @param {Array} sharedIncentiveDetailsArray : users array to get incentive amount.
     * @param {Number} saleBookingId : for the sale booking Data get
     * @returns : as promise to return object or reject error 
     */
    async incentiveSharingDataCopy(sharedIncentiveDetailsArray = [], saleBookingId) {
        return new Promise(async function (resolve, reject) {
            try {
                //sale booking data get from the db collection.
                const salebookingData = await salesBookingModel.findOne({
                    sale_booking_id: saleBookingId
                })
                if (!salebookingData) {
                    return resolve('Sales booking not found');
                }
                // Prepare the data to be inserted into the sharedIncentiveSaleBookingModel
                let salesBookingCopy = salebookingData.toObject();
                delete salesBookingCopy._id;
                delete salesBookingCopy.createdAt;
                delete salesBookingCopy.updatedAt;
                delete salesBookingCopy.created_by;
                delete salesBookingCopy.updated_by;
                delete salesBookingCopy.incentive_amount;
                delete salesBookingCopy.unearned_incentive_amount;
                delete salesBookingCopy.__v;
                //shared incentive data create in copy collection. 
                for (const element of sharedIncentiveDetailsArray) {
                    //if sharing user is to creted by user so copy incentive booking continue.  
                    if (salebookingData.created_by == Number(element.user_id)) {
                        continue;
                    }
                    salesBookingCopy.created_by = element.user_id;
                    salesBookingCopy.updated_by = element.user_id;
                    salesBookingCopy.incentive_amount = element.incentive_amount;
                    salesBookingCopy.unearned_incentive_amount = element.incentive_amount;
                    //if the data is already available then check
                    const cpSbData = await sharedIncentiveSaleBookingModel.findOne({
                        sale_booking_id: salesBookingCopy.sale_booking_id,
                        created_by: element.user_id
                    });
                    //if already created data so update and continue 
                    if (cpSbData && Object.keys(cpSbData).length) {
                        //update the old incentive shared data.
                        await sharedIncentiveSaleBookingModel.updateOne({
                            sale_booking_id: salesBookingCopy.sale_booking_id,
                            created_by: element.user_id
                        }, salesBookingCopy);
                        //now continue the loop.
                        continue;
                    }
                    // insert the data into the sharedIncentiveSaleBookingModel
                    await sharedIncentiveSaleBookingModel.create(salesBookingCopy);
                }
                //return response
                return resolve(true);
            } catch (err) {
                console.log('Error While get incentive sharing data copy', err);
                return resolve();
            }
        })
    },

    /**
     * funcion is used for the update fields in the shared sale booking collection. 
     * @param {Object} filterQuery : for the update data find condition check.
     * @returns : as promise to return object or reject error 
     */
    async distinctSaleBookingIdsForIncentive(filterQuery = {}) {
        return new Promise(async function (resolve, reject) {
            try {
                // Get distinct sale booking IDs from the database
                const distinctSaleBookingIds = await salesBookingModel.distinct('_id', filterQuery);
                // Get distinct shared incentive sale booking IDs from the database
                const distinctSharedIncentiveSaleBookingIds = await sharedIncentiveSaleBookingModel.distinct('_id', filterQuery);

                //Sale booking data and copy incentive sharing sale booking merged.
                const mergeDistinctSaleBookingIds = [...distinctSaleBookingIds, ...distinctSharedIncentiveSaleBookingIds];

                //return response
                return resolve(mergeDistinctSaleBookingIds);
            } catch (err) {
                console.log('Error While get incentive sharing user wise data', err);
                return resolve();
            }
        })
    },

    /**
     * funcion is used for the get unique user ids with add incentive amount. 
     * @param {Object} incentiveSharingUsersArray : for the update data find condition check.
     * @returns : as promise to return object or reject error 
     */
    async uniqueUserIdsWithIncentiveAmountAdd(incentiveSharingUsersArray = []) {
        return new Promise(async function (resolve, reject) {
            try {
                //if not get array's length
                if (!incentiveSharingUsersArray.length) {
                    return resolve([]);
                }
                // Create a new object to accumulate results
                let userMap = {};

                // Iterate through the array and sum incentive amounts for duplicate user_ids
                incentiveSharingUsersArray.forEach(element => {
                    if (userMap[element.user_id]) {
                        // If the user already exists in the map, add the incentive_amount
                        userMap[element.user_id].incentive_amount += element.incentive_amount;
                    } else {
                        // Otherwise, add a new entry for this user
                        userMap[element.user_id] = { ...element };
                    }
                });

                // Convert the object back to an array
                let result = Object.values(userMap);
                //return response
                return resolve(result);
            } catch (err) {
                console.log('Error While get unique user ids with incentive amount add', err);
                return resolve();
            }
        })
    },

    /**
     * funcion is used for the send email to admin after sale booking creation. 
     * @param {Object} saleBookingAdded : for email sending process data found.
     * @returns : as promise to return object or reject error 
     */
    async emailSendSaleBookingCreateTime(saleBookingAdded = {}) {
        return new Promise(async function (resolve, reject) {
            try {
                //If not get saleBookingAdded's length
                if (!Object.keys(saleBookingAdded).length) {
                    return resolve();
                }

                //user data get for the name
                const userData = await userModel.findOne({
                    user_id: saleBookingAdded.created_by
                }, {
                    user_id: 1,
                    user_name: 1,
                });

                //account data get for the name
                const accountData = await accountMasterModel.findOne({
                    account_id: saleBookingAdded.account_id
                }, {
                    account_id: 1,
                    account_name: 1,
                    account_type_id: 1,
                });

                //user data get for the name
                const accountTypeData = await accountTypesModel.findOne({
                    _id: accountData.account_type_id
                }, {
                    account_type_name: 1,
                });

                //user data get for the name
                const brandData = await brandModel.findOne({
                    _id: saleBookingAdded.brand_id
                }, {
                    brand_name: 1,
                });

                // Format a specific date
                const formattedDate = moment(saleBookingAdded.sale_booking_date).format('MM/DD/YYYY HH:mm:ss');
                //for email send process to admin
                try {
                    const transporterOptions = {
                        service: "gmail",
                        auth: {
                            user: constant.EMAIL_ID,
                            pass: constant.EMAIL_PASS,
                        },
                    };

                    const createMailOptions = (html) => ({
                        from: constant.EMAIL_ID,
                        to: salesEmail,
                        subject: "New Sale Booking Created",
                        html: html,
                    });

                    const sendMail = async (mailOptions) => {
                        const transporter = nodemailer.createTransport(transporterOptions);
                        await transporter.sendMail(mailOptions);
                    };

                    const templatePath = path.join(__dirname, "../templates/saleBookingCreateTemplate.ejs");
                    const template = await fs.promises.readFile(templatePath, "utf-8");
                    const html = ejs.render(template, {
                        salesExecutiveName: userData.user_name,
                        salesExecutiveID: saleBookingAdded.created_by,
                        saleBookingId: saleBookingAdded.sale_booking_id,
                        saleBookingDate: formattedDate,
                        saleBookingAmount: saleBookingAdded.campaign_amount,
                        accountId: accountData.account_id,
                        accountName: accountData.account_name,
                        accountType: accountTypeData.account_type_name,
                        brandName: brandData.brand_name,
                        headerText: "New Sale Booking is Created."
                    });
                    const mailOptions = createMailOptions(html);

                    //send email to admin
                    await sendMail(mailOptions);
                } catch (err) {
                    console.log("Error in email send process", err);
                    return resolve(response.returnFalse(666, req, res, err.message, {}));
                }
                //return response
                return resolve();
            } catch (err) {
                console.log('Error in email sending process to Admin', err);
                return resolve(response.returnFalse(666, req, res, err.message, {}));
            }
        })
    },

};
