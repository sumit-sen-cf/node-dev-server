const express = require("express");
const {
    addCountryCodeValidation,
    updateCountryCodeValidation,
} = require("../../helper/validation");
const {
    addCountryCode,
    deleteCountryCodeDetails,
    getAllCountryCodeDeletedData,
    getAllCountryCodeDetails,
    getSingleCountryCodeDetails,
    updateSingleCountryCodeDetails,
} = require("../../controllers/PMS2/countryCodeController");
const { verifyToken } = require("../../middleware/auth");

const router = express.Router();

router.post("/country_code", verifyToken, addCountryCodeValidation, addCountryCode);
router.get("/country_code", verifyToken, getAllCountryCodeDetails);
router.get("/country_code/:id", verifyToken, getSingleCountryCodeDetails);
router.put("/country_code", verifyToken, updateCountryCodeValidation, updateSingleCountryCodeDetails);
router.delete("/country_code/:id", verifyToken, deleteCountryCodeDetails);
router.get("/country_code_deleted", verifyToken, getAllCountryCodeDeletedData);

module.exports = router;
