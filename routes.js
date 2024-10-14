const express = require("express");
const router = express.Router();
const multer = require('multer');

const insta = require("./controllers/insta.js");
const exe = require("./controllers/execution.js");
const sim = require("./controllers/sim.js");
const logoBrand = require("./controllers/logoBrand.js");
const department = require("./controllers/department.js");
const brand = require("./controllers/brand.js");
const campagin = require("./controllers/campaign.js");
const projectxPageCategory = require("./controllers/projectxPageCategory.js");
const projectxSubCategory = require("./controllers/projectxSubCategory.js");
const hashTag = require("./controllers/hashTag.js");
const keyword = require("./controllers/keywordInsta.js");
const mention = require("./controllers/mentionInsta.js");
const instaBotY = require("./controllers/instaBotY.js");
const instaBotM = require("./controllers/instaBotM.js");
const instaBotW = require("./controllers/instaBotW.js");
const projectxCategory = require("./controllers/projectxCategory.js");
const projectxRecord = require("./controllers/projectxRecord.js");
const registerCampaign = require("./controllers/registerCampaign.js");
const contentSectionReg = require("./controllers/contentSectionRegCmp.js");
const contentType = require("./controllers/contentType.js");
const projectx = require("./controllers/projectx.js");
const announcement = require("./controllers/announcement.js");
const objectMast = require("./controllers/objmast.js");
const { upload, upload1 } = require("./common/uploadFile.js");
const designation = require("./controllers/designation.js");
const finance = require("./controllers/finance.js");
const sitting = require("./controllers/sitting.js");
const agency = require("./controllers/agency.js");
const responsibility = require("./controllers/responsibility.js");
const contentM = require("./controllers/contentManagement.js");
const billingheader = require("./controllers/billingheader.js");
const brandCategory = require("./controllers/brandCategory.js");
const campaignCategory = require("./controllers/campaignCategory.js");
const brandSubCategory = require("./controllers/brandSubCategory.js");
const productController = require("./controllers/product.js");
const brandMajorCategory = require("./controllers/brandMajorCategory.js");
const cmtController = require("./controllers/commitmentMast.js");
const exeCampaign = require("./controllers/exeCampaign.js");
const instaBrand = require("./controllers/instaBrand.js");
const user = require("./controllers/user.js");
const attendance = require("./controllers/attendance.js");
const instapage = require("./controllers/instaPage.js");
const pageUniqueness = require("./controllers/pageUniqueness.js");
const imageUpload = require("./controllers/Instagram/imageUpload.js");

const role = require("./controllers/role.js");
const kra = require("./controllers/kra.js");
const leadremark = require("./controllers/leadRemark.js");
const lead = require("./controllers/lead.js");
const leadtype = require("./controllers/lead.js");
const leadmast = require("./controllers/lead.js");
const { verifyToken } = require("./middleware/auth.js");
const demoApi = require("./controllers/demoApi.js");
const expenseApi = require("./controllers/expenseController.js");
const expenseAccountApi = require("./controllers/expenseAccountController.js");
const expenseCategoryApi = require("./controllers/expenseCategory.js");

const assetCategory = require("./controllers/assestsCategory.js");
const assetSubCategory = require("./controllers/assetsSubCategory.js");
const vendor = require("./controllers/vendor.js");
const coc = require("./controllers/cocManagement.js");
const documentController = require("./controllers/document.js");
const assetsImage = require("./controllers/assetsImage.js");
const notification = require("./controllers/notifications.js");
const userDocManagement = require("./controllers/userDocManagement.js");
const swaggerAccessManagement = require("./doc/customization_src/controller/swaggerAccessManagement.js");

//opertaion + execution imports start here`
const campaignPlanController = require("./controllers/operationExecution/campaignPlanController.js");
const campaignPhaseController = require("./controllers/operationExecution/campaignPhaseController.js");
const expertiseController = require('./controllers/operationExecution/expertiseController.js')
const assignmentController = require('./controllers/operationExecution/assignmentController.js')
const assignmentCommitController = require('./controllers/operationExecution/assignmentCommitController.js')
const assignmentDashboardController = require('./controllers/operationExecution/dashboards/assignmentDashboard.js')
const operationDasboard = require('./controllers/operationExecution/dashboard.controller.js')
const pageReplacementController = require('./controllers/operationExecution/pageReplacementController.js')
const preAssignmentController = require('./controllers/operationExecution/preAssignmentController.js')
const agencyController = require('./controllers/operationExecution/campaignMasterController/agencyController.js')
const goalController = require('./controllers/operationExecution/campaignMasterController/goalController.js')
const serviceController = require('./controllers/operationExecution/campaignMasterController/serviceController.js')
const industryController = require('./controllers/operationExecution/campaignMasterController/industryController.js')
const directPlanCreationController = require('./controllers/operationExecution/directPlanCreationController.js')
const tempPlanController = require('./controllers/operationExecution/tempPlan/tempPlanController.js')
const tempExecutionController = require('./controllers/operationExecution/tempPlan/executionTempController.js')
const handleInstaPost = require('./controllers/operationExecution/tempPlan/handleInstaPost.js')
//opertaion + execution imports ends here`

const city = require("./controllers/cityController.js");
const phpFinance = require("./controllers/phpFinance.js")
const phpPayment = require("./controllers/phpPaymentAccList.js")
const phpRefund = require("./controllers/phpPaymentRefund.js")
const phpIncentive = require("./controllers/phpIncentive.js")
const phpPaymentBal = require("./controllers/phpPaymentBalList.js");
const phpPendingInvoice = require("./controllers/phpPendingInvoice.js");
const phpSaleBookingTds = require("./controllers/saleBookingTds.js");
const assetBrand = require("./controllers/assetsBrand.js");
const assetModal = require("./controllers/assetsModal.js");
const emailContent = require("./controllers/emailTempContent.js")
const hobby = require("./controllers/hobby.js");
const family = require("./controllers/family.js");
const education = require('./controllers/education.js');
const assetReson = require("./controllers/assetReason.js");
const guardian = require("./controllers/guardian.js");
const repairRequest = require("./controllers/repairRequest.js");
const jobTypeController = require("./controllers/jobTypeController.js");
const dataSubCat = require("./controllers/dataSubCategory.js");
const dataBrand = require("./controllers/dataBrand.js");
const dataContentType = require("./controllers/dataContentType.js");
const dataCategory = require("./controllers/dataCategory.js");
const dataPlatform = require("./controllers/dataPlatform.js");
const dataController = require("./controllers/data.js");
const deptDesiAuth = require("./controllers/deptDesiAuth.js");
const assetRequest = require("./controllers/assetRequest.js");
//const taskDelivery = require("./controllers/TMS/taskDelivery.js")
// const task = require("./controllers/TMS/task.js")
// const taskSequence = require("./controllers/TMS/tmsStatusMastController.js");
const assetReturnRequest = require("./controllers/assetReturn.js");
const newCoc = require('./controllers/cocManagementNew.js')
const phpVendorPaymentRequest = require("./controllers/phpVendorPaymentRequest.js");
const assetHistory = require("./controllers/assetHistory.js");
const dataOperation = require("./controllers/dataOperation.js");
const attendanceDispute = require("./controllers/attendanceDispute.js");
const userUpdateHistory = require("./controllers/userUpdateHistory.js");
const userTraining = require("./controllers/userTraining.js");
const nodePhpVendorPaymentMode = require("./controllers/nodePhpVendorPaymentMode.js");
const razorPay = require("./controllers/razorpay.js");
const phpVendorPurchasePaymentRequest = require("./controllers/phpVendorPurchasePayment.js");


//Routes for Asset Repair and Return Summary Data
const repairandreturnsumdata = require("./controllers/repairAndReturnSum.js");
const assetVendorSum = require("./controllers/assetVendorSum.js");
const pmsPageAssignment = require("./controllers/PMS/pmsPageAssignment.js");
const dynamicTablesModel = require("./controllers/dynamicTables.js");
const adminController = require('./controllers/adminController.js')
const planMakingController = require('./controllers/planMakingController.js')


const majorDepartmentController = require("./controllers/majorDepartment.js");

/* Task Mangement Controller Import */
//const deptWiseStatus = require('./controllers/TMS/deptWiseStatus.js');
const { createTmsCatMast, getTmsCatMast, updateTmsCatMast, deleteTmsCatMast, getAllTmsCatMast } = require("./controllers/TMS/tmsCatMastController.js");
const { createTmsSubCatMast, getTmsSubCatMast, updateTmsSubCatMast, getAllTmsSubCatMast, getAllTmsSubCatList, deleteTmsSubCatMast } = require("./controllers/TMS/tmsSubCatController.js");
const { createTmsStatusMast, getTmsStatusMast, updateTmsStatusMast, getAllTmsStatusMast, getAllTmsStatusMastList, deleteStatusMast } = require("./controllers/TMS/tmsStatusMastController.js");
const { createTmsSubStatusMast, getTmsSubStatusMast, updateTmsSubStatusMast, getAllTmsSubStatusMast, getAllTmsSubStatusMastList, deleteSubStatusMast } = require("./controllers/TMS/tmsSubStatusMastController.js");
const { createTmsTaskJourney, getTmsTaskJourney, getAllTmsTaskJourney, getAllTmsTaskJourneyList, deleteTaskJourney } = require("./controllers/TMS/tmsTaskJourneyController.js");
const { addTmsTaskMast, getSingleTmsTaskMast, updateTmsTaskMast, getAllTmsTaskMastList } = require("./controllers/TMS/tmsTaskMastController.js");
const { createPmsVendor, getVendorDetail, updateVendorType, getAllVendorData, deleteVendorType } = require("./controllers/PMS/pmsVendorTypeController.js");
const { createPlatform, getPlatformDetail, updatePlatformData, getAllPlatformList, deletePlatformData } = require("./controllers/PMS/pmsPlatformController.js");
const { createPayMethod, getPayDetail, updatePayData, getAllPayList, deletePayData } = require("./controllers/PMS/pmsPayMethodController.js");
const { createPayCycle, getPayCycleDetail, updatePayCycle, getAllPayCycleList, deletePayCycleData } = require("./controllers/PMS/pmsPayCycleController.js");
const { createGroupLink, getGroupLinkDetail, updateGroupLink, getAllGroupLinkList, deleteGroupLinkData } = require("./controllers/PMS/pmsGroupLinkTypeController.js");
const { createPmsVendorMast, getVendorMastDetail, updateVendorMast, getAllVendorkMastList, getAllVendorMastList, vendorMastDelete, getPageByVenodrId, getNotAssignedToPageMastVenodrList } = require("./controllers/PMS/pmsVendorMastController.js");
const { createVendorGroup, getVendorGroupDetail, updateVendorGroup, getAllVendorGroupList, deleteVendorGroupData } = require("./controllers/PMS/pmsVendorGroupLinkController.js");
const { createPriceType, getPriceDetail, updatePriceType, getPriceList, deletePriceType, getAllPriceTypeList } = require("./controllers/PMS/pmsPriceTypeController.js");
const { createPlatformPrice, getPlatformPriceDetail, updatePlatformPriceData, getPlatformPriceList, deletePlatformPriceData } = require("./controllers/PMS/pmsPlatformPriceTypeController.js");
const { createPageCatg, getPageCatgDetail, updatePageCatg, getPageCatgList, deletePageCatgData } = require("./controllers/PMS/pmsPageCategoryController.js");
const { createPmsProfile, getProfileDetail, updateProfileType, getProfileList, deleteProfileType } = require("./controllers/PMS/pmsProfileTypeController.js");
const { createPageMast, getPageMastDetail, updatePageMast, getPageMastList, deletePageMastData, getTopPageMastList } = require("./controllers/PMS/pmsPageMastController.js");
const { createPageOwner, getPageOwnerDetail, updatePageOwner, getPageOwnerList, deletePageOwnerData } = require("./controllers/PMS/pmsPageOwnershipController.js");
const { createVendorPagePrice, getVendorPagePriceDetail, updateVendorPagePrice, getVendorPagePriceList, deleteVendorPagePriceData } = require("./controllers/PMS/pmsVendorPagePriceController.js");
const { createUserAnnouncement, getUserAnnouncementDetail, updateUserAnnouncement, getUserAnnoncementList, deleteUserAnnouncementData, announcementUpdateData, announcementWiseGetReactionDetails, announcementWisegetCommentsList, announcementWiseComment, getAllLoginUserAnnoncementListData } = require("./controllers/Announcement/userAnnouncementController.js");
const { createCustomerType, getcustomerTypeDetail, updateCustomerType, getCustomerTypeList, deleteCustomerType } = require("./controllers/Customer&Campaign/opsCustomerTypeController.js");
const { createAccountType, getAccountTypeDetail, updateAccountType, getAccountTypeList, deleteAccountType } = require("./controllers/Customer&Campaign/opsAccountTypeController.js");
const { createOwnership, getOwnershipDetail, updateOwnershipType, getOwnershipList, deleteOwnership } = require("./controllers/Customer&Campaign/opsOwnershipController.js");
const { createCustomerMast, getCustomerMastDetail, updateCustomerMast, getCustomerMastList, customerMastDelete, getCustomerMastNameListData } = require("./controllers/Customer&Campaign/opsCustomerMastController.js");
const { createCustomerContact, getCustomerContactDetail, updateCustomerContact, getCustomerContactList, deleteCustomerContact, getListCustomerContactData } = require("./controllers/Customer&Campaign/opsCustomerContactController.js");
const { createDocMast, getDocMastDetail, updateDocMast, getDocMastList, deleteDocMast } = require("./controllers/Customer&Campaign/opsDocMastController.js");
const { createCustomerDocument, getcustomerDocumentDetail, updateCustomerDocument, getCustomerDocumentList, deleteCustomerDocument, getAllCustomerDocumentList } = require("./controllers/Customer&Campaign/opsCustomerDocumentController.js");
const { createPagePurchasePrice, getPagePurchasePrice, updatePagePurchasePrice, getPagePurchasePriceList, deletePagePurchasePriceData, getAllPagePurchasePriceList, getAllDataList, getAllListData } = require("./controllers/PMS/pmsPagePurchasePriceController.js");
const { addExeHistory, updateExeHistory, getExeHistoryList, getExeHistoryDetails, getAllExeData } = require("./controllers/PMS/exeHistoryController.js");


