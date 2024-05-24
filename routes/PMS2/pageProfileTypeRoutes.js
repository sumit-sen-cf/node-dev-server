const express = require("express");
const { addProfileType, getProfileTypeDetails, getAllProfileTypeList, updateProfileTypeDetail, deleteProfileType, getAllProfileTypeDataDeleted } = require("../../controllers/PMS2/pageProfileTypeController");
const { addPageProfileValidation, updatePageProfileValidation } = require("../../helper/validation");
const router = express.Router();

router.post("/profile_type", addPageProfileValidation, addProfileType);
router.get("/profile_type/:id", getProfileTypeDetails);
router.get("/profile_type", getAllProfileTypeList);
router.put("/profile_type/:id", updatePageProfileValidation, updateProfileTypeDetail);
router.delete("/profile_type/:id", deleteProfileType);
router.get("/profile_type_deleted", getAllProfileTypeDataDeleted);

module.exports = router;
