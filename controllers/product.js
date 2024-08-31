/* Modules */
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

/* Others */
const constant = require("../common/constant.js");
const response = require("../common/response");
const sendMail = require("../common/sendMail.js");

/* Models */
const productModel = require("../models/productModel");
const productPropsModel = require("../models/productPropsModel.js");
const orderDeliveryModel = require("../models/orderDeliveryModel.js");
const orderReqModel = require("../models/orderReqModel.js");
const userModel = require("../models/userModel.js");
const sittingModel = require("../models/sittingModel.js");
const transferReqModel = require("../models/transferReqModel.js");
const emailTempModel = require("../models/emailTempModel.js")
const nodemailer = require("nodemailer");
const vari = require('../variables.js')
const { storage } = require('../common/uploadFile.js')

//Product Related api's

exports.addProduct = async (req, res) => {
  try {
    const {
      Product_name,
      Product_type,
      Duration,
      Stock_qty,
      Unit,
      Opening_stock,
      Opening_stock_date,
      Remarks,
      created_by,
      props1,
      props2,
      props3,
    } = req.body;

    const productObj = new productModel({
      Product_name,
      Product_type,
      Duration,
      Stock_qty,
      Unit,
      Opening_stock,
      Opening_stock_date,
      Remarks,
      Created_by: created_by,
      props1,
      props2,
      props3,
      // Product_image: req?.file?.filename,
    });

    const bucketName = vari.BUCKET_NAME;
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(req.file.originalname);
    productObj.Product_image = blob.name;
    const blobStream = blob.createWriteStream();
    blobStream.on("finish", () => {
      // res.status(200).send("Success") 
    });
    blobStream.end(req.file.buffer);

    const savedProduct = await productObj.save();
    return response.returnTrue(
      200,
      req,
      res,
      "Product created successfully",
      savedProduct
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.editProduct = async (req, res) => {
  try {
    let pro_image = req.file?.originalname;

    if (req.file) {
      const bucketName = vari.BUCKET_NAME;
      const bucket = storage.bucket(bucketName);
      const blob = bucket.file(req.file.originalname);
      pro_image = blob.name;
      const blobStream = blob.createWriteStream();
      blobStream.on("finish", () => {
        // res.status(200).send("Success") 
      });
      blobStream.end(req.file.buffer);
    }

    const editProductObj = await productModel.findOneAndUpdate(
      { product_id: parseInt(req.body.id) }, // Filter condition
      {
        $set: { ...req.body, Product_image: pro_image },
      },
      { new: true }
    );
    if (!editProductObj) {
      return response.returnFalse(
        200,
        req,
        res,
        "No Record Found with this Product id.",
        {}
      );
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Product updated successfully.",
      editProductObj
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.getProductById = async (req, res) => {
  try {
    let match_condition = {
      product_id: parseInt(req.params.id),
    };
    let product = await productModel.aggregate([
      {
        $match: match_condition,
      },
      {
        $lookup: {
          from: "productpropsmodels",
          localField: "product_id",
          foreignField: "product_id",
          as: "Product_Prop",
        },
      },
    ]);
    if (!product?.[0]) {
      return response.returnFalse(
        200,
        req,
        res,
        "No Record Found with this Product id.",
        {}
      );
    }
    const url = `${constant.base_url}`;
    const dataWithFileUrls = product.map((item) => ({
      ...item,
      imageUrl: item.Product_image ? url + item.Product_image : "",
    }));
    // return response.returnTrue(
    //   200,
    //   req,
    //   res,
    //   "Product Fetch successfully.",
    //   dataWithFileUrls
    // );
    return res.status(200).json(dataWithFileUrls[0]);
  } catch (error) {
    return response.returnFalse(500, req, res, error.message, {});
  }
};
exports.getProduct = async (req, res) => {
  try {
    let product = await productModel.aggregate([
      {
        $lookup: {
          from: "productpropsmodels",
          localField: "product_id",
          foreignField: "product_id",
          as: "Product_Prop",
        },
      },
    ]);
    if (!product?.[0]) {
      return response.returnFalse(
        200,
        req,
        res,
        "No Record Found with this Product id.",
        {}
      );
    }
    const url = `${constant.base_url}`;
    const dataWithFileUrls = product.map((item) => ({
      ...item,
      Product_image_download_url: item.Product_image ? url + item.Product_image : "",
    }));
    // return response.returnTrue(
    //   200,
    //   req,
    //   res,
    //   "Product Fetch successfully.",
    //   dataWithFileUrls
    // );
    return res.status(200).json(dataWithFileUrls);
  } catch (error) {
    return response.returnFalse(500, req, res, error.message, {});
  }
};

exports.deleteProductById = async (req, res) => {
  const id = parseInt(req.params.id);
  const condition = { product_id: id };
  try {
    const result = await productModel.findOneAndDelete(condition);
    if (result) {
      const productImagesFolder = path.join(
        __dirname,
        "../uploads"
      );
      const imageFileName = result.Product_image;

      if (imageFileName) {
        const imagePath = path.join(productImagesFolder, imageFileName);
        fs.unlink(imagePath, (err) => {
          if (err) {
            return response.returnFalse(req, res, err.message, {});
          } else {
            return response.returnTrue(
              200,
              req,
              res,
              `Product with ID ${id} deleted successfully`,
              {}
            );
          }
        });
      }
    } else {
      return response.returnFalse(
        200,
        req,
        `Product with ID ${id} not found`,
        {}
      );
    }
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

//Product Props related api's

exports.addProductProps = async (req, res) => {
  try {
    const {
      type_id,
      prop_name,
      remark,
      created_by,
      product_id,
      prop_category,
    } = req.body;
    let productIdToUse;

    if (product_id) {
      productIdToUse = product_id;
    } else {
      const lastProduct = await productModel
        .findOne({}, "product_id")
        .sort({ product_id: -1 })
        .limit(1);

      productIdToUse = lastProduct.product_id;
    }
    const productPropsObj = new productPropsModel({
      type_id,
      prop_name,
      remark,
      created_by,
      product_id: productIdToUse,
      prop_category,
    });

    const savedProductProps = await productPropsObj.save();
    return response.returnTrue(
      200,
      req,
      res,
      "Product props created successfully",
      savedProductProps
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.getProductPropsByProductId = async (req, res) => {
  try {
    let match_condition = {
      product_id: parseInt(req.params.product_id),
    };

    const result = await productPropsModel.aggregate([
      {
        $match: match_condition,
      },
      {
        $lookup: {
          from: "productmodels",
          localField: "product_id",
          foreignField: "product_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },

      {
        $project: {
          _id: 0,
          type_id: 1,
          prop_category: 1,
          prop_name: 1,
          product_id: 1,
          created_by: 1,
          created_at: 1,
          last_updated_by: 1,
          last_updated_at: 1,
          Product_name: "$product.Product_name",
        },
      },
    ]);
    if (!result?.[0]) {
      return response.returnFalse(
        200,
        req,
        res,
        "No Record Found with this Product id.",
        {}
      );
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Product Props Fetch successfully.",
      result[0]
    );
  } catch (error) {
    return response.returnFalse(500, req, res, error.message, {});
  }
};

exports.editProductProps = async (req, res) => {
  try {
    const editProductPropsObj = await productPropsModel.findOneAndUpdate(
      { id: parseInt(req.params.id) }, // Filter condition
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!editProductPropsObj) {
      return response.returnFalse(
        200,
        req,
        res,
        "No Record Found with this Product Prop id.",
        {}
      );
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Product Prop updated successfully.",
      editProductPropsObj
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.deleteProductProp = async (req, res) => {
  const id = parseInt(req.params.id);
  const condition = { id };
  try {
    const result = await productPropsModel.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `Prop with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `Prop with ID ${id} not found`,
      });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: err });
  }
};

//Order Delivery api's

exports.addOrderDelivery = async (req, res) => {
  try {
    const {
      order_req_id,
      product_name,
      order_quantity,
      special_request,
      sitting_name,
      sitting_area,
      request_datetime,
      status,
      request_delivered_by,
      delivered_datetime,
      message,
    } = req.body;

    const orderDeliveryObj = new orderDeliveryModel({
      Order_req_id: order_req_id,
      Product_name: product_name,
      Order_quantity: order_quantity,
      Special_request: special_request,
      Sitting_name: sitting_name,
      Sitting_area: sitting_area,
      Request_datetime: request_datetime,
      Status: status,
      Request_delivered_by: request_delivered_by,
      Delivered_datetime: delivered_datetime,
      Message: message,
    });

    const savedOrderDelivery = await orderDeliveryObj.save();
    return response.returnTrue(
      200,
      req,
      res,
      "Product created successfully",
      savedOrderDelivery
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.getAllOrderDeliveries = async (req, res) => {
  try {
    const resData = await orderDeliveryModel.find();

    if (resData.length === 0) {
      return response.returnFalse(200, req, res, "No Record Found !", {});
    } else {
      return response.returnTrue(
        200,
        req,
        res,
        "Data Fetched Successfully.",
        resData
      );
    }
  } catch (err) {
    return response.returnTrue(500, req, res, err.message, {});
  }
};

//Orders Req Api's
exports.addOrderReq = async (req, res) => {
  try {
    var d1 = new Date();
    const {
      product_id,
      order_quantity,
      special_request,
      user_id,
      sitting_id,
      status,
      request_delivered_by,
      delivered_datetime,
      message,
      remarks,
      created_by,
      room_id,
      props1,
      email
    } = req.body;

    const Delivered_datetime = delivered_datetime
      ? new Date(delivered_datetime)
      : null;

    const Request_datetime = new Date();
    Request_datetime.setHours(Request_datetime.getHours() + 5);
    Request_datetime.setMinutes(Request_datetime.getMinutes() + 30);

    //Saved Data into Order Req Table
    const orderReqObj = new orderReqModel({
      product_id: product_id,
      Order_quantity: order_quantity,
      Special_request: special_request,
      User_id: user_id,
      Sitting_id: sitting_id,
      Status: status,
      Request_delivered_by: request_delivered_by,
      Delivered_datetime: Delivered_datetime,
      Message: message,
      Remarks: remarks,
      Created_by: created_by,
      room_id,
      props1,
      Status: "pending",
      Request_datetime: Request_datetime
    });

    const savedOrderReqObj = await orderReqObj.save();

    const userDetails = await userModel.findOne({ user_id: parseInt(user_id) });
    const sittingDetails = await sittingModel.findOne({
      sitting_id: parseInt(sitting_id),
    });

    // const templatePath = path.join(__dirname, "template1.ejs");
    // const template = await fs.promises.readFile(templatePath, "utf-8");
    // const userName = userDetails.user_name;
    // const SittingRefNo = sittingDetails.sitting_ref_no;
    // const SittingArea = sittingDetails.sitting_area;

    // const html = ejs.render(template, {userName,SittingRefNo,SittingArea});
    // sendMail("Pantry New Order", html, email);

    /* dynamic email temp code */
    let contentList = await emailTempModel.findOne({ email_for_id: '65bde71ead52cfd11fa27e4e', send_email: true })
    const filledEmailContent = contentList.email_content
      .replace("{{user_name}}", userDetails.user_name)
      .replace("{{sitting_ref}}", sittingDetails.sitting_ref_no)
      .replace("{{sitting_area}}", sittingDetails.sitting_area);

    const html = filledEmailContent;

    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "onboarding@creativefuel.io",
        pass: "qtttmxappybgjbhp",
      },
    });

    let mailOptions = {
      from: "onboarding@creativefuel.io",
      to: req.body.email,
      subject: contentList.email_sub,
      html: html,
    };

    await transport.sendMail(mailOptions);
    /* dynamic email temp code */

    return response.returnTrue(
      200,
      req,
      res,
      "Order request added successfully",
      savedOrderReqObj
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.getOrderReqByOrderId = async (req, res) => {
  try {
    let orderReq = await orderReqModel.aggregate([
      {
        $match: {
          Order_req_id: parseInt(req.body.orderId),
        },
      },
      {
        $lookup: {
          from: "productmodels",
          localField: "product_id",
          foreignField: "product_id",
          as: "Product",
        },
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "User_id",
          foreignField: "user_id",
          as: "User",
        },
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "Request_delivered_by",
          foreignField: "user_id",
          as: "Request_delivered_by",
        },
      },
      {
        $unwind: "$Product",
      },
      {
        $unwind: "$User",
      },
      {
        $unwind: "$Request_delivered_by",
      },
      {
        $project: {
          Order_req_id: 1,
          product_id: 1,
          Product_category: 1,
          Order_quantity: 1,
          Special_request: 1,
          User_id: 1,
          Sitting_id: 1,
          Request_datetime: 1,
          Status: 1,
          Request_delivered_by: 1,
          Delivered_datetime: 1,
          Message: 1,
          Remarks: 1,
          creation_date: 1,
          Created_by: 1,
          Last_updated_by: 1,
          Last_updated_date: 1,
          room_id: 1,
          props1: 1,
          props2: 1,
          props3: 1,
          props1Int: 1,
          props2Int: 1,
          props3Int: 1,
          Product_name: "$Product.Product_name",
          User_name: "$User.user_name",
          Request_delivered_by_name: "$Request_delivered_by.user_name",
        },
      },
      {
        $project: {
          Product: 0,
          Request_delivered_by: 0,
          User: 0,
        },
      },
    ]);
    if (!orderReq?.[0]) {
      return response.returnFalse(
        200,
        req,
        res,
        "No Record Found with this Order Req id.",
        {}
      );
    }

    return response.returnTrue(
      200,
      req,
      res,
      "Order Req Data Fetch successfully.",
      orderReq[0]
    );
  } catch (error) {
    return response.returnFalse(500, req, res, error.message, {});
  }
};

exports.editOrderReq = async (req, res) => {
  try {
    let updateObj = {
      Order_quantity: req.body.order_quantity,
      Special_request: req.body.special_request,
      User_id: req.body.user_id,
      Sitting_id: req.body.sitting_id,
      Status: req.body.status,
      Request_delivered_by: req.body.request_delivered_by,
      Message: req.body.message,
      Remarks: req.body.remarks,
      product_id: req.body.product_id,
      Last_updated_date: Date.now(),
      Delivered_datetime: Date.now(),
    };

    const editOrderReqObj = await orderReqModel.findOneAndUpdate(
      { Order_req_id: parseInt(req.body.order_req_id) }, // Filter condition
      {
        $set: updateObj,
      },
      { new: true }
    );
    if (!editOrderReqObj) {
      return response.returnFalse(
        200,
        req,
        res,
        "No Record Found with this Order Req id.",
        {}
      );
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Order Req updated successfully.",
      editOrderReqObj
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.statusUpdateByManager = async (req, res) => {
  try {
    let updateObj = {
      Order_quantity: req.body.order_quantity,
      Special_request: req.body.special_request,
      User_id: req.body.user_id,
      Sitting_id: req.body.sitting_id,
      Status: req.body.status,
      Request_delivered_by: req.body.request_delivered_by,
      Message: req.body.message,
      Remarks: req.body.remarks,
      product_id: req.body.product_id,
      Last_updated_date: Date.now(),
      Delivered_datetime: Date.now(),
    };
    const editOrderReqObj = await orderReqModel.findOneAndUpdate(
      { Order_req_id: parseInt(req.body.order_req_id) }, // Filter condition
      {
        $set: updateObj,
      },
      { new: true }
    );
    if (!editOrderReqObj) {
      return response.returnFalse(
        200,
        req,
        res,
        "No Record Found with this Order Req id.",
        {}
      );
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Order Req updated successfully.",
      editOrderReqObj
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};
exports.orderRequestTransByMan = async (req, res) => {
  try {
    let updateObj = {
      Order_quantity: req.body.order_quantity,
      Special_request: req.body.special_request,
      User_id: req.body.user_id,
      Sitting_id: req.body.sitting_id,
      Status: req.body.status,
      Request_delivered_by: req.body.request_delivered_by,
      Message: req.body.message,
      room_id: req.body.room_id,
      Remarks: req.body.remarks,
      product_id: req.body.product_id,
      props1: req.body.props1,
      props2: req.body.props2,
      props3: req.body.props3,
      Last_updated_date: Date.now(),
      Delivered_datetime: Date.now(),
    };
    const editOrderReqObj = await orderReqModel.findOneAndUpdate(
      { Order_req_id: parseInt(req.body.order_req_id) }, // Filter condition
      {
        $set: updateObj,
      },
      { new: true }
    );
    if (!editOrderReqObj) {
      return response.returnFalse(
        200,
        req,
        res,
        "No Record Found with this Order Req id.",
        {}
      );
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Order Req updated successfully.",
      editOrderReqObj
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.deleteOrderReqById = async (req, res) => {
  const Order_req_id = parseInt(req.body.id);
  const condition = { Order_req_id, Status: "pending" };
  try {
    const result = await orderReqModel.deleteOne(condition);
    if (result.deletedCount === 1) {
      return response.returnTrue(
        200,
        req,
        res,
        `Order request with ID ${Order_req_id} deleted successfully`,
        {}
      );
    } else {
      return response.returnFalse(
        200,
        req,
        res,
        `Order request with ID ${Order_req_id} not found or is not in 'pending' status`,
        {}
      );
    }
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.getLastOrderId = async (req, res) => {
  try {
    const lastOrder = await orderReqModel
      .find()
      .sort({ Order_req_id: -1 })
      .limit(1);
    if (!lastOrder) {
      return response.returnFalse(200, req, res, "No Record found", {});
    } else {
      // return response.returnTrue(
      //   200,
      //   req,
      //   res,
      //   "Data Fetch Successfully",
      //   lastOrder
      // );
      return res.status(200).json(lastOrder[0]);
    }
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};
let timers1 = {};
exports.pendingOrdersById = async (req, res) => {
  try {
    const orders = await orderReqModel.aggregate([
      {
        $match: { Status: "pending" },
      },
      {
        $lookup: {
          from: "sittingmodels",
          localField: "Sitting_id",
          foreignField: "sitting_id",
          as: "Sitting",
        },
      },
      {
        $lookup: {
          from: "productmodels",
          localField: "product_id",
          foreignField: "product_id",
          as: "Product",
        },
      },
      {
        $unwind: "$Product",
      },
      {
        $unwind: "$Sitting",
      },
      {
        $project: {
          Order_req_id: 1,
          product_id: 1,
          Product_category: 1,
          Order_quantity: 1,
          Special_request: 1,
          User_id: 1,
          Sitting_id: 1,
          Request_datetime: 1,
          Status: 1,
          Request_delivered_by: 1,
          Delivered_datetime: 1,
          Message: 1,
          Remarks: 1,
          creation_date: 1,
          Created_by: 1,
          Last_updated_by: 1,
          Last_updated_date: 1,
          room_id: 1,
          props1: 1,
          props2: 1,
          props3: 1,
          props1Int: 1,
          props2Int: 1,
          props3Int: 1,
          Sitting_ref_no: "$Sitting.sitting_ref_no",
          Sitting_area: "$Sitting.sitting_area",
          Product_name: "$Product.Product_name",
          Duration: "$Product.Duration",
          Product_image: "$Product.Product_image",
        },
      },
      {
        $project: {
          Product: 0,
          Sitting: 0,
        },
      },
    ]);

    //Create Logic for create timer as well as image url
    const currentTime = new Date();


    const responseData = orders.map((item) => {
      const orderRequestId = item.Order_req_id;
      const imageUrl = `${constant.base_url}${item.Product_image}`;
      if (!timers1[orderRequestId]) {
        timers1[orderRequestId] = {
          startTime: currentTime,
          duration: parseInt(item.Duration) * 60000,
        };
      }
      const elapsedTime = currentTime - timers1[orderRequestId].startTime;
      const remainingTime = timers1[orderRequestId].duration - elapsedTime;
      const secondsRemaining = Math.floor(remainingTime / 1000);
      const formattedTimer = Math.max(secondsRemaining, 0);
      return {
        ...item,
        timer: formattedTimer,
        product_image_url: imageUrl,
      };
    });

    if (!responseData?.[0]) {
      return response.returnFalse(
        200,
        req,
        res,
        "No Record Found with this Product id.",
        {}
      );
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Product Props Fetch successfully.",
      responseData
    );
  } catch (error) {
    return response.returnFalse(500, req, res, error.message, {});
  }
};
exports.delivereOrdersById = async (req, res) => {
  try {
    const orders = await orderReqModel.aggregate([
      {
        $match: { Status: "delivered" },
      },
      {
        $lookup: {
          from: "sittingmodels",
          localField: "Sitting_id",
          foreignField: "sitting_id",
          as: "Sitting",
        },
      },
      {
        $lookup: {
          from: "productmodels",
          localField: "product_id",
          foreignField: "product_id",
          as: "Product",
        },
      },
      {
        $unwind: "$Product",
      },
      {
        $unwind: "$Sitting",
      },
      {
        $project: {
          Order_req_id: 1,
          product_id: 1,
          Product_category: 1,
          Order_quantity: 1,
          Special_request: 1,
          User_id: 1,
          Sitting_id: 1,
          Request_datetime: 1,
          Status: 1,
          Request_delivered_by: 1,
          Delivered_datetime: 1,
          Message: 1,
          Remarks: 1,
          creation_date: 1,
          Created_by: 1,
          Last_updated_by: 1,
          Last_updated_date: 1,
          room_id: 1,
          props1: 1,
          props2: 1,
          props3: 1,
          props1Int: 1,
          props2Int: 1,
          props3Int: 1,
          Sitting_ref_no: "$Sitting.sitting_ref_no",
          Sitting_area: "$Sitting.sitting_area",
          Product_name: "$Product.Product_name",
          Duration: "$Product.Duration",
          Product_image: "$Product.Product_image",
        },
      },
      {
        $project: {
          Product: 0,
          Sitting: 0,
        },
      },
    ]);

    //Create Logic for create timer as well as image url
    const currentTime = new Date();
    let timers1 = {};

    const responseData = orders.map((item) => {
      const orderRequestId = item.Order_req_id;
      const imageUrl = `${constant.base_url}${item.Product_image}`;
      if (!timers1[orderRequestId]) {
        timers1[orderRequestId] = {
          startTime: currentTime,
          duration: parseInt(item.Duration) * 60000,
        };
      }
      const elapsedTime = currentTime - timers1[orderRequestId].startTime;
      const remainingTime = timers1[orderRequestId].duration - elapsedTime;
      const secondsRemaining = Math.floor(remainingTime / 1000);
      const formattedTimer = Math.max(secondsRemaining, 0);
      return {
        ...item,
        timer: formattedTimer,
        product_image_url: imageUrl,
      };
    });

    if (!responseData?.[0]) {
      return response.returnFalse(
        200,
        req,
        res,
        "No Record Found with this Product id.",
        {}
      );
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Product Props Fetch successfully.",
      responseData
    );
  } catch (error) {
    return response.returnFalse(500, req, res, error.message, {});
  }
};

exports.orderRequestsForUser = async (req, res) => {
  try {
    const orderReq = await orderReqModel.aggregate([
      {
        $match: {
          User_id: parseInt(req.body.userId),
        },
      },
      {
        $lookup: {
          from: "productmodels",
          localField: "product_id",
          foreignField: "product_id",
          as: "productModel",
        },
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "user_id",
          foreignField: "User_id",
          as: "userModel",
        },
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "user_id",
          foreignField: "Request_delivered_by",
          as: "userModelDelivered",
        },
      },
      {
        $unwind: "$productModel",
      },
      {
        $unwind: "$userModel",
      },
      {
        $unwind: "$userModelDelivered",
      },
      {
        $project: {
          Order_req_id: 1,
          product_id: 1,
          Product_category: 1,
          Order_quantity: 1,
          Special_request: 1,
          User_id: 1,
          Sitting_id: 1,
          Request_datetime: 1,
          Status: 1,
          Request_delivered_by: 1,
          Delivered_datetime: 1,
          Message: 1,
          Remarks: 1,
          creation_date: 1,
          Created_by: 1,
          Last_updated_by: 1,
          Last_updated_date: 1,
          room_id: 1,
          props1: 1,
          props2: 1,
          props3: 1,
          props1Int: 1,
          props2Int: 1,
          props3Int: 1,
          Product_name: "$productModel.Product_name",
          User_name: "$userModel.user_name",
          Request_delivered_by_name: "$userModelDelivered.user_name",
        },
      },
      {
        $project: {
          userModelDelivered: 0,
          userModel: 0,
          productModel: 0,
        },
      },
    ]);
    if (!orderReq?.[0]) {
      return response.returnFalse(
        200,
        req,
        res,
        "Order requests not found for the user",
        {}
      );
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Order requests Fetch successfully.",
      orderReq
    );
  } catch (error) {
    return response.returnFalse(500, req, res, error.message, {});
  }
};
let timers = {};
exports.allOrderReqData = async (req, res) => {
  try {
    const orderReq = await orderReqModel.aggregate([
      // {
      //   $match: {
      //     Status: "pending",
      //   },
      // },
      {
        $lookup: {
          from: "usermodels",
          localField: "User_id",
          foreignField: "user_id",
          as: "userModel",
        },
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "Request_delivered_by",
          foreignField: "user_id",
          as: "userModelRequestDelivered",
        },
      },
      {
        $lookup: {
          from: "productmodels",
          localField: "product_id",
          foreignField: "product_id",
          as: "productModel",
        },
      },
      {
        $lookup: {
          from: "sittingmodels",
          localField: "Sitting_id",
          foreignField: "sitting_id",
          as: "sittingModel",
        },
      },
      {
        $unwind: {
          path: "$userModelRequestDelivered",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$userModel",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$productModel",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$sittingModel",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          Order_req_id: 1,
          product_id: 1,
          Product_category: 1,
          Order_quantity: 1,
          Special_request: 1,
          User_id: 1,
          Sitting_id: 1,
          Request_datetime: 1,
          Status: 1,
          Request_delivered_by: 1,
          Delivered_datetime: 1,
          Message: 1,
          Remarks: 1,
          creation_date: 1,
          Created_by: 1,
          Last_updated_by: 1,
          Last_updated_date: 1,
          room_id: 1,
          props1: 1,
          props2: 1,
          props3: 1,
          props1Int: 1,
          props2Int: 1,
          props3Int: 1,
          delivered_by_name: "$userModelRequestDelivered.user_name",
          user_name: "$userModel.user_name",
          dept_id: "$userModel.dept_id",
          Sitting_ref_no: "$sittingModel.sitting_ref_no",
          Sitting_area: "$sittingModel.sitting_area",
          Product_name: "$productModel.Product_name",
          Duration: "$productModel.Duration",
        },
      },
    ]);

    // Calculate the countdown timers based on the "Duration" from the database
    const currentTime = new Date();

    const responseData = orderReq.map((item) => {
      const orderRequestId = item.Order_req_id;

      if (!timers[orderRequestId]) {
        timers[orderRequestId] = {
          startTime: currentTime,
          duration: item.Duration * 60000, // Convert Duration to milliseconds
        };
      }

      const elapsedTime = currentTime - timers[orderRequestId].startTime;
      const remainingTime = timers[orderRequestId].duration - elapsedTime;

      const secondsRemaining = Math.floor(remainingTime / 1000);
      const formattedTimer = Math.max(secondsRemaining, 0); // Ensure the timer is not negative

      return {
        ...item,
        timer: formattedTimer,
      };
    });

    if (!responseData?.[0]) {
      return response.returnFalse(
        200,
        req,
        res,
        "Order requests not found for the user",
        {}
      );
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Order requests Fetch successfully.",
      responseData
    );
  } catch (error) {
    return response.returnFalse(500, req, res, error.message, {});
  }
};

exports.orderReqHistory = async (req, res) => {
  try {
    const User_id = req.params.user_id;

    const orderReqHis = await orderReqModel.aggregate([
      {
        $match: {
          User_id: parseInt(User_id),
          Request_datetime: {
            $gte: new Date(Date.now() - 48 * 60 * 60 * 1000),
          },
        },
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "User_id",
          foreignField: "user_id",
          as: "user_info",
        },
      },
      {
        $lookup: {
          from: "productmodels",
          localField: "product_id",
          foreignField: "product_id",
          as: "product_info",
        },
      },
      {
        $lookup: {
          from: "sittingmodels",
          localField: "Sitting_id",
          foreignField: "sitting_id",
          as: "sitting_info",
        },
      },
      {
        $unwind: "$user_info",
      },
      {
        $unwind: "$product_info",
      },
      {
        $unwind: "$sitting_info",
      },
      {
        $project: {
          Order_req_id: 1,
          User_id: 1,
          User_name: "$user_info.user_name",
          image: "$user_info.image",
          product_id: 1,
          Product_name: "$product_info.Product_name",
          Product_image: "$product_info.Product_image",
          Order_quantity: 1,
          Sitting_id: 1,
          Sitting_area: "$sitting_info.sitting_area",
          Sitting_ref_no: "$sitting_info.sitting_ref_no",
          Request_datetime: 1,
          Message: 1,
          Special_request: 1,
        },
      },
      // {
      //   $group: {
      //     _id: "$_id", // Group by the unique identifier of each document
      //     data: { $first: "$$ROOT" }, // Take the first occurrence of each document
      //   },
      // },
      {
        $sort: { "Request_datetime": -1 },
      },
      {
        $limit: 3,
      },
    ]);

    const responseData = orderReqHis.map((item) => {
      const imageUrl = item.Product_image
        ? `${constant.base_url}${item.Product_image}`
        : "";
      const userImageeUrl = item.image
        ? `${constant.base_url}${item.image}`
        : "";

      return {
        ...item,
        image: userImageeUrl,
        Product_image: imageUrl,
      };
    });
    // Transform the response objects into the desired format
    const transformedArray = responseData.map((item) => ({
      Order_req_id: item?.Order_req_id,
      User_id: item?.User_id,
      User_name: item?.User_name, // You can set the actual user name here
      image: item?.image,
      product_id: item?.product_id,
      Product_name: item?.Product_name,
      Product_image: item?.Product_image,
      Order_quantity: item?.Order_quantity,
      Sitting_id: item?.Sitting_id,
      Sitting_area: item?.Sitting_area,
      Sitting_ref_no: item?.Sitting_ref_no, // Set the desired value for Sitting_ref_no
      Request_datetime: item?.Request_datetime,
      Message: item?.Message,
      Special_request: item?.Special_request,
    }));
    if (!transformedArray?.[0]) {
      return response.returnFalse(
        200,
        req,
        res,
        "Order requests history not found for the user",
        {}
      );
    }
    // return response.returnTrue(
    //   200,
    //   req,
    //   res,
    //   "Order request history Fetch successfully.",
    //   responseData
    // );
    return res.status(200).json(transformedArray);
  } catch (error) {
    return response.returnFalse(500, req, res, error.message, {});
  }
};

// Get order req based on room id or Request_delivered_by And Order_req_mast.Status NOT IN ('complete', 'declined')

exports.getOrderReqsBasedOnFilter = async (req, res) => {
  try {
    const room_id = req.body.room_id;
    const Request_delivered_by = req.body.Request_delivered_by;

    const orderReq = await orderReqModel.aggregate([
      {
        $match: {
          $and: [
            { Status: { $nin: ["Delivered", "declined"] } },
            {
              $or: [
                { room_id: parseInt(room_id) },
                { Request_delivered_by: parseInt(Request_delivered_by) },
              ],
            },
          ],
        },
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "User_id",
          foreignField: "user_id",
          as: "userModel",
        },
      },

      {
        $lookup: {
          from: "productmodels",
          localField: "product_id",
          foreignField: "product_id",
          as: "productModel",
        },
      },
      {
        $lookup: {
          from: "sittingmodels",
          localField: "Sitting_id",
          foreignField: "sitting_id",
          as: "sittingModel",
        },
      },
      {
        $unwind: {
          path: "$userModel",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$productModel",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$sittingModel",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          Order_req_id: 1,
          product_id: 1,
          Product_category: 1,
          Order_quantity: 1,
          Special_request: 1,
          User_id: 1,
          Sitting_id: 1,
          Request_datetime: 1,
          Status: 1,
          Request_delivered_by: 1,
          Delivered_datetime: 1,
          Message: 1,
          Remarks: 1,
          creation_date: 1,
          Created_by: 1,
          Last_updated_by: 1,
          Last_updated_date: 1,
          room_id: 1,
          props1: 1,
          props2: 1,
          props3: 1,
          props1Int: 1,
          props2Int: 1,
          props3Int: 1,

          user_name: "$userModel.user_name",
          image: "$userModel.image",
          Sitting_ref_no: "$sittingModel.sitting_ref_no",
          Sitting_area: "$sittingModel.sitting_area",
          Product_name: "$productModel.Product_name",
          Product_image: "$productModel.Product_image",
        },
      },
    ]);

    const responseData = orderReq.map((item) => {
      const imageUrl = item.Product_image
        ? `${constant.base_url}${item.Product_image}`
        : "";
      const userImageeUrl = item.image
        ? `${constant.base_url}${item.image}`
        : "";
      return {
        ...item,
        image: userImageeUrl,
        Product_image: imageUrl,
      };
    });

    if (!responseData?.[0]) {
      return response.returnFalse(
        200,
        req,
        res,
        "Order requests not found for specific filter",
        {}
      );
    }
    return res.status(200).json(responseData)
  } catch (error) {
    return response.returnFalse(500, req, res, error.message, {});
  }
};

exports.addTransferReq = async (req, res) => {
  try {
    const { from_id, to_id, reason, order_req_id } = req.body;

    const transerReqObj = new transferReqModel({
      From_id: from_id,
      Reason: reason,
      To_id: to_id,
      order_req_id,
    });

    const savedTransferReq = await transerReqObj.save();
    if (savedTransferReq) {
      const editOrderReqObj = await orderReqModel.findOneAndUpdate(
        { Order_req_id: parseInt(order_req_id) }, // Filter condition
        {
          $set: { Request_delivered_by: to_id },
        },
        { new: true }
      );
      if (!editOrderReqObj) {
        return response.returnFalse(
          200,
          req,
          res,
          "Data Created in transfer req table but not set Request_delivered_by",
          {}
        );
      } else {
        return response.returnTrue(
          200,
          req,
          res,
          "Transfer Reuest added successful",
          transerReqObj
        );
      }
    } else {
      return response.returnFalse(
        200,
        req,
        res,
        "Something went wrong in data creation for transfer req model",
        {}
      );
    }
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.getAllTransferReq = async (req, res) => {
  try {
    const resData = await transferReqModel.aggregate([
      {
        $lookup: {
          from: "usermodels",
          localField: "From_id",
          foreignField: "user_id",
          as: "userModelFrom",
        },
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "To_id",
          foreignField: "user_id",
          as: "userModelTo",
        },
      },
      {
        $lookup: {
          from: "orderreqmodels",
          localField: "order_req_id",
          foreignField: "Order_req_id",
          as: "OrderReqModel",
        },
      },
      {
        $unwind: "$OrderReqModel",
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "OrderReqModel.User_id",
          foreignField: "user_id",
          as: "userModelORM",
        },
      },

      {
        $lookup: {
          from: "productmodels",
          localField: "OrderReqModel.product_id",
          foreignField: "product_id",
          as: "productModel",
        },
      },

      {
        $lookup: {
          from: "sittingmodels",
          localField: "OrderReqModel.Sitting_id",
          foreignField: "sitting_id",
          as: "sittingModel",
        },
      },
      {
        $unwind: "$sittingModel",
      },

      {
        $unwind: "$productModel",
      },
      {
        $unwind: "$userModelORM",
      },
      {
        $unwind: "$userModelTo",
      },
      {
        $unwind: "$userModelFrom",
      },
      {
        $project: {
          Transfer_req_id: 1,
          From_id: 1,
          To_id: 1,
          Reason: 1,
          order_req_id: 1,
          Order_quantity: "$OrderReqModel.Order_quantity",
          request_transfered_by: "$userModelFrom.user_name",
          transfer_to: "$userModelTo.user_name",
          requested_by: "$userModelORM.user_name",
          Sitting_ref_no: "$sittingModel.sitting_ref_no",
          Sitting_area: "$sittingModel.sitting_area",
          Product_name: "$productModel.Product_name",
        },
      },
    ]);
    if (!resData?.[0]) {
      return response.returnFalse(
        200,
        req,
        res,
        "Transfer Request Data Not Found",
        {}
      );
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Transfer Request Fetch successfully.",
      resData
    );
  } catch (error) {
    return response.returnFalse(500, req, res, error.message, {});
  }
};
