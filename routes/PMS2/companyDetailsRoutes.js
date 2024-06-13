const express = require("express");
const companyDetailsController = require("../../controllers/PMS2/companyDetailsController");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();

router.post("/company_name", verifyToken, companyDetailsController.createCompanyDetails);
router.get("/company_name/:id", verifyToken, companyDetailsController.getSingleCompanyDetails);
router.get("/company_name", verifyToken, companyDetailsController.getCompanyDetailsList);
router.put("/company_name/:id", verifyToken, companyDetailsController.updateCompanyDetails);
router.delete("/company_name/:id", verifyToken, companyDetailsController.deleteCompanyDetails);

module.exports = router;