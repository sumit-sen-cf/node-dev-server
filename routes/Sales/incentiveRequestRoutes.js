const express = require("express");
const router = express.Router();
const incentiveRequestController = require("../../controllers/Sales/incentiveRequestController");
const { verifyToken } = require("../../middleware/auth");

/**
 * incentive request routes
 */
router.post("/sales/incentive_request", verifyToken, incentiveRequestController.createIncentiveRequest);
router.put("/sales/incentive_request_admin_update/:id", verifyToken, incentiveRequestController.updateIncentiveRequestByAdmin);
router.get("/sales/incentive_request_list_for_admin/", verifyToken, incentiveRequestController.getIncentiveRequestListForAdmin);

module.exports = router; 