const express = require("express");
const {
    addPagePriceMultiple,
    updateSinglePagePriceMultipleDetails,
    getAllPagePriceMultipleDetails,
    getSinglePagePriceMultipleDetails,
    deletePagePriceMultipleDetails,getPagePriceMultipleDetailsBasedOnPageId
} = require("../../controllers/PMS2/pagePriceMultipleController");
const {
    addPayCycleValidation,
    updatePayCycleValidation,
} = require("../../helper/validation");
const router = express.Router();

router.post("/pagePriceMultiple", addPagePriceMultiple);
router.put("/pagePriceMultiple/:id", updateSinglePagePriceMultipleDetails);
router.get("/pagePriceMultiple", getAllPagePriceMultipleDetails);
router.get("/pagePriceMultiple/:id", getSinglePagePriceMultipleDetails);
router.get("/pagePriceMultipleByPageId/:id", getPagePriceMultipleDetailsBasedOnPageId);
router.delete("/pagePriceMultiple/:id", deletePagePriceMultipleDetails);

module.exports = router;
