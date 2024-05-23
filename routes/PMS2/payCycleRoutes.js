const express = require("express");
const {
    addPayCycle,
    deletePayCycleDetails,
    getAllPayCycleDetails,
    getSinglePayCycleDetails,
    updateSinglePayCycleDetails,
    getPayCycleDataDeleted,
} = require("../../controllers/PMS2/payCycleController");
const {
    addPayCycleValidation,
    updatePayCycleValidation,
} = require("../../helper/validation");
const router = express.Router();

router.post("/paycycle", addPayCycleValidation, addPayCycle);
router.get("/paycycle", getAllPayCycleDetails);
router.get("/paycycle/:id", getSinglePayCycleDetails);
router.put("/paycycle", updatePayCycleValidation, updateSinglePayCycleDetails);
router.delete("/paycycle/:id", deletePayCycleDetails);
router.get("/paycycle_deleted", getPayCycleDataDeleted);

module.exports = router;
