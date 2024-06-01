const express = require("express");
const router = express.Router();
const salesServiceMasterController = require("../../controllers/Sales/salesServiceMasterController");
const { verifyToken } = require("../../middleware/auth");

/**
 * sales service master routes
 */
router.post("/sales/service_master", verifyToken, salesServiceMasterController.createSalesServiceMaster);
router.put("/sales/service_master/:id", verifyToken, salesServiceMasterController.updateSalesServiceMaster);
router.get("/sales/service_master/:id", verifyToken, salesServiceMasterController.getServiceMasterDetails);
router.get("/sales/service_master", verifyToken, salesServiceMasterController.getServiceMasterList);
router.delete("/sales/service_master/:id", verifyToken, salesServiceMasterController.deleteServiceMaster);

module.exports = router; 