const express = require("express");
const router = express.Router();
const salesServiceMasterController = require("../../controllers/Sales/salesServiceMasterController");

/**
 * sales service master routes
 */
router.post("/sales/service_master", salesServiceMasterController.createSalesServiceMaster);
router.put("/sales/service_master/:id", salesServiceMasterController.updateSalesServiceMasterDetails);
router.get("/sales/service_master/:id", salesServiceMasterController.getSalesServiceMasterDetails);
router.get("/sales/service_master", salesServiceMasterController.getSalesServiceMasterList);
router.delete("/sales/service_master/:id", salesServiceMasterController.deleteSalesServiceMaster);

module.exports = router; 