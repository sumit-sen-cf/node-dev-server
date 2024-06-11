const express = require("express");
const {
    addPagePriceType,
    updateSinglePagePriceTypeDetails,
    getAllPagePriceTypeDetails,
    getSinglePagePriceTypeDetails,
    deletePagePriceTypeDetails,
    getAllPriceTypeDetailsBasedOnPlateform,
} = require("../../controllers/PMS2/pagePriceTypeController");
const { addPagePriceTypeValidation, updatePagePriceTypeValidation } = require("../../helper/validation");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();

router.post("/pagePriceType", verifyToken, addPagePriceTypeValidation, addPagePriceType);
router.put("/pagePriceType/:id", verifyToken, updatePagePriceTypeValidation, updateSinglePagePriceTypeDetails);
router.get("/pagePriceType", verifyToken, getAllPagePriceTypeDetails);
router.get("/pagePriceType/:id", verifyToken, getSinglePagePriceTypeDetails);
router.get("/pagePriceTypesForPlatformId/:id", verifyToken, getAllPriceTypeDetailsBasedOnPlateform);
router.delete("/pagePriceType/:id", verifyToken, deletePagePriceTypeDetails);

module.exports = router;
