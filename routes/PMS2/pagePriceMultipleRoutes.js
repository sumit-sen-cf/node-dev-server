const express = require("express");
const {
    addPagePriceMultiple,
    updateSinglePagePriceMultipleDetails,
    getAllPagePriceMultipleDetails,
    getSinglePagePriceMultipleDetails,
    deletePagePriceMultipleDetails, getPagePriceMultipleDetailsBasedOnPageId
} = require("../../controllers/PMS2/pagePriceMultipleController");
const { addPagePriceMultipleValidation, updatePagePriceMultipleValidation } = require("../../helper/validation");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();

router.post("/pagePriceMultiple", verifyToken, addPagePriceMultipleValidation, addPagePriceMultiple);
router.put("/pagePriceMultiple/:id", verifyToken, updatePagePriceMultipleValidation, updateSinglePagePriceMultipleDetails);
router.get("/pagePriceMultiple", verifyToken, getAllPagePriceMultipleDetails);
router.get("/pagePriceMultiple/:id", verifyToken, getSinglePagePriceMultipleDetails);
router.get("/pagePriceMultipleByPageId/:id", verifyToken, getPagePriceMultipleDetailsBasedOnPageId);
router.delete("/pagePriceMultiple/:id", verifyToken, deletePagePriceMultipleDetails);

module.exports = router;
