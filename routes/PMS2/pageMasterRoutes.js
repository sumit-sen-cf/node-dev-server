const express = require("express");
const {
    addPageMaster,
    updateSinglePageMasterDetails,
    getAllPageMasterDetails,
    getSinglePageMasterDetails,
    deletePageMasterDetails,
    getPageMasterDataVendorWise,
    getPageMasterDetailBYPID,
    getPageMasterData,
    getAllPageCategoryAssignments,
    addPageCategoryAssignmentToUser,
    editPageCategoryAssignmentToUser,
    deletePageCategoryAssignment,
    getAllPageCatAssignment,
    getAllPagesForUsers
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
router.delete("/pageMaster/:id", deletePageMasterDetails);
router.get("/vendor_wise_page_master_data/:id", verifyToken, getPageMasterDataVendorWise);
router.post('/add_page_cat_assignment', addPageCategoryAssignmentToUser);
router.post('/edit_page_cat_assignment', editPageCategoryAssignmentToUser);
router.post('/delete_page_cat_assignment/:_id', deletePageCategoryAssignment);
router.get("/get_all_page_cat_assignment/:user_id", getAllPageCategoryAssignments);
router.get('/get_all_page_cat_assignment', getAllPageCatAssignment);
router.post("/get_all_pages_for_users", getAllPagesForUsers)

module.exports = router;
