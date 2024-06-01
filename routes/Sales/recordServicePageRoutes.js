const express = require("express");
const router = express.Router();
const recordServicePageController = require("../../controllers/Sales/recordServicePageController");

/**
 * record service pages routes
 */
router.post("/sales/record_service_pages", recordServicePageController.createRecordServicePage);
router.put("/sales/record_service_pages/:id", recordServicePageController.updateRecordServicePage);
router.get("/sales/record_service_pages/:id", recordServicePageController.getRecordServiceMasterDetail);
router.get("/sales/record_service_pages", recordServicePageController.getRecordServicePageList);
router.delete("/sales/record_service_pages/:id", recordServicePageController.deleteRecordServicePage);

module.exports = router; 