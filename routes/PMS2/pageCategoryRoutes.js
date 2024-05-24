const express = require("express");
const { createPageCategory, getPageCategoryDetails, getPageCategoryList, updatePageCategory, deletePageCategory, getAllPageCategoryDeleted } = require("../../controllers/PMS2/pageCategoryController");
const { addPageCategoryValidation, updatePageCategoryValidation } = require("../../helper/validation");
const router = express.Router();

router.post("/page_category", addPageCategoryValidation, createPageCategory);
router.get("/page_category/:id", getPageCategoryDetails);
router.get("/page_category", getPageCategoryList);
router.put("/page_category/:id", updatePageCategoryValidation, updatePageCategory);
router.delete("/page_category/:id", deletePageCategory);
router.get("/page_category_deleted", getAllPageCategoryDeleted);

module.exports = router;