//Opcampaign
const opCampaign = require("./controllers/opCampaign.js");
const opCampaignPlan = require("./controllers/opCampaignPlan.js");
const opCampaignPhase = require("./controllers/opCampaignPhase.js");
const opExecution = require("./controllers/opExecution.js");
const userHistoryController = require("./controllers/userHistroryController.js");

router.get("/", (req, res) => {
  res.send({ message: "Welcome to my application." });
});

/* demo api */
router.post("/add_demo", upload1.single("t13"), demoApi.addDemo);
router.get("/get_all_demo", demoApi.getAllDemo);
router.get("/get_single_demo/:_id", demoApi.getSingleDemo);
router.put("/update_demo", upload1.single("t13"), demoApi.editDemo);
router.delete("/delete_demo/:_id", demoApi.deleteDemo);

/*operation+execution api starts*/

router.post("/campaignplan", campaignPlanController.createPlan);
router.put("/campaignplan", campaignPlanController.updateBulk);
router.get("/campaignplan/:id", campaignPlanController.getPlan);
router.get('/campaignplan/singleplan/:id', campaignPlanController.getSinglePlan)
router.put('/campaignplan/singleplan/:id', campaignPlanController.singlePlanUpdate)
router.post('/campaignplan/singleplan', campaignPlanController.deleteSinglePlan)
router.delete('/campaignplan/bulk/:id', campaignPlanController.deleteEntirePlan)
router.put('/updatePlan', campaignPlanController.updatePlan)
router.put('/updatePhase', campaignPhaseController.updatePhase)
router.put('/updateAssignment', assignmentController.updateAssignment)
// router.get('/campaignplan/:id', campaignPlanController.getPlan)

router.get("/operation_dashboard_api", campaignPlanController.getCampaignPlanDataList);



router.post('/campaignphase', campaignPhaseController.createPhase)
router.get('/campaignphase/:id', campaignPhaseController.getAllPhase)
router.get('/campaignphase/singlephase/:id', campaignPhaseController.getSinglePhase)
router.post('/campaignphase/singlephase', campaignPhaseController.deleteSinglePage)
router.delete('/campaignphase/bulk/:id', campaignPhaseController.deleteEntirePhase)

router.post('/expertise', expertiseController.createExpert)
router.get('/expertise', expertiseController.getAllExpert)
router.get('/expertise/:id', expertiseController.getSingleExpert)
router.get('/expertise/user/:id', expertiseController.getExpertBasedOnUser)
router.put('/expertise/:id', expertiseController.updateExpert)
router.delete('/expertise/:id', expertiseController.deleteExpert)

//assignment routes
router.post('/assignment', assignmentController.createAssignment)
router.get('/assignment', assignmentController.getAllGodamnAssignments)
router.get('/assignment/:id', assignmentController.getSingleAssignment)

router.get('/assignment/all/:id', assignmentController.getAllAssignmentToExpertee)
router.get('/assignments', assignmentController.getAllAssignments)
router.get('/assignment/phase/:id', assignmentController.getAllAssignmentInPhase)
router.get('/assignment/campaign/:id', assignmentController.getAllAssignmentInCampaign)
router.post('/assignment/status', assignmentController.updateAssignmentStatus)
router.get('/assignment/campaign_wise_counts/:id', assignmentController.getcampaignWiseCountsData)
router.put('/assignment/post/details/update', assignmentController.updatePostDetails)
router.post('/assignment/campaign/dashboard', assignmentDashboardController.AssignmentDashCampaign)
router.get('/assignment/get_all_phases/:phase_id', assignmentController.getAllAssignmentsFromPhaseId)
// router.get('/assignment/get_all_phases_by_campid/:_id', assignmentController.getAllPhasesByCampId)
// router.get('/assignment/get_all_exe_phases_by_campid/:_id', assignmentController.getAllExePhasesByCampId);
// router.get('/assignment/get_camp_commitments/:_id', assignmentController.getCampCommits)
// router.get('/assignment/get_phase_commitments/:phase_id', assignmentController.getPhaseCommits)
router.post('/assignment/get_shift_phases', assignmentController.getShiftPhases)
router.post('/assignment/replace_page_new', assignmentController.replacePage)
// router.post('/assignment/add_new_page', assignmentController.addNewPage)

router.post('/assignment/commit', assignmentCommitController.createAssComm)
router.post('/assignment/bulk', assignmentController.createAssignmentBulk)
router.get('/assignment/commit/:id', assignmentCommitController.getAllAssComm)
router.get('/assignment/commit/single/:id', assignmentCommitController.getAssCommitAssId)
router.put('/assignment/commit/single/:id', assignmentCommitController.updateSingleCommitment)
router.post('/preassignment', preAssignmentController.createPreAssignment)
router.get('/preassignment/:id', preAssignmentController.getPreAssignmentForExpertee)
router.post('/preassignment/phase', preAssignmentController.getPreAssignmnetOnPhaseId)
router.post('/preassignment/phase/update', preAssignmentController.preAssignmentUpdate)
router.post('/preassignment/acceptall', preAssignmentController.acceptAllPreAssignments)
router.post('/operation_phase_dashboard', operationDasboard.phaseDashboard)
router.post('/operation_plan_dashboard', operationDasboard.planDashboard)

router.post('/replacement/plan', pageReplacementController.createReplacementPlan)
router.post('/replacement/campexe/new', pageReplacementController.createReplacementPlanNew)
router.get('/replacement/plan', pageReplacementController.getAllRecord)
router.get('/replacement/:id', pageReplacementController.getSingleRecord)
router.post('/replacement/status', pageReplacementController.replacementStatus)

router.post('/agency', agencyController.createAgency)
router.get('/agency', agencyController.getAllAgency)
router.put('/agency/:id', agencyController.updateAgency)
router.get('/agency/:id', agencyController.getSingleAgency)
router.delete('/agency/:id', agencyController.deleteAgency)

router.post('/goal', goalController.createGoal)
router.get('/goal', goalController.getAllGoal)
router.put('/goal/:id', goalController.updateGoal)
router.get('/goal/:id', goalController.getSingleGoal)
router.delete('/goal/:id', goalController.deleteGoal)

router.post('/industry', industryController.createIndustry)
router.get('/industry', industryController.getAllIndustry)
router.put('/industry/:id', industryController.updateIndustry)
router.get('/industry/:id', industryController.getSingleIndustry)
router.delete('/industry/:id', industryController.deleteIndustry)

router.post('/services', serviceController.createService)
router.get('/services', serviceController.getAllService)
router.put('/services/:id', serviceController.updateService)
router.get('/services/:id', serviceController.getSingleService)
router.delete('/services/:id', serviceController.deleteService)


router.post('/directplan', directPlanCreationController.createX)
router.get('/directplan', directPlanCreationController.getAllPlans)
router.get('/directplan/:id', directPlanCreationController.getSinglePlan)
router.put('/directplan/:id', directPlanCreationController.updateSinglePlan)
router.delete('/directplan/:id', directPlanCreationController.deleteSinglePlan)

//temporary plan model
router.post('/tempplan', tempPlanController.createTempPlan)
router.post('/tempAssignments', tempExecutionController.getAllAssignmetsPlan)
router.post('/tempexecution', tempExecutionController.getAllExecutionForPlan)
router.put('/tempexecution', tempExecutionController.updateExecution)
router.get('/tempAssignment/:id', tempExecutionController.getAllAssignementBasedOnExpertee)
router.post('/getinstapostdata', handleInstaPost.getPostInfo)
router.post('/checktempexecduplicacy', tempExecutionController.validateLinkDuplication)

/*operation+execution api ends*/
/*insta api*/
router.get("/shorcode_info", insta.getCountBasedOnTrackedPost)
router.post("/add_image", upload1.fields([{ name: "brandImageToServer", maxCount: 10 }, { name: "campaignImageToServer", maxCount: 10 }, { name: "creatorImageToServer", maxCount: 10 }]), imageUpload.addImage)
router.post("/get_all_images", imageUpload.getImages)
router.get("/get_single_image/:id", imageUpload.getImage)
router.put("/update_image", upload1.fields([{ name: "brandImageToServer", maxCount: 10 }, { name: "campaignImageToServer", maxCount: 10 }, { name: "campaignImageToServer", maxCount: 10 }, { name: "creatorImageToServer", maxCount: 10 }]), imageUpload.editImages)
router.delete("/delete_image/:id", imageUpload.deleteImage)
// router.post("/upload_img_on_server",upload1.single("imageToServer"), insta.uploadImageToServer)
router.post("/add_tracked_post", insta.insertDataIntoPostAnalytics)
// router.get("/analytics_based_on_rating",insta.instaPostAnalyticsBasedOnRating)
router.post("/upload_img_on_server", upload1.single("imageToServer"), insta.uploadImageToServer)
router.post("/add_tracked_post", insta.insertDataIntoPostAnalytics)
router.put("/analytics_based_on_rating", insta.instaPostAnalyticsBasedOnRating)
router.post("/manually_tracked_shortcode", insta.manuallyApplyTrackingOnShortcode)
/**
 * Route handler for the POST request to retrieve data form different models bssed on provided matchCondition.
 * @param {string} "/get_post_analytics_data" - The endpoint for the request.
 * @param {Function} insta.getResBasedOnMatchForProvidedModel - The function to handle the request.
 * @returns None
 */
// router.post("/get_post_analytics_data", insta.getResBasedOnMatchForProvidedModel) //modified with cordination
router.post("/get_data_on_match_condition", insta.getResBasedOnMatchForProvidedModel)
router.post("/image_to_text", insta.imageToText)
router.post("/get_dynamic_key_value", insta.getDynamicReqAndResInstaP)
router.post("/get_dynamic_multiple__key_value", insta.getDynamicMultiReqAndResInsta)
router.post("/get_dynamic_key_value_instas", insta.getDynamicReqAndResInstaS)
router.get("/get_analytics", insta.getAnalytics)
router.post("/track_creator_post", insta.trackCreator);
router.get("/instagetcreators", insta.getCreators);
router.post("/track_creator_posty", insta.trackCreatorY);
router.put("/track_creator_puty/:pagename", insta.trackCreatorPutY);
router.get("/track_creator_get/:pagename", insta.trackCreatorGet);
router.post("/track_post_post", insta.trackPost);
router.get("/instagetposts", insta.getPosts);
router.post("/track_post_posty", insta.trackPostY);
router.post("/track_story_post", insta.trackStory);
router.put("/instaupdate", insta.editInsta);
router.get("/post_type_dec_count", insta.postTypeDecCount);
router.post("/creator_name_count", insta.creatorNameCount);
router.post("/creator_stories_count", insta.creatorStoriesCount);
router.post("/get_posts_from_name", insta.getPostsFromName);
router.get("/creator_insights", insta.creatorInsights);
router.get("/cfinstaapi", insta.cfInstaApi);
router.post("/countinstacp", insta.countInstaCPModels);
// router.get("/countinstacp", insta.countInstaCPModels);
router.post("/get_all_posts_by_id", insta.getPostsByDecNum);
router.get("/get_avg_frq_of_post", insta.getAvgFrqOfPost);
router.get("/get_all_stories", insta.getStories);
router.put("/update_insta_story", insta.editInstaStory);
router.post("/get_stories_from_name", insta.getStorysFromName);
router.post("/creator_name_count_for_stories", insta.creatorNameCountForStory);
router.post("/selector_name_count_instas", insta.selectorNameCountInstaS);
router.post("/selector_name_count_instap", insta.selectorNameCountInstaP);
router.post("/count_posted_on", insta.countBasedOnPostedOn);
/*execution api*/
router.post("/exe_inven_post", exe.exeInvenPost);
router.get("/get_exe_inventory", exe.getExeInventory);
router.get("/execution_graph", exe.executionGraph);
router.post("/exe_sum_post", exe.exeSumPost);
router.get("/get_exe_sum", exe.getExeSum);
router.put("/edit_exe_sum", exe.editExeSum);
router.get("/get_single_exe_pid_count/:p_id", exe.getLatestPIDCount);
// router.post("/add_exe_pid_history",exe.addIPCountHistory);
router.post("/add_exe_pid_history", exe.addIPCountHistory);
router.post("/exe_purchase_post", exe.exeForPurchase);
router.get("/get_all_purchase_data", exe.getAllExePurchase);
router.get("/get_exe_ip_count_history/:p_id", exe.getExeIpCountHistory);
router.delete("/delete_exe_ip_count_history/:_id", exe.deleteExeIpCountHistory);
router.put("/edit_exe_ip_count_history", exe.updateIPCountHistory);
router.post("/get_percentage", exe.getPercentage);
router.get("/get_all_exe_ip_history", exe.getAllExeHistory);
router.get("/get_stats_update_flag/:p_id", exe.getStatUpdateFlag);
router.get("/get_distinct_count_history/:p_id?", exe.getDistinctExeCountHistory);
router.post("/page_health_dashboard", exe.pageHealthDashboard);

