const express = require("express");
const {
    addGroupLinkTypeValidation,
    updateGrouplinkTypeValidation,
} = require("../../helper/validation");
const {
    addGroupLink,
    deleteGroupLinkDetails,
    getAllGroupLinkDetails,
    getSingleGroupLinkDetails,
    updateSingleGroupLinkDetails,
    getGroupLinkDeletedData,
} = require("../../controllers/PMS2/groupLinkTypeController");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();

router.post("/group_link_type", verifyToken, addGroupLinkTypeValidation, addGroupLink);
router.get("/group_link_type", verifyToken, getAllGroupLinkDetails);
router.get("/group_link_type/:id", verifyToken, getSingleGroupLinkDetails);
router.put("/group_link_type", verifyToken, updateGrouplinkTypeValidation, updateSingleGroupLinkDetails);
router.delete("/group_link_type/:id", verifyToken, deleteGroupLinkDetails);
router.get("/group_link_type_deleted", verifyToken, getGroupLinkDeletedData);

module.exports = router;
