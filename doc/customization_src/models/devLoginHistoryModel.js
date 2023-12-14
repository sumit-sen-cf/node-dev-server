const mongoose = require("mongoose");

const devLoginHisModel = new mongoose.Schema({
  dev_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "swaggerAccessModel",
  },
  login_date: {
    type: String,
    default: Math.floor(Date.now() / 1000) ,
  },
  token: {
    type: String,
    default:"" ,
  },
  duration: {
    type: String,
    default:"" ,
  },
  logout_date: {
    type: String,
    default:"",
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("devLoginHisModel", devLoginHisModel);
