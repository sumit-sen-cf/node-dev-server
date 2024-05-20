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
const salesIncentiveSettelmentNonGstSb = require("../controllers/SMS/salesIncentiveSettledNonGstSbController");
const salesBookingExecution = require("../controllers/SMS/salesBookingExecutionController");

router.get("/sales", (req, res) => {
    res.send({ message: "Welcome to Sales module." });
});

/**
 * sales booking routes
 */
router.post("/sales/add_sales_booking", SMS.addSalesBooking);
router.put("/sales/edit_sales_booking/:id", SMS.editSalesBooking);
router.get("/sales/get_all_sales_booking", SMS.getAllSalesBooking);
router.get("/sales/get_single_sales_booking/:id", SMS.getSingleSalesBooking);
router.delete("/sales/delete_sales_booking/:id", SMS.deleteSalesBooking);
router.get("/sales/get_all_new_deleted_data", SMS.getNewSalesBooking);
router.get("/sales/get_all_list_sales_booking/:id", SMS.getSalesBookingPaymentDetail);


/**
 * sales booking status routes
 */
router.post("/sales/add_sales_booking_status", SMS.addSalesBookingStatus);

/**
 * sales booking credit approval status Api's
 */
router.get("/sales/credit_approval_status_for_sales_booking_list", SMS.getAllStatusForCreditApprovalSalesBookingList);
router.put("/sales/credit_approval_status_status_change/:id", SMS.editCreditApprovalStatusChange);


/**
 * payment details routes
 */
router.post("/sales/add_payment_details", paymentDetailsController.createPaymentDetails);
router.get("/sales/get_payment_details/:id", paymentDetailsController.getPaymentDetails);
router.put("/sales/update_payment_details/:id", paymentDetailsController.updatePaymentDetails);
router.get("/sales/getlist_payment_details", paymentDetailsController.getPaymentDetailList);
router.delete("/sales/delete_payment_details/:id", paymentDetailsController.deletePaymentDetails);


/**
 * sales booking payment details routes
 */
router.post("/sales/add_sales_booking_payment", salesBookingPayment.createSalesBookingPayment);
router.get("/sales/get_sales_booking_payment/:id", salesBookingPayment.getSalesBookingPaymentDetail);
router.put("/sales/update_sales_booking_payment/:id", salesBookingPayment.updateSalesBookingPaymentDeatil);
router.get("/sales/getlist_sales_booking_payment", salesBookingPayment.salesBookingPaymentDetailsList);
router.delete("/sales/delete_sales_booking_payment_details/:id", salesBookingPayment.deleteSalesBookingPaymentDetails);
router.get("/sales/getAll_pending_sales_booking_payment_list", salesBookingPayment.salesBookingPaymentPendingDetailsList);
router.get("/sales/getAll_rejected_sales_booking_payment_list", salesBookingPayment.salesBookingPaymentRejectedDetailsList);

/**
 * sales invoice particular routes
 */
router.post("/sales/add_sales_invoice_particular", salesInvoiceParticular.createSalesInvoiceParticular);
router.get("/sales/get_sales_invoice_particular/:id", salesInvoiceParticular.getSalesInvoiceParticular);
router.put("/sales/update_sales_invoice_particular/:id", salesInvoiceParticular.updateSalesInvoiceParticular);
router.get("/sales/getlist_sales_invoice_particular", salesInvoiceParticular.getSalesInvoiceParticularList);
router.delete("/sales/delete_sales_invoice_particular/:id", salesInvoiceParticular.deleteSalesInvoiceParticular);

/**
 * sales invoice type routes
 */
router.post("/sales/add_sales_invoice_type", salesInvoiceType.createSalesInvoiceType);
router.get("/sales/get_sales_invoice_type/:id", salesInvoiceType.getSalesInvoiceType);
router.put("/sales/update_sales_invoice_type/:id", salesInvoiceType.updateSalesInvoiceType);
router.get("/sales/getlist_sales_invoice_type", salesInvoiceType.getSalesInvoiceTypeList);
router.delete("/sales/delete_sales_invoice_type/:id", salesInvoiceType.deleteSalesInvoiceType);

