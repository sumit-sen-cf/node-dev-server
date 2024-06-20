const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth");
const invoiceRequestController = require("../../controllers/Sales/invoiceRequestController.js")

/**
 * invoice request routes
 */
router.post("/sales/invoice_request", verifyToken, invoiceRequestController.createInvoiceRequest);
router.get("/sales/invoice_request/:id", verifyToken, invoiceRequestController.getInvoiceRequestData);
router.put("/sales/invoice_request/:id", verifyToken, invoiceRequestController.updateInvoiceRequest);
router.get("/sales/invoice_request", verifyToken, invoiceRequestController.getInvoiceRequestDatas);
router.delete("/sales/invoice_request/:id", verifyToken, invoiceRequestController.deleteInvoiceRequest);

module.exports = router; 