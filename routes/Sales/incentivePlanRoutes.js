const express = require("express");
const router = express.Router();
const incentivePlanController = require("../../controllers/Sales/incentivePlanController");
const { verifyToken } = require("../../middleware/auth");

/**
 * incentive plan request routes
 */
router.post("/sales/incentive_plan", verifyToken, incentivePlanController.createIncentivePlan);
router.get("/sales/incentive_plan/:id", verifyToken, incentivePlanController.getIncentivePlanDetails);
router.put("/sales/incentive_plan/:id", verifyToken, incentivePlanController.updateIncentivePlan);
router.get("/sales/incentive_plan", verifyToken, incentivePlanController.getIncentivePlanList);
router.delete("/sales/incentive_plan/:id", verifyToken, incentivePlanController.deleteIncentivePlan);

module.exports = router; 