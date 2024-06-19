const express = require("express");
const { addDocumentDetails, getDocumentDetails, updateDocumentDetails, getDocumentDetailsList, deleteDocumentDetails, getDocumentVendorWiseDetails } = require("../../controllers/PMS2/documentDetailsController");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();


router.post("/document_detail", verifyToken, addDocumentDetails);
router.get("/document_detail/:id", verifyToken, getDocumentDetails);
router.put("/document_detail/:id", verifyToken, updateDocumentDetails);
router.get("/document_detail", verifyToken, getDocumentDetailsList);
router.delete("/document_detail/:id", verifyToken, deleteDocumentDetails);
router.get("/vendor_wise_document_detail/:id", verifyToken, getDocumentVendorWiseDetails);

module.exports = router;