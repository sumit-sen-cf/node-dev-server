const express = require("express");
const router = express.Router();

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
const assignmentCommitController=require('./controllers/operationExecution/assignmentCommitController.js')
const operationDasboard =require('./controllers/operationExecution/dashboard.controller.js')
//opertaion + execution imports ends here`

const city = require("./controllers/cityController.js");
const phpFinance = require("./controllers/phpFinance.js")
const phpPayment = require("./controllers/phpPaymentAccList.js")
const phpRefund = require("./controllers/phpPaymentRefund.js")
const phpIncentive = require("./controllers/phpIncentive.js")
const phpPaymentBal = require("./controllers/phpPaymentBalList.js");
const phpPendingInvoice = require("./controllers/phpPendingInvoice.js");
const phpSaleBookingTds = require("./controllers/saleBookingTds.js");


router.get("/", (req, res) => {
  res.send({ message: "Welcome to my application." });
});

/* demo api */
router.post("/add_demo",upload1.single("t13"), demoApi.addDemo);
router.get("/get_all_demo", demoApi.getAllDemo);
router.get("/get_single_demo/:_id", demoApi.getSingleDemo);
router.put("/update_demo",upload1.single("t13"), demoApi.editDemo);
router.delete("/delete_demo/:_id", demoApi.deleteDemo);

/*operation+execution api starts*/
router.post("/campaignplan", campaignPlanController.createPlan);
router.put("/campaignplan", campaignPlanController.updateBulk);
router.get("/campaignplan/:id", campaignPlanController.getPlan);
router.get('/campaignplan/singleplan/:id', campaignPlanController.getSinglePlan)
router.put('/campaignplan/singleplan/:id', campaignPlanController.singlePlanUpdate)
router.put('/updatePlan', campaignPlanController.updatePlan)
router.put('/updatePhase', campaignPhaseController.updatePhase)
router.put('/updateAssignment', assignmentController.updateAssignment)
// router.get('/campaignplan/:id', campaignPlanController.getPlan)

router.post('/campaignphase', campaignPhaseController.createPhase)
router.get('/campaignphase/:id', campaignPhaseController.getAllPhase)
router.get('/campaignphase/singlephase/:id', campaignPhaseController.getSinglePhase)

router.post('/expertise',expertiseController.createExpert)
router.get('/expertise',expertiseController.getAllExpert)
router.get('/expertise/:id',expertiseController.getSingleExpert)
router.put('/expertise/:id',expertiseController.updateExpert)
router.delete('/expertise/:id',expertiseController.deleteExpert)

router.post('/assignment',assignmentController.createAssignment)
router.get('/assignment/:id',assignmentController.getSingleAssignment)

router.get('/assignment/all/:id',assignmentController.getAllAssignmentToExpertee)


router.post('/assignment/commit',assignmentCommitController.createAssComm)
router.get('/assignment/commit/:id',assignmentCommitController.getAllAssComm)
router.post('/operation_phase_dashboard',operationDasboard.phaseDashboard)



/*operation+execution api ends*/
/*insta api*/
router.get("/shorcode_info",insta.getCountBasedOnTrackedPost)
router.post("/add_image",upload1.fields([{ name: "brandImageToServer", maxCount: 10 },{name: "campaignImageToServer", maxCount: 10},{name:"creatorImageToServer", maxCount: 10}]), imageUpload.addImage)
router.post("/get_all_images",imageUpload.getImages)
router.get("/get_single_image/:id",imageUpload.getImage)
router.put("/update_image",upload1.fields([{ name: "brandImageToServer", maxCount: 10 },{name: "campaignImageToServer", maxCount: 10},{name: "campaignImageToServer", maxCount: 10},{name:"creatorImageToServer", maxCount: 10}]), imageUpload.editImages)
router.delete("/delete_image/:id", imageUpload.deleteImage)
// router.post("/upload_img_on_server",upload1.single("imageToServer"), insta.uploadImageToServer)
router.post("/add_tracked_post",insta.insertDataIntoPostAnalytics)
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
router.get("/get_all_purchase_data",exe.getAllExePurchase);
router.get("/get_exe_ip_count_history/:p_id", exe.getExeIpCountHistory);
router.delete("/delete_exe_ip_count_history/:_id", exe.deleteExeIpCountHistory);
router.put("/edit_exe_ip_count_history", exe.updateIPCountHistory);
router.post("/get_percentage", exe.getPercentage);
router.get("/get_all_exe_ip_history", exe.getAllExeHistory);
router.get("/get_stats_update_flag/:p_id", exe.getStatUpdateFlag);
router.get("/get_distinct_count_history/:p_id?", exe.getDistinctExeCountHistory);
router.post("/page_health_dashboard", exe.pageHealthDashboard);

