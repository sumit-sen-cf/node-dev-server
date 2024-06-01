const express = require("express");
const router = express.Router();
const salesServiceMasterController = require("../../controllers/Sales/salesServiceMasterController");

/**
 * sales service master routes
 */
router.post("/sales/service_master", salesServiceMasterController.createSalesServiceMaster);
router.put("/sales/service_master/:id", salesServiceMasterController.updateSalesServiceMaster);
router.get("/sales/service_master/:id", salesServiceMasterController.getServiceMasterDetails);
router.get("/sales/service_master", salesServiceMasterController.getServiceMasterList);
router.delete("/sales/service_master/:id", salesServiceMasterController.deleteServiceMaster);

module.exports = router; 