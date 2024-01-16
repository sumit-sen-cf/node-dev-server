const vari = require("../variables")

module.exports = Object.freeze({
  // base_url: vari.IMAGE_URL, //http://34.93.135.33:8080,
  base_url: vari.IMAGE_URL, //http://34.93.221.166:3000
  local_base_url: "http://localhost:3000",
  CREATOR_INSIGHTS: "https://app.ylytic.com/ylytic/api/v1/rt_tracking/insights",
  CF_INSTA_API: "https://www.instagram.com/trolls_official/?__a=1&__d=dis",
  INSTA_C_MODELS: 1,
  INSTA_P_MODELS: 2,
  ADMIN_ROLE: 1,
  SWAGGER_ADMIN: 1,
  SWAGGER_DEVELOPER: 2,

  /* JWT  */
  SECRET_KEY_LOGIN:"thisissecret12",
  SECRET_KEY_DOC_LOGIN:"docloginsect1234d",
  CONST_VALIDATE_SESSION_EXPIRE_DOC:"1h",
  CONST_SESSION_TIME_FOR_SWAGGER : 1500000,  //   1/2 hours
  CONST_VALIDATE_SESSION_EXPIRE: '24h',
  CONST_EMAIL_VERIFICATION_EXPIRED: '10m',

  /* Response messages */ 

  //Common msg
  CREATED_SUCCESSFULLY :"Data Created Successfully...",
  DELETED_SUCCESSFULLY :"Data Deleted Successfully...",
  UPDATED_SUCCESSFULLY :"Data Updated Successfully...",
  FETCH_SUCCESSFULLY :"Data Updated Successfully...",
  NO_RECORD_FOUND:"No Record found..."
 
});
