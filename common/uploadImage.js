const { storage } = require('./uploadFile.js');
const vari = require('../variables.js');


const bucketName = vari.BUCKET_NAME;
const bucket = storage.bucket(bucketName);

// Function to upload image to Google Cloud Storage
const uploadImage = (file, folder) => {
    return new Promise((resolve, reject) => {
        if (!file || !file.originalname) {
            return resolve(null);
        }

        const blob = bucket.file(`${folder}/${file.originalname}`);
        const blobStream = blob.createWriteStream();

        blobStream.on('error', (err) => {
            reject(err);
        });

        blobStream.on('finish', () => {
            resolve(file.originalname);
        });

        blobStream.end(file.buffer);
    });
};

module.exports = { uploadImage };
