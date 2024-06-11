const express = require("express");
const {
    addPaymentMethod,
    deletePaymentMethodDetails,
    getAllPaymentMethodDetails,
    getSinglePaymentMethodDetails,
    updateSinglePaymentMethodDetails,
    getAllPaymentMethodDeletedData,
} = require("../../controllers/PMS2/paymentMethodController");
const { addPaymentMethodValidation, updatePaymentMethodValidation } = require("../../helper/validation");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();

router.post("/payment_method", verifyToken, addPaymentMethodValidation, addPaymentMethod);
router.get("/payment_method", verifyToken, getAllPaymentMethodDetails);
router.get("/payment_method/:id", verifyToken, getSinglePaymentMethodDetails);
router.put("/payment_method", verifyToken, updatePaymentMethodValidation, updateSinglePaymentMethodDetails);
router.delete("/payment_method/:id", verifyToken, deletePaymentMethodDetails);
router.get("/payment_method_deleted", verifyToken, getAllPaymentMethodDeletedData);

module.exports = router;
