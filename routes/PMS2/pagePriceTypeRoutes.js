const express = require("express");
const {
    addPagePriceType,
    updateSinglePagePriceTypeDetails,
    getAllPagePriceTypeDetails,
    getSinglePagePriceTypeDetails,
    deletePagePriceTypeDetails,
    getAllPriceTypeDetailsBasedOnPlateform,
} = require("../../controllers/PMS2/pagePriceTypeController");
const {
    addPagePriceTypeValidation,
    updatePagePriceTypeValidation,
} = require("../../helper/validation");
const router = express.Router();

router.post("/pagePriceType", addPagePriceTypeValidation, addPagePriceType);
router.put("/pagePriceType/:id", updatePagePriceTypeValidation, updateSinglePagePriceTypeDetails);
router.get("/pagePriceType", getAllPagePriceTypeDetails);
router.get("/pagePriceType/:id", getSinglePagePriceTypeDetails);
router.get("/pagePriceTypesForPlatformId/:id", getAllPriceTypeDetailsBasedOnPlateform);
router.delete("/pagePriceType/:id", deletePagePriceTypeDetails);

module.exports = router;