router.post("/token_get_data/:sale_booking_execution_id", exe.AddExeToken);
router.put("/update_all_list_token/:execution_token", exe.updateAllListExeToken);


/* logo brand */
router.post("/add_logo_category", logoBrand.addLogoBrandCat);
router.get("/get_all_logo_categories", logoBrand.getLogoBrandsCat);
router.get(
  "/get_single_category/:id",

  logoBrand.getSingleLogoBrandCat
);
router.put("/update_logo_category", logoBrand.editLogoBrandCat);
router.delete("/delete_logo_category/:id", logoBrand.deleteLogoBrandCat);
router.post("/add_logo_brand", upload1.single('upload_logo'), logoBrand.addLogoBrand)
router.get("/get_logo_image/:filename", logoBrand.getlogoImage)
router.get("/get_logo_data", logoBrand.getLogoData)
router.get("/get_single_logo_data/:logo_id", logoBrand.getSingleLogoData)
router.get("/get_logo_data_for_brand/:brand_name", logoBrand.getLogoDataBasedBrand)
router.delete("/delete_logo/:logo_id", logoBrand.deleteLogoBrand)
router.delete("/delete_logo_based_brand/:brand_name", logoBrand.deleteLogoBrandBasedBrand)
router.put("/update_logo_brand", upload1.single('upload_logo'), logoBrand.editLogoBrand)
router.put("/update_logo_brand_new", logoBrand.editLogoBrandNew)

/* department */
router.post("/add_department", department.addDepartment); //Done
router.get("/get_all_departments", department.getDepartments); //Done
router.get(
  "/get_single_department/:id",

  department.getSingleDepartment
); //not used
router.put("/update_department", department.editDepartment); //Done
router.delete("/delete_department/:id", department.deleteDepartment); //Done

/* sub department */
router.post("/add_sub_department", department.addSubDepartment); //Done
router.get("/get_all_sub_departments", department.getSubDepartments); //Done
router.put("/update_sub_department", department.editSubDepartment); //Done
router.delete(
  "/delete_sub_department/:id",

  department.deleteSubDepartment
); //Done
router.get(
  "/get_subdept_from_dept/:dept_id",

  department.getSubDepartmentsFromDeptId
); //Done
router.get(
  "/get_subdept_from_id/:id",

  department.getSubDepartmentsFromId
); //Done

/* designation */
router.post("/add_designation", designation.addDesignation); //Done
router.put("/update_designation", designation.editDesignation); //Done
router.get(
  "/get_single_designation/:desi_id",
  designation.getSingleDesignation
); //Done
router.get(
  "/get_all_designations_by_deptId/:dept_id",
  designation.getAllDesignationByDeptID
);
router.delete("/delete_designation/:desi_id", designation.deleteDesignation); //Done
router.get("/get_all_designations", designation.getDesignations); //Done
router.get("/get_all_designation/:sub_dept_id", designation.getAllDesignationBySubDeptID);


/* Major Department */
router.post("/add_major_department", majorDepartmentController.addMajorDepartment);
router.get("/get_all_major_departments", majorDepartmentController.getMajorDepartments);
router.get("/get_single_major_department/:id", majorDepartmentController.getSingleMajorDepartment);
router.put("/edit_major_department", majorDepartmentController.editMajorDepartment);
router.delete("/delete_major_department/:id", majorDepartmentController.deleteMajorDepartment);

//brand routes
router.post("/add_brand", brand.addBrand);
router.get("/get_brands", brand.getBrands);
router.get("/check_unique_brand", brand.checkSubCatAndCat);
router.get("/get_brand/:id", brand.getBrandById);
router.put("/edit_brand", brand.editBrand);
router.delete("/delete_brand/:id", brand.deleteBrand);

//Campaign routes
router.post("/campaign", campagin.addCampaign);
router.get("/campaign", campagin.getCampaigns);
router.get("/campaign/:id", campagin.getCampaignById);
router.put("/campaign", campagin.editCampaign);
router.delete("/campaign/:id", campagin.deleteCampaign);

//Execution Campaign routes
router.post("/exe_campaign", verifyToken, exeCampaign.addExeCampaign);
router.get("/exe_campaign", verifyToken, exeCampaign.getExeCampaigns);
router.get("/exe_campaign/:id", verifyToken, exeCampaign.getExeCampaignById);
router.put("/exe_campaign/:id", verifyToken, exeCampaign.editExeCampaign);
router.delete("/exe_campaign/:id", verifyToken, exeCampaign.deleteExeCampaign);
router.get("/exe_campaign_name_wise", verifyToken, exeCampaign.getExeCampaignsNameWiseData);
router.get("/exe_campaign_wise_list/:id", verifyToken, exeCampaign.getAllExeCampaignList);


//ProjectxPageCategory
router.post(
  "/projectxpagecategory",
  projectxPageCategory.addProjectxPageCategory
);
router.get(
  "/projectxpagecategory",
  projectxPageCategory.getProjectxPageCategory
);
router.get(
  "/projectxpagecategory/:id",
  projectxPageCategory.getProjectxPageCategoryById
);
router.put(
  "/projectxpagecategory",
  projectxPageCategory.editProjectxPageCategory
);
router.delete(
  "/projectxpagecategory/:id",
  projectxPageCategory.deleteProjectxPageCategory
);

//ProjectxSubCategory
router.post("/projectxSubCategory", projectxSubCategory.addProjectxSubCategory);
router.get("/projectxSubCategory", projectxSubCategory.getProjectxSubCategory);
router.get(
  "/projectxSubCategory/:id",
  projectxSubCategory.getProjectxSubCategoryById
);
router.put("/projectxSubCategory", projectxSubCategory.editProjectxSubCategory);
router.delete(
  "/projectxSubCategory/:id",
  projectxSubCategory.deleteProjectxSubCategory
);

//Register Campaign
router.post(
  "/register_campaign",
  upload1.single("excel_file"),
  registerCampaign.addRegisterCampaign
);
router.get("/register_campaign", registerCampaign.getRegisterCampaigns);
router.put(
  "/register_campaign",
  upload1.single("excel_file"),
  registerCampaign.editRegisterCampaign
);
router.delete("/register_campaign/:id", registerCampaign.deleteRegisterCmp);
router.get("/register_campaign/:id", registerCampaign.getSingleRegisterCampign);

//Hash Tag
router.post("/hash_tag", hashTag.addHashTag);
router.get("/hash_tag", hashTag.getHashTags);
router.put("/hash_tag_edit", hashTag.editHashTag);
router.delete("/hash_tag/:id", hashTag.deleteHashTag);

//Keyword
router.post("/keyword", keyword.addKeyword);
router.get("/keyword", keyword.getKeywords);
router.get("/keyword/:id", keyword.getKeyword);
router.put("/keyword", keyword.editKeyword);
router.delete("/keyword/:id", keyword.deleteKeyword);

//Mentions
router.post("/mention", mention.addMention);
router.get("/mention", mention.getMentions);
router.get("/mention/:id", mention.getMention);
router.put("/mention", mention.editMention);
router.delete("/mention/:id", mention.deleteMention);

//InstaBotY
router.post("/bot_y", instaBotY.addBotY);
router.get("/bot_y", instaBotY.getBotYs);
router.get("/bot_y/:id", instaBotY.getBotY);
router.put("/bot_y", instaBotY.editBotY);
router.delete("/bot_y/:id", instaBotY.deleteBotY);

//InstaBotM
router.post("/bot_m", instaBotM.addBotM);
router.get("/bot_m", instaBotM.getBotMs);
router.get("/bot_m/:id", instaBotM.getBotM);
router.put("/bot_m", instaBotM.editBotM);
router.delete("/bot_m/:id", instaBotM.deleteBotM);

//InstaBotW
router.post("/bot_w", instaBotW.addBotW);
router.get("/bot_w", instaBotW.getBotWs);
router.get("/bot_w/:id", instaBotW.getBotW);
router.put("/bot_w", instaBotW.editBotW);
router.delete("/bot_w/:id", instaBotW.deleteBotW);

//Projectx Category
router.post("/projectxCategory", projectxCategory.addProjectxCategory);
router.get("/projectxCategory", projectxCategory.getProjectxCategory);
router.get("/projectxCategory/:id", projectxCategory.getProjectxCategoryById);
router.put("/projectxCategory", projectxCategory.editProjectxCategory);
router.delete("/projectxCategory/:id", projectxCategory.deleteProjectxCategory);

//Projectx
router.post("/projectxpost", projectx.addProjectx);
router.get("/getallprojectx", projectx.getProjectx);
router.post("/getprojectx", projectx.getProjectxByPageName);
router.put("/projectxupdate", projectx.editProjectx);
router.delete("/projectxdelete/:id", projectx.deleteProjectx);

//Projectx Record
router.post("/projectxRecord", projectxRecord.addProjectxRecord);
router.get("/projectxRecord", projectxRecord.getProjectxRecords);
router.put("/projectxRecord", projectxRecord.editProjectxRecord);
router.delete("/projectxRecord/:id", projectxRecord.deleteProjectxRecord);

//Register Campaign Content Section
router.post(
  "/contentSectionReg",
  upload.fields([
    { name: "content_sec_file", maxCount: 10 },
    { name: "cmpAdminDemoFile", maxCount: 1 },
  ]),

  contentSectionReg.addContentSectionReg
);
router.get("/contentSectionReg", contentSectionReg.getContentSectionReg);
router.put(
  "/contentSectionReg",
  upload.fields([
    { name: "content_sec_file", maxCount: 5 },
    { name: "cmpAdminDemoFile", maxCount: 1 },
  ]),
  contentSectionReg.editContentSectionReg
);

// Content Type
router.post("/content", contentType.addContentType);
router.get("/content", contentType.getContentTypes);
router.get("/content/:id", contentType.getContentTypeById);
router.put("/content", contentType.editContentType);
router.delete("/content/:id", contentType.deleteContentType);

/* finance */
router.post(
  "/add_finance",

  upload1.single("screenshot"),
  finance.addFinance
);
router.get("/get_finances", finance.getFinances);
router.get("/get_wfhd_financial_year_data", finance.getWFHFinancialYearData);
router.put(
  "/edit_finance",

  upload1.single("screenshot"),
  finance.editFinance
);
router.put("/edit_finance_utr", finance.editFinanceUtr);
router.delete("/delete_finance", finance.deleteFinance);
router.post("/set_utr_data", upload1.single("excel"), finance.setUtrData)
router.post("/get_wfhd_tds_users", finance.getWFHDTDSUsers);
router.put("/update_finance_data", finance.updateDataFinance);

/* Sitting Routes */
router.post("/add_sitting", sitting.addSitting);
router.get("/get_all_sittings", sitting.getSittings);
router.get("/get_single_sitting/:sitting_id", sitting.getSingleSitting);
router.put("/update_sitting", sitting.editSitting);
router.delete("/delete_sitting/:id", sitting.deleteSitting);
router.get("/not_alloc_sitting", sitting.getNotAllocSitting);

/* Sitting Routes */
router.post("/add_room", upload1.single("room_image"), sitting.addRoom);
router.put("/update_room", upload1.single("room_image"), sitting.editRoom);
router.get("/get_all_rooms", sitting.getRooms);
router.get("/get_room/:id", sitting.getRoomById);
router.delete("/delete_room/:id", sitting.deleteRoom);

/* Agency Routes */
router.post("/add_agency", agency.addAgency);
router.get("/get_all_agencys", agency.getAgencys);
router.get("/get_single_agency/:id", agency.getAgencyById);
router.put("/update_agency", agency.editAgency);
router.delete("/delete_agency/:id", agency.deleteAgency);

/* Object Mast */
router.post("/add_obj", objectMast.addObjectMast);
router.get("/get_all_objs", objectMast.getObjectMasts);
router.get("/objdata/:obj_id", objectMast.getObjectMastById);
router.put("/obj_update", objectMast.editObjectMast);
router.delete("/obj_delete/:obj_id", objectMast.deleteObjectMast);

/* role */
router.post("/add_role", role.addRole);
router.get("/get_all_roles", role.getRoles);
router.put("/update_role", role.editRole);
router.delete("/delete_role/:role_id", role.deleteRole);

