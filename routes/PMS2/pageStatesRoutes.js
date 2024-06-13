const express = require("express");
const { addPageStates, getPageStatesDetails, getAllPageStatesList, updatePageStates, deletePageStatesDetails, getStatesHistory } = require("../../controllers/PMS2/pageStatesController");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();

router.post("/page_states", verifyToken, addPageStates);
router.get("/page_states/:id", verifyToken, getPageStatesDetails);
router.get("/page_states", verifyToken, getAllPageStatesList);
router.put("/page_states/:id", verifyToken, updatePageStates);
router.delete("/page_states/:id", verifyToken, deletePageStatesDetails);
router.get("/states_history/:id", verifyToken, getStatesHistory);

module.exports = router;