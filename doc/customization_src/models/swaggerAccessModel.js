const { default: mongoose } = require("mongoose");
const constant = require("../../../common/constant");
const swaggerAccessSchema = new mongoose.Schema({
  email: {
    type: String,
    unique : true,
    default: "",
  },
  password: {
    type: String,
    default: "",
  },
  role: {
    type: Number,
    default: constant.SWAGGER_DEVELOPER,
  },
  isAdminVerified: {
    type: Number,
    default: 0,  // 0 for not pending // 1 for approved // 2 for rejected
  },
  isEmailVerified: {
    type: Number,
    default: 0,  // 0 for not pending // 1 for verified
  },
  otp: {
    type: String,
    default: "",  
  },
  otpExpired: {
    type: String,
    default: "",  
  },
  phone: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "Active",
  },
  department: {
    type: String,
    default: "",
  },

});
module.exports = mongoose.model("swaggerAccessModel", swaggerAccessSchema);