/* Announcement */
router.post("/add_annomastpost", announcement.addAnnouncement);
router.get(
  "/get_all_announcementdatas",

  announcement.getAnnouncements
);
router.get(
  "/get_single_announcement/:id",

  announcement.getAnnoncementById
);
router.delete(
  "/delete_annomastdelete/:id",

  announcement.deleteAnnoncement
);
router.put("/update_annomastput", announcement.editAnnoncement);

/* job responsibility */
router.post(
  "/add_job_responsibility",

  responsibility.addJobResponsibility
);
router.get(
  "/get_all_jobresponsibilitys",

  responsibility.getJobResposibilities
);
router.get(
  "/get_single_jobresponsibility/:id",

  responsibility.getSingleJobResponsibility
);
router.put(
  "/update_jobresponsibility",

  responsibility.editJobResponsibility
);
router.delete(
  "/delete_jobresponsibility/:id",

  responsibility.deleteJobResponsibility
);

router.post(
  "/add_responsibility",

  responsibility.addResponsibility
);
router.get(
  "/get_all_responsibilitys",

  responsibility.getResposibilities
);
router.get(
  "/get_single_responsibility/:id",

  responsibility.getSingleResposibility
);
router.put(
  "/edit_responsibility/:id",

  responsibility.editResponsibility
);
router.delete(
  "/delete_responsibility/:id",

  responsibility.deleteResponsibility
);

/* Content Management Routes */
router.post(
  "/add_contentMgnt",
  upload1.single("content"),
  contentM.addcontentManagement
);
router.get(
  "/get_all_contentMgnts",

  contentM.getcontentManagements
);
router.get(
  "/get_single_contentMgnt/:id",

  contentM.getContentManagementById
);
router.put(
  "/update_contentMgnt",
  upload1.single("content"),
  contentM.editcontentManagement
);
router.delete(
  "/delete_contentMgnt/:id",

  contentM.deletecontentManagement
);

/* BillingHeader Routes */
router.post("/add_billingheader", billingheader.addBillingHeader);
router.get(
  "/get_all_billingheaders",

  billingheader.getBillingHeaders
);
router.get(
  "/get_single_billingheader/:id",

  billingheader.getBillingHeaderById
);
router.put(
  "/update_billingheader",

  billingheader.editBillingHeader
);
router.delete(
  "/delete_billingheader/:id",

  billingheader.deleteBillingHeader
);

/* Brand Category */
router.post("/brandCategory", brandCategory.addBrandCategory);
router.get("/brandCategory", brandCategory.getBrandCategorys);
router.get("/brandCategory/:id", brandCategory.getBrandCategoryById);
router.put("/brandCategory", brandCategory.editBrandCategory);
router.delete("/brandCategory/:id", brandCategory.deleteBrandCategory);

/* Campaign Category */
router.post("/campaignCategory", campaignCategory.addCampaignCategory);
router.get("/campaignCategory", campaignCategory.getCampaignCategories);
router.get("/campaignCategory/:id", campaignCategory.getCampaignCategoryById);
router.put("/campaignCategory", campaignCategory.editCampaignCategory);
router.delete("/campaignCategory/:id", campaignCategory.deleteCampaignCategory);

/* Brand Sub Category */
router.post("/brandSubCategory", brandSubCategory.addBrandSubCategory);
router.get("/brandSubCategory", brandSubCategory.getBrandSubCategorys);
router.get("/brandSubCategory/:id", brandSubCategory.getBrandSubCategoryById);
router.put("/brandSubCategory", brandSubCategory.editBrandSubCategory);
router.delete("/brandSubCategory/:id", brandSubCategory.deleteBrandSubCategory);

/* Brand Major Category */
router.post("/brandMajorCategory", brandMajorCategory.addBrandMajorCategory);
router.get("/brandMajorCategory", brandMajorCategory.getBrandMajorCategorys);
router.get(
  "/brandMajorCategory/:id",
  brandMajorCategory.getBrandMajorCategoryById
);
router.put("/brandMajorCategory", brandMajorCategory.editBrandMajorCategory);
router.delete(
  "/brandMajorCategory/:id",
  brandMajorCategory.deleteBrandMajorCategory
);

/* Insta Brand */
router.post("/insta_brand", instaBrand.addInstaBrand);
router.get("/insta_brand", instaBrand.getInstaBrands);
router.get("/insta_brand/:id", instaBrand.getInstaBrandById);
router.put("/insta_brand", instaBrand.editInstaBrand);
router.delete("/insta_brand/:id", instaBrand.deleteInstaBrand);

//---------------------------------------------------------------------------All Routes OF User Module Starts Here ---------------------------------------------------------------------------------------------------//

router.post("/add_user", user.addUser);
router.post("/add_user_for_general_information", user.addUserForGeneralInformation);
router.post("/forgot_pass", user.forgotPass);
router.put("/update_user", user.updateUser);
router.put("/update_user_for_general_information/:user_id", user.updateUserForGeneralInformation);
router.put("/update_user_for_other_details/:user_id", user.updateUserInformation);
router.put("/update_user_for_bank_details/:user_id", user.updateBankInformation);

router.get("/get_wfh_user/:dept_id", user.getWFHUsersByDept);
router.get("/get_all_users", user.getAllUsers);
router.get("/get_single_user/:id", user.getSingleUser);
router.delete("/delete_user/:id", user.deleteUser);
router.post("/add_user_auth", user.addUserAuth);
router.put("/update_user_auth", user.updateUserAuth);
router.delete("/delete_user_auth", user.deleteUserAuth);
router.get("/get_all_user_auth", user.allUserAuthDetail);
router.post("/login_user", user.loginUser);
router.post("/log_out", user.logOut);
router.get("/get_delivery_boy", user.deliveryBoy); //done
router.get("/get_delivery_user", user.deliveryUser);
router.get(
  "/get_single_delivery_boy_by_room/:room_id",

  user.deliveryBoyByRoom
); //done
router.get(
  "/get_single_user_auth_detail/:Juser_id",

  user.getSingleUserAuthDetail
);
router.get("/get_user_object_auth", user.userObjectAuth);
router.post(
  "/add_send_user_mail",
  user.sendUserMail
);
router.post(
  "/get_user_job_responsibility",

  user.getUserJobResponsibility
);
router.get("/get_user_by_deptid/:id", user.getUserByDeptId);
router.get("/get_user_other_fields/:user_id", user.getUserOtherFields);
router.post(
  "/add_user_other_field",

  upload.single("field_value"),
  user.addUserOtherField
);
router.put(
  "/update_user_other_fields/:id",

  upload.single("field_value"),
  user.getUserOtherFields
);

router.get("/get_user_time_line/:id", user.getUserTimeLine);
router.post("/l1l2l3_users_by_dept", user.l1l2l3UsersByDept);

router.get("/report_l1_users_data/:id", user.reportl1UsersData);

router.get("/user_hiearchy/:id", user.userHierarchy);


router.post("/login_user_data", user.loginUserData);
router.get("/login_user_data_with_jarvis/:user_id", user.loginUserDataWithJarvis2);
router.post("/add_reason", user.addReason);
router.get("/get_all_reasons", user.getAllReasons);
router.post("/add_separation", user.addSeparation);
router.get("/get_all_separations", user.getAllSeparations);
router.get("/get_single_separation/:id", user.getSingleSeparation);
router.put("/update_separation", user.updateSeparation);
router.post(
  "/add_send_mail_all_wfo_user",

  upload.single("attachment"),
  user.sendMailAllWfoUser
);
router.post("/send_mail_for_extend_joining_date", user.sendUserMailForJoiningDayExtension);
router.get("/get_all_wfh_users", user.getAllWfhUsers);
router.get("/get_all_login_history", user.getLoginHistory);
router.post("/get_user_pre_sitting", user.getUserPresitting);
router.get("/get_all_users_with_doj", user.getAllUsersWithDoj);
router.get("/get_all_users_with_dob", user.getAllUsersWithDoB);
router.get("/get_last_month_users", user.getLastMonthUsers);
router.get("/get_all_filled_users", user.getAllFilledUsers);
router.get("/get_all_percentage", user.getFilledPercentage);
// router.post("/get_users_by_departments",user.getUsersByDepartment);
// router.get("/get_first_time_login_users", user.getAllFirstLoginUsers)
router.post("/get_user_graph_data", user.getUserGraphData);
router.post("/get_user_graph_data_of_wfhd", user.getUserGraphDataOfWFHD);
router.post("/get_user_graph_data_of_wfo", user.getUserGraphDataOfWFO);
router.get("/get_users_with_status", user.getUsersWithStatus);
router.get("/get_all_sales_users", user.getAllSalesUsers);
router.get("/get_all_sales_users_list", user.getAllSalesUsersByDepartment);
router.get("/all_objs_in_user_auth/:user_id", user.assignAllObjInUserAuth);
router.post("/check_login_exist", user.checkLoginExist);
router.get("/get_all_users_with_invoiceno", user.getAllUsersWithInvoiceNo);
router.get("/users", user.getUsers);
router.post("/get_all_users_counts_with_joining_date", user.getAllUsersCountsWithJoiningDate);
router.get("/get_users_without_digital_signature_image", user.getAllWithDigitalSignatureImageUsers);
router.put("/rejoin_user", user.rejoinUser);
router.get("/get_all_users_with_roleId", user.getAllUsersWithRole);
router.post("/image_to_base64", user.ImagetoBase64);
router.get("/download_offerletter_in_bucket/:filename", user.downloadOfferLeterInBucket);
router.post("/send_offer_letter", user.sendOfferLetter);
router.post("/offer_letter_send_in_mail", upload.single("attachment"), user.sendOfferLetterMail);
router.put('/change_all_reportL1_by_sub_dept', user.changeAllReportL1BySubDept);
router.get("/get_wfh_users_with_dept", user.getAllWfhUsersWithDept);
router.get("/get_wfo_users_with_dept", user.getAllWfOUsersWithDept);
router.get("/get_work_anniversary", user.getWorkAnniversarysForWFHDUsers);
router.get("/get_wfo_users_work_anniversary", user.getWorkAnniversarysForWFOUsers);
router.get("/get_birth_days", user.getBirthDaysForWFHDUsers);
router.get("/get_wfo_users_birth_days", user.getBirthDaysForWFOUsers);
router.get("/get_newjoinee_of_wfhd_users", user.getNewJoineeOfWFHDUsers);
router.get("/get_newjoinee_of_wfo_users", user.getNewJoineeOfWFOUsers);
router.get("/get_exit_of_wfhd_users", user.getNewExitOfWFHDUsers);
router.get("/get_exit_of_wfo_users", user.getNewExitOfWFOUsers);
router.get("/get_all_exit_users_of_wfhd", user.getAllExitUsersOfWFHD);
router.get("/get_all_exit_users_of_wfo", user.getAllExitUsersOfWFO);
router.put("/update_training", user.updateTraining);
router.post("/changes_user_from_wfhd_to_wfo", user.changeUserFromWFHDToWFO);
router.get('/get_all_users_with_basic_fields', user.getAllUsersWithSomeBasicFields);

//---------------------------------------------------------------------------All Routes OF User Module Ends Here ---------------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------All Routes OF Attendance Module Starts Here ---------------------------------------------------------------------------------------------------//

router.post("/add_attendance", attendance.addAttendance);
router.post(
  "/get_salary_by_id_month_year",

  attendance.getSalaryByDeptIdMonthYear
);
router.post("/get_salary_by_month_year", attendance.getSalaryByMonthYear);
router.post("/get_salary_by_filter", attendance.getSalaryByFilter);
router.post(
  "/get_attendance_by_userid",

  attendance.getSalaryByUserId
);
router.get("/get_wfh_user_count", attendance.countWfhUsers);
router.post(
  "/get_salary_count_by_dept_year",

  attendance.getSalaryCountByDeptYear
);
router.get(
  "/get_salary_count_by_year",

  attendance.getSalaryCountByYear
);
router.post(
  "/new_joiners",

  attendance.newJoiners
);
router.get(
  "/all_attendence_mast_data",

  attendance.allAttendenceMastData
);
router.post(
  "/left_employees",

  attendance.leftEmployees
);
router.post(
  "/dept_id_with_wfh",

  attendance.deptIdWithWfh
);
router.get("/get_total_salary", attendance.totalSalary);
router.get("/current_month_all_dept_total_salary", attendance.currentMonthAllDeptTotalSalary);
router.get("/single_dept_whole_year_total_salary/:id", attendance.singleDeptWholeYearTotalSalary);
// router.get("/get_all_dept_with_wfh", attendance.allDeptWithWfh)
router.put("/update_salary", attendance.updateSalary);
router.put("/update_attendence_status", attendance.updateAttendenceStatus);
router.get("/get_month_year_data", attendance.getMonthYearData);
router.get("/get_month_year_merged_data", attendance.getMonthYearDataMerged);
router.post("/get_distinct_depts", attendance.getDistinctDepts);
router.post("/check_salary_status", attendance.checkSalaryStatus);
router.get("/all_departments_of_wfh", attendance.allDeptsOfWfh);
router.get("/dept_with_wfh", attendance.deptWithWFH);
router.post("/save_all_depts_attendance", attendance.addAttendanceAllDepartments);
router.get("/get_all_attendance_data", attendance.getAllAttendanceData);
router.get("/get_salary_calculation_data", attendance.getSalarycalculationData);
router.get("/get_salary_calculation_with_filter_data", attendance.getSalaryCalculationWithFilterData);
router.post("/get_users_count_by_dept", attendance.getUsersCountByDept);
router.put("/update_attendance", attendance.updateAttendance);
// router.get("/get_all_disputes", attendance.allAttendanceDisputeDatas);
// router.get("/get_all_disputes/:user_id", attendance.getUserAttendanceDisputeDatas);