/*sim api*/
router.get("/get_all_sims", sim.getSims); // done
router.post("/add_sim", upload.single("invoiceCopy"), sim.addSim); //done
router.get("/get_single_sim/:id", sim.getSingleSim); // done
router.put("/update_sim", upload.single("invoiceCopy"), sim.editSim); //done
router.delete("/delete_sim/:id", sim.deleteSim); //done
router.post("/add_sim_allocation", sim.addAllocation); //done
router.get("/get_all_allocations", sim.getAllocations);
router.get("/get_allocation_by_alloid/:id", sim.getAllocationDataByAlloId);
router.get("/get_allocation_data_by_id/:id", sim.getSimAllocationDataById);
router.put("/update_allocationsim", sim.editAllocation);
router.delete("/delete_allocation/:id", sim.deleteAllocation);
router.get("/alldataofsimallocment", sim.alldataofsimallocment);
router.get("/get_asset_department_count", sim.getAssetDepartmentCount);
router.get("/get_asset_users_of_dept/:dept_id", sim.getAssetUsersDepartment)

/* logo brand */
router.post("/add_logo_brand", logoBrand.addLogoBrand);
router.get("/get_all_logo_brands", logoBrand.getLogoBrands);
router.get(
  "/get_single_logobrand/:id",

  logoBrand.getSingleLogoBrand
);
router.put("/update_logo_brand", logoBrand.editLogoBrand);
router.delete("/delete_logo_brand/:id", logoBrand.deleteLogoBrand);

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
router.delete("/delete_designation/:desi_id", designation.deleteDesignation); //Done
router.get("/get_all_designations", designation.getDesignations); //Done

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
router.post("/exe_campaign", exeCampaign.addExeCampaign);
router.get("/exe_campaign", exeCampaign.getExeCampaigns);
router.get("/exe_campaign/:id", exeCampaign.getExeCampaignById);
router.put("/exe_campaign", exeCampaign.editExeCampaign);
router.delete("/exe_campaign/:id", exeCampaign.deleteExeCampaign);

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
  upload.single("excel_file"),
  registerCampaign.addRegisterCampaign
);
router.get("/register_campaign", registerCampaign.getRegisterCampaigns);
router.put(
  "/register_campaign",
  upload.single("excel_file"),
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

  upload.single("screenshot"),
  finance.addFinance
);
router.get("/get_finances", finance.getFinances);
router.put(
  "/edit_finance",

  upload.single("screenshot"),
  finance.editFinance
);
router.delete("/delete_finance", finance.deleteFinance);

/* Sitting Routes */
router.post("/add_sitting", sitting.addSitting);
router.get("/get_all_sittings", sitting.getSittings);
router.get("/get_single_sitting/:sitting_id", sitting.getSingleSitting);
router.put("/update_sitting", sitting.editSitting);
router.delete("/delete_sitting/:id", sitting.deleteSitting);
router.get("/not_alloc_sitting", sitting.getNotAllocSitting);

/* Sitting Routes */
router.post("/add_room", upload.single("room_image"), sitting.addRoom);
router.put("/update_room", upload.single("room_image"), sitting.editRoom);
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
  upload.single("content"),
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
  upload.single("content"),
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

/* user */
router.post("/add_user", user.addUser);
router.post("/forgot_pass", user.forgotPass);
router.put("/update_user", user.updateUser);
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
  upload.single("attachment"),

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

router.post("/login_user_data", user.loginUserData);
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
router.get("/get_all_wfh_users", user.getAllWfhUsers);
router.get("/get_all_login_history", user.getLoginHistory);
router.post("/get_user_pre_sitting",user.getUserPresitting);
router.get("/get_all_users_with_dob_doj",user.getAllUsersWithDoBAndDoj);
router.get("/get_last_month_users",user.getLastMonthUsers);
router.get("/get_all_filled_users",user.getAllFilledUsers);
router.get("/get_all_percentage",user.getFilledPercentage);
// router.post("/get_users_by_departments",user.getUsersByDepartment);
// router.get("/get_first_time_login_users", user.getAllFirstLoginUsers)

/* attendance */
router.post("/add_attendance", attendance.addAttendance);
router.post(
  "/get_salary_by_id_month_year",

  attendance.getSalaryByDeptIdMonthYear
);
router.post("/get_salary_by_month_year",attendance.getSalaryByMonthYear);
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
// router.get("/get_all_dept_with_wfh", attendance.allDeptWithWfh)
router.put("/update_salary", attendance.updateSalary);
router.put("/update_attendence_status", attendance.updateAttendenceStatus);
router.get("/get_month_year_data", attendance.getMonthYearData);
router.post("/get_distinct_depts", attendance.getDistinctDepts);
router.post("/check_salary_status", attendance.checkSalaryStatus);
router.get("/all_departments_of_wfh", attendance.allDeptsOfWfh);
router.get("/dept_with_wfh", attendance.deptWithWFH);
router.post("/save_all_depts_attendance", attendance.addAttendanceAllDepartments)

