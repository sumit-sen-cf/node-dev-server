const express = require("express");
const { verifyToken } = require("../../middleware/auth");
const { upload1 } = require("../../common/uploadFile");
const {
  addBlogImages,
  getSingleBlogImagesDetails,
  deleteBlogImageDetails,
  getAllBlogImageDetails,
  updateSingleBlogImageDetails,
  getAllblogImageByBlogId,
  uploadImageToDirectGCP,
} = require("../../controllers/sarcasm_co/blogImagesController");
const router = express.Router();

router.post(
  "/blog-image",
  upload1.fields([{ name: "blog_images", maxCount: 10 }]),
  addBlogImages
);
router.post(
  "/gcp/upload-image",
  upload1.single("image"),
  uploadImageToDirectGCP
);
router.get("/blog-image", getAllBlogImageDetails);
router.get("/blog-image/:id", getSingleBlogImagesDetails);
router.get("/blog-image-by-blogId/:id", getAllblogImageByBlogId);
router.put(
  "/blog-image",
  upload1.single("blog_images"),
  updateSingleBlogImageDetails
);
router.delete("/blog-image/:id", deleteBlogImageDetails);

module.exports = router;
