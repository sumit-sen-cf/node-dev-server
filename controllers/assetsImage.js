const assetsImagesModel = require("../models/assetsimagesModel");
const simModel = require("../models/simModel");
const multer = require("multer");
const vari = require("../variables.js");
const {storage} = require('../common/uploadFile.js')

// const upload = multer({ dest: "uploads/assets" }).fields([
//   { name: "img1", maxCount: 1 },
//   { name: "img2", maxCount: 1 },
//   { name: "img3", maxCount: 1 },
//   { name: "img4", maxCount: 1 },
// ]);

const upload = multer({
  storage: multer.memoryStorage()
}).fields([
  { name: "img1", maxCount: 1 },
  { name: "img2", maxCount: 1 },
  { name: "img3", maxCount: 1 },
  { name: "img4", maxCount: 1 }
]);

exports.addAssetImage = [
  upload,
  async (req, res) => {
    try {
      const assetImage = new assetsImagesModel({
        sim_id: req.body.sim_id,
        // img1: req.files.img1 ? req.files.img1[0].filename : "",
        // img2: req.files.img2 ? req.files.img2[0].filename : "",
        // img3: req.files.img3 ? req.files.img3[0].filename : "",
        // img4: req.files.img4 ? req.files.img4[0].filename : "",
        uploaded_by: req.body.uploaded_by,
        type: req.body.type,
      });

      const bucketName = vari.BUCKET_NAME;
      const bucket = storage.bucket(bucketName);

      if(req.files.img1 && req.files.img1[0].originalname){
        const blob1 = bucket.file(req.files.img1[0].originalname);
        assetImage.img1 = blob1.name;
        const blobStream1 = blob1.createWriteStream();
        blobStream1.on("finish", () => res.status(200).send("Success"));
        blobStream1.end(req.files.img1[0].buffer);
      }
      if(req.files.img2 && req.files.img2[0].originalname){
        const blob2 = bucket.file(req.files.img2[0].originalname);
        assetImage.img2 = blob2.name;
        const blobStream2 = blob2.createWriteStream();
        blobStream2.on("finish", () => { res.status(200).send("Success") });
        blobStream2.end(req.files.img2[0].buffer);
      }
      if(req.files.img3 && req.files.img3[0].originalname){
        const blob3 = bucket.file(req.files.img3[0].originalname);
        assetImage.img3 = blob3.name;
        const blobStream3 = blob3.createWriteStream();
        blobStream3.on("finish", () => { res.status(200).send("Success") });
        blobStream3.end(req.files.img3[0].buffer);
      }
      if(req.files.img4 && req.files.img4[0].originalname){
        const blob4 = bucket.file(req.files.img4[0].originalname);
        assetImage.img4 = blob4.name;
        const blobStream4 = blob4.createWriteStream();
        blobStream4.on("finish", () => { res.status(200).send("Success") });
        blobStream4.end(req.files.img4[0].buffer);
      }

      const assetsImages = await assetImage.save();
      const sim = await simModel.findOne({ sim_id: req.body.sim_id });
      if (sim) {
        sim.selfAuditFlag = true;
        await sim.save();
      }

      return res.send({ assetsImages, status: 200 });
    } catch (err) {
      return res.status(500).send({
        error: err.message,
        sms: "This asset Images data cannot be created",
      });
    }
  },
];

exports.getAllAssetsImages = async (req, res) => {
  try {
    const assetsdata = await assetsImagesModel
      .aggregate([
        {
          $lookup: {
            from: "usermodels",
            localField: "uploaded_by",
            foreignField: "user_id",
            as: "userdata",
          },
        },
        {
          $unwind: {
            path: "$userdata",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            asset_image_id: "$asset_image_id",
            sim_id: "$sim_id",
            type: "$type",
            img1: "$img1",
            img2: "$img2",
            img3: "$img3",
            img4: "$img4",
            uploaded_date: "$uploaded_date",
            uploaded_by: "$uploaded_by",
            uploaded_by_name: "$userdata.user_name",
          },
        },
      ])
      .exec();
    const assetImagesBaseUrl = `${vari.IMAGE_URL}`;
    const dataWithImageUrl = assetsdata.map((assetimage) => ({
      ...assetimage,
      img1_url: assetimage.img1 ? assetImagesBaseUrl + assetimage.img1 : null,
      img2_url: assetimage.img2 ? assetImagesBaseUrl + assetimage.img2 : null,
      img3_url: assetimage.img3 ? assetImagesBaseUrl + assetimage.img3 : null,
      img4_url: assetimage.img4 ? assetImagesBaseUrl + assetimage.img4 : null,
    }));
    if (dataWithImageUrl?.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      res.status(200).send({ data: dataWithImageUrl });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, sms: "Error getting all assetsImages" });
  }
};