/* commitement */
router.post("/add_commitment", cmtController.addCmt);
router.put("/update_commitment", cmtController.editCmt);
router.get("/get_all_commitments", cmtController.getCmt);
router.get("/get_single_commitment/:id", cmtController.getCmtById);
router.delete("/delete_commitment/:id", cmtController.deleteCmt);

/* Product */

//Product
router.post(
  "/add_product",
  upload.single("Product_image"), //upload1

  productController.addProduct
); //done
router.put(
  "/update_productupdate",
  upload.single("Product_image"), //upload1

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

/* Asset Sub Category Routes */
router.post("/add_asset_sub_category", assetSubCategory.addAssetSubCategory);
router.get(
  "/get_all_asset_sub_category",
  assetSubCategory.getAssetSubCategorys
);
router.get(
  "/get_single_asset_sub_category/:sub_category_id",
  assetSubCategory.getSingleAssetSubCategory
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

/* Vendor Routes */
router.post("/add_vendor", vendor.addVendor);
router.get("/get_all_vendor", vendor.getVendors);
router.get("/get_single_vendor/:vendor_id", vendor.getSingleVendor);
router.put("/update_vendor", vendor.editVendor);
router.delete("/delete_vendor/:vendor_id", vendor.deleteVendor);
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

/* Assets Images master */
router.post("/add_assets_images", assetsImage.addAssetImage);
router.get("/get_all_assets_images", assetsImage.getAllAssetsImages);
router.post("/get_single_assets_image", assetsImage.getSingleAssetsImage);
router.put("/update_assets_images", assetsImage.updateAssetImage);
router.delete(
  "/delete_assets_images/:asset_image_id",
  assetsImage.deleteAssetImage
);

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
router.delete("/delete_user_doc/:id", userDocManagement.deleteDoc);

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
router.get("/get_all_php_finance_data_pending",phpFinance.getAllphpFinanceDataPending);
router.post("/add_php_payment_acc_data_in_node", phpPayment.savePhpPaymentAccDataInNode);
router.get("/get_all_php_payment_acc_data", phpPayment.getAllphpPaymentAccData);
router.get("/get_all_php_payment_acc_data_pending",phpPayment.getAllphpPaymentAccDataForStatus);
router.put("/pending_approval_update",phpPayment.pendingApprovalUpdate);
router.post("/add_php_payment_refund_data_in_node", phpRefund.savePhpPaymentRefundInNode);
router.get("/get_all_php_payment_refund_data", phpRefund.getAllphpPaymentRefundData);
router.get("/get_all_php_payment_refund_data_pending",phpRefund.getAllphpPaymentRefundDataStatus);
router.put("/pending_approval_refund_update",upload.single("payment_screenshot"),phpRefund.pendingApprovalRefundUpdate);
router.post("/add_php_payment_incentive_data_in_node", phpIncentive.savePhpIncentiveInNode);
router.get("/get_all_php_payment_incentive_data", phpIncentive.getAllphpIncentiveData);
router.post("/add_php_payment_bal_data_in_node", phpPaymentBal.savePhpPaymentBalDataInNode);
router.get("/get_all_php_payment_bal_data", phpPaymentBal.getAllphpPaymentBalData);
router.put("/balance_payment_list_update",phpPaymentBal.balancePaymentListUpdate);
router.post("/add_php_pending_invoice_data_in_node", phpPendingInvoice.savePhpPaymentPendingInvoiceDataInNode);
router.get("/get_all_php_pending_invoice_data", phpPendingInvoice.getAllphpPaymentPendingInvoiceData);
router.post("/add_php_sale_booking_tds_data_in_node", phpSaleBookingTds.savePhpSaleBookingTdsDataInNode);
router.get("/get_all_php_sale_booking_tds_data", phpSaleBookingTds.getAllphpSaleBookingTdsData);
router.post("/add_php_sale_booking_tds_verification_data_in_node", phpSaleBookingTds.savePhpSaleBookingTdsVerificationDataInNode);
router.get("/get_all_php_sale_booking_tds_verification_data", phpSaleBookingTds.getAllphpSaleBookingTdsVerificationData);
router.get("/get_all_php_payment_acc_data_customers/:cust_id",phpPayment.getAccListDataFromCustId)

module.exports = router;