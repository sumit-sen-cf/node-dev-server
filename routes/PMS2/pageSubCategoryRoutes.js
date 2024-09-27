const express = require("express");
const { createPageCategory, 
    getPageSubCategoryDetails, 
    getPageSubCategoryList, 
    updatePageSubCategory, 
    deletePageSubCategory, 
    getAllPageSubCategoryDeleted 
} = require("../../controllers/PMS2/pageSubCategoryController");
// const { addPageCategoryValidation, updatePageCategoryValidation } = require("../../helper/validation");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();

router.post("/page_sub_category", verifyToken, createPageCategory);
router.get("/page_sub_category/:id", verifyToken, getPageSubCategoryDetails);
router.get("/page_sub_category", verifyToken, getPageSubCategoryList);
router.put("/page_sub_category/:id", verifyToken, updatePageSubCategory);
router.delete("/page_sub_category/:id", verifyToken, deletePageSubCategory);
router.get("/page_sub_category_deleted", verifyToken, getAllPageSubCategoryDeleted);

module.exports = router;