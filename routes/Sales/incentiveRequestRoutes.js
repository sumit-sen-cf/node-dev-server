const express = require("express");
const router = express.Router();
const incentiveRequestController = require("../../controllers/Sales/incentiveRequestController");
const { verifyToken } = require("../../middleware/auth");

/**
 * incentive request routes
 */
router.post("/sales/incentive_request", verifyToken, incentiveRequestController.createIncentiveRequest);
//for admin 
router.put("/sales/incentive_request_admin_update/:id", verifyToken, incentiveRequestController.updateIncentiveRequestByAdmin);
router.get("/sales/incentive_request_list_for_admin/", verifyToken, incentiveRequestController.getIncentiveRequestListForAdmin);

//for finance 
router.put("/sales/incentive_request_release_by_finance/:id", verifyToken, incentiveRequestController.incentiveRequestReleaseByFinance);
router.get("/sales/incentive_request_list_for_finance/", verifyToken, incentiveRequestController.getIncentiveRequestListForFinance);

//incentive calculation user-wise api's for incentive dashboard total count overview
router.get("/sales/incentive_request_user_status_wise/:id", verifyToken, incentiveRequestController.getIncentiveRequestListUserAndStatusWise);

module.exports = router; 