// Importing required modules
const os = require("os");
const { getNetworkIP, sendMailAlertForIPAuth } = require("../helper/helper");


// Function to retrieve the network interfaces object
const getNetworkIPObject = () => {
  // Get network interfaces information
  const interfaces = os.networkInterfaces();
  return interfaces;
};

// Middleware to restrict access based on IP address
exports.restrictIPMiddleware = async (req, res, next) => {

  const clientIP = getNetworkIP();
  const allowedIPs = []; // Set of Authorized ip's

  // Check if client IP is allowed
  if (clientIP && allowedIPs.includes(clientIP)) {
    next(); // IP is allowed, continue to the next middleware
  } else {
    // Send email alert with the formatted IP object
    await sendMailAlertForIPAuth(getNetworkIPObject(), "New IP Wants Access");
    res.status(403).send("Forbidden"); // IP not allowed, send 403 Forbidden status
  }
};
