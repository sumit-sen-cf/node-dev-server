const jwt = require("jsonwebtoken");
const constant = require("../../../common/constant");
const devLoginHistoryModel = require("../models/devLoginHistoryModel");
exports.checkDevAuthentication = async (req, res, next) => {
  const authorizationHeader = req.params.token;
  if (!authorizationHeader) {
    return res.status(200).json({
      Status: "Failed",
      Mesaage: " Access Denied Please pass token in header",
    });
  }

  const token = authorizationHeader.replace("Bearer ", "");
  jwt.verify(token, constant.SECRET_KEY_DOC_LOGIN, async (error, payload) => {
    if (error) {
      if (error.name === "TokenExpiredError") {
        const decoded = jwt.decode(token, { complete: true });
        let id = decoded.payload.login_id;
        let loginInfo = await devLoginHistoryModel.findById(id);

        if (!loginInfo) {
          return response.returnFalse(200, req, res, "No login hostory find.");
        }
        let formatedLoginTime = parseInt(loginInfo.login_date);
        let formatedCurrentTime = Math.floor(Date.now() / 1000);
        let diffInSecound = formatedCurrentTime - formatedLoginTime;
        await devLoginHistoryModel.findByIdAndUpdate(id, {
          $set: {
            isLoggedIn: false,
            logout_date: formatedCurrentTime,
            duration: diffInSecound,
          },
        });
        return res.redirect("/doc-login");
      }
      return res.status(200).json({ Message: "TOKEN UNAUTHORIZED" });
    }
    next();
  });
};
exports.checkDevAuthenticationUsingQuery = async (req, res, next) => {
  const authorizationHeader = req.query.token;
  if (!authorizationHeader) {
    return res.status(200).json({
      Status: "Failed",
      Mesaage: " Access Denied Please pass token in header",
    });
  }

  const token = authorizationHeader.replace("Bearer ", "");
  jwt.verify(token, constant.SECRET_KEY_DOC_LOGIN, async (error, payload) => {
    if (error) {
      if (error.name === "TokenExpiredError") {
        const decoded = jwt.decode(token, { complete: true });
        let id = decoded.payload.login_id;
        let loginInfo = await devLoginHistoryModel.findById(id);

        if (!loginInfo) {
          return response.returnFalse(200, req, res, "No login hostory find.");
        }
        let formatedLoginTime = parseInt(loginInfo.login_date);
        let formatedCurrentTime = Math.floor(Date.now() / 1000);
        let diffInSecound = formatedCurrentTime - formatedLoginTime;
        await devLoginHistoryModel.findByIdAndUpdate(id, {
          $set: {
            isLoggedIn: false,
            logout_date: formatedCurrentTime,
            duration: diffInSecound,
          },
        });
        return res.redirect("/doc-login");
      }
      return res.status(200).json({ Message: "TOKEN UNAUTHORIZED" });
    }
    next();
  });
};
