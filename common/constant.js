const vari = require("../variables")

module.exports = Object.freeze({
  // base_url: vari.IMAGE_URL, //http://34.93.135.33:8080,
  base_url: vari.IMAGE_URL, //http://34.93.221.166:3000
  local_base_url: "http://localhost:8080",
  CREATOR_INSIGHTS: "https://app.ylytic.com/ylytic/api/v1/rt_tracking/insights",
  CF_INSTA_API: "https://www.instagram.com/trolls_official/?__a=1&__d=dis",
  INSTA_C_MODELS: 1,
  INSTA_P_MODELS: 2,
  ADMIN_ROLE: 1,
  SWAGGER_ADMIN: 1,
  SWAGGER_DEVELOPER: 2,

  // GCP Image URL
  GCP_VENDOR_FOLDER_URL: `${vari.IMAGE_URL}InVendorDocs`,
  GCP_PAGE_STATES_FOLDER_URL: `${vari.IMAGE_URL}PMS2Docs`,
  GCP_SALES_BOOKING_FOLDER_URL: `${vari.IMAGE_URL}SalesBookingFiles`,
  GCP_SALES_RECORD_SERVICE_FOLDER_URL: `${vari.IMAGE_URL}SalesRecordServiceFiles`,
  GCP_SALES_PAYMENT_UPDATE_FOLDER_URL: `${vari.IMAGE_URL}SalesPaymentUpdateFiles`,
  GCP_SALES_BADGES_FOLDER_URL: `${vari.IMAGE_URL}SalesBadgeImages`,
  GCP_ACCOUNT_FOLDER_URL: `${vari.IMAGE_URL}AccountDocument`,
  GCP_INVOICE_REQUEST_URL: `${vari.IMAGE_URL}InvoiceRequestFiles`,
  GCP_PMS2_Document_FOLDER_URL: `${vari.IMAGE_URL}PMS2DocumentImage`,
  GCP_ACCOUNT_BRANDS_FOLDER_URL: `${vari.IMAGE_URL}AccountBrandFiles`,
  GCP_ACCOUNT_MASTER_FOLDER_URL: `${vari.IMAGE_URL}AccountMasterImages`,


  /* JWT  */
  SECRET_KEY_LOGIN: "thisissecret12",
  SECRET_KEY_DOC_LOGIN: "docloginsect1234d",
  CONST_VALIDATE_SESSION_EXPIRE_DOC: "1h",
  CONST_SESSION_TIME_FOR_SWAGGER: 1500000,  //   1/2 hours
  CONST_VALIDATE_SESSION_EXPIRE: '24h',
  CONST_EMAIL_VERIFICATION_EXPIRED: '10m',

  /* Response messages */

  //Common msg
  CREATED_SUCCESSFULLY: "Data Created Successfully...",
  DELETED_SUCCESSFULLY: "Data Deleted Successfully...",
  UPDATED_SUCCESSFULLY: "Data Updated Successfully...",
  FETCH_SUCCESSFULLY: "Data Updated Successfully...",
  NO_RECORD_FOUND: "No Record found...",

  //@2 Model Status 
  DELETED: 2,
  ACTIVE: 0,
  INACTIVE: 1,

  //@2 Email Configuration 
  CONST_MAIL_USER_FOR_ALERT: "naveen@creativefuel.io",
  CONST_SUMIT_MAIL: "sumit@creativefuel.io",
  CONST_MAIL_PASS_FOR_ALERT: "absolwvkdihbvahf",

    //@2 Formates for sarcasm image
    CONST_SARCASM_FOLDER : "sarcasm_co",
    CONST_IMAGE_FORMATE : ".jpeg",
});