/**
 * sales booking invoice request routes
 */
router.post("/sales/add_sales_booking_invoice_request", salesBookingInvoiceRequest.createSalesBookingInvoiceRequest);
router.get("/sales/get_sales_booking_invoice_request/:id", salesBookingInvoiceRequest.getSalesBookingInvoiceRequest);
router.put("/sales/update_sales_booking_invoice_request/:id", salesBookingInvoiceRequest.updateSalesBookingInvoiceRequest);
router.get("/sales/getlist_sales_booking_invoice_request", salesBookingInvoiceRequest.salesBookingInvoiceRequestList);
router.delete("/sales/delete_sales_booking_invoice_request/:id", salesBookingInvoiceRequest.deleteSalesBookingInvoiceRequest);

/**
 * reason credit approval request routes
 */
router.post("/sales/add_reason_credit_approval", reasonCreditApproval.createReasonCreaditApproval);
router.get("/sales/get_reason_credit_approval/:id", reasonCreditApproval.getReasonCreditApprovalDetail);
router.put("/sales/update_reason_credit_approval/:id", reasonCreditApproval.updateReasonCreditApproval);
router.get("/sales/getlist_reason_credit_approval", reasonCreditApproval.getReasonCreditApprovalList);
router.delete("/sales/delete_reason_credit_approval/:id", reasonCreditApproval.deleteReasonCreditApproval);


/**
 * sales booking refund request routes
 */
router.post("/sales/add_sale_booking_refund", salesBookingRefund.createSalesBookingRefund);
router.get("/sales/get_sale_booking_refund/:id", salesBookingRefund.getSalesBookingRefundDetail);
router.put("/sales/update_sale_booking_refund/:id", salesBookingRefund.updateSalesBookingRefund);
router.get("/sales/getlist_sale_booking_refund", salesBookingRefund.salesBookingRefundList);
router.delete("/sales/delete_sale_booking_refund/:id", salesBookingRefund.deleteSalesBookingRefund);

/**
 * sales service master request routes
 */
router.post("/sales/add_sale_service_master", salesServiceMaster.createSalesServiceMaster);
router.get("/sales/get_sale_service_master/:id", salesServiceMaster.getSalesServiceMasterDetails);
router.put("/sales/update_sale_service_master/:id", salesServiceMaster.updateSalesServiceMasterDetails);
router.get("/sales/getlist_sale_service_master", salesServiceMaster.getSalesServiceMasterList);
router.delete("/sales/delete_sale_service_master/:id", salesServiceMaster.deleteSalesServiceMaster);

/**
 * incentive plan request routes
 */
router.post("/sales/add_incentive_plan", incentivePlan.createIncentivePlan);
router.get("/sales/get_incentive_plan/:id", incentivePlan.getIncentivePlanDetails);
router.put("/sales/update_incentive_plan/:id", incentivePlan.updateIncentivePlan);
router.get("/sales/getlist_incentive_plan", incentivePlan.getIncentivePlanList);
router.delete("/sales/delete_incentive_plan/:id", incentivePlan.deleteIncentivePlan);

/**
 * record service master request routes
 */
router.post("/sales/add_record_service_master", recordServiceMaster.createRecordServiceMaster);
router.get("/sales/get_record_service_master/:id", recordServiceMaster.getRecordServiceMasterDetail);
router.put("/sales/update_record_service_master/:id", recordServiceMaster.updateRecordServiceMaster);
router.get("/sales/get_record_service_master", recordServiceMaster.getRecordServiceMasterList);
router.delete("/sales/delete_record_service_master/:id", recordServiceMaster.deleteRecordServiceMaster);

/**
 * record service pages request routes
 */
