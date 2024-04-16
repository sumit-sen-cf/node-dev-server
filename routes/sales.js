const express = require("express");
const router = express.Router();
const SMS = require("../controllers/SMS/sales");
const paymentDetailsController = require("../controllers/SMS/paymentDetailsController");
const salesBookingPayment = require("../controllers/SMS/salesBookingPaymentController");
const salesInvoiceParticular = require("../controllers/SMS/salesInvoiceParticularController");
const salesInvoiceType = require("../controllers/SMS/salesInvoiceTypeController");
const salesBookingInvoiceRequest = require("../controllers/SMS/salesBookingInvoiceRequestController");
const reasonCreditApproval = require("../controllers/SMS/reasonCreditApprovalController");
const salesBookingRefund = require("../controllers/SMS/salesBookingRefundController");
const salesServiceMaster = require("../controllers/SMS/salesServiceMasterController");
const incentivePlan = require("../controllers/SMS/incentivePlanController");
const recordServiceMaster = require("../controllers/SMS/recordServiceMasterController");
const recordServicePages = require("../controllers/SMS/recordServicePageController");
const salesBrand = require("../controllers/SMS/salesBrandController");
const salesIndustry = require("../controllers/SMS/salesIndustryController");
const salesBadgesMaster = require("../controllers/SMS/salesBadgesMasterController");
const financialYearSetup = require("../controllers/SMS/financialYearSetupController");
const salesRoleBadgeAssignedRate = require("../controllers/SMS/salesRoleBadgeAssignedRateController");
const salesPaymentMode = require("../controllers/SMS/salesPaymentModeController");
const autoIncentiveCalculation = require("../controllers/SMS/autoIncentiveCalculationController");
const salesIncentiveSettelmentGst = require("../controllers/SMS/salesIncentiveSettelmentGstController");
const salesIncentiveSettelmentNonGst = require("../controllers/SMS/salesIncentiveSettelmentNonGstController");

router.get("/", (req, res) => {
    res.send({ message: "Welcome to Sales module." });
});

/**
 * sales booking routes
 */
router.post("/add_sales_booking", SMS.addSalesBooking);
router.put("/edit_sales_booking/:id", SMS.editSalesBooking);
router.get("/get_all_sales_booking", SMS.getAllSalesBooking);
router.get("/get_single_sales_booking/:id", SMS.getSingleSalesBooking);
router.delete("/delete_sales_booking/:id", SMS.deleteSalesBooking);

/**
 * sales booking status routes
 */
router.post("/add_sales_booking_status", SMS.addSalesBookingStatus);


/**
 * payment details routes
 */
router.post("/add_payment_details", paymentDetailsController.createPaymentDetails);
router.get("/get_payment_details/:id", paymentDetailsController.getPaymentDetails);
router.put("/update_payment_details/:id", paymentDetailsController.updatePaymentDetails);
router.get("/getlist_payment_details", paymentDetailsController.getPaymentDetailList);
router.delete("/delete_payment_details/:id", paymentDetailsController.deletePaymentDetails);


/**
 * sales booking payment details routes
 */
router.post("/add_sales_booking_payment", salesBookingPayment.createSalesBookingPayment);
router.get("/get_sales_booking_payment/:id", salesBookingPayment.getSalesBookingPaymentDetail);
router.put("/update_sales_booking_payment/:id", salesBookingPayment.updateSalesBookingPaymentDeatil);
router.get("/getlist_sales_booking_payment", salesBookingPayment.salesBookingPaymentDetailsList);
router.delete("/delete_sales_booking_payment_details/:id", salesBookingPayment.deleteSalesBookingPaymentDetails);

/**
 * sales invoice particular routes
 */
router.post("/add_sales_invoice_particular", salesInvoiceParticular.createSalesInvoiceParticular);
router.get("/get_sales_invoice_particular/:id", salesInvoiceParticular.getSalesInvoiceParticular);
router.put("/update_sales_invoice_particular/:id", salesInvoiceParticular.updateSalesInvoiceParticular);
router.get("/getlist_sales_invoice_particular", salesInvoiceParticular.getSalesInvoiceParticularList);
router.delete("/delete_sales_invoice_particular/:id", salesInvoiceParticular.deleteSalesInvoiceParticular);

/**
 * sales invoice type routes
 */
router.post("/add_sales_invoice_type", salesInvoiceType.createSalesInvoiceType);
router.get("/get_sales_invoice_type/:id", salesInvoiceType.getSalesInvoiceType);
router.put("/update_sales_invoice_type/:id", salesInvoiceType.updateSalesInvoiceType);
router.get("/getlist_sales_invoice_type", salesInvoiceType.getSalesInvoiceTypeList);
router.delete("/delete_sales_invoice_type/:id", salesInvoiceType.deleteSalesInvoiceType);

