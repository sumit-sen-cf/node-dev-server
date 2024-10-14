const express = require("express");
const router = express.Router();
const incentiveSharingServicesController = require("../../controllers/Sales/incentiveSharingServicesController");
const { verifyToken } = require("../../middleware/auth");

/**
 * sales payment mode routes
 */
router.post("/sales/incentive_sharing", verifyToken, incentiveSharingServicesController.createIncentiveSharing);
router.get("/sales/incentive_sharing/:account_id", verifyToken, incentiveSharingServicesController.getIncentiveSharingDetails);
router.delete("/sales/incentive_sharing/:account_id", verifyToken, incentiveSharingServicesController.deleteIncentiveSharing);

module.exports = router; 