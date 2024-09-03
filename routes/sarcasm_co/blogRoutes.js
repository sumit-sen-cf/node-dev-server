const express = require("express");
const { verifyToken } = require("../../middleware/auth");
const {
  addBlog,
  deleteBlogDetails,
  getAllBlogDetails,
  getSingleBlogDetails,
  updateSingleBlogDetails,
} = require("../../controllers/sarcasm_co/blogController");
const { upload1 } = require("../../common/uploadFile");
const router = express.Router();

router.post(
  "/blog",
  upload1.fields([
    { name: "blog_images", maxCount: 10 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  verifyToken,
  addBlog
);
router.get("/blog", verifyToken, getAllBlogDetails);
router.get("/blog/:id", verifyToken, getSingleBlogDetails);
router.put(
  "/blog",
  upload1.single("bannerImage"),
  verifyToken,
  updateSingleBlogDetails
);
router.delete("/blog/:id", verifyToken, deleteBlogDetails);

module.exports = router;
