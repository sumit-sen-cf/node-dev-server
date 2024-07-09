const response = require("../../common/response");
const salesBookingModel = require("../../models/Sales/salesBookingModel");

/**
 * Api is to used for the salesbooking outstanding for finance.
 */
exports.getSalesBookingOutStandingListForFinanace = async (req, res) => {
    try {
        //get all data in DB collection
        const SalesBookingData = await salesBookingModel.aggregate([{
            $match: {
                tds_status: "open",
            }
        }, {
            $lookup: {
                from: "usermodels",
                localField: "created_by",
                foreignField: "user_id",
                as: "createdUserData",
            }
        }, {
            $unwind: {
                path: "$createdUserData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "accountmastermodels",
                localField: "account_id",
                foreignField: "account_id",
                as: "accountMasterData",
            }
        }, {
            $unwind: {
                path: "$accountMasterData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "salesinvoicerequestmodels",
                localField: "sale_booking_id",
                foreignField: "sale_booking_id",
                as: "salesInvoiceRequestData",
            }
        }, {
            $project: {
                sale_booking_id: 1,
                account_id: 1,
                account_name: "$accountMasterData.account_name",
                created_by: 1,
                created_by_name: "$createdUserData.user_name",
                balance_payment_ondate: 1,
                sale_booking_date: 1,
                campaign_amount: 1,
                base_amount: 1,
                paid_amount: "$approved_amount",
                gst_status: 1,
                salesInvoiceRequestData: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        }]);

        //if data not found
        if (!SalesBookingData) {
            return response.returnFalse(200, req, res, "No Reord Found...", []);
        }
        //success response send
        return response.returnTrue(200, req, res, "Sales Booking data fatched", SalesBookingData);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};