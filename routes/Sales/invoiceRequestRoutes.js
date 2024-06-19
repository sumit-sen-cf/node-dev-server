const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth");
const invoiceRequestController = require("../../controllers/Sales/invoiceRequestController.js")

/**
 * invoice request routes
 */
router.post("/sales/invoicerequest", verifyToken, invoiceRequestController.createInvoiceRequest);
router.get("/sales/invoicerequest/:id", verifyToken, invoiceRequestController.getInvoiceRequestData);
router.put("/sales/invoicerequest/:id", verifyToken, invoiceRequestController.updateInvoiceRequest);
router.get("/sales/invoicerequest", verifyToken, invoiceRequestController.getInvoiceRequestDatas);
router.delete("/sales/invoicerequest/:id", verifyToken, invoiceRequestController.deleteInvoiceRequest);

module.exports = router; 