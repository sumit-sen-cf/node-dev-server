

var returnTrue = function (statusCode,req, res, message, arr) {
  return res.status(statusCode).json({
    success: true,
    message: message,
    data: arr,
  });
};
var returnTrueWithPagination = function (statusCode,req, res, message, arr,pagination_data) {
  return res.status(statusCode).json({
    success: true,
    message: message,
    data: arr,
    pagination_data
  });
};

var returnFalse = function (statusCode, req, res, message, arr) {
  return res.status(statusCode).json({
    success: false,
    message: message,
    data: arr,
  });
};

var response = {
  returnTrue: returnTrue,
  returnTrueWithPagination: returnTrueWithPagination,
  returnFalse: returnFalse,
};

module.exports = response;
