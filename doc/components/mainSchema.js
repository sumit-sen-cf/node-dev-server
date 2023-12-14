const brandSchema = require("../schemas/BrandSchema.js");
const billingSchema = require("../schemas/billingSchema.js");
const projectxCategorySchema = require("../schemas/projectxCategorySchema.js");
const agencySchema = require("../schemas/agencySchema.js");
const announcementSchema = require("../schemas/announcementSchema.js");
const brandCategorySchema = require("../schemas/brandCategorySchema.js");
const brandSubCategorySchema = require("../schemas/brandSubCategorySchema.js");
const campaginCategorySchema = require("../schemas/campaignCategorySchema.js");
const brandMajorCategorySchema = require("../schemas/brandMajaorCategorySchema.js");
const campaignSchema = require("../schemas/campaignSchema.js");
const commitementSchema = require("../schemas/commitmentSchema.js");
const contentManagementSchema = require("../schemas/contentMangmentSchema.js");
const contentRegSecSchema = require("../schemas/contentSecRegSchema.js");
const contentTypeSchema = require("../schemas/contentTypeSchema.js");
const departmentSchema = require("../schemas/departmentSchema.js");
const designationSchema = require("../schemas/designationSchema.js");
const exeCampaignSchema = require("../schemas/executionCampaignSchema.js");
const projectxPageCategorySchema = require("../schemas/projectxPageCategorySchema.js");
const projectxSubCategorySchema = require("../schemas/projectxSubCategorySchema.js");
const registerCampaignSchema = require("../schemas/registerCampaignSchema.js");
const fileUploadSchema = require("../schemas/fileUploadSchema.js");
const financeSchema = require("../schemas/financeSchema.js");
const instaBotMSchema = require("../schemas/instaBotMSchema.js");
const hashTagSchema = require("../schemas/hashTagSchema.js");
const instaBotWSchema = require("../schemas/instaBotWSchema.js");
const instaBotYSchema = require("../schemas/instaBotYSchema.js");
const instaBrandSchema = require("../schemas/instaBrandSchema.js");
const keywordSchema = require("../schemas/keywordSchema.js");
const instaTypeSchema = require("../schemas/instaTypeSchema.js");
const jobResponsibilitiesSchema = require("../schemas/jobResponsibilitiesSchema.js");
const kraTransSchema = require("../schemas/kraTransSchema.js");
const leadSchema = require("../schemas/leadSchema.js");
const leadTypeSchema = require("../schemas/leadTypeSchema.js");
const logoBrandSchema = require("../schemas/logoBrandSchema.js");
const orderDeliverySchema = require("../schemas/orderDeliverySchema.js");
const objSchema = require("../schemas/objSchema.js");
const mentionSchema = require("../schemas/mentionSchema.js");
const pageUniquenessSchema = require("../schemas/pageUniquenessSchema.js");
const roleSchema = require("../schemas/roleSchema.js");
const productPropsSchema = require("../schemas/productPropsSchema.js");
const responsibilitySchema = require("../schemas/responsibilitySchema.js");
const reasonSchema = require("../schemas/reasonSchema.js");
const documentSchema = require("../schemas/documentSchema.js");
const mainSchema = {
  //Create schema for display schema
  Agency: {
    ...agencySchema,
  },
  Announcement: {
    ...announcementSchema,
  },
  Brand: {
    ...brandSchema,
  },
  Brand_Category: {
    ...brandCategorySchema,
  },
  Brand_Sub_Category: {
    ...brandSubCategorySchema,
  },
  Brand_Major_Category: {
    ...brandMajorCategorySchema,
  },
  Billing_Header: {
    ...billingSchema,
  },
  Campagin_Category: {
    ...campaginCategorySchema,
  },
  Campagin: {
    ...campaignSchema,
  },
  Commitment: {
    ...commitementSchema,
  },
  Content_Management: {
    ...contentManagementSchema,
  },
  Content_Register_Section: {
    ...contentRegSecSchema,
  },
  Content_Type: {
    ...contentTypeSchema,
  },
  Department: {
    ...departmentSchema,
  },
  Designation: {
    ...designationSchema,
  },
  Document: {
    ...documentSchema,
  },
  Execution_Campaign: {
    ...exeCampaignSchema,
  },
  Finance: {
    ...financeSchema,
  },
  File_Upload_Schema_For_Content_Section_Reg: {
    ...fileUploadSchema,
  },
  Hash_Tag: {
    ...hashTagSchema,
  },
  Insta_Bot_M: {
    ...instaBotMSchema,
  },
  Insta_Bot_W: {
    ...instaBotWSchema,
  },
  Insta_Bot_Y: {
    ...instaBotYSchema,
  },
  Insta_Brand: {
    ...instaBrandSchema,
  },
  Insta_Type: {
    ...instaTypeSchema,
  },
  Keyword: {
    ...keywordSchema,
  },
  kra_Trans: {
    ...kraTransSchema,
  },
  Job_Responsibilities: {
    ...jobResponsibilitiesSchema,
  },
  Lead: {
    ...leadSchema,
  },
  Lead_Type: {
    ...leadTypeSchema,
  },
  Logo_Brand: {
    ...logoBrandSchema,
  },
  Projectx_Sub_Category: {
    ...projectxSubCategorySchema,
  },
  Projectx_Page_Category: {
    ...projectxPageCategorySchema,
  },
  Projectx_Category: {
    ...projectxCategorySchema,
  },
  Page_Uniqueness: {
    ...pageUniquenessSchema,
  },
  Product_Props: {
    ...productPropsSchema,
  },
  Register_Campaign: {
    ...registerCampaignSchema,
  },
  Role: {
    ...roleSchema,
  },
  Reason: {
    ...reasonSchema,
  },
  Responsibiltiy: {
    ...responsibilitySchema,
  },
  Order_Delivery_Schema: {
    ...orderDeliverySchema,
  },
  Obj_Schema: {
    ...objSchema,
  },
  Mention_Schema: {
    ...mentionSchema,
  },
};
module.exports = mainSchema;
