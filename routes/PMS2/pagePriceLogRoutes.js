const express = require("express");
const { getAllPagePriceLogs, getAllPageFollowerCountLog } = require("../../controllers/PMS2/pagePriceLogController");
const router = express.Router();



router.get("/get_all_page_price_logs", getAllPagePriceLogs);
router.get("/get_all_page_follower_count_logs", getAllPageFollowerCountLog);

module.exports = router;