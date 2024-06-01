const express = require("express");
const router = express.Router();
const recordServicePageController = require("../../controllers/Sales/recordServicePageController");
const { verifyToken } = require("../../middleware/auth");

/**
 * record service pages routes
 */
router.post("/sales/record_service_pages", verifyToken, recordServicePageController.createRecordServicePage);
router.put("/sales/record_service_pages/:id", verifyToken, recordServicePageController.updateRecordServicePage);
router.get("/sales/record_service_pages/:id", verifyToken, recordServicePageController.getRecordServiceMasterDetail);
router.get("/sales/record_service_pages", verifyToken, recordServicePageController.getRecordServicePageList);
router.delete("/sales/record_service_pages/:id", verifyToken, recordServicePageController.deleteRecordServicePage);

module.exports = router; 