const express = require("express");
const {
    addPayCycle,
    deletePayCycleDetails,
    getAllPayCycleDetails,
    getSinglePayCycleDetails,
    updateSinglePayCycleDetails,
    getPayCycleDataDeleted,
} = require("../../controllers/PMS2/payCycleController");
const { addPayCycleValidation, updatePayCycleValidation } = require("../../helper/validation");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();

router.post("/paycycle", verifyToken, addPayCycleValidation, addPayCycle);
router.get("/paycycle", verifyToken, getAllPayCycleDetails);
router.get("/paycycle/:id", verifyToken, getSinglePayCycleDetails);
router.put("/paycycle", verifyToken, updatePayCycleValidation, updateSinglePayCycleDetails);
router.delete("/paycycle/:id", verifyToken, deletePayCycleDetails);
router.get("/paycycle_deleted", verifyToken, getPayCycleDataDeleted);

module.exports = router;