router.post("/sales/add_record_service_pages", recordServicePages.createRecordServicePage);
router.get("/sales/get_record_service_pages/:id", recordServicePages.getRecordServiceMasterDetail);
router.put("/sales/update_record_service_pages/:id", recordServicePages.updateRecordServicePage);
router.get("/sales/getlist_record_service_pages", recordServicePages.getRecordServicePageList);
router.delete("/sales/delete_record_service_pages/:id", recordServicePages.deleteRecordServicePage);

/**
 * sales brand request routes
 */
router.post("/sales/add_sales_brand", salesBrand.createSalesBrand);
router.get("/sales/get_sales_brand/:id", salesBrand.getSalesBrand);
router.put("/sales/update_sales_brand/:id", salesBrand.updateSalesBrand);
router.get("/sales/getlist_sales_brand", salesBrand.getSalesBrandList);
router.delete("/sales/delete_sales_brand/:id", salesBrand.deleteSalesBrand);

/**
 * sales industry request routes
 */
router.post("/sales/add_sales_industry", salesIndustry.createSalesIndustry);
router.get("/sales/get_sales_industry/:id", salesIndustry.getSalesIndustry);
router.put("/sales/update_sales_industry/:id", salesIndustry.updateSalesIndustry);
router.get("/sales/getlist_sales_industry", salesIndustry.getSalesIndustryList);
router.delete("/sales/delete_sales_industry/:id", salesIndustry.deleteSalesIndustry);

/**
 * sales badges request routes
 */
router.post("/sales/add_sales_badges", salesBadgesMaster.createSalesBadgesMaster);
router.get("/sales/get_sales_badges/:id", salesBadgesMaster.getSalesBadgesMaster);
router.put("/sales/update_sales_badges/:id", salesBadgesMaster.updateSalesBadgesMaster);
router.get("/sales/getlist_sales_badges", salesBadgesMaster.getSalesBadgesMasterList);
router.delete("/sales/delete_sales_badges/:id", salesBadgesMaster.deleteSalesBadgesMaster);

/**
 * financial yaer setup request routes
 */
router.post("/sales/add_financial_year_setup", financialYearSetup.createFinancialYearSetup);
router.get("/sales/get_financial_year_setup/:id", financialYearSetup.getFinancialYearSetupDetails);
router.put("/sales/update_financial_year_setup/:id", financialYearSetup.updateFinancialYearSetup);
router.get("/sales/getlist_financial_year_setup", financialYearSetup.getFinancialYearSetupList);
router.delete("/sales/delete_financial_year_setup/:id", financialYearSetup.deleteFinancialYearSetup);

/**
 * sales role badges assigned rate request routes
 */
router.post("/sales/add_sale_role_badges_assigned_rate", salesRoleBadgeAssignedRate.createSalesRoleBadgeAssignedRate);
router.get("/sales/get_sale_role_badges_assigned_rate/:id", salesRoleBadgeAssignedRate.getSalesRoleBadgeAssigned);
router.put("/sales/update_sale_role_badges_assigned_rate/:id", salesRoleBadgeAssignedRate.updateSalesRoleBadgeAssignedRate);
router.get("/sales/getlist_sale_role_badges_assigned_rate", salesRoleBadgeAssignedRate.getSalesRoleBadgeAssignedRateList);
router.delete("/sales/delete_sale_role_badges_assigned_rate/:id", salesRoleBadgeAssignedRate.deleteSalesRoleBadgeAssigned);

/**
 * sales payment mode rate request routes
 */
router.post("/sales/add_sale_payment_mode", salesPaymentMode.createSalesPaymentmode);
router.get("/sales/get_sale_payment_mode/:id", salesPaymentMode.getSalesPaymentMode);
router.put("/sales/update_sale_payment_mode/:id", salesPaymentMode.updateSalesPaymentMode);
router.get("/sales/getlist_sale_payment_mode", salesPaymentMode.getSalesPaymentModeList);
router.delete("/sales/delete_sale_payment_mode/:id", salesPaymentMode.deleteSalesPaymentMode);

/**
 * auto incentive calculation request routes
 */
