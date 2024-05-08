const userDocManagmentModel = require("../models/userDocManagementModel.js");
const response = require("../common/response.js");
const constant = require("../common/constant.js");
const { default: mongoose } = require("mongoose");
const helper = require("../helper/helper.js");
const vari = require("../variables.js");
const { storage } = require('../common/uploadFile.js');
const userLoginHisModel = require("../models/userLoginHisModel.js");

exports.addUserDoc = async (req, res) => {
  try {
    const {
      reject_reason,
      status,
      timer,
      doc_id,
      user_id,
      upload_date,
      approval_date,
      approval_by,
    } = req.body;
    let doc_image = req.file.filename;
    const doc = new userDocManagmentModel({
      reject_reason,
      status,
      timer,
      doc_id,
      user_id,
      upload_date,
      approval_date,
      approval_by,
      doc_image,
    });

    const savedDoc = await doc.save();

    return response.returnTrue(
      200,
      req,
      res,
      "Data Created Successfully",
      savedDoc
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.getUserDoc = async (req, res) => {
  try {
    let userDocId = req.body?._id;
    let user_id = req.body?.user_id;
    let matchCondition = {};

    if (user_id) {
      matchCondition.user_id = parseInt(user_id);
    }
    if (userDocId) {
      matchCondition._id = mongoose.Types.ObjectId(userDocId);
    }
    let docs = await userDocManagmentModel.aggregate([
      {
        $match: matchCondition,
      },
      {
        $lookup: {
          from: "documentmodels",
          localField: "doc_id",
          foreignField: "_id",
          as: "document",
        },
      },
      {
        $unwind: "$document",
      },
      {
        $addFields: {
          doc_image_url: {
            $cond: {
              if: "$doc_image",
              then: {
                $concat: [
                  `${constant.base_url}`,
                  "$doc_image",
                ],
              },
              else: "",
            },
          },
        },
      },
    ]);

    if (docs?.length === 0) {
      return response.returnFalse(200, req, res, "No record found", []);
    } else {
      return response.returnTrue(
        200,
        req,
        res,
        "Data Fetch Successfully",
        docs
      );
    }
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};


// //new 
// exports.getUserDoc = async (req, res) => {
//   try {
//     const userDocId = req.body?._id;
//     const user_id = req.body?.user_id;
//     const matchCondition = {};

//     if (user_id) {
//       matchCondition.user_id = parseInt(user_id);
//     }
//     if (userDocId) {
//       matchCondition._id = mongoose.Types.ObjectId(userDocId);
//     }

//     const user = await userLoginHisModel.findOne({ user_id }).sort({ login_date: 1 });
//     if (!user) {
//       return response.returnFalse(404, req, res, "User not found", []);
//     }

//     const firstLoginTime = user.login_date;

//     const docs = await userDocManagmentModel.aggregate([
//       {
//         $match: matchCondition,
//       },
//       {
//         $lookup: {
//           from: "documentmodels",
//           localField: "doc_id",
//           foreignField: "_id",
//           as: "document",
//         },
//       },
//       {
//         $unwind: "$document",
//       },
//       {
//         $addFields: {
//           doc_image_url: {
//             $cond: {
//               if: "$doc_image",
//               then: {
//                 $concat: [
//                   `${constant.base_url}`,
//                   "$doc_image",
//                 ],
//               },
//               else: "",
//             },
//           },
//           remaining_time: {
//             $subtract: [
//               "$document.period_days",
//               {
//                 $divide: [
//                   {
//                     $subtract: [new Date(), firstLoginTime]
//                   },
//                   1000 * 60 * 60 * 24
//                 ]
//               }
//             ]
//           },
//           isExpired: {
//             $gte: [{ $divide: [{ $subtract: [new Date(), firstLoginTime] }, 1000 * 60 * 60 * 24] }, 10]
//           }
//         },
//       },
//       {
//         $project: {
//           document: 1,
//           doc_image_url: 1,
//           remaining_time: {
//             $cond: {
//               if: "$isExpired",
//               then: "Expired",
//               else: {
//                 $concat: [
//                   { $toString: { $floor: "$remaining_time" } },
//                   " days ",
//                   { $toString: { $floor: { $mod: [{ $multiply: ["$remaining_time", 24] }, 24] } } },
//                   " hours left"
//                 ]
//               }
//             }
//           }
//         }
//       }
//     ]);

//     if (docs.length === 0) {
//       return response.returnFalse(200, req, res, "No record found", []);
//     } else {
//       return response.returnTrue(200, req, res, "Data Fetch Successfully", docs);
//     }
//   } catch (err) {
//     return response.returnFalse(500, req, res, err.message, {});
//   }
// };


exports.editDoc = async (req, res) => {
  try {
    const {
      _id,
      reject_reason,
      status,
      timer,
      doc_id,
      user_id,
      upload_date,
      approval_date,
      approval_by,
    } = req.body;
    let doc_image = req.file?.originalname;
    const editDocObj = await userDocManagmentModel.findByIdAndUpdate(_id, {
      $set: {
        reject_reason,
        status,
        timer,
        doc_id,
        user_id,
        upload_date,
        approval_date,
        approval_by,
        doc_image,
      },
    });

    if (req.file) {
      const bucketName = vari.BUCKET_NAME;
      const bucket = storage.bucket(bucketName);
      const blob = bucket.file(req.file.originalname);
      editDocObj.doc_image = blob.name;
      const blobStream = blob.createWriteStream();
      blobStream.on("finish", () => {
        editDocObj.save();
        // res.status(200).send("Success") 
      });
      blobStream.end(req.file.buffer);
    }

    if (doc_image) {
      const result = helper.fileRemove(
        editDocObj?.doc_image,
        "../uploads/userDocuments"
      );
      if (result?.status == false) {
        console.log(result.msg);
      }
    }
    if (!editDocObj) {
      return response.returnFalse(200, req, res, "No record found", {});
    }
    return response.returnTrue(200, req, res, "Data Update Successfully", {});
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.deleteDoc = async (req, res) => {
  try {
    const data = await userDocManagmentModel.findByIdAndDelete(req.params.id);
    if (data) {
      const result = helper.fileRemove(
        data?.doc_image,
        "../uploads/userDocuments"
      );
      if (result?.status == false) {
        console.log(result.msg);
      }

      return response.returnTrue(
        200,
        req,
        res,
        `Document with ID ${req.params?.id} deleted successfully.`
      );
    } else {
      return response.returnFalse(
        200,
        req,
        res,
        `Document with ID ${req.params?.id} not found.`
      );
    }
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};


exports.getDocsByUserID = async (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id);
    const simData = await userDocManagmentModel.find({ user_id: user_id, status: "Approved" });
    if (simData.length === 0) {
      return res.status(404).json({ message: "No documents found for this user." });
    }

    const docIds = simData.map(doc => doc.doc_id);

    const documents = await documentModel.find({ _id: { $in: docIds } });

    if (documents.length === 0) {
      return res.status(404).json({ message: "No documents found in documentModel collection." });
    }

    const docResponse = documents.map(doc => ({
      doc_type: doc.doc_type,
      description: doc.description,
      doc_image_url: vari.IMAGE_URL + simData.find(data => data.doc_id.equals(doc._id)).doc_image
    }));

    res.status(200).json(docResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, sms: "Error getting all documents" });
  }
};

exports.updateUserDoc = async (req, res) => {
  try {
    const editsim = await userDocManagmentModel.findByIdAndUpdate(req.body._id, {
      status: "Verification Pending",
    }, { new: true })
    res.status(200).send({ success: true, data: editsim })
  } catch (err) {
    res.status(500).send({ error: err, sms: 'Error updating doc details' })
  }
};