router.delete("/delete_all_attendance", attendance.deleteAttecndenceData);
router.get("/get_salary_by_month_wise", attendance.getSalaryByMonthWise);
router.get("/get_salary_by_LPA", attendance.getSalaryWithLPAOfWFHD);
router.get("/get_salary_by_LPA_of_wfo_users", attendance.getSalaryWithLPAOfWFO);
router.get("/get_all_wfhd_users_with_bonus", attendance.getAllWFHDUsersWithBonus);
router.put("/update_all_salary_with_finance", attendance.updateAllSalaryWithFinance);


/* commitement */
router.post("/add_commitment", cmtController.addCmt);
router.put("/update_commitment", cmtController.editCmt);
router.get("/get_all_commitments", cmtController.getCmt);
router.get("/get_single_commitment/:id", cmtController.getCmtById);
router.delete("/delete_commitment/:id", cmtController.deleteCmt);


//--------------------------------------------------------------All Routes of Attendance Disputes------------------------------------------------------------------------------------------------------------------//

router.post("/add_attendance_dispute", attendanceDispute.addAttendanceDispute);
router.put("/update_attendance_dispute", attendanceDispute.editAttendanceDispute);
router.get("/get_all_disputes", attendanceDispute.getAttendanceDisputes);
router.get("/get_all_disputes/:user_id", attendanceDispute.getSingleAttendanceDispute);
router.delete("/delete_attendance_dispute/:_id", attendanceDispute.deleteAttendanceDispute);

//---------------------------------------------------------------------------All Routes OF Attendance Module Ends Here ---------------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------All Routes OF Product Module Starts Here ---------------------------------------------------------------------------------------------------//

//Product
router.post(
  "/add_product",
  upload1.single("Product_image"), //upload1

  productController.addProduct
); //done
router.put(
  "/update_productupdate",
  upload1.single("Product_image"), //upload1

  productController.editProduct
); //done
router.get(
  "/get_single_productdata/:id",

  productController.getProductById
); //done
router.get(
  "/get_all_products",

  productController.getProduct
); //done
router.delete(
  "/delete_productdelete/:id",

  productController.deleteProductById
); //done
//Product props
router.post("/add_proppost", productController.addProductProps); //done
router.get(
  "/get_single_propsdata/:product_id",

  productController.getProductPropsByProductId
); //done
router.put(
  "/update_propsdataupdate/:id",

  productController.editProductProps
); // build in sql but not used in react
router.delete(
  "/delete_propdelete/:id",

  productController.deleteProductProp
); //done

// Order Delivery api's
router.post(
  "/add_orderdelivery",

  productController.addOrderDelivery
); // build in sql but not used in react
router.get(
  "/get_all_orderdelivery",

  productController.getAllOrderDeliveries
); // build in sql but not used in react

//Order Req api's
router.post("/add_orderreq", productController.addOrderReq); //done
router.post(
  "/get_orderrequest",

  productController.getOrderReqByOrderId
); // build in sql but not used in react
router.put("/update_orderrequest", productController.editOrderReq); //done
router.put(
  "/update_statusupdatebymanager",

  productController.statusUpdateByManager
); //build in sql but not used in react
router.put(
  "/update_orderrequesttransbyman",

  productController.statusUpdateByManager
); // build in sql but not used in react
router.delete(
  "/delete_orderreqdelete",

  productController.deleteOrderReqById
); // build in sql but not used in react
router.get("/get_LastOrderId", productController.getLastOrderId); //done
router.get(
  "/get_single_deliveredorders/:id",

  productController.delivereOrdersById
); // build in sql but not used in react
router.get(
  "/get_single_pendingorders/:id",

  productController.pendingOrdersById
); //done
router.post(
  "/add_userorderrequest",

  productController.orderRequestsForUser
); // build in sql but not used in react
router.get(
  "/get_all_orderreqdata",

  productController.allOrderReqData
); //done
router.get(
  "/get_single_orderreqshistory/:user_id",

  productController.orderReqHistory
); //done
router.post(
  "/add_orderreqs",

  productController.getOrderReqsBasedOnFilter
); //done
router.post("/add_transreq", productController.addTransferReq); //done
router.get(
  "/get_all_transreq",

  productController.getAllTransferReq
); //done

//---------------------------------------------------------------------------All Routes OF Product Module Ends Here ---------------------------------------------------------------------------------------------------//

/* KRA Routes */
router.post("/add_kra", kra.addKra);
router.get("/get_single_kra/:user_id", kra.getJobResponById);
router.get("/get_all_kras", kra.getKras);

/* instapage routes */
router.post("/add_instapage", instapage.addIp); //done
router.put("/update_instapage", instapage.updateIp);
router.delete("/delete_instapage/:id", instapage.deleteInstaPage);
router.post("/add_platform", instapage.addPlatform); //done
router.get("/get_all_platforms", instapage.getAllPlatforms); //done
router.get("/get_single_platform_by_id/:id", instapage.getAllPlatforms); //done
router.put("/update_platform", instapage.updatePlatform); //done
router.delete("/delete_platform/:id", instapage.deletePlatform); //done
router.post("/add_iptype", instapage.addIpType); //done
router.get("/get_all_iptypes", instapage.getAllIpTypes); //done
router.post("/add_ipstats", instapage.addIpStats);
router.get("/get_stats", instapage.getStats);
router.get("/get_insta_count_history/:id", instapage.getInstaCountHistory);
router.get("/get_last_insta_count/:id", instapage.getLastInstaCount);
router.post("/add_insta_page_count", instapage.addInstaPageCount);
router.put("/update_iptype", instapage.updateIpType); //done
router.delete("/delete_iptype/:id", instapage.deleteIpType); //done
router.get("/get_iptype_byid/:id", instapage.getIpTypeById); //done
router.get("/get_platform_byid/:id", instapage.getPlatformById); //done
router.get("/get_instapage_byid/:id", instapage.getInstaPageById);
router.post("/dataforgraph", instapage.dataForGraph);
router.get("/get_all_instapages", instapage.getAllInstaPages);
router.post("/instagram", instapage.Instagram);

//---------------------------------------------------------------------------All Routes OF Lead Module Starts Here ---------------------------------------------------------------------------------------------------//

/* Lead Remark Route */
router.post("/add_leadremark", leadremark.addLeadRemark);
router.get("/get_all_leadremarks", leadremark.getLeadRemarks);
router.put("/update_leadremark", leadremark.editLeadRemark);

/* Lead Route */
router.post("/add_lead", lead.addLead);
router.get("/get_all_leads", lead.getLeads);
router.get("/get_single_lead/:lead_id", lead.getLeadById);
router.put("/update_lead", lead.editLead);
router.delete("/delete_lead", lead.deleteLead);

/* Lead Type Route */
router.post("/add_leadtype", leadtype.addLeadType);
router.get("/get_all_leadtypes", leadtype.getLeadTypes);
router.put("/update_leadtype", leadtype.editLeadType);
router.delete("/delete_leadtype", leadtype.deleteLeadType);

/* Lead Mast Route */
router.post("/add_leadmast", leadmast.addLeadMast);
router.get("/get_all_leadmasts", leadmast.getLeadMasts);
router.get(
  "/get_single_leadmast/:leadmast_id",

  leadmast.getLeadMastById
);
router.put("/update_leadmast", leadmast.editLeadMast);
router.delete("/delete_leadmast", leadmast.deleteLeadMast);

//---------------------------------------------------------------------------All Routes OF Lead Module Ends Here ---------------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------All Routes OF Asset Module Starts Here ---------------------------------------------------------------------------------------------------//

/*sim api*/
router.get("/get_all_sims", sim.getSims); // done
router.post("/add_sim", upload1.single("invoiceCopy"), sim.addSim); //done
router.get("/get_single_sim/:id", sim.getSingleSim); // done
router.put("/update_sim", upload1.single("invoiceCopy"), sim.editSim); //done
router.delete("/delete_sim/:id", sim.deleteSim); //done
router.post("/add_sim_allocation", sim.addAllocation); //done
router.get("/get_all_allocations", sim.getAllocations);
router.get("/get_allocation_by_alloid/:id", sim.getAllocationDataByAlloId);
router.get("/get_allocation_data_by_id/:id", sim.getSimAllocationDataById);
router.get("/get_allocated_asset_data_for_user_id/:id", sim.getAllocatedAssestByUserId);
router.put("/update_allocationsim", sim.editAllocation);
router.delete("/delete_allocation/:id", sim.deleteAllocation);
router.get("/alldataofsimallocment", sim.alldataofsimallocment);
router.get("/get_asset_department_count", sim.getAssetDepartmentCount);
router.get("/get_asset_users_of_dept/:dept_id", sim.getAssetUsersDepartment);
router.get("/get_total_asset_in_category/:category_id", sim.getTotalAssetInCategory);
router.get("/get_total_asset_in_category_allocated/:category_id", sim.getTotalAssetInCategoryAllocated);
router.get("/show_asset_hr_data", sim.showAssetDataToHR);
router.get("/show_asset_user_data/:user_id", sim.showAssetDataToUser);
router.get("/show_new_asset_user_data/:user_id", sim.showNewAssetDataToUser);
router.get("/show_asset_user_data_report/:user_id", sim.showAssetDataToUserReport);
router.get("/get_asset_by_sub_cat_id/:id", sim.getSimBySubCategoryId);

/* Asset Category Routes */
router.post("/add_asset_category", assetCategory.addAssetCategory);
router.get("/get_all_asset_category", assetCategory.getAssetCategorys);
router.get(
  "/get_single_asset_category/:category_id",
  assetCategory.getSingleAssetCategory
);
router.put("/update_asset_category", assetCategory.editAssetCategory);
router.delete(
  "/delete_asset_category/:category_id",
  assetCategory.deleteAssetCategory
);
router.get("/get_count_sub_category/:category_id", assetCategory.getAssetSubCategoryCount);

/* Asset Sub Category Routes */
router.post("/add_asset_sub_category", assetSubCategory.addAssetSubCategory);
router.get(
  "/get_all_asset_sub_category",
  assetSubCategory.getAssetSubCategorys
);
router.get(
  "/get_single_asset_sub_category/:category_id",
  assetSubCategory.getSingleAssetSubCategory
);
router.get(
  "/get_single_asset_cat/:sub_category_id",
  assetSubCategory.getSingleAssetCat
);
router.put("/update_asset_sub_category", assetSubCategory.editAssetSubCategory);
router.delete(
  "/delete_asset_sub_category/:sub_category_id",
  assetSubCategory.deleteAssetSubCategory
);
router.get(
  "/get_sub_category_from_categroyid/:category_id",
  assetSubCategory.getAssetSubCategoryFromCategoryId
);
router.get("/get_total_asset_in_sub_category/:sub_category_id", assetSubCategory.getTotalAssetInSubCategory);
router.get("/get_total_asset_in_sub_category_allocated/:sub_category_id", assetSubCategory.getTotalAssetInSubCategoryAllocated);
router.get("/get_asset_by_sub_cat/:sub_category_id", assetSubCategory.getAssetBySubCat)
/* Vendor Routes */
router.post("/add_vendor", vendor.addVendor);
router.get("/get_all_vendor", vendor.getVendors);
router.get("/get_single_vendor/:vendor_id", vendor.getSingleVendor);
router.put("/update_vendor", vendor.editVendor);
router.delete("/delete_vendor/:vendor_id", vendor.deleteVendor);

// Asset Brand Routes 
router.post("/add_asset_brand", assetBrand.addAssetBrand);
router.put("/update_asset_brand", assetBrand.editAssetBrand);
router.get("/get_all_asset_brands", assetBrand.getAssetBrands);
router.get("/get_single_asset_brand/:id", assetBrand.getAssetBrandById);
router.delete("/delete_asset_brand/:id", assetBrand.deleteAssetBrand);
router.get("/get_asset_available_count_in_brand/:asset_brand_id", assetBrand.getTotalAvailableAssetInBrand);
router.get("/get_asset_allocated_count_in_brand/:asset_brand_id", assetBrand.getTotalAllocatedAssetInBrand);

// Asset Modal Routes 
router.post("/add_asset_modal", assetModal.addAssetModal);
router.put("/update_asset_modal", assetModal.editAssetModal);
router.get("/get_all_asset_modals", assetModal.getAssetModals);
router.get("/get_single_asset_modal/:id", assetModal.getAssetModalById);
router.get("/get_asset_modal_by_asset_brandId/:id", assetModal.getAssetModalByAssetBrandId);
router.delete("/delete_asset_modal/:id", assetModal.deleteAssetModal);
router.get("/get_asset_available_count_in_modal/:asset_modal_id", assetModal.getTotalAvailableAssetInModal);
router.get("/get_asset_allocated_count_in_modal/:asset_modal_id", assetModal.getTotalAllocatedAssetInModal);

