const express = require("express");
const { verifyToken } = require("../../middleware/auth");
const {
  addBlogCategory,
  getAllBlogCategoryDetails,
  getSingleBlogCategoryDetails,
  updateSingleBlogCategoryDetails,
  deleteBlogCategoryDetails,
  getRecentBlogsForEachBlogCategory,
} = require("../../controllers/sarcasm_co/blogCategoryController");

const router = express.Router();

router.post("/blog-category",  addBlogCategory);
router.get("/blog-category", getAllBlogCategoryDetails);
router.get("/recent-blogs-for-each-category", getRecentBlogsForEachBlogCategory);
router.get("/blog-category/:id", getSingleBlogCategoryDetails);
router.put("/blog-category", updateSingleBlogCategoryDetails);
router.delete("/blog-category/:id", deleteBlogCategoryDetails);

module.exports = router;
