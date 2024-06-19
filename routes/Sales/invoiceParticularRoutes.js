const express = require("express");
const router = express.Router();
const invoiceParticularController = require("../../controllers/Sales/invoiceParticularController");
const { verifyToken } = require("../../middleware/auth");

/**
 * sales payment mode routes
 */
router.post("/sales/invoice_particular", verifyToken, invoiceParticularController.createSalesInvoiceParticular);
router.get("/sales/invoice_particular/:id", verifyToken, invoiceParticularController.getInvoiceParticularDetails);
router.put("/sales/invoice_particular/:id", verifyToken, invoiceParticularController.updateInvoiceParticular);
router.get("/sales/invoice_particular", verifyToken, invoiceParticularController.getInvoiceParticularList);
router.delete("/sales/invoice_particular/:id", verifyToken, invoiceParticularController.deleteInvoiceParticular);

module.exports = router; 