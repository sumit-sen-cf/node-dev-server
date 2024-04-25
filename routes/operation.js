const express = require("express");
const router = express.Router();
const SMS = require("../controllers/SMS/sales");

router.get("/", (req, res) => {
    res.send({ message: "Welcome to Operation module." });
});

/**
 * sales booking routes
 */
router.post("/add_sales_booking", SMS.addSalesBooking);
router.put("/edit_sales_booking/:id", SMS.editSalesBooking);
router.get("/get_all_sales_booking", SMS.getAllSalesBooking);
router.get("/get_single_sales_booking/:id", SMS.getSingleSalesBooking);
router.delete("/delete_sales_booking/:id", SMS.deleteSalesBooking);

module.exports = router; 