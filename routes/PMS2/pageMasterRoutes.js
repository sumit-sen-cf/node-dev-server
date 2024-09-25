const express = require("express");
const {
    addPageMaster,
    updateSinglePageMasterDetails,
    getAllPageMasterDetails,
    getSinglePageMasterDetails,
    deletePageMasterDetails,
    getPageMasterDataVendorWise,
    getPageMasterDetailBYPID,
    getPageMasterData
} = require("../../controllers/PMS2/pageMasterController");
const { addPageMasterValidation, updatePageMasterValidation } = require("../../helper/validation");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();

router.post("/pageMaster", verifyToken, addPageMaster);
router.put("/pageMaster/:id", verifyToken, updateSinglePageMasterDetails);
router.get("/pageMaster", getAllPageMasterDetails);
router.get("/pageMasterData", getPageMasterData);
router.get("/pageMaster/:id", verifyToken, getSinglePageMasterDetails);
router.get("/pageMasterDataByPID/:p_id", getPageMasterDetailBYPID);
router.delete("/pageMaster/:id", verifyToken, deletePageMasterDetails);
router.get("/vendor_wise_page_master_data/:id", verifyToken, getPageMasterDataVendorWise);

module.exports = router;
