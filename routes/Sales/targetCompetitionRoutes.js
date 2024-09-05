const express = require("express");
const router = express.Router();
const targetCompetitionController = require("../../controllers/Sales/targetCompetitionController");
const { verifyToken } = require("../../middleware/auth");

/**
 * sales payment mode routes
 */
router.post("/sales/target_competition", verifyToken, targetCompetitionController.createTargetCompetition);
router.put("/sales/target_competition/:id", verifyToken, targetCompetitionController.updateTargetCompetition);
router.get("/sales/target_competition/:id", verifyToken, targetCompetitionController.getTargetCompetitionDetails);
router.get("/sales/target_competition", verifyToken, targetCompetitionController.getTargetCompetitionList);
router.delete("/sales/target_competition/:id", verifyToken, targetCompetitionController.deleteTargetCompetition);

module.exports = router; 