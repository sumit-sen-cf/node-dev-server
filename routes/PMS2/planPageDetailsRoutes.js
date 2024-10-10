const express = require("express");
const { addPlanPageDetail, getPlanPageDetails, getSinglePlanPageDetail, editPlanPageDetail, deletePlanPageDetail, addMultiplePlanPageDetail, getSinglePlanPageDetailWithPlanXID, deletePlanPageDetailWithPlanXID } = require("../../controllers/PMS2/planPageDetailsController.js");
const router = express.Router();


router.post("/plan_page_details", addPlanPageDetail);
router.get("/plan_page_details", getPlanPageDetails);
router.get('/plan_page_details/:id', getSinglePlanPageDetail);
router.get("/plan_page_details_with_planxid/:planx_id", getSinglePlanPageDetailWithPlanXID);
router.put("/plan_page_details", editPlanPageDetail);
router.delete("/plan_page_details/:id", deletePlanPageDetail);
router.post("/add_multiple_plan_page_data", addMultiplePlanPageDetail);
router.delete("/delete_plan_page_details_with_planxid/:planx_id", deletePlanPageDetailWithPlanXID)

module.exports = router;