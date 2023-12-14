const { brandApis } = require("../apis/brandDoc");
const { projectxCategoryApis } = require("../apis/projectxCategoryDoc");
const { billingHeaderApis } = require("../apis/billingHeaderDoc");
const { projectxPageCategoryApis } = require("../apis/projectxPageCategoryDoc");
const { projectxSubCategoryApis } = require("../apis/projectxSubCategoryDoc");
const { brandCategoryApis } = require("../apis/brandCategoryDoc");
const { registerCmpApis } = require("../apis/registerCampaignDoc");
const { brandMajorCategoryApis } = require("../apis/brandMajorCategoryDoc");
const { brandSubCategoryApis } = require("../apis/brandSubCategoryDoc");
const { campaignApis } = require("../apis/campaignDoc");
const { campaignCategoryApis } = require("../apis/campaignCategoryDoc");
const { commitmentApis } = require("../apis/commitmentDoc");
const { contentManagementApis } = require("../apis/contentManagement");
const { contentSectionRegApis } = require("../apis/contentSectionRegCmpDoc");
const { instaApis } = require("../apis/instaDoc");
const { documenentMastApis } = require("../apis/documentDoc");
const { userApis } = require("../apis/userDoc");

/**
 * Combines multiple API schemas into a single main schema object.
 * @returns {Object} - The main schema object containing all the API schemas.
 */
const mainSchema = {
  ...instaApis,
  ...brandApis,
  ...brandCategoryApis,
  ...brandMajorCategoryApis,
  ...brandSubCategoryApis,
  ...campaignApis,
  ...campaignCategoryApis,
  ...commitmentApis,
  ...contentManagementApis,
  ...contentSectionRegApis,
  ...documenentMastApis,
  ...billingHeaderApis,
  ...projectxCategoryApis,
  ...projectxSubCategoryApis,
  ...projectxPageCategoryApis,
  ...userApis,
  ...registerCmpApis,
};
module.exports = mainSchema;
