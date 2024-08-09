const constant = require("../common/constant.js");
const response = require("../common/response.js");
const { uploadImage, deleteImage } = require("../common/uploadImage.js");
const exeCampaignSchema = require("../models/executionCampaignModel.js");
const multer = require("multer");
const mongoose = require("mongoose");


const upload = multer({
  storage: multer.memoryStorage()
}).fields([
  { name: "exe_campaign_image", maxCount: 10 }
]);

exports.addExeCampaign = [
  upload,
  async (req, res) => {
    try {
      const { exe_campaign_name, exe_hash_tag, brand_id, user_id, agency_id, created_by } = req.body
      const exeCampaignAdded = new exeCampaignSchema({
        exe_campaign_name,
        exe_hash_tag,
        brand_id,
        user_id,
        agency_id,
        created_by
      });
      // Define the image fields 
      const imageFields = {
        exe_campaign_image: 'ExeCampaignImagesFile',
      };
      for (const [field] of Object.entries(imageFields)) {    //itreates 
        if (req.files[field] && req.files[field][0]) {
          exeCampaignAdded[field] = await uploadImage(req.files[field][0], "ExeCampaignImages");
        }
      }
      await exeCampaignAdded.save();
      return response.returnTrue(
        200,
        req,
        res,
        "Execution campaign created successfully",
        exeCampaignAdded
      );
    } catch (err) {
      if (err.code === 11000) {
        // 11000 is the error code for duplicate key error
        return response.returnFalse(500, req, res, `Campaign Name already exists!`, {});
      } else {
        return response.returnFalse(500, req, res, err.message, {});
      }
    }
  }];

exports.getExeCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const exeCampaignDetails = await exeCampaignSchema.findOne({
      _id: id,
      status: { $ne: constant.DELETED }
    });
    if (!exeCampaignDetails) {
      return response.returnFalse(200, req, res, `No Record Found`, {});
    }
    // Return a success response with the updated record details
    return response.returnTrue(
      200,
      req,
      res,
      "Execution campaign details retrive successfully!",
      exeCampaignDetails
    );
  } catch (error) {
    // Return an error response in case of any exceptions
    return response.returnFalse(500, req, res, `${error.message}`, {});
  }
};

exports.getExeCampaigns = async (req, res) => {
  try {
    // Extract page and limit from query parameters, default to null if not provided
    const page = req.query?.page ? parseInt(req.query.page) : null;
    const limit = req.query?.limit ? parseInt(req.query.limit) : null;

    // Calculate the number of records to skip based on the current page and limit
    const skip = (page && limit) ? (page - 1) * limit : 0;

    // Retrieve the list of records with pagination applied
    const exeCampaignList = await exeCampaignSchema.find({
      status: { $ne: constant.DELETED }
    }).skip(skip).limit(limit);

    // Get the total count of records in the collection
    const exeCamapignCount = await exeCampaignSchema.countDocuments();

    // If no records are found, return a response indicating no records found
    if (exeCampaignList.length === 0) {
      return response.returnFalse(200, req, res, `No Record Found`, []);
    }
    // Return a success response with the list of records and pagination details
    return response.returnTrueWithPagination(
      200,
      req,
      res,
      "Execution campaign list retrieved successfully!",
      exeCampaignList,
      {
        start_record: page && limit ? skip + 1 : 1,
        end_record: page && limit ? skip + exeCampaignList.length : exeCampaignList.length,
        total_records: exeCamapignCount,
        current_page: page || 1,
        total_page: page && limit ? Math.ceil(exeCamapignCount / limit) : 1,
      }
    );
  } catch (error) {
    // Return an error response in case of any exceptions
    return response.returnFalse(500, req, res, `${error.message}`, {});
  }
};

