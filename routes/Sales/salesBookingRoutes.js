const express = require("express");
const router = express.Router();
const Sales = require("../../controllers/Sales/salesBookingController");
const { verifyToken } = require("../../middleware/auth");

router.get("/sales", (req, res) => {
    res.send({ message: "Welcome to Sales module." });
});

/**
 * sales booking routes
 */
router.post("/sales/sales_booking", verifyToken, Sales.addSalesBooking);
router.put("/sales/sales_booking/:id", verifyToken, Sales.editSalesBooking);
router.get("/sales/sales_booking/:id", verifyToken, Sales.getSingleSalesBooking);
router.get("/sales/sales_booking", verifyToken, Sales.getAllSalesBooking);
router.delete("/sales/sales_booking/:id", verifyToken, Sales.deleteSalesBooking);
router.get("/sales/deleted_sale_booking_list", verifyToken, Sales.getDeletedSalesBookingList);
router.get("/sales/account_sale_booking/:id", verifyToken, Sales.getSalesBookingDetail);

/**
 * sales booking credit approval status Api's
 */
router.get("/sales/credit_approval_status_for_sales_booking_list", Sales.getAllStatusForCreditApprovalSalesBookingList);
router.put("/sales/credit_approval_status_status_change/:id", Sales.editCreditApprovalStatusChange);

router.get("/sales/account_wise_status", verifyToken, Sales.salesDataOfAccountOutstanding);
router.get("/sales/user_wise_status", verifyToken, Sales.salesDataOfUserOutstanding);


module.exports = router; 