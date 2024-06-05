const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth");
const reasonCreditApprovalController = require("../../controllers/Sales/reasonCreditApprovalController");


/**
 * reason credit approval request routes
 */
router.post("/sales/reason_credit_approval", verifyToken, reasonCreditApprovalController.createReasonCreaditApproval);
router.get("/sales/reason_credit_approval/:id", verifyToken, reasonCreditApprovalController.getReasonCreditApprovalDetail);
router.put("/sales/reason_credit_approval/:id", reasonCreditApprovalController.updateReasonCreditApproval);
router.get("/sales/reason_credit_approval", reasonCreditApprovalController.getReasonCreditApprovalList);
router.delete("/sales/reason_credit_approval/:id", reasonCreditApprovalController.deleteReasonCreditApproval);

module.exports = router;