exports.getSingleAssetsImage = async (req, res) => {
  try {
    const assetsdata = await assetsImagesModel
      .aggregate([
        {
          $match: { sim_id: parseInt(req.body.sim_id) },
        },
        {
          $lookup: {
            from: "usermodels",
            localField: "uploaded_by",
            foreignField: "user_id",
            as: "userdata",
          },
        },
        {
          $unwind: {
            path: "$userdata",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            asset_image_id: "$asset_image_id",
            sim_id: "$sim_id",
            type: "$type",
            img1: "$img1",
            img2: "$img2",
            img3: "$img3",
            img4: "$img4",
            uploaded_date: "$uploaded_date",
            uploaded_by: "$uploaded_by",
            uploaded_by_name: "$userdata.user_name",
          },
        },
      ])
      .exec();
    const assetImagesBaseUrl = `${vari.IMAGE_URL}`;
    const dataWithImageUrl = assetsdata.map((assetimage) => ({
      ...assetimage,
      img1_url: assetimage.img1 ? assetImagesBaseUrl + assetimage.img1 : null,
      img2_url: assetimage.img2 ? assetImagesBaseUrl + assetimage.img2 : null,
      img3_url: assetimage.img3 ? assetImagesBaseUrl + assetimage.img3 : null,
      img4_url: assetimage.img4 ? assetImagesBaseUrl + assetimage.img4 : null,
    }));
    if (dataWithImageUrl?.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      res.status(200).send({ data: dataWithImageUrl });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, sms: "Error getting Single assetImage" });
  }
};

exports.updateAssetImage = [
  upload,
  async (req, res) => {
    try {
      const existingAssetImage = await assetsImagesModel.findOne({
        sim_id: parseInt(req.body.sim_id),
      });

      const updateFields = {
        uploaded_by: req.body.uploaded_by,
        type: req.body.type,
      };

      if (req.files) {
        updateFields.img1 = req.files?.img1 ? req.files.img1[0].originalname : existingAssetImage.img1;
        updateFields.img2 = req.files?.img2 ? req.files.img2[0].originalname : existingAssetImage.img2;
        updateFields.img3 = req.files?.img3 ? req.files.img3[0].originalname : existingAssetImage.img3;
        updateFields.img4 = req.files?.img4 ? req.files.img4[0].originalname : existingAssetImage.img4;
      }


      const editassetimage = await assetsImagesModel.findOneAndUpdate(
        { sim_id: parseInt(req.body.sim_id) },
        updateFields,
        { new: true }
      );

      if (!editassetimage) {
        return res.status(500).send({ success: false });
      }

      const bucketName = vari.BUCKET_NAME;
      const bucket = storage.bucket(bucketName);

      if(req.files.img1 && req.files.img1[0].originalname){
        const blob1 = bucket.file(req.files.img1[0].originalname);
        editassetimage.img1 = blob1.name;
        const blobStream1 = blob1.createWriteStream();
        blobStream1.on("finish", () => {
          editassetimage.save();
          res.status(200).send("Success")
        });
        blobStream1.end(req.files.img1[0].buffer);
      }
      if(req.files.img2 && req.files.img2[0].originalname){
        const blob2 = bucket.file(req.files.img2[0].originalname);
        editassetimage.img2 = blob2.name;
        const blobStream2 = blob2.createWriteStream();
        blobStream2.on("finish", () => { 
          editassetimage.save();
          res.status(200).send("Success") 
        });
        blobStream2.end(req.files.img2[0].buffer);
      }
      if(req.files.img3 && req.files.img3[0].originalname){
        const blob3 = bucket.file(req.files.img3[0].originalname);
        editassetimage.img3 = blob3.name;
        const blobStream3 = blob3.createWriteStream();
        blobStream3.on("finish", () => { 
          editassetimage.save();
          res.status(200).send("Success") 
        });
        blobStream3.end(req.files.img3[0].buffer);
      }
      if(req.files.img4 && req.files.img4[0].originalname){
        const blob4 = bucket.file(req.files.img4[0].originalname);
        editassetimage.img4 = blob4.name;
        const blobStream4 = blob4.createWriteStream();
        blobStream4.on("finish", () => { 
          editassetimage.save();
          res.status(200).send("Success") 
        });
        blobStream4.end(req.files.img4[0].buffer);
      }

      return res.status(200).send({ success: true, data: editassetimage });
    } catch (err) {
      return res
        .status(500)
        .send({ error: err.message, sms: "Error updating assets image details" });
    }
  },
];


exports.deleteAssetImage = async (req, res) => {
  assetsImagesModel
    .deleteOne({ asset_image_id: req.params.asset_image_id })
    .then((item) => {
      if (item) {
        return res
          .status(200)
          .json({ success: true, message: "Asset Images deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Asset Images not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, message: err.message });
    });
};
