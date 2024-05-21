const express = require("express");
const {
    addPaymentMethod,
    deletePaymentMethodDetails,
    getAllPaymentMethodDetails,
    getSinglePaymentMethodDetails,
    updateSinglePaymentMethodDetails,
    getAllPaymentMethodDeletedData,
} = require("../../controllers/PMS2/paymentMethodController");
const {
    addPaymentMethodValidation,
    updatePaymentMethodValidation,
} = require("../../helper/validation");
const router = express.Router();

router.post("/payment_method", addPaymentMethodValidation, addPaymentMethod);
router.get("/payment_method", getAllPaymentMethodDetails);
router.get("/payment_method/:id", getSinglePaymentMethodDetails);
router.put(
    "/payment_method",
    updatePaymentMethodValidation,
    updateSinglePaymentMethodDetails
);
router.delete("/payment_method/:id", deletePaymentMethodDetails);
router.get("/payment_method", getAllPaymentMethodDeletedData);

module.exports = router;
