const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth");
const badgesMasterController = require("../../controllers/Sales/badgesMasterController");

/**
 * sales badges request routes
 */
router.post("/sales/badges_master", verifyToken, badgesMasterController.createBadgesMaster);
router.get("/sales/badges_master/:id", verifyToken, badgesMasterController.getBadgesMasterDetails);
router.put("/sales/badges_master/:id", verifyToken, badgesMasterController.updateBadgesMaster);
router.get("/sales/badges_master", verifyToken, badgesMasterController.getBadgesMasterList);
router.delete("/sales/badges_master/:id", verifyToken, badgesMasterController.deleteBadgesMaster);

router.get("/sales/badges_sales_booking_data", verifyToken, badgesMasterController.totalSaleBookingAmountForBadge);

module.exports = router;