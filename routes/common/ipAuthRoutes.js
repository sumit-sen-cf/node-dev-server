const express = require("express");
const {
    addIpAuthDetail,
    deleteIpAuthDetailDetails,
    getAllIpAuthDetailDeletedData,
    getAllIpAuthDetailDetails,
    getSingleIpAuthDetailDetails,
    updateSingleIpAuthDetailDetails,
    getMyNetworkIp,
} = require("../../controllers/ipAuthController");
const router = express.Router();

router.post("/ip_auth", addIpAuthDetail);
router.get("/ip_auth/:id", getSingleIpAuthDetailDetails);
router.get("/ip_auth", getAllIpAuthDetailDetails);
router.put("/ip_auth/:id", updateSingleIpAuthDetailDetails);
router.delete("/ip_auth/:id", deleteIpAuthDetailDetails);
router.get("/ip_auth_deleted_data", getAllIpAuthDetailDeletedData);
router.get("/my_network_ip", getMyNetworkIp);

module.exports = router;