router.post("/sales/add_auto_incentive_calculation", autoIncentiveCalculation.createAutoIncentiveCalculation);
router.get("/sales/get_auto_incentive_calculation/:id", autoIncentiveCalculation.getAutoIncentiveCalculationDetails);
router.put("/sales/update_auto_incentive_calculation/:id", autoIncentiveCalculation.updateAutoIncentiveCalculation);
router.get("/sales/getlist_auto_incentive_calculation", autoIncentiveCalculation.getAutoIncentiveCalculationList);
router.delete("/sales/delete_auto_incentive_calculation/:id", autoIncentiveCalculation.deleteAutoIncentiveCalculation);

/**
 * sales incentive settelment gst request routes
 */
router.post("/sales/add_sales_incentive_settelment_gst", salesIncentiveSettelmentGst.createSalesIncentiveGst);
router.get("/sales/get_sales_incentive_settelment_gst/:id", salesIncentiveSettelmentGst.getSalesIncentiveSettelmentGst);
router.put("/sales/update_sales_incentive_settelment_gst/:id", salesIncentiveSettelmentGst.updateSalesInsentiveSettelmentGst);
router.get("/sales/getlist_sales_incentive_settelment_gst", salesIncentiveSettelmentGst.getSalesIncentiveSettelmentGstList);
router.delete("/sales/delete_sales_incentive_settelment_gst/:id", salesIncentiveSettelmentGst.deleteSalesInsentiveSettelmentGst);

/**
 * sales incentive settelment non gst request routes
 */
router.post("/sales/add_sales_incentive_settelment_non_gst", salesIncentiveSettelmentNonGst.createSalesIncentiveSettelmentNonGst);
router.get("/sales/get_sales_incentive_settelment_non_gst/:id", salesIncentiveSettelmentNonGst.getSalesIncentiveSettelmentNonGstDetail);
router.put("/sales/update_sales_incentive_settelment_non_gst/:id", salesIncentiveSettelmentNonGst.updateSalesIncentiveNonGst);
router.get("/sales/getlist_sales_incentive_settelment_non_gst", salesIncentiveSettelmentNonGst.getSalesIncentiveSettelmentNonGstList);
router.delete("/sales/delete_sales_incentive_settelment_non_gst", salesIncentiveSettelmentNonGst.deleteSalesIncentiveSettelmentNonGst);

/**
 * sales incentive settelment non gst sb request routes
 */
router.post("/sales/add_sales_incentive_settelment_non_gst_sb", salesIncentiveSettelmentNonGstSb.createSalesIncentiveSettledNonGstSb);
router.get("/sales/get_sales_incentive_settelment_non_gst_sb/:id", salesIncentiveSettelmentNonGstSb.getSalesSettledNonGstSbDetails);
router.put("/sales/update_sales_incentive_settelment_non_gst_sb/:id", salesIncentiveSettelmentNonGstSb.updateSalesIncentiveSettelmentNonGstSb);
router.get("/sales/get_list_sales_incentive_settelment_non_gst_sb", salesIncentiveSettelmentNonGstSb.salesIncentiveSettledNonGstSbList);
router.delete("/sales/delete_list_sales_incentive_settelment_non_gst_sb/:id", salesIncentiveSettelmentNonGstSb.deleteSalesIncentiveSetteledNonGstSb);

/**
 * sales booking execution routes
 */
router.post("/sales/add_sales_booking_execution", salesBookingExecution.createSalesBookingExecution);
router.get("/sales/get_sales_booking_execution/:id", salesBookingExecution.getSalesBookingExecutionDetails);
router.put("/sales/update_sales_booking_execution/:id", salesBookingExecution.updateSalesBookingExecution);
router.get("/sales/get_list_sales_booking_execution", salesBookingExecution.getSalesBookingExcutionList);
router.delete("/sales/delete_list_sales_booking_execution/:id", salesBookingExecution.deleteSalesBookingExecution);

module.exports = router; 