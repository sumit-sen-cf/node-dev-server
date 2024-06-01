const express = require("express");
const router = express.Router();
const recordServiceController = require("../../controllers/Sales/recordServiceController");

/**
 * record service routes
 */
router.post("/sales/record_service", recordServiceController.createRecordServiceMaster);
router.put("/sales/record_service/:id", recordServiceController.updateRecordServiceMaster);
router.get("/sales/record_service/:id", recordServiceController.getRecordServiceMasterDetail);
router.get("/sales/record_service", recordServiceController.getRecordServiceMasterList);
router.delete("/sales/record_service/:id", recordServiceController.deleteRecordServiceMaster);

module.exports = router; 