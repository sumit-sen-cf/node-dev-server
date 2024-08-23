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
        // Calculate the start and end of the current week (Monday to Sunday)
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Monday
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 5); // Sunday
        endOfWeek.setHours(23, 59, 59, 999);

        // Calculate the start and end of the current month (1st to 30th/31st)
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        // Calculate the start and end of the current quarter (e.g., January to March)
        const quarter = Math.floor((currentDate.getMonth() / 3));
        const startOfQuarter = new Date(currentDate.getFullYear(), quarter * 3, 2);
        const endOfQuarter = new Date(currentDate.getFullYear(), quarter * 3 + 3, 0);
        endOfQuarter.setHours(23, 59, 59, 999);

        // Define the pipeline for weekly, monthly, and quarterly data
        const getData = async (startDate, endDate) => {
            //match obj prepare
            let matchQuery = {
                sale_booking_date: {
                    $gte: startDate,
                    $lt: endDate
                }
            }
            if (req.query?.userId && req.query?.isAdmin == ("false" || false)) {
                matchQuery["created_by"] = Number(req.query.userId);
            }
            //get data using user and date filter.
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
                    startDate: { $literal: startDate },  // Adding startDate to the projection
                    endDate: { $literal: endDate }       // Adding endDate to the projection
                }
            }]);

            //get total account counts
            const accountDataCounts = await accountMasterModel.countDocuments({
                createdAt: {
                    $gte: startDate,
                    $lt: endDate
                }
            });
            //return obj prepare
            let dashboardObj = {
                totalCampaignAmount: 0,
                totalSaleBookingCounts: 0,
                totalAccountCounts: 0,
                startDate: startDate,
                endDate: endDate
            }
            //length check of the data
            if (salesData && salesData[0]) {
                dashboardObj["totalCampaignAmount"] = salesData[0].totalCampaignAmount;
                dashboardObj["totalSaleBookingCounts"] = salesData[0].totalSaleBookingCounts;
                dashboardObj["totalAccountCounts"] = accountDataCounts;
            }
            return dashboardObj;
        };

        // Fetch data for weekly, monthly, and quarterly
        const weeklyData = await getData(startOfWeek, endOfWeek);
        const monthlyData = await getData(startOfMonth, endOfMonth);
        const quarterlyData = await getData(startOfQuarter, endOfQuarter);

        // Return a success response with all the data
        return response.returnTrue(
            200,
            req,
            res,
            "Dashboard Data retrieved successfully!",
            {
                weeklyData,
                monthlyData,
                quarterlyData
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

