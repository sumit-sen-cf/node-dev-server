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
    getAllPagesForUsers,
    getAllPageMasterDetailsWithStartEndDate,
    getAllPagesForUsersWithStartEndDate,
    getAllPageLanguages,
    getPageDatas
} = require("../../controllers/PMS2/pageMasterController");
const { addPageMasterValidation, updatePageMasterValidation } = require("../../helper/validation");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();

router.post("/pageMaster", addPageMaster);
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
router.post("/get_all_pages_for_users", getAllPagesForUsers);
router.post("get_all_pages_for_users_with_start_end_date", getAllPagesForUsersWithStartEndDate);
router.post("/get_all_pages_with_start_end_date", verifyToken, getAllPageMasterDetailsWithStartEndDate);
router.get("/get_all_page_languages", getAllPageLanguages);
router.get('/get_all_pages', getPageDatas)

module.exports = router;
