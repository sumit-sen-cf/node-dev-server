const express = require("express");
const { verifyToken } = require("../../middleware/auth");
const { upload1 } = require("../../common/uploadFile");
const {
  addBlogImages,
  getSingleBlogImagesDetails,
  deleteBlogImageDetails,
  getAllBlogImageDetails,
  updateSingleBlogImageDetails,
} = require("../../controllers/sarcasm_co/blogImagesController");
const router = express.Router();

router.post(
  "/blog-image",
  upload1.fields([{ name: "blog_images", maxCount: 10 }]),
  verifyToken,
  addBlogImages
);
router.get("/blog-image", verifyToken, getAllBlogImageDetails);
router.get("/blog-image/:id", verifyToken, getSingleBlogImagesDetails);
router.put(
  "/blog-image",
  upload1.single("blog_images"),
  verifyToken,
  updateSingleBlogImageDetails
);
router.delete("/blog-image/:id", verifyToken, deleteBlogImageDetails);

module.exports = router;
