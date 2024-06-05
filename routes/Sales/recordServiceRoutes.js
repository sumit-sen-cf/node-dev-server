const express = require("express");
const router = express.Router();
const recordServiceController = require("../../controllers/Sales/recordServiceController");
const { verifyToken } = require("../../middleware/auth");

/**
 * record service routes
 */
router.post("/sales/record_service", verifyToken, recordServiceController.createRecordServiceMaster);
router.put("/sales/record_service/:id", verifyToken, recordServiceController.updateRecordServiceMaster);
router.get("/sales/record_service/:id", verifyToken, recordServiceController.getRecordServiceMasterDetail);
router.get("/sales/record_service", verifyToken, recordServiceController.getRecordServiceMasterList);
router.delete("/sales/record_service/:id", verifyToken, recordServiceController.deleteRecordServiceMaster);
router.put("/sales/update_multiple_record_service/:id", verifyToken, recordServiceController.updateMultipleRecordService);

module.exports = router; 