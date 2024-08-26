const response = require("../../common/response");
const vari = require("../../variables");
const multer = require("multer");
const { storage } = require('../../common/uploadFile');
const salesBooking = require('../../models/SMS/salesBooking');

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "plan_file", maxCount: 1 },
]);


/**
 * Api is to get all the pending, approved, rejected requested for creadit approval data list get from DB collection.
 */
exports.getAllStatusForCreditApprovalSalesBookingList = async (req, res) => {
    try {
        let status = req.query?.status;

        //get all data in DB collection
        const SalesBookingData = await salesBooking.aggregate([{
            $match: {
                payment_credit_status: "sent_for_credit_approval",
                credit_approval_status: status,
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
                from: "customermasts",
                localField: "customer_id",
                foreignField: "customer_id",
                as: "customermastsData",
            }
        }, {
            $unwind: {
                path: "$customermastsData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "salesbookingpayments",
                localField: "sale_booking_id",
                foreignField: "sale_booking_id",
                as: "salesbookingpaymentsData",
            }
        }, {
            $unwind: {
                path: "$salesbookingpaymentsData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "reasoncreditapprovals",
                localField: "reason_credit_approval",
                foreignField: "_id",
                as: "reasoncreditapprovalData",
            }
        }, {
            $unwind: {
                path: "$reasoncreditapprovalData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $project: {
                sale_booking_date: 1,
                campaign_amount: 1,
                description: 1,
                credit_approval_status: 1,
                reason_credit_approval: 1,
                reason_credit_approval_name: "$reasoncreditapprovalData.reason",
                reason_credit_approval_own_reason: 1,
                balance_payment_ondate: 1,
                payment_credit_status: 1,
                booking_status: 1,
                sale_booking_id: 1,
                customer_id: 1,
                customer_name: "$customermastsData.customer_name",
                created_by: 1,
                created_by_name: "$createdUserData.user_name",
                createdAt: 1,
                updatedAt: 1,
                salesbookingpaymentsData: "$salesbookingpaymentsData"
            }
        }, {
            $group: {
                _id: "$sale_booking_id",
                sale_booking_date: { $first: "$sale_booking_date" },
                campaign_amount: { $first: "$campaign_amount" },
                description: { $first: "$description" },
                credit_approval_status: { $first: "$credit_approval_status" },
                reason_credit_approval: { $first: "$reason_credit_approval" },
                reason_credit_approval_name: { $first: "$reason_credit_approval_name" },
                reason_credit_approval_own_reason: { $first: "$reason_credit_approval_own_reason" },
                balance_payment_ondate: { $first: "$balance_payment_ondate" },
                payment_credit_status: { $first: "$payment_credit_status" },
                booking_status: { $first: "$booking_status" },
                sale_booking_id: { $first: "$sale_booking_id" },
                customer_id: { $first: "$customer_id" },
                customer_name: { $first: "$customer_name" },
                created_by: { $first: "$created_by" },
                created_by_name: { $first: "$created_by_name" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                paid_amount: {
                    $sum: {
                        $cond: [{
                            $eq: ["$salesbookingpaymentsData.payment_approval_status", "approved"]
                        }, "$salesbookingpaymentsData.payment_amount", 0]
                    }
                }
            }
        }]);

        //if data not found
        if (!SalesBookingData) {
            return response.returnFalse(200, req, res, "No Reord Found...", []);
        }
        //success response send
        return response.returnTrue(200, req, res, "Credit approval Sales Booking Status data fatched", SalesBookingData);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

/**
 * Api is to update credit approval status change in sales booking data in DB collection.
 */
exports.editCreditApprovalStatusChange = async (req, res) => {
    try {
        //get sale booking id
        let saleBookingId = req.params?.id;

        //if not found then error return
        if (!saleBookingId) {
            return response.returnFalse(200, req, res, "Sale Booking Id is required...", []);
        }

        //status change in sale booking collection.
        await salesBooking.updateOne({
            sale_booking_id: Number(saleBookingId),
            credit_approval_status: "pending"
        }, {
            credit_approval_status: req.body.status,
            credit_approval_by: parseInt(req.body.approved_by),
        });

        //success response send
        return response.returnTrue(200, req, res, "Sales Booking Credit Approval Status update Successfully");
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};
