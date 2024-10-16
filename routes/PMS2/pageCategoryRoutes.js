const express = require("express");
const { createPageCategory, getPageCategoryDetails, getPageCategoryList, updatePageCategory, deletePageCategory, getAllPageCategoryDeleted, mergePageCategory } = require("../../controllers/PMS2/pageCategoryController");
const { addPageCategoryValidation, updatePageCategoryValidation } = require("../../helper/validation");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();

router.post("/page_category", verifyToken, addPageCategoryValidation, createPageCategory);
router.get("/page_category/:id", verifyToken, getPageCategoryDetails);
router.get("/page_category", verifyToken, getPageCategoryList);
router.put("/page_category/:id", verifyToken, updatePageCategoryValidation, updatePageCategory);
router.delete("/page_category/:id", verifyToken, deletePageCategory);
router.get("/page_category_deleted", verifyToken, getAllPageCategoryDeleted);
router.put('/merge_page_category', mergePageCategory)

module.exports = router;