// Asset Request Routes
router.post("/assetrequest", assetRequest.addAssetRequest);
router.put("/assetrequest", assetRequest.editAssetRequest);
router.get("/assetrequest", assetRequest.getAssetRequests);
router.get("/assetrequest/:id", assetRequest.getAssetRequestById);
router.delete("/assetrequest/:_id", assetRequest.deleteAssetRequest);
router.get("/assetrequest/:user_id", assetRequest.showAssetRequestData);
router.get("/show_asset_with_status", assetRequest.showAssetWithStatus);


// Asset Reason Routes
router.post("/add_asset_reason", assetReson.addAssetReason);
router.put("/update_asset_reason", assetReson.editAssetReason);
router.get("/get_all_assetResons", assetReson.getAssetReasons);
router.get("/get_single_assetReson/:id", assetReson.getAssetReasonById);
router.delete("/delete_assetReson/:id", assetReson.deleteAssetReason);

// Asset Repair Request Routes
router.post("/add_repair_request", repairRequest.addRepairRequest);
router.put("/update_repair_request", repairRequest.editRepairRequest);
router.get("/get_all_repair_request", repairRequest.getAllRepairRequests);
router.get("/get_single_repair_request/:id", repairRequest.getSingleRepairRequests);
router.get("/get_all_repair_request_by_asset_reasonId/:id", repairRequest.getAllRepairRequestsByAssetReasonId);
router.delete("/delete_repair_request/:id", repairRequest.deleteRepairRequest);
router.get("/show_repair_request_asset_data_to_reportL1/:user_id", repairRequest.showRepairRequestAssetDataToUserReport);
router.get("/show_asset_repair_request_data_to_user/:user_id", repairRequest.showAssetRepairRequestDataToUser);
router.get("/get_summary_for_asset_repair_request", repairRequest.getAllRepairRequestsForSummary);
router.get("/get_single_repair_request_by_reqBy/:req_by", repairRequest.getSingleRepairRequestsByReqBy);

// asset summary repair and return routes
router.get("/get_all_repair_summary_data", repairandreturnsumdata.getAllRepairSummaryData);
router.get("/get_all_return_summary_data", repairandreturnsumdata.getAllReturnSummaryData);

/* Assets Images master */
router.post("/add_assets_images", assetsImage.addAssetImage);
router.get("/get_all_assets_images", assetsImage.getAllAssetsImages);
router.post("/get_single_assets_image", assetsImage.getSingleAssetsImage);
router.put("/update_assets_images", assetsImage.updateAssetImage);
router.delete(
  "/delete_assets_images/:asset_image_id",
  assetsImage.deleteAssetImage
);

// Asset Return Request Routes
router.post("/assetreturn", assetReturnRequest.addAssetReturnRequest);
router.put("/assetreturn", assetReturnRequest.editAssetReturnRequest);
router.get("/assetreturn", assetReturnRequest.getAssetReturnRequests);
router.get("/assetreturn/:_id", assetReturnRequest.getAssetReturnRequestById);
router.delete("/assetreturn/:_id", assetReturnRequest.deleteAssetReturnRequest);
router.get("/show_return_asset_to_reportL1/:user_id", assetReturnRequest.showReturnAssetDataToUserReport);
router.get("/get_summary_of_asset_return", assetReturnRequest.showReturnReturnAllData)
router.get("/get_summary_of_asset_return_by_user/:asset_return_by", assetReturnRequest.assetReturnByUser)

//Asset History Routes
router.get("/get_all_asset_history", assetHistory.getAllAssetsHistrory);
router.get("/get_single_asset_history/:sim_id", assetHistory.getSingleAssetHistory);

//---------------------------------------------------------------------------All Routes OF Asset Module Ends Here ---------------------------------------------------------------------------------------------------//

/* Page Uniqueness routes for insta */
router.post("/page_uniqueness", pageUniqueness.addPageUniqueness);
router.get("/page_uniqueness", pageUniqueness.getAllPageUniqueness);
router.get("/page_uniqueness/:id", pageUniqueness.getPageUniquenessById);
router.put("/page_uniqueness", pageUniqueness.editPageUniqueness);
router.delete("/page_uniqueness/:id", pageUniqueness.deletePageUniqueness);

/* coc routes */
router.post("/add_coc", coc.addCoc);
router.get("/get_all_cocs", coc.getAllCocs);
router.get("/get_single_coc/:_id", coc.getSingleCoc);
router.put("/update_coc", coc.editCoc);
router.get("/get_coc_history/:_id", coc.getCocHistory);
router.delete("/delete_coc/:_id", coc.deleteCoc);

/* New coc routes */
router.post("/newcoc", newCoc.addNewCoc);
router.get("/newcoc", newCoc.getAllNewCocs);
router.get("/newcoc/:_id", newCoc.getSingleNewCoc);
router.put("/newcoc", newCoc.editNewCoc);
router.delete("/newcoc/:_id", newCoc.deleteNewCoc);
router.get("/latest_newcoc", newCoc.getLatestNewCoc);

/* Document master */
router.post("/add_doc", documentController.addDocument);
router.get("/get_all_docs", documentController.getDocs);
router.get("/get_doc/:id", documentController.getDoc);
router.put("/update_doc", documentController.editDoc);
router.delete("/delete_doc/:id", documentController.deleteDoc);
router.post(
  "/add_doc_history",
  upload.fields([{ name: "doc_file", maxCount: 10 }]),
  documentController.addHistoryDoc
);
router.put("/update_doc_history", documentController.editHistoryDoc);
router.put("/edit_document_order", documentController.rearrangeDocumentOrder);


/* crawler count api */
router.post("/add_crawler_count", insta.addCrawlerCount);
router.put("/update_crawler_count", insta.editCrawlerCount);
router.get("/get_all_crawlers", insta.getAllCrawler);
router.get("/get_single_crawler/:_id", insta.getSingleCrawler);

/* notifications api */
router.post("/add_notification", notification.addNotification);
router.get(
  "/get_all_unreden_notifications",
  notification.getAllUnredenNotifications
);
router.get("/get_all_notifications", notification.getAllNotifications);
router.put("/update_notification", notification.editNotification);
router.delete("/delete_notification/:_id", notification.deleteNotification);
/* user doc  */
router.post(
  "/add_user_doc",
  upload1.single("doc_image"),
  userDocManagement.addUserDoc
);
router.put(
  "/update_user_doc",
  upload1.single("doc_image"),
  userDocManagement.editDoc
);
// router.post("/get_user_doc/:id", userDocManagement.getUserDoc);
router.post("/get_user_doc", userDocManagement.getUserDoc);
router.post("/get_wfhd_user_doc", userDocManagement.getWFHDUserDoc);
router.delete("/delete_user_doc/:id", userDocManagement.deleteDoc);
router.get("/get_doc_by_userid/:user_id", userDocManagement.getDocsByUserID);
router.put("/update_doc_user", userDocManagement.updateUserDoc);

//Swagger Route
router.post("/add_dev_data", swaggerAccessManagement.addDevData);

// City Routes 
router.post("/add_city", city.addCity);
router.put("/update_city", city.editCity);
router.get("/get_all_cities", city.getAllCities);
router.get("/get_single_city/:_id", city.getSingleCity);
router.delete("/delete_city/:_id", city.deleteCity);

/* php finance api */
router.post("/add_php_finance_data_in_node", phpFinance.savePhpFinanceDataInNode);
router.get("/get_all_php_finance_data", phpFinance.getAllphpFinanceData);
router.delete("/delete_php_finance_data", phpFinance.deletePhpFinanceData);
router.get("/get_all_php_finance_data_pending", phpFinance.getAllphpFinanceDataPending);
router.post("/add_php_payment_acc_data_in_node", phpPayment.savePhpPaymentAccDataInNode);
router.get("/get_all_php_payment_acc_data", phpPayment.getAllphpPaymentAccData);
router.post("/add_payment_acc_data", phpPayment.addAccListData);
router.put("/edit_payment_acc_data", phpPayment.updateAccListData);
router.delete("/delete_payment_acc_data", phpPayment.deleteAccListData);
router.get("/get_all_php_payment_acc_data_pending", phpPayment.getAllphpPaymentAccDataForStatus);
router.put("/pending_approval_update", phpPayment.pendingApprovalUpdate);
router.put("/update_hide_status_php_payment_acc_data/:id", phpPayment.updateHideStatusForPhpPaymentAccData);
router.post("/add_php_payment_refund_data_in_node", phpRefund.savePhpPaymentRefundInNode);
router.get("/get_all_php_payment_refund_data", phpRefund.getAllphpPaymentRefundData);
router.get("/get_all_php_payment_refund_data_pending", phpRefund.getAllphpPaymentRefundDataStatus);
router.put("/pending_approval_refund_update", upload1.single("payment_screenshot"), phpRefund.pendingApprovalRefundUpdate);
router.post("/add_php_payment_incentive_data_in_node", phpIncentive.savePhpIncentiveInNode);
router.get("/get_all_php_payment_incentive_data", phpIncentive.getAllphpIncentiveData);
router.put("/edit_php_payment_incentive_data", phpIncentive.editPhpIncentiveData);
router.post("/add_php_payment_bal_data_in_node", phpPaymentBal.savePhpPaymentBalDataInNode);
router.get("/get_all_php_payment_bal_data", phpPaymentBal.getAllphpPaymentBalData);
router.put("/balance_payment_list_update", phpPaymentBal.balancePaymentListUpdate);
router.post("/add_php_pending_invoice_data_in_node", phpPendingInvoice.savePhpPaymentPendingInvoiceDataInNode);
router.get("/get_all_php_pending_invoice_data", phpPendingInvoice.getAllphpPaymentPendingInvoiceData);
router.put("/pending_invoice_update", upload1.single("invoice"), phpPendingInvoice.pendingInvoiceUpdate);
router.post("/add_php_sale_booking_tds_data_in_node", phpSaleBookingTds.savePhpSaleBookingTdsDataInNode);
router.get("/get_all_php_sale_booking_tds_data", phpSaleBookingTds.getAllphpSaleBookingTdsData);
router.post("/add_php_sale_booking_tds_verification_data_in_node", phpSaleBookingTds.savePhpSaleBookingTdsVerificationDataInNode);
router.get("/get_all_php_sale_booking_tds_verification_data", phpSaleBookingTds.getAllphpSaleBookingTdsVerificationData);
router.get("/get_all_php_payment_acc_data_customers/:cust_id", phpPayment.getAccListDataFromCustId)

/* email content routes */
router.post("/add_email_content", emailContent.addEmailContent);
router.put("/update_email_content", emailContent.editEmailContent);
router.get("/get_all_email_contents", verifyToken, emailContent.getAllEmailContents);
router.get("/get_single_email_content/:_id", emailContent.getSingleEmailContent);
router.delete("/delete_email_content/:_id", emailContent.deleteEmailContent);
router.post("/add_email_event", emailContent.addEmailEvent);
router.put("/update_email_event", emailContent.editEmailEvent);
router.get("/get_all_email_events", verifyToken, emailContent.getAllEmailEvents);
router.get("/get_single_email_event/:_id", emailContent.getSingleEmailEvent);

// Hobbies  Routes 
router.post("/add_hobby", hobby.addHobby);
router.put("/update_hobby", hobby.editHobby);
router.get("/get_all_hobbies", hobby.getHobbys);
router.get("/get_single_hobby/:id", hobby.getHobbyById);
router.delete("/delete_hobby/:id", hobby.deleteHobby);

// Family Person  Routes 
router.post("/add_family", family.addFamily);
router.put("/update_family", family.editFamily);
router.get("/get_all_families", family.getFamilys);
router.get("/get_single_family/:user_id", family.getSingleFamily);
router.delete("/delete_family/:id", family.deleteFamily);

// Education Routes 
router.post("/add_education", education.addEducation);
router.put("/update_education", education.editEducation);
router.get("/get_all_educations", education.getEducations);
router.get("/get_single_education/:user_id", education.getSingleEducation);
router.delete("/delete_education/:id", education.deleteEducation);

// Gaurdian Routes
router.post("/add_guardian", guardian.addGuardian);
router.put("/update_guardian", guardian.editGuardian);
router.get("/get_all_guardians", guardian.getGuardians);
router.get("/get_single_guardian/:user_id", guardian.getSingleGuardian);
router.delete("/delete_guardian/:id", guardian.deleteGuardian);

// Job Type Routes
router.post("/add_job_type", jobTypeController.addJobType);
router.put("/update_job_type", jobTypeController.editJobType);
router.get("/get_all_job_types", jobTypeController.getJobTypes);
router.get("/get_single_job_type/:id", jobTypeController.getJobType);
router.delete("/delete_job_type/:id", jobTypeController.deleteJobType);

