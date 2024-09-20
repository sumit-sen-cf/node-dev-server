const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth");
const executionController = require("../../controllers/Sales/executionController");
/**
 * sales booking execution routes
 */
router.post("/sales/sales_booking_execution", verifyToken, executionController.createExecution);
router.get("/sales/sales_booking_execution/:id", verifyToken, executionController.getExecutionDetails);
router.put("/sales/sales_booking_execution/:id", verifyToken, executionController.updateExecutionDetial);
router.get("/sales/sales_booking_execution", verifyToken, executionController.getExcutionList);
router.delete("/sales/sales_booking_execution/:id", verifyToken, executionController.deleteExecution);
router.put("/sales/execution_status/:id", verifyToken, executionController.updateStatusExecution);
router.get("/sales/count_data_status_wise", executionController.countTheDataStatusWise);

//execution token to get data 
router.get("/sales/get_execution_token_data/:id", verifyToken, executionController.getExcutionTokenData);

module.exports = router;