/**
 * sales booking invoice request routes
 */
router.post("/add_sales_booking_invoice_request", salesBookingInvoiceRequest.createSalesBookingInvoiceRequest);
router.get("/get_sales_booking_invoice_request/:id", salesBookingInvoiceRequest.getSalesBookingInvoiceRequest);
router.put("/update_sales_booking_invoice_request/:id", salesBookingInvoiceRequest.updateSalesBookingInvoiceRequest);
router.get("/getlist_sales_booking_invoice_request", salesBookingInvoiceRequest.salesBookingInvoiceRequestList);
router.delete("/delete_sales_booking_invoice_request/:id", salesBookingInvoiceRequest.deleteSalesBookingInvoiceRequest);

/**
 * reason credit approval request routes
 */
router.post("/add_reason_credit_approval", reasonCreditApproval.createReasonCreaditApproval);
router.get("/get_reason_credit_approval/:id", reasonCreditApproval.getReasonCreditApprovalDetail);
router.put("/update_reason_credit_approval/:id", reasonCreditApproval.updateReasonCreditApproval);
router.get("/getlist_reason_credit_approval", reasonCreditApproval.getReasonCreditApprovalList);
router.delete("/delete_reason_credit_approval/:id", reasonCreditApproval.deleteReasonCreditApproval);


/**
 * sales booking refund request routes
 */
router.post("/add_sale_booking_refund", salesBookingRefund.createSalesBookingRefund);
router.get("/get_sale_booking_refund/:id", salesBookingRefund.getSalesBookingRefundDetail);
router.put("/update_sale_booking_refund/:id", salesBookingRefund.updateSalesBookingRefund);
router.get("/getlist_sale_booking_refund", salesBookingRefund.salesBookingRefundList);
router.delete("/delete_sale_booking_refund/:id", salesBookingRefund.deleteSalesBookingRefund);

/**
 * sales service master request routes
 */
router.post("/add_sale_service_master", salesServiceMaster.createSalesServiceMaster);
router.get("/get_sale_service_master/:id", salesServiceMaster.getSalesServiceMasterDetails);
router.put("/update_sale_service_master/:id", salesServiceMaster.updateSalesServiceMasterDetails);
router.get("/getlist_sale_service_master", salesServiceMaster.getSalesServiceMasterList);
router.delete("/delete_sale_service_master/:id", salesServiceMaster.deleteSalesServiceMaster);

/**
 * incentive plan request routes
 */
router.post("/add_incentive_plan", incentivePlan.createIncentivePlan);
router.get("/get_incentive_plan/:id", incentivePlan.getIncentivePlanDetails);
router.put("/update_incentive_plan/:id", incentivePlan.updateIncentivePlan);
router.get("/getlist_incentive_plan", incentivePlan.getIncentivePlanList);
router.delete("/delete_incentive_plan/:id", incentivePlan.deleteIncentivePlan);

/**
 * record service master request routes
 */
router.post("/add_record_service_master", recordServiceMaster.createRecordServiceMaster);
router.get("/get_record_service_master/:id", recordServiceMaster.getRecordServiceMasterDetail);
router.put("/update_record_service_master/:id", recordServiceMaster.updateRecordServiceMaster);
router.get("/get_record_service_master", recordServiceMaster.getRecordServiceMasterList);
router.delete("/delete_record_service_master/:id", recordServiceMaster.deleteRecordServiceMaster);

/**
 * record service pages request routes
 */
router.post("/add_record_service_pages", recordServicePages.createRecordServicePage);
router.get("/get_record_service_pages/:id", recordServicePages.getRecordServiceMasterDetail);
router.put("/update_record_service_pages/:id", recordServicePages.updateRecordServicePage);
router.get("/getlist_record_service_pages", recordServicePages.getRecordServicePageList);
router.delete("/delete_record_service_pages/:id", recordServicePages.deleteRecordServicePage);

/**
 * sales brand request routes
 */
router.post("/add_sales_brand", salesBrand.createSalesBrand);
router.get("/get_sales_brand/:id", salesBrand.getSalesBrand);
router.put("/update_sales_brand/:id", salesBrand.updateSalesBrand);
router.get("/getlist_sales_brand", salesBrand.getSalesBrandList);
router.delete("/delete_sales_brand/:id", salesBrand.deleteSalesBrand);

/**
 * sales industry request routes
 */
router.post("/add_sales_industry", salesIndustry.createSalesIndustry);
router.get("/get_sales_industry/:id", salesIndustry.getSalesIndustry);
router.put("/update_sales_industry/:id", salesIndustry.updateSalesIndustry);
router.get("/getlist_sales_industry", salesIndustry.getSalesIndustryList);
router.delete("/delete_sales_industry/:id", salesIndustry.deleteSalesIndustry);