//---------------------------------------------------------------------------All Routes OF Data Module Starts Here ---------------------------------------------------------------------------------------------------//
// Data Sub Category Routes
router.post("/add_data_sub_category", dataSubCat.addDataSubCat);
router.get("/get_all_data_sub_categories", dataSubCat.getDataSubCats);
router.get(
  "/get_single_data_sub_category/:_id",
  dataSubCat.getSingleDataSubCat
);
router.put("/update_data_sub_category", dataSubCat.editDataSubCat);
router.delete("/delete_data_sub_category/:_id", dataSubCat.deleteDataSubCat);
router.get(
  "/get_single_data_from_sub_category/:cat_id",
  dataSubCat.getSingleDataSubCategory
);


// Data Brand Routes
router.post("/add_data_brand", dataBrand.addDataBrand);
router.get("/get_all_data_brands", dataBrand.getDataBrands);
router.get(
  "/get_single_data_brand/:_id",
  dataBrand.getSingleDataBrand
);
router.put("/update_data_brand", dataBrand.editDataBrand);
router.delete("/delete_data_brand/:_id", dataBrand.deleteDataBrand);

// Data Content Type Routes
router.post("/add_data_content_type", dataContentType.addDataContentType);
router.get("/get_all_data_content_types", dataContentType.getDataContentTypes);
router.get(
  "/get_single_data_content_type/:_id",
  dataContentType.getSingleDataContentType
);
router.put("/update_data_content_type", dataContentType.editDataContentType);
router.delete("/delete_data_content_type/:_id", dataContentType.deleteDataContentType);

// Data Category Routes
router.post("/add_data_category", dataCategory.addDataCategory);
router.get("/get_all_data_categorys", dataCategory.getDataCategorys);
router.get(
  "/get_single_data_category/:_id",
  dataCategory.getSingleDataCategory
);
router.put("/update_data_category", dataCategory.editDataCategory);
router.delete("/delete_data_category/:_id", dataCategory.deleteDataCategory);
router.get(
  "/get_data_sub_category_from_categoryid/:_id",
  dataCategory.getDataSubCategoryCount
);

// Data Platform Routes
router.post("/add_data_platform", dataPlatform.addDataPlatform);
router.get("/get_all_data_platforms", dataPlatform.getDataPlatforms);
router.get(
  "/get_single_data_platform/:_id",
  dataPlatform.getSingleDataPlatform
);
router.put("/update_data_platform", dataPlatform.editDataPlatform);
router.delete("/delete_data_platform/:_id", dataPlatform.deleteDataPlatform);

//Data Routes
router.post("/add_data", dataController.addData);
router.get("/get_all_datas", dataController.getDatas);
router.get("/get_data_based_data_name/:data_id", dataController.getDataBasedDataName);
router.get("/get_data_based_data_name_new/:data_name", dataController.getDataBasedDataNameNew);
router.get(
  "/get_single_data/:data_id",
  dataController.getSingleData
);
router.put("/update_data", dataController.editData);
router.delete("/delete_data/:_id", dataController.deleteData);
router.delete("/delete_data_based_data/:data_name", dataController.deleteDataBasedData);
router.put("/edit_data_new", dataController.editDataNew);
router.get("/distinct_created_by", dataController.DistinctCreatedByWithUserName);
router.get("/distinct_designed_by", dataController.DistinctDesignedByWithUserName);
router.get("/images_with_data_name/:data_name", dataController.ImagesWithDataName);
router.get('/total_count_data', dataController.totalCountOfData);

//---------------------------------------------------------------------------All Routes OF Data Module Ends Here ---------------------------------------------------------------------------------------------------//

//deptDesiAuth routes
router.post("/add_dept_desi_auth", deptDesiAuth.addDeptDesiAuth);
router.get("/get_single_desi_dept_auth/:dept_id", deptDesiAuth.getSingleDeptDesiAuthDetail);
router.put("/update_dept_desi_auth", deptDesiAuth.updateDeptDesiAuth);

router.get("/get_single_desi_dept_auth_count", deptDesiAuth.getListDeptDesiAuthData);

// --------------------------------------------------------------Customer_&_Campaign-----------------------------------------------//

router.post("/add_customer_type", createCustomerType);
router.get("/get_customer_type/:id", getcustomerTypeDetail);
router.put("/update_customer_type/:id", updateCustomerType);
router.get("/get_all_customer_type", getCustomerTypeList);
router.delete("/delete_customer_type/:id", deleteCustomerType);

router.post("/add_account_type", createAccountType);
router.get("/get_account_type/:id", getAccountTypeDetail);
router.put("/update_account_type/:id", updateAccountType);
router.get("/get_all_account_type", getAccountTypeList);
router.delete("/delete_account_type/:id", deleteAccountType);

router.post("/add_ownership", createOwnership);
router.get("/get_ownership/:id", getOwnershipDetail);
router.put("/update_ownership/:id", updateOwnershipType);
router.get("/get_all_ownership", getOwnershipList);
router.delete("/delete_ownership/:id", deleteOwnership);

router.post("/add_customer_mast", createCustomerMast);
router.get("/get_customer_mast/:id", getCustomerMastDetail);
router.put("/update_customer_mast/:id", updateCustomerMast);
router.get("/get_all_customer_mast", getCustomerMastList);
router.delete("/delete_customer_mast/:id", customerMastDelete);
router.get("/get_all_customer_name_data", getCustomerMastNameListData);

router.post("/add_customer_contact", createCustomerContact);
router.get("/get_customer_contact/:id", getCustomerContactDetail);
router.put("/update_customer_contact/:id", updateCustomerContact);
router.get("/get_all_customer_contact", getCustomerContactList);
router.get("/get_list_customer_contact/:id", getListCustomerContactData);

router.delete("/delete_customer_contact/:id", deleteCustomerContact);

router.post("/add_doc_mast", createDocMast);
router.get("/get_doc_mast/:id", getDocMastDetail);
router.put("/update_doc_mast/:id", updateDocMast);
router.get("/get_all_doc_mast", getDocMastList);
router.delete("/delete_doc_mast/:id", deleteDocMast);

router.post("/add_customer_document", createCustomerDocument);
router.get("/get_customer_document/:id", getcustomerDocumentDetail);
router.put("/update_customer_document/:id", updateCustomerDocument);
router.get("/get_all_customer_document", getCustomerDocumentList);
router.get("/getlist_customer_document/:id", getAllCustomerDocumentList);

router.delete("/delete_customer_document/:id", deleteCustomerDocument);

// --------------------------------------------------------------User_Announcement------------------------------------------//

router.post("/add_announcement", createUserAnnouncement);
router.get("/get_user_announcement/:id", getUserAnnouncementDetail);
router.put("/update_user_announcement/:id", updateUserAnnouncement);
router.get("/get_all_user_announcement", getUserAnnoncementList);
router.get("/get_all_user_login_announcement/:id", getAllLoginUserAnnoncementListData);
router.delete("/delete_user_announcement/:id", deleteUserAnnouncementData);

router.put("/announcement_post_like", announcementUpdateData);
router.get("/get_announcement_reaction_details/:announcementId", announcementWiseGetReactionDetails);
router.post("/announcement_post_comment", announcementWiseComment);
router.get("/get_announcement_comments/:announcementId", announcementWisegetCommentsList);

// --------------------------------------------------------------Page Mangements System all Routes------------------------------------------//
//@2 This is vendor type master collection for dropdown
router.post("/addVendor", createPmsVendor);
router.get("/vendorDetail/:id", getVendorDetail);
router.put("/updateVendor/:id", updateVendorType);
router.get("/getAllVendor", getAllVendorData);
router.delete("/deleteVendor/:id", deleteVendorType);
//@2 End This is vendor type master collection for dropdown 
//@2 Platform master collection for dropdown
router.post("/addPlatform", createPlatform);
router.get("/platformDetail/:id", getPlatformDetail);
router.put("/updatePlatform/:id", updatePlatformData);
router.get("/getAllPlatform", getAllPlatformList);
router.delete("/deletePlatform/:id", deletePlatformData);
//@2 Platform master collection for dropdown 
router.post("/addpayMethod", createPayMethod);
router.get("/getPay/:id", getPayDetail);
router.put("/updatePay/:id", updatePayData);
router.get("/getAllPay", getAllPayList);
router.delete("/deletePay/:id", deletePayData);

//@2 Vendor paycycle master collection for dropdown 
router.post("/addPayCycle", createPayCycle);
router.get("/getPayCycle/:id", getPayCycleDetail);
router.put("/updatePayCycle/:id", updatePayCycle);
router.get("/getAllPayCycle", getAllPayCycleList);
router.delete("/deletePayCycle/:id", deletePayCycleData);
//@2 End Vendor paycycle master collection for dropdown 
router.post("/addGroupLink", createGroupLink);
router.get("/getGroupLink/:id", getGroupLinkDetail);
router.put("/updateGroupLink/:id", updateGroupLink);
router.get("/getAllGroupLink", getAllGroupLinkList);
router.delete("/deleteGroupLink/:id", deleteGroupLinkData);

//@2 Vendor Master Collection api - 
router.post("/addVendorMast", createPmsVendorMast);
router.get("/getVendorMast/:id", getVendorMastDetail);
router.put("/updateVendorMast/:id", updateVendorMast);
router.get("/vendorAllData", getAllVendorMastList);
router.get("/notAssignedToPageVendors", getNotAssignedToPageMastVenodrList);
router.get("/pageByVenodrId/:vendorMast_id", getPageByVenodrId);
router.delete("/deleteVendorMast/:id", vendorMastDelete);
//@2 End Vendor Master Collection api - 

router.post("/addVendorGroup", createVendorGroup);
router.get("/getVendorGroup/:id", getVendorGroupDetail);
router.put("/updateVendorGroup/:id", updateVendorGroup);
router.get("/getAllVendorGroupList", getAllVendorGroupList);
router.delete("/deleteVendorGroup/:id", deleteVendorGroupData);

router.post("/addPrice", createPriceType);
router.get("/getPrice/:id", getPriceDetail);
router.put("/updatePrice/:id", updatePriceType);
router.get("/getPriceList", getPriceList);
router.delete("/deletePrice/:id", deletePriceType);

router.post("/addPlatformPrice", createPlatformPrice);
router.get("/getPlatformPriceDetail/:id", getPlatformPriceDetail);
router.put("/updatePlatformPrice/:id", updatePlatformPriceData);
router.get("/getPlatformPriceList", getPlatformPriceList);
router.delete("/deletePlatformPrice/:id", deletePlatformPriceData);

router.post("/addPageCatg", createPageCatg);
router.get("/getPageCatg/:id", getPageCatgDetail);
router.put("/updatePageCatg/:id", updatePageCatg);
router.get("/getPageCatgList", getPageCatgList);
router.delete("/deletePage/:id", deletePageCatgData);

router.post("/addProfile", createPmsProfile);
router.get("/getProfile/:id", getProfileDetail);
router.put("/updateProfile/:id", updateProfileType);
router.get("/getProfileList", getProfileList);
router.delete("/deleteProfile/:id", deleteProfileType);

router.post("/addPageMast", createPageMast);
router.get("/getPageDetail/:id", getPageMastDetail);
router.put("/updatePage/:id", updatePageMast);
router.get("/getPageMastList", getPageMastList);
router.get("/getPageMastListQ", getTopPageMastList);
router.delete("/deletePageMast/:id", deletePageMastData);

router.post("/addPageOwner", createPageOwner);
router.get("/getPageOwner/:id", getPageOwnerDetail);
router.put("/updatePageOwner/:id", updatePageOwner);
router.get("/getPageOwnerList", getPageOwnerList);
router.delete("/deletePageOwner/:id", deletePageOwnerData);

router.post("/addVendorPagePrice", createVendorPagePrice);
router.get("/getVendorPagePrice/:id", getVendorPagePriceDetail);
router.put("/updateVendorPagePrice/:id", updateVendorPagePrice);
router.get("/getVendorPagePriceList", getVendorPagePriceList);
router.delete("/deleteVendorPagePrice/:id", deleteVendorPagePriceData);


router.post("/add_page_purchase_price", createPagePurchasePrice);
router.get("/get_page_purchase_price/:id", getPagePurchasePrice);
router.put("/update_page_purchase_price/:id", updatePagePurchasePrice);
router.get("/getlist_page_purchase_price", getPagePurchasePriceList);
// router.get("/getAll_page_purchase_price/:id", getAllPagePurchasePriceList);
router.delete("/delete_page_purchase_price/:id", deletePagePurchasePriceData);
router.get("/data/:_id", getAllDataList);
router.get("/get_all_data_list", getAllListData);

// exe history Data
router.post("/add_exe_history", addExeHistory);
router.put("/update_exe_history/:id", updateExeHistory);
router.get("/get_all_list_exe_history", getExeHistoryList);
router.get("/get_exe_history/:pageMast_id", getExeHistoryDetails);

router.get("/get_exe_historyData", getAllExeData);
router.post('/add_plan_making_data', planMakingController.addPlanMaking)
router.get('/get_all_plan_making_data', planMakingController.getAllPlanMakingData)
router.get('/get_single_plan_making_data/:_id', planMakingController.getSinglePlanMakingData)


