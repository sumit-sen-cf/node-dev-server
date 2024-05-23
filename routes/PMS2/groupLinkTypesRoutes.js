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
const router = express.Router();

router.post("/group_link_type", addGroupLinkTypeValidation, addGroupLink);
router.get("/group_link_type", getAllGroupLinkDetails);
router.get("/group_link_type/:id", getSingleGroupLinkDetails);
router.put(
    "/group_link_type",
    updateGrouplinkTypeValidation,
    updateSingleGroupLinkDetails
);
router.delete("/group_link_type/:id", deleteGroupLinkDetails);
router.get("/group_link_type_deleted", getGroupLinkDeletedData);

module.exports = router;
