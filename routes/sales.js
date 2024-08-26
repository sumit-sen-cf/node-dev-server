const express = require("express");
const router = express.Router();
const SMS = require("../controllers/SMS/sales");
const autoIncentiveCalculation = require("../controllers/SMS/autoIncentiveCalculationController");
const salesIncentiveSettelmentGst = require("../controllers/SMS/salesIncentiveSettelmentGstController");
const salesIncentiveSettelmentNonGst = require("../controllers/SMS/salesIncentiveSettelmentNonGstController");
const salesIncentiveSettelmentNonGstSb = require("../controllers/SMS/salesIncentiveSettledNonGstSbController");

router.get("/sales", (req, res) => {
    res.send({ message: "Welcome to Sales module." });
});

/**
 * sales booking credit approval status Api's
 */
router.get("/sales/credit_approval_status_for_sales_booking_list", SMS.getAllStatusForCreditApprovalSalesBookingList);
router.put("/sales/credit_approval_status_status_change/:id", SMS.editCreditApprovalStatusChange);



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

module.exports = router; 