const express = require("express");
const { addProfileType, getProfileTypeDetails, getAllProfileTypeList, updateProfileTypeDetail, deleteProfileType, getAllProfileTypeDataDeleted } = require("../../controllers/PMS2/pageProfileTypeController");
const { addPageProfileValidation, updatePageProfileValidation } = require("../../helper/validation");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();

router.post("/profile_type", verifyToken, addPageProfileValidation, addProfileType);
router.get("/profile_type/:id", verifyToken, getProfileTypeDetails);
router.get("/profile_type", verifyToken, getAllProfileTypeList);
router.put("/profile_type/:id", verifyToken, updatePageProfileValidation, updateProfileTypeDetail);
router.delete("/profile_type/:id", verifyToken, deleteProfileType);
router.get("/profile_type_deleted", verifyToken, getAllProfileTypeDataDeleted);

module.exports = router;
