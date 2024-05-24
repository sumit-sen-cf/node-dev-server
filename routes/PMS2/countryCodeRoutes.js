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

const router = express.Router();

router.post("/country_code", addCountryCodeValidation, addCountryCode);
router.get("/country_code", getAllCountryCodeDetails);
router.get("/country_code/:id", getSingleCountryCodeDetails);
router.put(
    "/country_code",
    updateCountryCodeValidation,
    updateSingleCountryCodeDetails
);
router.delete("/country_code/:id", deleteCountryCodeDetails);
router.get("/country_code_deleted", getAllCountryCodeDeletedData);

module.exports = router;