//pms page assignment APi's
router.post("/add_page_assignment", pmsPageAssignment.createPageAssignment);
router.put("/update_page_assignment/:id", pmsPageAssignment.updatePageAssignment);
router.get("/get_page_assignment/:id", pmsPageAssignment.getPageAssignmentDetail);
router.get("/get_list_page_assignment", pmsPageAssignment.getPageAssignmentList);
router.delete("/delete_page_assignment/:id", pmsPageAssignment.deletePageAssignmentData);
router.get("/get_list_page_assignment_history", pmsPageAssignment.getPageAssignmentHistoryList);

// --------------------------------------------------------------Task Mangements all Routes------------------------------------------//
router.post("/addSubStatus", createTmsSubStatusMast);
router.get("/getSubStatus/:id", getTmsSubStatusMast);
router.put("/updateSubStatus/:id", updateTmsSubStatusMast);
router.get("/getAllSubstatus", getAllTmsSubStatusMast);
router.get("/getAllSubstatusList", getAllTmsSubStatusMastList);
router.delete("/deleteSubStatus/:id", deleteSubStatusMast);

router.post("/addSubCat", createTmsSubCatMast);
router.get("/getSubCat/:id", getTmsSubCatMast);
router.put("/updateSubCat/:id", updateTmsSubCatMast);
router.get("/getAllSubCatList", getAllTmsSubCatMast);
router.get("/allSubCatList", getAllTmsSubCatList);
router.delete("/deleteSubCat/:id", deleteTmsSubCatMast);

router.post("/createtmsCat", createTmsCatMast);
router.get("/getCatMast/:id", getTmsCatMast);
router.get("/getAllCatList", getAllTmsCatMast);
router.put("/updateCatMast/:id", updateTmsCatMast);
router.delete("/deteCatMast/:id", deleteTmsCatMast);

router.post("/addtmsStatus", createTmsStatusMast);
router.get("/getStatus/:id", getTmsStatusMast);
router.put("/updateStatus/:id", updateTmsStatusMast);
router.get("/getAllStatus", getAllTmsStatusMast);
router.get("/getAllStatusList", getAllTmsStatusMastList);
router.delete("/deleteStatus/:id", deleteStatusMast);

router.post("/addTaskJorney", upload1.single("attachments"), createTmsTaskJourney);
router.get("/gettaskJourney/:id", getTmsTaskJourney);
router.get("/getAllTaskJourney", getAllTmsTaskJourney);
router.get("/getAllTaskJourneyList", getAllTmsTaskJourneyList);
router.delete("/deleteTaskJourney/:id", deleteTaskJourney);

router.post("/addTask", upload1.single("attachments"), addTmsTaskMast);
router.get("/gettask/:id", getSingleTmsTaskMast);
router.put("/updateTask/:id", upload1.single('attachments'), updateTmsTaskMast)
router.get("/getAllTask", getAllTmsTaskMastList);
// router.get("/getAllTaskJourneyList", getAllTmsTaskJourneyList);
// router.delete("/deleteTaskJourney/:id", deleteTaskJourney);


//phpVendorRequest Routes
router.post("/phpvendorpaymentrequest", upload1.single('evidence'), phpVendorPaymentRequest.addPhpVendorPaymentRequestAdd);
router.get("/phpvendor_insert_data_node", phpVendorPaymentRequest.addPhpVendorPaymentRequestSet);
router.get("/phpvendorpaymentrequest", phpVendorPaymentRequest.getPhpVendorPaymentRequests);
router.get("/phpvendorpaymentrequest/:request_id", phpVendorPaymentRequest.getSinglePhpVendorPaymentRequest)
router.put("/phpvendorpaymentrequest", upload1.single('evidence'), phpVendorPaymentRequest.updatePhpVendorPaymentRequest);
router.delete("/deletephpvendorpaymentrequest/:request_id", phpVendorPaymentRequest.deletePhpVendorPaymentRequest);
router.put("/updatePhpVendorPaymentRequestImage", upload1.single('evidence'), phpVendorPaymentRequest.updatePhpVendorPaymentRequestImage);

// router.get("/phpvendorpaymentList/:status", phpVendorPaymentRequest.getVendorPaymentRequestList);
// router.get("/phpvendorpaymentmatchlist", phpVendorPaymentRequest.getVendorPaymentRequestMatchList);
//  router.get("/phpvendorpaymentWeeklyList", phpVendorPaymentRequest.getVendorPaymentRequestWeeklyList);
// router.get("/phpvendorpaymentmatchlist", phpVendorPaymentRequest.getVendorPaymentRequestDayWiseListData);

// phpVendorPurchase Routes
router.post("/phpvendorpurchasepaymentrequest", phpVendorPurchasePaymentRequest.addPhpVendorPurchasePaymentRequestSet);
router.get("/phpvendorpurchasepaymentrequest", phpVendorPurchasePaymentRequest.getPhpVendorPurchasePaymentRequests)

//Data Operation Routes
router.post("/dataoperation", dataOperation.addOperationData);
router.get("/dataoperation", dataOperation.getOprationDatas);
router.get("/dataoperation/:data_id", dataOperation.getSingleOprationData);
router.put("/dataoperation", dataOperation.editOperationData);
router.delete("/dataoperation/:_id", dataOperation.deleteOperationData);
router.delete("/dataoperationwithdataname/:data_name", dataOperation.deleteDataBasedData);
router.get("/get_data_operation_based_data_name_new/:data_name", dataOperation.getOperationDataBasedDataNameNew);
router.put("/editdataoperationname", dataOperation.editOperationDataName);

//user update history routes 
router.post('/update_user_history', userUpdateHistory.addUserUpdateHistory);
router.get("/get_single_user_update_history/:user_id", userUpdateHistory.getSingleUserUpdateHistory)


// user Training Routes
router.post("/add_user_training", userTraining.addUserTraining);
router.get("/get_user_trainings", userTraining.getUserTrainings);
router.get("/get_single_user_training/:user_id", userTraining.getSingleUserTraining);
router.put("/update_user_training", userTraining.editUserTraining);
router.delete("/delete_user_training/:_id", userTraining.deleteUserTraining);

// node php payment mode Routes
router.post("/add_payment_mode", nodePhpVendorPaymentMode.addPaymentMode);
router.get("/get_all_payment_mode", nodePhpVendorPaymentMode.getAllPaymentMode);
router.get("/get_single_payment_mode/:_id", nodePhpVendorPaymentMode.getSinglePaymentMode);
router.put("/edit_payment_mode/:_id", nodePhpVendorPaymentMode.editPaymentMode);
router.delete("/delete_payment_mode/:_id", nodePhpVendorPaymentMode.deletePaymentMode);

// Payment Gateway Routes
// router.post("/create_order", razorPay.createOrder);
router.post("/process_payment", razorPay.processPayment);

//Vendor Summary Data
router.post("/vendorsum", assetVendorSum.addVendorSum);
router.get("/vendorsum", assetVendorSum.getVendorSums);
router.get("/get_all_hr", assetVendorSum.getAllHR);
router.put("/vendorsum", assetVendorSum.editVendorSum);

//Dynamic table routes
router.post("/add_dynamic_table_data", dynamicTablesModel.addDynamicTablesData);
router.get("/get_dynamic_table_data", dynamicTablesModel.getSingleDynamicTablesData);
router.put("/edit_dynamic_table_data", dynamicTablesModel.editDynamicTablesData);

// admin password and email routes
router.post('/change_selected_user_password', adminController.changePassOfSelectedUsers);
router.post('/change_all_user_password', adminController.changePassOfUsers);
router.post('/send_email_to_all_users', adminController.sendPassEmailToUsers);
router.post("/node_data_to_php_update_vendor", adminController.nodeDataToPhpUpDateOfVendor);
router.post("/node_data_to_php_delete_vendor", adminController.nodeDataToPhpDeleteOfVendor);
router.post("/node_data_to_php_update_page", adminController.nodeDataToPhpUpdateOfPage);
router.post("/node_data_to_php_delete_page", adminController.nodeDataToPhpDeleteOfPage);

// router.post('/get_story_data', adminController.trackCreatorGet);
// router.put('/update_vendorid_pagemaster', adminController.updatepagevendorids);

//------------------------------------------------- New Operations Routes Starts Here----------------------------

//OpCampaign Routes Start Here
router.post('/opcampaign', opCampaign.addOpCampaign);
router.get('/opcampaign', opCampaign.getOpCampaigns);
router.get('/opcampaign/:id', opCampaign.getSingleOpCampaign);
router.delete('/opcampaign/:_id', opCampaign.deleteCampaign);
router.post('/get_filter_campaigns', opCampaign.filterCampagin);
router.get('/get_data', opCampaign.getCampaignWithFilterData);
router.get('/get_single_sale_booking_data_new_table/:sale_booking_id', opCampaign.getSingleSaleBookingData);
// router.get('/get_single_sale_booking_data_old_table/:sale_booking_id', opCampaign.getSingleSaleBookingData);

//OpCampaign Plan Routes
router.post('/opcampaignplan', opCampaignPlan.addCampaignPlan);
router.get('/opcampaignplan/:id', opCampaignPlan.getCampaignPlan);
router.get('/opcampaignplan/:_id', opCampaignPlan.getSingleCampaignPlan);
router.put('/opcampaignplan/:id', opCampaignPlan.updateSingleCampaignPlan);
router.delete('/opcampaignplan/:id', opCampaignPlan.deleteCampaignPlanDataByCampaignId);
router.delete('/opcampaignplansingle/:_id', opCampaignPlan.deleteCampaignPlan);
router.post('/get_excel_data_in_json_from_url', opCampaignPlan.getNsendExcelDataInJson);
router.post('/replace_plan_pages', opCampaignPlan.replacePlanPage);

//OpCampaign Phase
router.post('/opCampaignPhase', opCampaignPhase.addCampaignPhase);
router.get('/opCampaignPhase/:id', opCampaignPhase.getOpCampaignPhases);
router.post('/replace_phase_pages', opCampaignPhase.replacePhasePage);
router.delete('/opCampaignPhase', opCampaignPhase.deleteCampaignPhaseDataByCampaignId);
router.delete('/opCampaignPhaseSingle/:_id', opCampaignPhase.deleteCampaignPhase);

//OpExecution Routes
router.post('/opexecution', opExecution.addOPExecution);
router.get('/get_all_exe_phases_by_campid/:_id', opExecution.getOPExecutions);
router.get('/get_all_phases_by_campid/:_id', opExecution.getAllPhasesByCampId);
router.get('/get_all_phases_by_phaseName/:phaseName', opExecution.getAllPhasesByPhaseName);
router.get('/get_camp_commitments/:_id', opExecution.getCampCommits);
router.put('/opexecution', opExecution.updateOPExecution);
router.post('/add_new_page', opExecution.addNewPage)
router.get('/get_phase_commitments/:phaseName', opExecution.getPhaseCommits);
router.get('/phase_created_campaign', opExecution.phaseCreatedCampaign);

const pluralStorage = multer.memoryStorage();
const pluralUpload = multer({ storage: pluralStorage });

//------------------------------------------------- New Operations Routes End Here----------------------------
router.get('/change_vendor_id_to_id', adminController.changeVendorIdToId)
router.get('/change_primarypage_id_to_id', adminController.changePrimaryPageToId)
router.get('/shift_bank_details', adminController.shiftBankDetails)
router.get('/get_vendor_details_with_ids', adminController.getVendorDetailsWithIds)
router.get('/get_vendor_details_with_ids_by_id/:vendor_id', adminController.getVendorDetailsWithIdsById)
router.get('/generate_plural_payment_jwt_token', adminController.createJWTForPluralPayment)
router.get('/update_vid_in_grouplink', adminController.updateVendoridinGroupLink)
router.get('/copy_vhomeaddress_to_company', adminController.copyHomeToCompAddress)
router.post("/create_payout", adminController.createpayout);
router.post('/payout_from_file', pluralUpload.single('file'), adminController.pluralPayoutFromFile)

/* expense api */
router.post("/add_expense", expenseApi.addExpense);
router.post("/add_multiple_expense", expenseApi.addMultipleExpense);
router.get("/get_all_expense", expenseApi.getAllExpenses);
router.get("/get_single_expense/:_id", expenseApi.getSingleExpense);
router.put("/update_expense", expenseApi.editExpense);
router.delete("/delete_expense/:_id", expenseApi.deleteExpense);

/* expense account api */
router.post("/add_expense_account", expenseAccountApi.addExpenseAccount);
router.get("/get_all_expense_accounts", expenseAccountApi.getExpenseAccounts);
router.get("/get_single_expense_account/:_id", expenseAccountApi.getSingleExpenseAccount);
router.put("/update_expense_account", expenseAccountApi.editExpenseData);
router.delete("/delete_expense_account/:_id", expenseAccountApi.deleteExpenseData);

/* expense Category api */
router.post("/add_expense_category", expenseCategoryApi.addExpenseCategory);
router.get("/get_all_expense_categories", expenseCategoryApi.getExpenseCategories);
router.get("/get_single_expense_category/:_id", expenseCategoryApi.getSingleExpenseCategory);
router.put("/update_expense_category", expenseCategoryApi.editExpenseCategory);
router.delete("/delete_expense_category/:_id", expenseCategoryApi.deleteExpenseData);

/* user history routes */
router.get("/get_all_history_data", userHistoryController.getAllUserHistorys);

module.exports = router;