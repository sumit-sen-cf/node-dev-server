const multer = require("multer");
const path = require("path");
const vari = require('../variables.js')
const { Storage } = require("@google-cloud/storage");

exports.upload = multer({
  dest: "./uploads",
});

const devEnCodedBase64 = 'ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiaGVsbG8tYmFja2VuZC00MTY2MTEiLAogICJwcml2YXRlX2tleV9pZCI6ICI3NWM1N2E1YzQ4OTA3MTA0ZGQ3NWEwMjJlMTQ1NjdmODlkODY5MTU2IiwKICAicHJpdmF0ZV9rZXkiOiAiLS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tXG5NSUlFdlFJQkFEQU5CZ2txaGtpRzl3MEJBUUVGQUFTQ0JLY3dnZ1NqQWdFQUFvSUJBUURlYjAxTnQ5cHdHSTJuXG5RMmlKVEpQS1dUdGlnczdGNUo3cjlLcjdZTHhaU3ByUDZZZVh3Y2k3VmE5dUJwRGJ0encrcjI1bHoyaDVJZldJXG5qd0c5aDJnblBPb2RDSmJ4S0V3ckk2dDN0SUx1dEpRaldDUHYwOU5CaUIvR1JFYVZYMC9ZYk5hMUtCaW83Z2tQXG5OUmNkRGJHY2NCbkVEdkt3dldzY1p4WFpCZjN0RDNjdkFFejlVQXNqZVh0MkFQVVVpREUwUGI1aWhrMnlTTmF6XG4zYlE1ZnFIcEJxb2tKeVRadlRybUlUQWxQT3FzUFVuZFArMS9UdXhSUHpYRlcrU0hkbzQ0Q28wOWVBeEdMbWJLXG4wR050aWcycmprN01GaS83UXgwREM4ODRscjlKTkpDUExUcjFodHZrRC9FVHRPaGRFd3o0YkRPRDU5cG42SUVJXG5aN0gyZmpCRkFnTUJBQUVDZ2dFQUQxcFlXQnB1RWRtb0FWa0dRSi9QL2FIK0Z0VVhoNUk1bytpdDJvNzVRU0tFXG5vQUFxOHo4VloxVEpPSXRzZVRYakN5S1p1SjVCeEVhalIyc3pnQXoyRSt0QTc0TVZ4QXgzZ1d6RFc0NVNrVDVXXG5rVC8ycndtTVpkUUsrV2ppQkZKaFZQdGlNSHZWZytkMktaNE0rOXpqbXZ3ajB5UUMvVTc5c3lhc1c5L3RnR3kxXG5XekhIMVUxQlIxd3BCQ0pGOS81bDhneUJ3MjhsTGxzWmlEUk91Qjl6UmQ2U2lwejVGZU5JUENvWHpFblpjZUtkXG55bGhZYUNXaFJWVEN1Z1FZcTNiM1NKa1pLOHVVSktudHUwZDBQZU8rVkxWM0tkY1VxTzV3TFFpZkQxQXMvNTh1XG4rSUg4dXVxajdkcHk4N3VrWkVqWE4xbXQwcDJ4YTc0YW1GZmpqT1Q2cXdLQmdRRDhndEZaanlnYXVlTHBhSE5tXG5yeVFNZE1XQmw4L0N6QjFscUMwSWw3UW5Kalh3THdHS0dtZ3dYcG96QzgxSmdyWE5LcXBGdkZtQmZjdnk1Ykh6XG5tWWNsMnZOZERkT2lNUUpKWmZOMGxPbWpQNjRoQTQrcnd0VHpTUEtVcENBRkJ1amR4WnUyWS9wZytjMjZ3aEVOXG5ZRTNUMUtzU1dZS2psK0NUMDIrUVd6MVl6d0tCZ1FEaGdoazNyVjJrUW5VVEF6VlNSMkE5OXBnamNQMU9XQnJBXG52WHk0MmJsUE1iOCtmUnlSREt5clFlMWVQNkRUQWZlUGJxTDRBdWcxRjhHeVF4Uis4bTA2bXJMNWQyTnkzb2NDXG5lTnUzRGROQW1nTER2UVh2dUFPMGNGY3hlTngyK3g2SUd1eDZhbDE4OCtvcCtLUkYxdnN2VnBUSFpGRlpCdVdWXG5aOE5BTlJuQ3F3S0JnUURFK25lOVdZTjdkYzZoTGEzNFNGL2lwNlQ2OXlaSFcxc0RWakhySmd5UERhdTk5YTFKXG53bGZNZzcvZVdqS0dTY1R3aTN2UWNxR1A5a1lHOFUva0s3dlZ0L3RvZDhURUhWOGZTcnlrRVJaQkZ3Z0xFUEFlXG5tUm50dnRZZFJmc0VjT052UFJ1L0tEYkZONWxaT3RKNmtNbWxtWnpwNzVHTmRJam9TR1FiUkZHUzJRS0JnSFJPXG5qa1VLRkZib3M4czNoMlBGVGwwRzl4YW9hdXppUWdJUWVPZzUydnArZE4xODE2UHovb1poZlZSenlyV3B1UTN3XG5DUHVUUEVKTjIyZmVjdzY2YUIybXRoSTJRa04zZy9pQmJ3aXRoN3cwOHFJVHRxRVpya2Q4L1d1Vm8xZDJVeHZ0XG5qdlBnTWhHRkY4dkg0cW5tcEN5Wklpam9rNUF3SDI3OFVsYW1USC83QW9HQVdrbnJEajkvOVlETERLSmgvdkJKXG5qYit6NExwTzkrYWVMQTRkcFdBMWMvbnBzcGlwOUQvTUgwZ0w0UkJZMEdoVkVtUTRiR2J4S3gyWjdnTmN6SWpoXG5RYjBZdERjUWxpdVU0NVZsQTBsRFFWOTVmamYxdlVkR0NFNlV2ZDM1aE5obDdEQkxNUXI2OFRzUEs1dHdmdmlqXG5lc2pVZmNJbFRWS2s5UjdRc1JGa0g2WT1cbi0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS1cbiIsCiAgImNsaWVudF9lbWFpbCI6ICJub2RlLWRldi1idWMtY3JlZGVuQGhlbGxvLWJhY2tlbmQtNDE2NjExLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAiY2xpZW50X2lkIjogIjEwNzE5MjcwMTg2NTAzMTg5MzIxOCIsCiAgImF1dGhfdXJpIjogImh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi9hdXRoIiwKICAidG9rZW5fdXJpIjogImh0dHBzOi8vb2F1dGgyLmdvb2dsZWFwaXMuY29tL3Rva2VuIiwKICAiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsCiAgImNsaWVudF94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3JvYm90L3YxL21ldGFkYXRhL3g1MDkvbm9kZS1kZXYtYnVjLWNyZWRlbiU0MGhlbGxvLWJhY2tlbmQtNDE2NjExLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAidW5pdmVyc2VfZG9tYWluIjogImdvb2dsZWFwaXMuY29tIgp9Cg=='
const serviceAccountKey = JSON.parse(Buffer.from(devEnCodedBase64, "base64").toString("utf-8"));

