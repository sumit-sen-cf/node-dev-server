const multer = require("multer");
const path = require("path");

//Generate rendom string fileName with direct download functionality
exports.upload = multer({
  dest: "./uploads",
});

//Generate actual fileName with view functionality
const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    if (file.fieldname === "upload_logo") {
      cb(null, "./uploads/logo");
    } else if (file.fieldname === "creatorImageToServer") {
      cb(null, "./uploads/Creator_s Avatar");
    }else if (file.fieldname === "campaignImageToServer") {
      cb(null, "./uploads/Campaign_s Avatar");
    } else if (file.fieldname === "brandImageToServer") {
      cb(null, "./uploads/Brand_s Avatar");
    } else if (file.fieldname === "doc_image") {
      cb(null, "./uploads/userDocuments");
    } else if (file.fieldname === "Product_image") {
      cb(null, "./uploads/productImage");
    } else if (file.fieldname === "content_sec_file") {
      cb(null, "./uploads/contentSecFiles");
    } else {
      cb(null, "./uploads");
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadfile = multer({ storage: storage });
exports.upload1 = uploadfile;
