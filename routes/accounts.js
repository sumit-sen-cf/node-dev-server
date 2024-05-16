const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const validation = require("../helper/validation");
const accountMaster = require("../controllers/accounts/accountMasterController");
const accountType = require("../controllers/accounts/accountTypeController");
const accountCompanyTypeController = require("../controllers/accounts/accountCompanyTypeController");

router.get("/", (req, res) => {
    res.send({ message: "Welcome to Account module." });
});

/**
 * account master routes
 */
// router.post("/add_account", accountMaster.addAccountDetails);
// router.put("/edit_account/:id", accountMaster.editAccountDetails);
// router.get("/get_all_account", accountMaster.getAllAccountDetails);
// router.get("/get_single_account/:id", accountMaster.getSingleAccountDetails);
// router.delete("/delete_account/:id", accountMaster.deleteAccountDetails);

/**
 * account type routes
 */
router.post("/add_account_type", verifyToken, validation.accountTypeValidation,
    accountType.addAccountType);
router.get("/get_account_type/:id", accountType.getAccountTypeData);
router.put("/update_account_type/:id", validation.accountTypeValidation,
    accountType.updateAccountTypeData);
router.get("/get_account_type_list", accountType.getAccountTypeList);
router.delete("/delete_account_type/:id", accountType.deleteAccountType);


/**
 * account company type routes
 */
router.post("/add_account_company_type", verifyToken, validation.accountCompanyTypeValidation,
    accountCompanyTypeController.addAccountCompanyType);
router.put("/edit_account_company_type/:id", verifyToken, validation.accountCompanyTypeValidation,
    accountCompanyTypeController.editAccountCompanyType);
router.get("/get_all_account_company_type", verifyToken, accountCompanyTypeController.getAllAccountCompanyType);
router.get("/get_single_account_company_type/:id", verifyToken, accountCompanyTypeController.getSingleAccountCompanyType);
router.delete("/delete_account_company_type/:id", verifyToken, accountCompanyTypeController.deleteAccountCompanyType);

module.exports = router; 