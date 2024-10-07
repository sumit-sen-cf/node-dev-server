const express = require("express");
const { addPlanXLogs, getPlanXLogs, getSinglePlanXLog, editPlanXLog, deletePlanXLog } = require("../../controllers/PMS2/planxlogController.js");
const router = express.Router();


router.post("/planxlogs", addPlanXLogs);
router.get("/planxlogs", getPlanXLogs);
router.get('/planxlogs/:id', getSinglePlanXLog);
router.put("/planxlogs", editPlanXLog);
router.delete("/planxlogs/:id", deletePlanXLog);

module.exports = router;