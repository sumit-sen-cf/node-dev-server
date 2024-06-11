const express = require("express");
const { addDocumentDetails, getDocumentDetails, updateDocumentDetails, getDocumentDetailsList, deleteDocumentDetails } = require("../../controllers/PMS2/documentDetailsController");
const router = express.Router();


router.post("/document_detail", addDocumentDetails);
router.get("/document_detail/:id", getDocumentDetails);
router.put("/document_detail/:id", updateDocumentDetails);
router.get("/document_detail", getDocumentDetailsList);
router.delete("/document_detail/:id", deleteDocumentDetails);

module.exports = router;