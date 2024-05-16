const express = require("express");
const router = express.Router();
const accountMaster = require("../controllers/accounts/accountMasterController");

router.get("/", (req, res) => {
    res.send({ message: "Welcome to Account module." });
});

/**
 * account master routes
 */
// router.post("/add_sales_booking", SMS.addSalesBooking);
// router.put("/edit_sales_booking/:id", SMS.editSalesBooking);
// router.get("/get_all_sales_booking", SMS.getAllSalesBooking);
// router.get("/get_single_sales_booking/:id", SMS.getSingleSalesBooking);
// router.delete("/delete_sales_booking/:id", SMS.deleteSalesBooking);

module.exports = router; 