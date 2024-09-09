const express = require("express");
const { verifyToken } = require("../../middleware/auth");
const {
  addBlog,
  deleteBlogDetails,
  getAllBlogDetails,
  getSingleBlogDetails,
  updateSingleBlogDetails,
  getAllBlogByCategory,
} = require("../../controllers/sarcasm_co/blogController");
const { upload1 } = require("../../common/uploadFile");
const router = express.Router();

router.post(
  "/blog",
  upload1.fields([
    { name: "blog_images", maxCount: 10 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  // verifyToken,
  addBlog
);
router.get("/blog",  getAllBlogDetails);
router.get("/blog/:id",  getSingleBlogDetails);
router.get("/blog-by-category/:id",  getAllBlogByCategory);
router.put(
  "/blog",
  upload1.single("bannerImage"),
  updateSingleBlogDetails
);
router.delete("/blog/:id",  deleteBlogDetails);

module.exports = router;
