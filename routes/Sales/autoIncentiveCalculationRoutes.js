const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth");
const autoIncentiveCalculationController = require("../../controllers/Sales/autoIncentiveCalculationController");

/**
 * sales badges request routes
 */
router.post("/sales/auto_incentive_calculation", verifyToken, autoIncentiveCalculationController.createAutoIncentiveCalculation);
router.get("/sales/auto_incentive_calculation/:id", verifyToken, autoIncentiveCalculationController.getAutoIncentiveCalculationDetails);
router.put("/sales/auto_incentive_calculation/:id", verifyToken, autoIncentiveCalculationController.updateAutoIncentiveCalculation);
router.get("/sales/auto_incentive_calculation", verifyToken, autoIncentiveCalculationController.getAutoIncentiveCalculationList);
router.delete("/sales/auto_incentive_calculation/:id", verifyToken, autoIncentiveCalculationController.deleteAutoIncentiveCalculation);
router.get("/sales/auto_incentive_calculation_executive/:id", verifyToken, autoIncentiveCalculationController.autoIncentiveCalculationData);


module.exports = router;