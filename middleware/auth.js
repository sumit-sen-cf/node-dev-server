const jwt = require("jsonwebtoken");
const constant = require("../common/constant");
exports.verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(200).json({
      Status: "Failed",
      Mesaage: " Access Denied Please pass token in header",
    });
  }

  const token = authorizationHeader.replace("Bearer ", "");
  jwt.verify(token, constant.SECRET_KEY_LOGIN, (error, payload) => {
    if (error) {
      return res.status(200).json({ Message: "TOKEN UNAUTHORIZED" });
    }
    next();
  });
};
