const express = require("express");
const { addPlanPageDetail, getPlanPageDetails, getSinglePlanPageDetail, editPlanPageDetail, deletePlanPageDetail } = require("../../controllers/PMS2/planPageDetailsController.js");
const router = express.Router();


router.post("/plan_page_details", addPlanPageDetail);
router.get("/plan_page_details", getPlanPageDetails);
router.get('/plan_page_details/:id', getSinglePlanPageDetail);
router.put("/plan_page_details", editPlanPageDetail);
router.delete("/plan_page_details/:id", deletePlanPageDetail);

module.exports = router;