const storage = new Storage({
  projectId: "hello-backend-416611",
  // projectId: "hello-backend-416611",
  // keyFilename: path.join(__dirname, "../hello-backend-416611-73bb3d971ab8.json"),
  //bucket key changes.
  credentials: serviceAccountKey,
  // keyFilename: path.join(__dirname, "../hello-backend-416611-5a1009ac3405.json"),
});
exports.storage = storage;

const upload1 = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024,
  },
});
exports.upload1 = upload1;

const uploadToGCP = (req, obj, fieldName) => {
  return new Promise((resolve, reject) => {
    if (req.file) {
      const bucketName = vari.BUCKET_NAME;
      const bucket = storage.bucket(bucketName);

      // const blob = bucket.file(req.file.originalname);
      // obj[fieldName] = blob.name;

      const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
      const newFilename = `${timestamp}__${req.file.originalname}`;
      const blob = bucket.file(newFilename);

      obj[fieldName] = blob.name;

      const blobStream = blob.createWriteStream();
      blobStream.on("finish", () => {
        resolve("Success");
      });
      blobStream.on("error", (err) => {
        reject(err);
      });
      blobStream.end(req.file.buffer);
    } else {
      reject(new Error("No file found in the request."));
    }
  });
};
exports.uploadToGCP = uploadToGCP