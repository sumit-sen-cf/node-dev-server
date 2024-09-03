const express = require("express");
const { verifyToken } = require("../../middleware/auth");
const {
  addBlogCategory,
  getAllBlogCategoryDetails,
  getSingleBlogCategoryDetails,
  updateSingleBlogCategoryDetails,
  deleteBlogCategoryDetails,
} = require("../../controllers/sarcasm_co/blogCategoryController");

const router = express.Router();

router.post("/blog-category", verifyToken, addBlogCategory);
router.get("/blog-category", verifyToken, getAllBlogCategoryDetails);
router.get("/blog-category/:id", verifyToken, getSingleBlogCategoryDetails);
router.put("/blog-category/:id", verifyToken, updateSingleBlogCategoryDetails);
router.delete("/blog-category/:id", verifyToken, deleteBlogCategoryDetails);

module.exports = router;
