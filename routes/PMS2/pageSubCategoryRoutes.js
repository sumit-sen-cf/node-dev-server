const express = require("express");
const { createPageSubCategory,
    getPageSubCategoryDetails,
    getPageSubCategoryList,
    updatePageSubCategory,
    deletePageSubCategory,
    getAllPageSubCategoryDeleted,
    mergePageSubCategory,
    getAllSubCatWithCat
} = require("../../controllers/PMS2/pageSubCategoryController");
// const { addPageCategoryValidation, updatePageCategoryValidation } = require("../../helper/validation");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();

router.post("/page_sub_category", verifyToken, createPageSubCategory);
router.get("/page_sub_category/:id", verifyToken, getPageSubCategoryDetails);
router.get("/page_sub_category", verifyToken, getPageSubCategoryList);
router.put("/page_sub_category/:id", verifyToken, updatePageSubCategory);
router.delete("/page_sub_category/:id", verifyToken, deletePageSubCategory);
router.get("/page_sub_category_deleted", verifyToken, getAllPageSubCategoryDeleted);
router.put("/merge_page_sub_category", verifyToken, mergePageSubCategory);
router.get("/get_all_sub_cat_with_cat_id/:category_id", verifyToken, getAllSubCatWithCat);

module.exports = router;