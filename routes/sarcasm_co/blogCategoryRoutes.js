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

router.post("/blog-category",  addBlogCategory);
router.get("/blog-category", getAllBlogCategoryDetails);
router.get("/blog-category/:id", getSingleBlogCategoryDetails);
router.put("/blog-category/:id", updateSingleBlogCategoryDetails);
router.delete("/blog-category/:id", deleteBlogCategoryDetails);

module.exports = router;