/**
 * sales badges request routes
 */
router.post("/add_sales_badges", salesBadgesMaster.createSalesBadgesMaster);
router.get("/get_sales_badges/:id", salesBadgesMaster.getSalesBadgesMaster);
router.put("/update_sales_badges/:id", salesBadgesMaster.updateSalesBadgesMaster);
router.get("/getlist_sales_badges", salesBadgesMaster.getSalesBadgesMasterList);
router.delete("/delete_sales_badges/:id", salesBadgesMaster.deleteSalesBadgesMaster);

/**
 * financial yaer setup request routes
 */
router.post("/add_financial_year_setup", financialYearSetup.createFinancialYearSetup);
router.get("/get_financial_year_setup/:id", financialYearSetup.getFinancialYearSetupDetails);
router.put("/update_financial_year_setup/:id", financialYearSetup.updateFinancialYearSetup);
router.get("/getlist_financial_year_setup", financialYearSetup.getFinancialYearSetupList);

/**
 * sales role badges assigned rate request routes
 */
router.post("/add_sale_role_badges_assigned_rate", salesRoleBadgeAssignedRate.createSalesRoleBadgeAssignedRate);
router.get("/get_sale_role_badges_assigned_rate/:id", salesRoleBadgeAssignedRate.getSalesRoleBadgeAssigned);
router.put("/update_sale_role_badges_assigned_rate/:id", salesRoleBadgeAssignedRate.updateSalesRoleBadgeAssignedRate);
router.get("/getlist_sale_role_badges_assigned_rate", salesRoleBadgeAssignedRate.getSalesRoleBadgeAssignedRateList);
router.delete("/delete_sale_role_badges_assigned_rate/:id", salesRoleBadgeAssignedRate.deleteSalesRoleBadgeAssigned);

/**
 * sales payment mode rate request routes
 */
router.post("/add_sale_payment_mode", salesPaymentMode.createSalesPaymentmode);
router.get("/get_sale_payment_mode/:id", salesPaymentMode.getSalesPaymentMode);
router.put("/update_sale_payment_mode/:id", salesPaymentMode.updateSalesPaymentMode);
router.get("/getlist_sale_payment_mode", salesPaymentMode.getSalesPaymentModeList);
router.delete("/delete_sale_payment_mode/:id", salesPaymentMode.deleteSalesPaymentMode);

/**
 * auto incentive calculation request routes
 */
router.post("/add_auto_incentive_calculation", autoIncentiveCalculation.createAutoIncentiveCalculation);
router.get("/get_auto_incentive_calculation/:id", autoIncentiveCalculation.getAutoIncentiveCalculationDetails);
router.put("/update_auto_incentive_calculation/:id", autoIncentiveCalculation.updateAutoIncentiveCalculation);
router.get("/getlist_auto_incentive_calculation", autoIncentiveCalculation.getAutoIncentiveCalculationList);
router.delete("/delete_auto_incentive_calculation/:id", autoIncentiveCalculation.deleteAutoIncentiveCalculation);

/**
 * sales incentive settelment gst request routes
 */
router.post("/add_sales_incentive_settelment_gst", salesIncentiveSettelmentGst.createSalesIncentiveGst);
router.get("/get_sales_incentive_settelment_gst/:id", salesIncentiveSettelmentGst.getSalesIncentiveSettelmentGst);
router.put("/update_sales_incentive_settelment_gst/:id", salesIncentiveSettelmentGst.updateSalesInsentiveSettelmentGst);
router.get("/getlist_sales_incentive_settelment_gst", salesIncentiveSettelmentGst.getSalesIncentiveSettelmentGstList);
router.delete("/delete_sales_incentive_settelment_gst/:id", salesIncentiveSettelmentGst.deleteSalesInsentiveSettelmentGst);

/**
 * sales incentive settelment non gst request routes
 */
router.post("/add_sales_incentive_settelment_non_gst",salesIncentiveSettelmentNonGst.createSalesIncentiveSettelmentNonGst);
router.get("/get_sales_incentive_settelment_non_gst/:id",salesIncentiveSettelmentNonGst.getSalesIncentiveSettelmentNonGstDetail);
router.put("/update_sales_incentive_settelment_non_gst/:id",salesIncentiveSettelmentNonGst.updateSalesIncentiveNonGst);
router.get("/getlist_sales_incentive_settelment_non_gst",salesIncentiveSettelmentNonGst.getSalesIncentiveSettelmentNonGstList);
router.delete("/delete_sales_incentive_settelment_non_gst",salesIncentiveSettelmentNonGst.deleteSalesIncentiveSettelmentNonGst);


module.exports = router; 