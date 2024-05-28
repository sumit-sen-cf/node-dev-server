const express = require("express");
const {
    addPageMaster,
    updateSinglePageMasterDetails,
    getAllPageMasterDetails,
    getSinglePageMasterDetails,
    deletePageMasterDetails,
} = require("../../controllers/PMS2/pageMasterController");
const {
    addPayCycleValidation,
    updatePayCycleValidation,
    addPageMasterValidation,
    updatePageMasterValidation,
} = require("../../helper/validation");
const router = express.Router();

router.post("/pageMaster",addPageMasterValidation, addPageMaster);
router.put("/pageMaster/:id",updatePageMasterValidation, updateSinglePageMasterDetails);
router.get("/pageMaster", getAllPageMasterDetails);
router.get("/pageMaster/:id", getSinglePageMasterDetails);
router.delete("/pageMaster/:id", deletePageMasterDetails);

module.exports = router;
