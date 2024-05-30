const express = require("express");
const { addPageStates, getPageStatesDetails, getAllPageStatesList, updatePageStates, deletePageStatesDetails, getStatesHistory } = require("../../controllers/PMS2/pageStatesController");
const router = express.Router();

router.post("/page_states", addPageStates);
router.get("/page_states/:id", getPageStatesDetails);
router.get("/page_states", getAllPageStatesList);
router.put("/page_states/:id", updatePageStates);
router.delete("/page_states/:id", deletePageStatesDetails);
router.get("/states_history/:id", getStatesHistory);

module.exports = router;