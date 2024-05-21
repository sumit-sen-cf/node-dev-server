const multer = require('multer');
// const { Storage } = require('@google-cloud/storage');
// const { BUCKET_NAME } = require('../config/vari');
const vari = require("../variables.js");
const { storage } = require('./uploadFile.js');


// Initialize Google Cloud Storage
const bucketName = vari.BUCKET_NAME;
const bucket = storage.bucket(bucketName);

// Configure Multer to use memory storage
const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "pan_image", maxCount: 1 },
    { name: "gst_image", maxCount: 1 }
]);

// Function to upload image to Google Cloud Storage
const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        if (!file || !file.originalname) {
            return resolve(null);
        }

        const blob = bucket.file(`InVendorDocs/${file.originalname}`);
        const blobStream = blob.createWriteStream();

        blobStream.on('error', (err) => {
            reject(err);
        });

        blobStream.on('finish', () => {
            resolve(blob.name);
        });

        blobStream.end(file.buffer);
    });
};

module.exports = { upload, uploadImage };
