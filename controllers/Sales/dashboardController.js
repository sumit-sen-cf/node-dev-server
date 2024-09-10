const constant = require("../../common/constant");
const response = require("../../common/response");
const vari = require("../../variables.js");
const { storage } = require('../../common/uploadFile.js');
const { saleBookingStatus } = require('../../helper/status.js');
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
        // Prepare the match query
        let matchCondition = {};
        if (req.query?.userId && req.query?.isAdmin == ("false" || false)) {
            matchCondition["created_by"] = Number(req.query.userId);
        }
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

        // Check if the environment is local or server
        const isLocal = vari.NODE_ENV === 'development'; // Assuming 'development' is local
        console.log("🚀 ~ isLocal:", isLocal);
        // Set the day based on the environment (1st locally, 2nd on server)
        const startDay = isLocal ? 0 : 1;
        console.log("🚀 ~ startDay:", startDay);

        // Function to get the start and end dates of a week (Monday to Sunday)
        const getWeekRange = (date, offset = 0) => {
            const startOfWeek = new Date(date);
            startOfWeek.setDate(date.getDate() - date.getDay() + startDay + offset * 7); // Adjust for local or server
            startOfWeek.setHours(0, 0, 0, 0);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
            endOfWeek.setHours(23, 59, 59, 999);
            return { startOfWeek, endOfWeek };
        };

        // Function to get the start and end dates of a month
        const getMonthRange = (date, offset = 0) => {
            const startOfMonth = new Date(date.getFullYear(), date.getMonth() + offset, startDay);
            startOfMonth.setHours(0, 0, 0, 0);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1 + offset, 0);
            endOfMonth.setHours(23, 59, 59, 999);
            return { startOfMonth, endOfMonth };
        };

        // Function to get the start and end dates of a quarter
        const getQuarterRange = (date, offset = 0) => {
            const quarter = Math.floor((date.getMonth() / 3)) + offset;
            const startOfQuarter = new Date(date.getFullYear(), quarter * 3, startDay);
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

/**
 * Api is to used for date range sale booking data.
 */
exports.getdateRangeTotalSaleAmountData = async (req, res) => {
    try {
        //get date from the query
        let startDate = req.query.startDate; //"2024-08-15"
        let endDate = req.query.endDate; //"2024-10-19"

        // Prepare the match query
        let matchCondition = {
            createdAt: {
                $gte: new Date(startDate), // start date
                $lte: new Date(endDate)  // end date
            }
        }
        // if (req.query?.userId && req.query?.isAdmin == ("false" || false)) {
        //     matchCondition["created_by"] = Number(req.query.userId);
        // }
        //date range sale booking with campaign amount wise.
        const dateRangeWiseSaleBookingData = await salesBookingModel.aggregate([{
            $match: matchCondition
        }, {
            $group: {
                _id: '$created_by',
                campaignAmount: {
                    $sum: '$campaign_amount'
                },
                totalSaleBookingCounts: {
                    $sum: 1
                },
                created_by: {
                    $first: '$created_by'
                }
            }
        }, {
            $sort: {
                campaignAmount: -1
            }
        }, {
            $lookup: {
                from: 'usermodels',
                localField: 'created_by',
                foreignField: 'user_id',
                as: 'userData'
            }
        }, {
            $unwind: '$userData'
        }, {
            $project: {
                _id: 0,
                sales_executive_id: '$created_by',
                sales_executive_name: '$userData.user_name',
                campaignAmount: 1,
                totalSaleBookingCounts: 1,
            }
        }, {
            $group: {
                _id: null,
                totalCampaignAmount: { $sum: "$campaignAmount" },
                userWiseData: { $push: "$$ROOT" },
            }
        }, {
            $project: {
                _id: 0,
                totalCampaignAmount: 1,
                userWiseData: 1,
            }
        }]);

        // If no data are found, return a response indicating no data found
        if (dateRangeWiseSaleBookingData.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response
        return response.returnTrue(
            200,
            req,
            res,
            "Date Range Sale Booking Amount Data retrieved successfully!",
            dateRangeWiseSaleBookingData,
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for get top 20 account list data.
 */
exports.getSaleBookingStatusList = async (req, res) => {
    try {
        let dataResponse = [
            saleBookingStatus['01'],
            saleBookingStatus['02'],
            saleBookingStatus['03'],
            saleBookingStatus['04'],
            saleBookingStatus['05'],
            saleBookingStatus['06'],
            saleBookingStatus['07'],
            saleBookingStatus['08'],
            saleBookingStatus['09'],
            saleBookingStatus['10'],
            saleBookingStatus['11'],
            saleBookingStatus['12'],
            saleBookingStatus['13']
        ]
        // Return a success response
        return response.returnTrue(
            200,
            req,
            res,
            "Sale Booking Status List retrieved successfully!",
            dataResponse,
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for Sale booking grid status list count data.
 */
exports.getSaleBookingGridStatusCountList = async (req, res) => {
    try {
        // Define all possible booking statuses
        const allBookingStatuses = [
            { booking_status: saleBookingStatus['01'].status, totalSaleBookingCounts: 0 },
            { booking_status: saleBookingStatus['02'].status, totalSaleBookingCounts: 0 },
            { booking_status: saleBookingStatus['03'].status, totalSaleBookingCounts: 0 },
            { booking_status: saleBookingStatus['04'].status, totalSaleBookingCounts: 0 },
            { booking_status: saleBookingStatus['05'].status, totalSaleBookingCounts: 0 },
            { booking_status: saleBookingStatus['06'].status, totalSaleBookingCounts: 0 },
            { booking_status: saleBookingStatus['07'].status, totalSaleBookingCounts: 0 },
            { booking_status: saleBookingStatus['08'].status, totalSaleBookingCounts: 0 },
            { booking_status: saleBookingStatus['09'].status, totalSaleBookingCounts: 0 },
            { booking_status: saleBookingStatus['10'].status, totalSaleBookingCounts: 0 },
            { booking_status: saleBookingStatus['11'].status, totalSaleBookingCounts: 0 },
            { booking_status: saleBookingStatus['12'].status, totalSaleBookingCounts: 0 },
            { booking_status: saleBookingStatus['13'].status, totalSaleBookingCounts: 0 },
            { booking_status: null, totalSaleBookingCounts: 0 }, // Handling null status as well
        ];

        // Get data using user and date filter
        const salesData = await salesBookingModel.aggregate([{
            $group: {
                _id: '$booking_status', // Group by booking status
                totalSaleBookingCounts: { $sum: 1 }
            }
        }, {
            $project: {
                _id: 0,
                booking_status: "$_id",
                totalSaleBookingCounts: 1,
            }
        }]);

        // Merge the salesData with allBookingStatuses
        const mergedData = allBookingStatuses.map(status => {
            const matchingData = salesData.find(sale => sale.booking_status === status.booking_status);
            return matchingData ? matchingData : status;
        });

        // Return a success response
        return response.returnTrue(
            200,
            req,
            res,
            "Sale Booking Grid Status Count List retrieved Successfully!",
            mergedData
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};
