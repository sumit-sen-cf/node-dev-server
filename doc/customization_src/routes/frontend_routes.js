const express = require("express");
const { checkDevAuthentication } = require("../middleware/swaggerMiddleware");
const path = require("path");
const router = express.Router();

router.get("/doc-login", (req, res) => {
  const templatePath = path.join(__dirname, `../doc_templates/pages/index.html`);
  res.sendFile(templatePath);
});
router.get("/doc-access/:token", checkDevAuthentication, (req, res) => {
  return res.render("swaggerAccessForm");
});
router.get("/admin-profile/:token", (req, res) => {
  return res.render("adminProfileOverview");
});
router.get("/rejected-dev/:token", (req, res) => {
  return res.render("rejectedDev");
});
router.get("/admin-request", (req, res) => {
  return res.render("devRequestForm");
});
router.get("/all-request/:token", checkDevAuthentication, (req, res) => {
  return res.render("allDevRequest");
});
router.get("/dev-forgot", (req, res) => {
  return res.render("forgotPassword");
});
router.get("/otp-verify", (req, res) => {
  return res.render("otpVerify");
});
router.get("/reset-password", (req, res) => {
  return res.render("resetPassword");
});
router.get(
  "/dev-delete/:id/:token/:page",
  checkDevAuthentication,
  (req, res) => {
    let userId = req.params.id;
    let token = req.params.token;
    let page = req.params.page;
    let url = page == 1 ? "/doc-user" : "/all-request";
    return res.render("confirmationTemplate", {
      error_title: "Are you sure you want to delete ?",
      error_description:
        "After delete this data you can't retrive from anyway....",
      error_image:
        "https://cdni.iconscout.com/illustration/premium/thumb/employee-is-unable-to-find-sensitive-data-9952946-8062130.png?f=webp",
      button_path_cancel: `${url}/${token}`,
      button_text_cancel: "Cancel",
      button_text_ok: "Ok",
      button_path_ok: `/delete-dev/${userId}/${token}/${page}`,
    });
  }
);
router.get(
  "/clear-all-history/:token/:valueToBeDelete",
  checkDevAuthentication,
  (req, res) => {
    let token = req.params.token;
    let valueToBeDelete = req.params.valueToBeDelete;
    // let id = req.params.id;
    return res.render("confirmationTemplate", {
      error_title: "Are you sure you want to delete ?",
      error_description:
        "After delete this data you can't retrive from anyway....",
      error_image:
        "https://cdni.iconscout.com/illustration/premium/thumb/employee-is-unable-to-find-sensitive-data-9952946-8062130.png?f=webp",
      button_path_cancel: `/login-history/${token}`,
      button_text_cancel: "Cancel",
      button_text_ok: `OK`,
      // button_path_ok: `/delete-history/${token}`
      button_path_ok: `/delete-history?token=${encodeURIComponent(token)}&days=${valueToBeDelete}`

    });
  }
);
router.get("/doc-user/:token", checkDevAuthentication, (req, res) => {
  return res.render("userList");
});
router.get("/login-history/:token", checkDevAuthentication, (req, res) => {
  return res.render("swaggerDevLoginHistory");
});
router.get("/dev-update/:id/:token", checkDevAuthentication, (req, res) => {
  return res.render("swaggerEditForm");
});

module.exports = router;
