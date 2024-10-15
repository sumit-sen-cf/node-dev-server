const express = require("express");
const { getAllPagePriceLogs, getAllPageFollowerCountLog } = require("../../controllers/PMS2/pagePriceLogController");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth");



router.get("/get_all_page_price_logs", verifyToken, getAllPagePriceLogs);
router.get("/get_all_page_follower_count_logs", verifyToken, getAllPageFollowerCountLog);

module.exports = router;