exports.getExeCampaignsNameWiseData = async (req, res) => {
  try {
    const matchCondition = {
      status: {
        $ne: constant.DELETED
      }
    }
    if (req.query?.userId) {
      matchCondition["user_id"] = Number(req.query.userId);
    }
    // Retrieve the list of records with pagination applied
    const exeCampaignList = await exeCampaignSchema.find(matchCondition, {
      exe_campaign_name: 1,
      is_sale_booking_created: 1
    });
    // Return a success response with the list of records and pagination details
    return response.returnTrueWithPagination(
      200,
      req,
      res,
      "Execution campaign name list retrieved successfully!",
      exeCampaignList,
    );
  } catch (error) {
    // Return an error response in case of any exceptions
    return response.returnFalse(500, req, res, `${error.message}`, {});
  }
};

exports.editExeCampaign = [
  upload, async (req, res) => {
    try {
      const { id } = req.params;

      let updateData = {
        exe_campaign_name: req.body.exe_campaign_name,
        exe_hash_tag: req.body.exe_hash_tag,
        brand_id: req.body.brand_id,
        user_id: req.body.user_id,
        agency_id: req.body.agency_id,
        updated_by: req.body.updated_by,
      };
      // Fetch the old document and update it
      const updatedExeCampaignService = await exeCampaignSchema.findByIdAndUpdate({
        _id: id
      }, updateData,
        {
          new: true
        });

      if (!updatedExeCampaignService) {
        return response.returnFalse(404, req, res, `Execution campaigns data not found`, {});
      }

      // Define the image fields 
      const imageFields = {
        exe_campaign_image: 'ExeCampaignImagesFile',
      };

      // Remove old images not present in new data and upload new images
      for (const [fieldName] of Object.entries(imageFields)) {
        if (req.files && req.files[fieldName] && req.files[fieldName][0]) {

          // Delete old image if present
          if (updatedExeCampaignService[fieldName]) {
            await deleteImage(`ExeCampaignImages/${updatedExeCampaignService[fieldName]}`);
          }
          // Upload new image
          updatedExeCampaignService[fieldName] = await uploadImage(req.files[fieldName][0], "ExeCampaignImages");
        }
      }
      // Save the updated document with the new image URLs
      await updatedExeCampaignService.save();
      // Return a success response with the updated record details
      return response.returnTrue(
        200,
        req,
        res,
        "Execution campaigns data updated successfully!",
        updatedExeCampaignService
      );
    } catch (error) {
      // Return an error response in case of any exceptions
      return response.returnFalse(500, req, res, `${error.message}`, {});
    }
  }];

exports.deleteExeCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const exeCampaignDeleted = await exeCampaignSchema.findOneAndUpdate({
      _id: id,
      status: { $ne: constant.DELETED }
    },
      {
        $set: {
          status: constant.DELETED,
        },
      },
      { new: true }
    );
    if (!exeCampaignDeleted) {
      return response.returnFalse(200, req, res, `No Record Found`, {});
    }
    // Return a success response with the updated record details
    return response.returnTrue(
      200,
      req,
      res,
      `Execution campaign deleted successfully id ${id}`,
      exeCampaignDeleted
    );
  } catch (error) {
    // Return an error response in case of any exceptions
    return response.returnFalse(500, req, res, `${error.message}`, {});
  }
};


exports.getAllExeCampaignList = async (req, res) => {
  try {
    const exeCampaignData = await exeCampaignSchema.aggregate([{

      $match: { _id: mongoose.Types.ObjectId(req.params.id) },
    }, {
      $lookup: {
        from: "agencymasters",
        localField: "agency_id",
        foreignField: "_id",
        as: "agencymastersData",
      }
    }, {
      $unwind: {
        path: "$agencymastersData",
        preserveNullAndEmptyArrays: true,
      },
    }, {
      $project: {
        exe_campaign_name: 1,
        exe_hash_tag: 1,
        brand_id: 1,
        user_id: 1,
        agency_id: 1,
        is_sale_booking_created: 1,
        created_by: 1,
        agencymastersData: {
          agencymastersData: "$agencymastersData.name"
        }
      }
    }
    ]);

    //if data not found
    if (!exeCampaignData) {
      return response.returnFalse(200, req, res, "No Reord Found...", []);
    }
    //success response send
    return response.returnTrue(200, req, res, "Credit approval Exe Campaign Status data fatched", exeCampaignData);
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};
