const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth");
const reasonCreditApproval = require("../../controllers/Sales/reasonCreditApprovalController");

/**
 * reason credit approval routes
 */
router.post("/sales/reason_credit_approval", verifyToken, reasonCreditApproval.createReasonCreaditApproval);
router.put("/sales/reason_credit_approval/:id", verifyToken, reasonCreditApproval.updateReasonCreditApproval);
router.get("/sales/reason_credit_approval/:id", verifyToken, reasonCreditApproval.getReasonCreditApprovalDetail);
router.get("/sales/reason_credit_approval", verifyToken, reasonCreditApproval.getReasonCreditApprovalList);
router.delete("/sales/reason_credit_approval/:id", verifyToken, reasonCreditApproval.deleteReasonCreditApproval);

module.exports = router; 