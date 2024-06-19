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
router.get("/sales/auto_incentive_calculation_month_wise/:user_id", verifyToken, autoIncentiveCalculationController.getAutoIncentiveCalculationMonthWise);

//incentive calculation api's
router.get("/sales/incentive_calculation_status_wise_data/:user_id", verifyToken, autoIncentiveCalculationController.getIncentiveCalculationStatusWiseData);


module.exports = router;