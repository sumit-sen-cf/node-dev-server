const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const validation = require("../helper/validation");
const accountMaster = require("../controllers/accounts/accountMasterController");
const accountType = require("../controllers/accounts/accountTypeController");
const accountCompanyTypeController = require("../controllers/accounts/accountCompanyTypeController");
const accountPoc = require("../controllers/accounts/accountPocController")
const accountDocumentMaster = require("../controllers/accounts/accountDocumentMasterController");
const accountDocumentOverview = require("../controllers/accounts/accountDocumentOverviewController");

router.get("/", (req, res) => {
    res.send({ message: "Welcome to Account module." });
});

/**
 * account master routes
 */
router.post("/add_account", verifyToken, accountMaster.addAccountDetails);
router.put("/edit_account/:id", verifyToken, accountMaster.editAccountDetails);
router.get("/get_all_account", verifyToken, accountMaster.getAllAccountDetails);
router.get("/get_single_account/:id", verifyToken, accountMaster.getSingleAccountDetails);
router.delete("/delete_account/:id", verifyToken, accountMaster.deleteAccountDetails);
//billing get data
router.get("/get_all_account", verifyToken, accountMaster.getAllAccountBillingDetails);
router.get("/get_single_account/:id", verifyToken, accountMaster.getSingleAccountBillingDetails);

/**
 * account type routes
 */
router.post("/add_account_type", verifyToken, validation.accountTypeValidation,
    accountType.addAccountType);
router.get("/get_account_type/:id", verifyToken, accountType.getAccountTypeData);
router.put("/update_account_type/:id", verifyToken, validation.accountTypeValidation,
    accountType.updateAccountTypeData);
router.get("/get_account_type_list", verifyToken, accountType.getAccountTypeList);
router.delete("/delete_account_type/:id", verifyToken, accountType.deleteAccountType);

/**
 * account poc routes
 */
router.post("/add_account_poc", verifyToken, validation.accountPocValidation, accountPoc.addAccountPoc);
router.put("/update_account_poc/:id", verifyToken, validation.accountPocValidation, accountPoc.updateAccountPoc);
router.get("/get_account_poc/:id", verifyToken, accountPoc.getAccountPocDetails);
router.get("/get_account_poc_list", verifyToken, accountPoc.getAccountPocList);
router.delete("/delete_account_poc/:id", verifyToken, accountPoc.deleteAccountPoc);

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

/**
 * account document master routes
 */
router.post("/add_document_master", verifyToken, validation.accountDocumentMasterValidation,
    accountDocumentMaster.addDocumentMaster);
router.put("/update_document_master/:id", verifyToken, validation.accountDocumentMasterValidation,
    accountDocumentMaster.updateDocumentMaster);
router.get("/get_document_master/:id", verifyToken, accountDocumentMaster.getDocumentMasterDetails);
router.get("/get_document_master_list", verifyToken, accountDocumentMaster.getDocumentMasterList);
router.delete("/delete_document_master/:id", verifyToken, accountDocumentMaster.deleteDocumentMaster);

/**
 * account document overview routes
 */
router.post("/add_document_overview", verifyToken, validation.accountDocumentOverviewValidation,
    accountDocumentOverview.addDocumentOverview);
router.put("/update_document_overview/:id", verifyToken, validation.accountDocumentOverviewValidation,
    accountDocumentOverview.updateDocumentOverview);
router.get("/get_document_overview/:id", verifyToken, accountDocumentOverview.getDocumentOverviewDetails);
router.get("/get_document_overview_list", verifyToken, accountDocumentOverview.getDocumentOverviewList);
router.delete("/delete_document_overview_list/:id", verifyToken, accountDocumentOverview.deleteDocumentOverview);

module.exports = router; 