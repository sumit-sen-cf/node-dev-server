const express = require("express");
const {
    addPagePriceType,
    updateSinglePagePriceTypeDetails,
    getAllPagePriceTypeDetails,
    getSinglePagePriceTypeDetails,
    deletePagePriceTypeDetails,
} = require("../../controllers/PMS2/pagePriceTypeController");
const {
    addPayCycleValidation,
    updatePayCycleValidation,
} = require("../../helper/validation");
const router = express.Router();

router.post("/pagePriceType", addPagePriceType);
router.put("/pagePriceType/:id", updateSinglePagePriceTypeDetails);
router.get("/pagePriceType", getAllPagePriceTypeDetails);
router.get("/pagePriceType/:id", getSinglePagePriceTypeDetails);
router.delete("/pagePriceType/:id", deletePagePriceTypeDetails);

module.exports = router;