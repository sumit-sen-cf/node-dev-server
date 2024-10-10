const express = require("express");
const { addTagCategory, getPageTagCategory, getSinglePageTagCategory, editPageTagCategory, deletePageTagcategory } = require("../../controllers/PMS2/pageTagCategoryController");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();


router.post("/page_tag_cat", verifyToken, addTagCategory);
router.get("/page_tag_cat", verifyToken, getPageTagCategory);
router.get('/page_tag_cat/:id', verifyToken, getSinglePageTagCategory);
router.put("/page_tag_cat", verifyToken, editPageTagCategory);
router.delete("/page_tag_cat/:id", verifyToken, deletePageTagcategory);

module.exports = router;