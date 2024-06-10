const express = require("express");
const companyDetailsController = require("../../controllers/PMS2/companyDetailsController")
const router = express.Router();

router.post("/company_name", companyDetailsController.createCompanyDetails);
router.get("/company_name/:id", companyDetailsController.getSingleCompanyDetails);
router.get("/company_name", companyDetailsController.getCompanyDetailsList);
router.put("/company_name/:id", companyDetailsController.updateCompanyDetails);
router.delete("/company_name/:id", companyDetailsController.deleteCompanyDetails);

module.exports = router;