const express = require("express");
const { addCaseStudy, getCaseStudies, getSingleCaseStudy, editCaseStudy, deleteCaseStudy } = require("../../controllers/executionCaseStudy/caseStudy.js");
const router = express.Router();


router.post("/casestudy", addCaseStudy);
router.get("/casestudy", getCaseStudies);
router.get('/casestudy/:id', getSingleCaseStudy);
router.put("/casestudy", editCaseStudy);
router.delete("/casestudy/:id", deleteCaseStudy);

module.exports = router;