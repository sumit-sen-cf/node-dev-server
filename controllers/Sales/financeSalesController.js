const response = require("../../common/response");
const salesBookingModel = require("../../models/Sales/salesBookingModel");
const { storage, uploadToGCP } = require('../../common/uploadFile.js')
const constant = require("../../common/constant.js");
const salesBookingPayment = require('../../models/Sales/paymentUpdateModel.js')
const { saleBookingStatus } = require("../../helper/status.js");
const phpFinanceModel = require("../../models/phpFinanceModel.js");

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
            $addFields: {
                url: constant.GCP_INVOICE_REQUEST_URL
            },
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
                url: 1,
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

exports.salesBalanceUpdate = async (req, res) => {
    try {
        const updateData = await salesBookingPayment.create(
            // { sale_booking_id: req.body.sale_booking_id },
            {
                payment_ref_no: req.body.paymentRefNo,
                payment_detail_id: req.body.paymentDetails,
                payment_screenshot: req.file?.paymentRefImg,
                payment_approval_status: 'approval',
                payment_type: req.body.paymentType,
                payment_mode: req.body.others,
                paid_amount: req.body.paidAmount,
                payment_date: req.body.paymentDate,
                incentive_adjustment_amount: req.body.adjustmentAmount
            }
        );

        const updateStatus = await salesBookingPayment.updateMany(
            { sale_booking_id: req.body.sale_booking_id },
            { payment_approval_status: 'reject' }
        );

        let saleBookingData = await salesBookingModel.findOne({ sale_booking_id: req.body.sale_booking_id });

        let approvedAmount = saleBookingData.approved_amount;
        let requestedAmount = saleBookingData.requested_amount;

        let updateObj = { approved_amount: approvedAmount, requested_amount: requestedAmount };

        approvedAmount = approvedAmount + parseInt(req.body.paidAmount)
        updateObj["booking_status"] = saleBookingStatus['12'].status;
        updateObj["approved_amount"] = approvedAmount;

        let campaignPercentageAmount = (saleBookingData.campaign_amount * 90) / 100;
        if (approvedAmount >= campaignPercentageAmount) {
            updateObj["incentive_earning_status"] = "earned";
            updateObj["earned_incentive_amount"] = saleBookingData.incentive_amount;
            updateObj["unearned_incentive_amount"] = 0;
        } else {
            updateObj["unearned_incentive_amount"] = saleBookingData.incentive_amount;
        }

        if (saleBookingData.campaign_amount == approvedAmount) {
            updateObj["booking_status"] = saleBookingStatus['05'].status;
        }

        await salesBookingModel.updateOne({
            sale_booking_id: editPaymentUpdatedDetail.sale_booking_id
        }, { $set: updateObj });

        if (!updateData) {
            return response.returnFalse(200, req, res, "No Record Found with given id...", []);
        }
        if (req.file) {
            try {
                const message = await uploadToGCP(req, updateData, 'payment_screenshot');
                res.status(200).send(message);
            } catch (error) {
                return res.status(500).send(error.message);
            }
        }
        return response.returnTrue(200, req, res, 'Record Updated successfully', updateData)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}

exports.getAllphpFinanceDataById = async (req, res) => {
    try {
        const getData = await phpFinanceModel.find({ cust_id: Number(req.params.cust_id) });
        res.status(200).send({ data: getData, message: 'data fetched successfully' })
    } catch (error) {
        res.status(500).send({ error: error.message, sms: "error getting php finance data" })
    }
}

exports.saleBookingsForTDS = async (req, res) => {
    try {
        const SalesBookingTdsData = await salesBookingModel.aggregate([
            // {
            //     $match: {
            //         tds_status: req.body.tds_status,
            //     }
            // }, 
            {
                $lookup: {
                    from: "phppaymentballistmodels",
                    localField: "sale_booking_id",
                    foreignField: "sale_booking_id",
                    as: "accountMasterData",
                }
            }, {
                $unwind: {
                    path: "$accountMasterData",
                    // preserveNullAndEmptyArrays: true,
                }
            }, {
                $project: {
                    sale_booking_id: 1,
                    account_id: 1,
                    cust_name: "$accountMasterData.cust_name",
                    sales_exe_name: "$accountMasterData.username",
                    sale_booking_date: 1,
                    campaign_amount: 1,
                    base_amount: 1,
                    tds_verified_amount: 1,
                    gst_amount: 1,
                    net_amount: { $add: ["$base_amount", "$gst_amount"] },
                    paid_amount: "$accountMasterData.paid_amount",
                    balance_refund_amount: "$accountMasterData.balance_refund_amount",
                    booking_created_date: "$accountMasterData.booking_created_date",
                    tds_status: 1,
                    created_by: 1
                }
            }]);

        if (!SalesBookingTdsData) {
            return response.returnFalse(200, req, res, "No Record Found...", []);
        }

        return response.returnTrue(200, req, res, "Sales Booking data fatched", SalesBookingTdsData);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}

exports.verifyTDS = async (req, res) => {
    try {
        const updateData = await salesBookingPayment.findOneAndUpdate(
            { sale_booking_id: req.body.sale_booking_id },
            {
                tds_verified_amount: req.body.tds_verified_amount,
                tds_verified_remark: tds_verified_remark
            }
        );

        if (!updateData) {
            return response.returnFalse(200, req, res, "No Record Found with given id...", []);
        }
        return response.returnTrue(200, req, res, 'Record Updated successfully', updateData)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}