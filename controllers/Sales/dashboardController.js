const constant = require("../../common/constant");
const response = require("../../common/response");
const vari = require("../../variables.js");
const { storage } = require('../../common/uploadFile.js');
const accountMasterModel = require("../../models/accounts/accountMasterModel.js");
const salesBookingModel = require("../../models/Sales/salesBookingModel.js");
const paymentUpdateModel = require("../../models/Sales/paymentUpdateModel.js");
const invoiceRequestModel = require("../../models/Sales/invoiceRequestModel.js");
const incentiveRequestModel = require("../../models/Sales/incentiveRequestModel.js");

/**
 * Api is to used for get top 20 account list data.
 */
exports.getTop20AccountList = async (req, res) => {
    try {
        let accountLimit = 20;
        let matchCondition = {};
        //get top 20 account list with campaign amount wise.
        const accountWiseSaleBookingData = await salesBookingModel.aggregate([{
            $match: matchCondition
        }, {
            $group: {
                _id: '$account_id',
                totalCampaignAmount: {
                    $sum: '$campaign_amount'
                },
                totalSaleBookingCounts: {
                    $sum: 1
                },
                account_id: {
                    $first: '$account_id'
                }
            }
        }, {
            $sort: {
                totalCampaignAmount: -1
            }
        }, {
            $limit: accountLimit
        }, {
            $lookup: {
                from: 'accountmastermodels',
                localField: 'account_id',
                foreignField: 'account_id',
                as: 'accountData'
            }
        }, {
            $unwind: '$accountData'
        }, {
            $lookup: {
                from: 'usermodels',
                localField: 'accountData.created_by',
                foreignField: 'user_id',
                as: 'userData'
            }
        }, {
            $unwind: '$userData'
        }, {
            $project: {
                _id: 0,
                account_id: '$account_id',
                account_obj_id: '$accountData._id',
                account_name: '$accountData.account_name',
                created_by_name: '$userData.user_name',
                created_by_email: '$userData.user_email_id',
                created_by_contact_no: '$userData.user_contact_no',
                totalCampaignAmount: 1,
                totalSaleBookingCounts: 1,
            }
        }]);

        // If no data are found, return a response indicating no data found
        if (accountWiseSaleBookingData.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response
        return response.returnTrue(
            200,
            req,
            res,
            "Top 20 Accounts list retrieved successfully!",
            accountWiseSaleBookingData,
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for weekly monthly quterly data get of sale booking.
 */
exports.getWeeklyMonthlyQuarterlyList = async (req, res) => {
    try {
        // Get the current date
        const currentDate = new Date();

        // Function to get the start and end dates of a week (Monday to Sunday)
        const getWeekRange = (date, offset = 0) => {
            const startOfWeek = new Date(date);
            startOfWeek.setDate(date.getDate() - date.getDay() + 1 + offset * 7); // Monday
            startOfWeek.setHours(0, 0, 0, 0);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 5); // Sunday
            endOfWeek.setHours(23, 59, 59, 999);
            return { startOfWeek, endOfWeek };
        };

        // Function to get the start and end dates of a month
        const getMonthRange = (date, offset = 0) => {
            const startOfMonth = new Date(date.getFullYear(), date.getMonth() + offset, 2);
            startOfMonth.setHours(0, 0, 0, 0);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1 + offset, 0);
            endOfMonth.setHours(23, 59, 59, 999);
            return { startOfMonth, endOfMonth };
        };

        // Function to get the start and end dates of a quarter
        const getQuarterRange = (date, offset = 0) => {
            const quarter = Math.floor((date.getMonth() / 3)) + offset;
            const startOfQuarter = new Date(date.getFullYear(), quarter * 3, 2);
            startOfQuarter.setHours(0, 0, 0, 0);
            const endOfQuarter = new Date(date.getFullYear(), quarter * 3 + 3, 0);
            endOfQuarter.setHours(23, 59, 59, 999);
            return { startOfQuarter, endOfQuarter };
        };

        // Current week, month, and quarter
        const { startOfWeek, endOfWeek } = getWeekRange(currentDate);
        const { startOfMonth, endOfMonth } = getMonthRange(currentDate);
        const { startOfQuarter, endOfQuarter } = getQuarterRange(currentDate);

        // Last week, month, and quarter
        const { startOfWeek: lastWeekStart, endOfWeek: lastWeekEnd } = getWeekRange(currentDate, -1);
        const { startOfMonth: lastMonthStart, endOfMonth: lastMonthEnd } = getMonthRange(currentDate, -1);
        const { startOfQuarter: lastQuarterStart, endOfQuarter: lastQuarterEnd } = getQuarterRange(currentDate, -1);

        // Define the pipeline for weekly, monthly, and quarterly data
        const getData = async (startDate, endDate) => {
            // Prepare the match query
            let matchQuery = {
                sale_booking_date: {
                    $gte: startDate,
                    $lt: endDate
                }
            };
            if (req.query?.userId && req.query?.isAdmin == ("false" || false)) {
                matchQuery["created_by"] = Number(req.query.userId);
            }
            // Get data using user and date filter
            const salesData = await salesBookingModel.aggregate([{
                $match: matchQuery
            }, {
                $group: {
                    _id: null,
                    totalCampaignAmount: {
                        $sum: '$campaign_amount'
                    },
                    totalSaleBookingCounts: {
                        $sum: 1
                    }
                }
            }, {
                $project: {
                    _id: 0,
                    totalCampaignAmount: 1,
                    totalSaleBookingCounts: 1,
                    startDate: { $literal: startDate },
                    endDate: { $literal: endDate }
                }
            }]);

            // Get total account counts
            const accountDataCounts = await accountMasterModel.countDocuments({
                createdAt: {
                    $gte: startDate,
                    $lt: endDate
                }
            });

            // Prepare the return object
            let dashboardObj = {
                totalCampaignAmount: 0,
                totalSaleBookingCounts: 0,
                totalAccountCounts: 0,
                startDate: startDate,
                endDate: endDate
            };

            // Check the length of the data
            if (salesData && salesData[0]) {
                dashboardObj["totalCampaignAmount"] = salesData[0].totalCampaignAmount;
                dashboardObj["totalSaleBookingCounts"] = salesData[0].totalSaleBookingCounts;
                dashboardObj["totalAccountCounts"] = accountDataCounts;
            }
            return dashboardObj;
        };

        // Fetch data for current and last periods
        const weeklyData = await getData(startOfWeek, endOfWeek);
        const lastWeekData = await getData(lastWeekStart, lastWeekEnd);
        const monthlyData = await getData(startOfMonth, endOfMonth);
        const lastMonthData = await getData(lastMonthStart, lastMonthEnd);
        const quarterlyData = await getData(startOfQuarter, endOfQuarter);
        const lastQuarterData = await getData(lastQuarterStart, lastQuarterEnd);

        // Return a success response with all the data
        return response.returnTrue(
            200,
            req,
            res,
            "Dashboard Data retrieved successfully!",
            {
                weeklyData,
                lastWeekData,
                monthlyData,
                lastMonthData,
                quarterlyData,
                lastQuarterData
            }
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for finance dashboard counts.
 */
exports.financeDashboardCounts = async (req, res) => {
    try {
        //sale booking outstanding counts
        const saleBookingOutstandingCounts = await salesBookingModel.countDocuments({});

        //sale booking tds open counts
        const saleBookingtdsOpenCounts = await salesBookingModel.countDocuments({
            tds_status: "open"
        });

        //sale booking tds close counts
        const saleBookingtdsCloseCounts = await salesBookingModel.countDocuments({
            tds_status: "close"
        });

        //pending payment request counts
        const pendingPaymentReqCounts = await paymentUpdateModel.countDocuments({
            payment_approval_status: "pending"
        })

        //pending payment request counts
        const pendingInvoiceReqCounts = await invoiceRequestModel.countDocuments({
            invoice_creation_status: "pending"
        })

        //pending payment request counts
        const pendingIncentiveReqData = await incentiveRequestModel.aggregate([{
            $match: {
                finance_status: "pending"
            }
        }, {
            $group: {
                _id: null,
                totalIncentiveReqCounts: {
                    $sum: 1
                },
                totalIncentiveReqAmount: {
                    $sum: '$admin_approved_amount'
                },
            }
        }, {
            $project: {
                _id: 0,
                totalIncentiveReqCounts: 1,
                totalIncentiveReqAmount: 1
            }
        }]);

        let financeDataCountsObj = {
            saleBookingOutstandingCounts: saleBookingOutstandingCounts,
            saleBookingtdsOpenCounts: saleBookingtdsOpenCounts,
            saleBookingtdsCloseCounts: saleBookingtdsCloseCounts,
            pendingPaymentReqCounts: pendingPaymentReqCounts,
            pendingInvoiceReqCounts: pendingInvoiceReqCounts,
            pendingIncentiveReqCounts: 0,
            pendingIncentiveReqAmount: 0
        }

        //check length of the incentive data
        if (pendingIncentiveReqData && pendingIncentiveReqData.length) {
            financeDataCountsObj["pendingIncentiveReqCounts"] = pendingIncentiveReqData[0].totalIncentiveReqCounts;
            financeDataCountsObj["pendingIncentiveReqAmount"] = pendingIncentiveReqData[0].totalIncentiveReqAmount;
        }
        // Return a success response
        return response.returnTrue(
            200,
            req,
            res,
            "Finance Dashboard Api Counts retrive Successfully",
            financeDataCountsObj,
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

