const simModel = require("../models/simModel.js");
const simAlloModel = require("../models/simAlloModel.js");
const userModel = require("../models/userModel.js");
const vari = require("../variables.js");
const { storage } = require('../common/uploadFile.js');
const assetHistoryModel = require("../models/assetHistoryModel.js");
const assetRequestModel = require("../models/assetRequestModel.js");
const assetsSubCategoryModel = require("../models/assetsSubCategoryModel.js");
const response = require("../common/response.js");

exports.addSim = async (req, res) => {
  try {
    const checkDuplicacy = await simModel.findOne({ sim_no: req.body.sim_no })
    if (checkDuplicacy) {
      return res.status(409).send({
        data: [],
        message: "asset id already exist",
      });
    }

    const nextHrDate = new Date();
    nextHrDate.setDate(nextHrDate.getDate() + 30);
    const updatedDateString = nextHrDate.toISOString();

    const nextSelfDate = new Date();
    nextSelfDate.setDate(nextSelfDate.getDate() + 30);
    const updatedDateString2 = nextSelfDate.toISOString();

    const simc = new simModel({
      sim_no: req.body.sim_no,
      Remarks: req.body.remark,
      created_by: req.body.created_by,
      status: req.body.status,
      s_type: req.body.s_type,
      assetsName: req.body.assetsName,
      assetsOtherID: req.body.assetsOtherID,
      category_id: req.body.category_id,
      sub_category_id: req.body.sub_category_id,
      vendor_id: req.body.vendor_id,
      inWarranty: req.body.inWarranty,
      warrantyDate: req.body.warrantyDate,
      dateOfPurchase: req.body.dateOfPurchase,
      selfAuditPeriod: req.body.selfAuditPeriod,
      hrAuditPeriod: req.body.hrAuditPeriod,
      selfAuditUnit: req.body.selfAuditUnit,
      hrAuditUnit: req.body.hrAuditUnit,
      // invoiceCopy: req.file?.filename,
      assetsValue: req.body.assetsValue,
      assetsCurrentValue: req.body.assetsCurrentValue,
      last_hr_audit_date: req.body.last_hr_audit_date,
      last_self_audit_date: req.body.last_self_audit_date,
      next_hr_audit_date: updatedDateString,
      next_self_audit_date: updatedDateString2,
      asset_financial_type: req.body.asset_financial_type,
      depreciation_percentage: req.body.depreciation_percentage,
      asset_brand_id: req.body.asset_brand_id,
      asset_modal_id: req.body.asset_modal_id,
    });

    if (req.file) {
      const bucketName = vari.BUCKET_NAME;
      const bucket = storage.bucket(bucketName);
      const blob = bucket.file(req.file.originalname);
      simc.invoiceCopy = blob.name;
      const blobStream = blob.createWriteStream();
      blobStream.on("finish", () => {
        // res.status(200).send("Success") 
      });
      blobStream.end(req.file.buffer);
    }

    const simv = await simc.save();

    const assetHistoryData = {
      sim_id: simv.sim_id,
      action_date_time: simv.Creation_date,
      action_by: simv.created_by,
      asset_detail: "",
      action_to: 0,
      asset_remark: simv.Remarks,
      asset_action: "Asset Created"
    };

    const newAssetHistory = await assetHistoryModel.create(assetHistoryData);

    res.send({ simv, status: 200 });
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, sms: "This asset cannot be created" });
  }
};


exports.getSims = async (req, res) => {
  try {
    const assetsImagesUrl = `${vari.IMAGE_URL}`;
    const simc = await simModel
      .aggregate([
        // {
        //   $lookup: {
        //     from: "usermodels",
        //     localField: "user_id",
        //     foreignField: "user_id",
        //     as: "userdata",
        //   },
        // },
        // {
        //   $unwind: {
        //     path: "$userdata",
        //     preserveNullAndEmptyArrays: true,
        //   },
        // },
        {
          $lookup: {
            from: "assetscategorymodels",
            localField: "category_id",
            foreignField: "category_id",
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$category",
            // preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "assetssubcategorymodels",
            localField: "sub_category_id",
            foreignField: "sub_category_id",
            as: "subcategory",
          },
        },
        {
          $unwind: {
            path: "$subcategory",
            // preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "vendormodels",
            localField: "vendor_id",
            foreignField: "vendor_id",
            as: "vendor",
          },
        },
        {
          $unwind: {
            path: "$vendor",
            // preserveNullAndEmptyArrays: true,
          },
        },
        // {
        //   $lookup: {
        //     from: "usermodels",
        //     localField: "created_by",
        //     foreignField: "user_id",
        //     as: "user",
        //   },
        // },
        // {
        //   $unwind: {
        //     path: "$user",
        //     preserveNullAndEmptyArrays: true,
        //   },
        // },
        {
          $lookup: {
            from: "simallomodels",
            localField: "sim_id",
            foreignField: "sim_id",
            as: "simallocation",
          },
        },
        {
          $unwind: {
            path: "$simallocation",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "usermodels",
            localField: "simallocation.user_id",
            foreignField: "user_id",
            as: "allocated_username",
          },
        },
        {
          $unwind: {
            path: "$allocated_username",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "assetbrandmodels",
            localField: "asset_brand_id",
            foreignField: "asset_brand_id",
            as: "assetBrand",
          },
        },
        {
          $unwind: {
            path: "$assetBrand",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "assetmodalmodels",
            localField: "asset_modal_id",
            foreignField: "asset_brand_id",
            as: "assetModal",
          },
        },
        {
          $unwind: {
            path: "$assetModal",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: "$_id",
            sim_id: "$sim_id",
            user_id: "$user_id",
            asset_id: "$sim_no",
            status: "$status",
            asset_type: "$s_type",
            assetsName: "$assetsName",
            assetsOtherID: "$assetsOtherID",
            category_id: "$category_id",
            sub_category_id: "$sub_category_id",
            vendor_id: "$vendor_id",
            inWarranty: "$inWarranty",
            warrantyDate: "$warrantyDate",
            dateOfPurchase: "$dateOfPurchase",
            hrAuditPeriod: "$hrAuditPeriod",
            hrAuditUnit: "$hrAuditUnit",
            selfAuditPeriod: "$selfAuditPeriod",
            selfAuditUnit: "$selfAuditUnit",
            invoiceCopy: "$invoiceCopy",
            assetsValue: "$assetsValue",
            created_by: "$created_by",
            assetsCurrentValue: "$assetsCurrentValue",
            Remarks: "$Remarks",
            // user_name: "$userdata.user_name",
            category_name: "$category.category_name",
            sub_category_name: "$subcategory.sub_category_name",
            vendor_name: "$vendor.vendor_name",
            // created_by_name: "$user.user_name",
            // allocated_username: "$allocated_username.user_name",
            // allocated_username: {
            //   $cond: {
            //     if: { $ne: ["$simallocation.user_id", 0] },
            //     then: "$allocated_username.user_name",
            //     else: ""
            //   }
            // },
            Last_updated_date: "$Last_updated_date",
            invoiceCopy_url: { $concat: [assetsImagesUrl, "$invoiceCopy"] },
            submitted_at: "$simallocation.submitted_at",
            asset_financial_type: "$asset_finacial_type",
            depreciation_percentage: "$depreciation_percentage",
            asset_brand_id: "$asset_brand_id",
            asset_modal_id: "$asset_modal_id",
            asset_brand_name: "$assetBrand.asset_brand_name",
            asset_modal_name: "$assetModal.asset_modal_name",
            allocated_username: {
              $cond: {
                if: { $eq: ["$status", "Allocated"] },
                then: "$allocated_username.user_name",
                else: ""
              }
            },
            date_difference: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "Allocated"] },
                    { $eq: ["$simallocation.submitted_at", 0] },
                  ],
                },
                {
                  $subtract: [new Date(), "$Last_updated_date"],
                },
                0,
              ],
            },
          },
        },
      ])
      .exec();

    if (!simc) {
      return res.status(500).json({ success: false, message: "No data found" });
    }

    const uniqueData = simc.reduce((acc, cur) => {
      const key = cur._id.toString() + '-' + cur.status;
      if (!acc[key]) {
        acc[key] = cur;
      }
      return acc;
    }, {});
    // const uniqueData = Array.from(new Set(simc.map((item) => item._id))).map(
    //   (sim_id) => simc.find((item) => item._id === sim_id)
    // );

    res.status(200).json({ data: Object.values(uniqueData) });
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, sms: "Error getting all sim datas" });
  }
};

exports.getSingleSim = async (req, res) => {
  try {
    const singlesim = await simModel
      .aggregate([
        {
          $match: { sim_id: parseInt(req.params.id) }
        },
        {
          $lookup: {
            from: "assetscategorymodels",
            localField: "category_id",
            foreignField: "category_id",
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "assetssubcategorymodels",
            localField: "sub_category_id",
            foreignField: "sub_category_id",
            as: "subcategory",
          },
        },
        {
          $unwind: {
            path: "$subcategory",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "vendormodels",
            localField: "vendor_id",
            foreignField: "vendor_id",
            as: "vendor",
          },
        },
        {
          $unwind: {
            path: "$vendor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: "$_id",
            sim_id: "$sim_id",
            user_id: "$user_id",
            asset_id: "$sim_no",
            status: "$status",
            asset_type: "$s_type",
            assetsName: "$assetsName",
            assetsOtherID: "$assetsOtherID",
            category_id: "$category_id",
            sub_category_id: "$sub_category_id",
            vendor_id: "$vendor_id",
            inWarranty: "$inWarranty",
            warrantyDate: "$warrantyDate",
            dateOfPurchase: "$dateOfPurchase",
            hrAuditPeriod: "$hrAuditPeriod",
            hrAuditUnit: "$hrAuditUnit",
            selfAuditPeriod: "$selfAuditPeriod",
            selfAuditUnit: "$selfAuditUnit",
            invoiceCopy: "$invoiceCopy",
            assetsValue: "$assetsValue",
            created_by: "$created_by",
            asset_financial_type: "$asset_financial_type",
            assetsCurrentValue: "$assetsCurrentValue",
            Remarks: "$Remarks",
            category_name: "$category.category_name",
            sub_category_name: "$subcategory.sub_category_name",
            vendor_name: "$vendor.vendor_name"
          },
        },
      ])
      .exec();
    if (!singlesim) {
      return res.status(500).send({ success: false });
    }

    const result = singlesim[0];
    res.status(200).send({ data: result });
  } catch (err) {
    res.status(500).send({ error: err, sms: "Error getting sim details" });
  }
};

exports.editSim = async (req, res) => {
  try {
    const editsim = await simModel.findOneAndUpdate(
      { sim_id: req.body.id },
      {
        sim_no: req.body.sim_no,
        Remarks: req.body.remark,
        created_by: req.body.created_by,
        status: req.body.status,
        asset_type: req.body.s_type,
        assetsName: req.body.assetsName,
        assetsOtherID: req.body.assetsOtherID,
        category_id: req.body.category_id,
        sub_category_id: req.body.sub_category_id,
        vendor_id: req.body.vendor_id,
        inWarranty: req.body.inWarranty,
        warrantyDate: req.body.warrantyDate,
        dateOfPurchase: req.body.dateOfPurchase,
        selfAuditPeriod: req.body.selfAuditPeriod || 0,
        hrAuditPeriod: req.body.hrAuditPeriod || 0,
        selfAuditUnit: req.body.selfAuditUnit || 0,
        hrAuditUnit: req.body.hrAuditUnit || 0,
        invoiceCopy: req.file?.originalname,
        assetsValue: req.body.assetsValue,
        assetsCurrentValue: req.body.assetsCurrentValue,
        asset_financial_type: req.body.asset_financial_type,
        depreciation_percentage: req.body.depreciation_percentage,
        asset_brand_id: req.body.asset_brand_id,
        asset_modal_id: req.body.asset_modal_id,
      },
      { new: true }
    );
    if (!editsim) {
      res.status(500).send({ success: false });
    }

    if (req.file && req.file.originalname) {
      const bucketName = vari.BUCKET_NAME;
      const bucket = storage.bucket(bucketName);
      const blob = bucket.file(req.file.originalname);
      editsim.invoiceCopy = blob.name;

      const blobStream = blob.createWriteStream();
      blobStream.on("finish", () => {
        editsim.save();
        res.status(200).send({ success: true, data: editsim });
      });
      blobStream.end(req.file.buffer);
    } else {
      return res.status(200).send({ success: true, data: editsim });
    }

  } catch (err) {
    return res
      .status(500)
      .send({ error: err.message, sms: "Error updating sim details" });
  }
};

exports.deleteSim = async (req, res) => {
  simModel
    .deleteOne({ sim_id: req.params.id })
    .then((item) => {
      if (item) {
        return res.status(200).json({ success: true, message: "sim deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "sim not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, message: err });
    });
};

exports.addAllocation = async (req, res) => {
  try {
    const simc = new simAlloModel({
      user_id: req.body.user_id,
      sim_id: req.body.sim_id,
      category_id: req.body.category_id,
      sub_category_id: req.body.sub_category_id,
      Remarks: req.body.Remarks,
      // dept_id: req.body.dept_id,
      created_by: req.body.created_by,
      submitted_by: req.body.submitted_by,
      reason: req.body.reason,
      status: req.body.status,
      deleted_status: req.body.deleted_status,
      submitted_at: req.body.submitted_at,
    });
    const simv = await simc.save();

    const assetHistoryData = {
      sim_id: simv.sim_id,
      action_date_time: simv.Creation_date,
      action_by: simv.created_by,
      asset_detail: "",
      action_to: simv.submitted_by,
      asset_remark: simv.Remarks,
      asset_action: "Asset Allocated"
    };

    const newAssetHistory = await assetHistoryModel.create(assetHistoryData);

    res.send({ simv, status: 200 });
  } catch (err) {
    res.status(500).send({ error: err, sms: "This sim cannot allocate" });
  }
};

exports.getAllocations = async (req, res) => {
  try {
    const simc = await simAlloModel
      .aggregate([
        {
          $lookup: {
            from: "usermodels",
            localField: "user_id",
            foreignField: "user_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "simmodels",
            localField: "sim_id",
            foreignField: "sim_id",
            as: "sim",
          },
        },
        {
          $unwind: {
            path: "$sim",
            preserveNullAndEmptyArrays: true,
          },
        },
        // {
        //   $lookup: {
        //     from: "simmodels",
        //     localField: "sim_id",
        //     foreignField: "sim_id",
        //     as: "sim",
        //   },
        // },
        // // {
        // //     $unwind: '$sim'
        // // },
        // {
        //   $unwind: {
        //     path: "$sim",
        //     preserveNullAndEmptyArrays: true,
        //   },
        // },
        // {
        //     $lookup: {
        //         from: 'departmentmodels',
        //         localField: 'dept_id',
        //         foreignField: 'dept_id',
        //         as: 'department'
        //     }
        // },
        // // {
        // //     $unwind: '$department'
        // // },
        // {
        //     $unwind: {
        //         path: "$department",
        //         preserveNullAndEmptyArrays: true
        //     }
        // },
        // {
        //     $lookup: {
        //         from: "designationmodels",
        //         localField: "user.user_designation",
        //         foreignField: "desi_id",
        //         as: "designation"
        //     }
        // },
        // // {
        // //     $unwind: "$designation"
        // // },
        // {
        //     $unwind: {
        //         path: "$designation",
        //         preserveNullAndEmptyArrays: true
        //     }
        // },
        {
          $project: {
            // dept_name: '$department.dept_name',
            // desi_name: '$designation.desi_name',
            _id: "$_id",
            user_id: "$user_id",
            sim_no: "$sim_no",
            assetsName: "$sim.assetsName",
            // provider: "$provider",
            Remarks: "$Remarks",
            created_by: "$created_by",
            status: "$status",
            // register: "$register",
            // mobileNo: "$sim.mobileNumber",
            user_name: "$user.user_name",
            s_type: "$s_type",
            // desi: "$desi",
            // dept: "$dept",
            sim_id: "$sim_id",
            type: "$type",
            allo_id: "$allo_id",
            submitted_at: "$submitted_at",
          },
        },
      ])
      .exec();
    if (!simc) {
      res.status(500).send({ success: false });
    }
    res.status(200).send({ data: simc });
  } catch (err) {
    res
      .status(500)
      .send({ error: err, sms: "Error getting all sim allocatinos" });
  }
};

// Get User Allocated assests based on his user id
exports.getAllocatedAssestByUserId = async (req, res) => {
  try {
    const assetData = await simAlloModel.aggregate([
      {
        $match: {
          user_id: parseInt(req.params.id),
          status: "Allocated"
        }
      },
      {
        $lookup: {
          from: "simmodels",
          localField: "sim_id",
          foreignField: "sim_id",
          as: "sim"
        }
      },
      {
        $unwind: "$sim"
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "user_id",
          foreignField: "user_id",
          as: "userData"
        }
      },
      {
        $unwind: "$userData"
      },
      {
        $lookup: {
          from: "assetscategorymodels",
          localField: "sim.category_id",
          foreignField: "category_id",
          as: "category"
        }
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "assetssubcategorymodels",
          localField: "sim.sub_category_id",
          foreignField: "sub_category_id",
          as: "subcategory"
        }
      },
      {
        $unwind: {
          path: "$subcategory",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "submitted_by",
          foreignField: "user_id",
          as: "user"
        }
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "assetrequestmodels",
          localField: "sim.sub_category_id",
          foreignField: "sub_category_id",
          as: "assetrequest"
        }
      },
      {
        $unwind: {
          path: "$assetrequest",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "assetrequest.request_by",
          foreignField: "user_id",
          as: "userRequest"
        }
      },
      {
        $unwind: {
          path: "$userRequest",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "assetrequest.multi_tag",
          foreignField: "user_id",
          as: "userMulti"
        }
      },
      {
        $unwind: {
          path: "$userMulti",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "assetreturnmodels",
          localField: "sim_id",
          foreignField: "sim_id",
          as: "assetReturn"
        }
      },
      {
        $unwind: {
          path: "$assetReturn",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "repairrequestmodels",
          localField: "sim_id",
          foreignField: "sim_id",
          as: "repairrequest"
        }
      },
      {
        $unwind: {
          path: "$repairrequest",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: "$_id",
          user_id: { $first: "$user_id" },
          category_id: { $first: "$sim.category_id" },
          sub_category_id: { $first: "$sim.sub_category_id" },
          sim_no: { $first: "$sim.sim_no" },
          assetsName: { $first: "$sim.assetsName" },
          Remarks: { $first: "$Remarks" },
          sub_category_name: { $first: "$subcategory.sub_category_name" },
          category_name: { $first: "$category.category_name" },
          submitted_at: { $first: "$submitted_at" },
          created_by: { $first: "$created_by" },
          status: { $first: "$status" },
          user_name: { $first: "$userData.user_name" },
          s_type: { $first: "$sim.s_type" },
          sim_id: { $first: "$sim.sim_id" },
          type: { $first: "$type" },
          allo_id: { $first: "$allo_id" },
          submitted_by: { $first: "$submitted_by" },
          submitted_by_name: { $first: "$user.user_name" },
          asset_request_multi_tag: { $addToSet: "$assetrequest.multi_tag" },
          asset_request_detail: { $first: "$assetrequest.detail" },
          asset_request_priority: { $first: "$assetrequest.priority" },
          asset_request_status: { $first: "$assetrequest.asset_request_status" },
          asset_request_request_by: { $first: "$assetrequest.request_by" },
          asset_request_request_by_name: { $first: "$userRequest.user_name" },
          asset_request_multi_tag_names: { $addToSet: "$userMulti.user_name" },
          asset_repair_request_status: { $first: "$repairrequest.status" },
          // asset_return_status: { $first: "$assetReturn.asset_return_status" }
          asset_return_status: { $first: { $ifNull: ["$assetReturn.asset_return_status", ""] } }
        }
      }
    ]).exec();

    if (!assetData || assetData.length === 0) {
      return res.status(500).send({ success: false, message: "No Record Found" });
    }

    return res.status(200).send({ data: assetData });
  } catch (err) {
    return res.status(500).send({ error: err.message, sms: "Error getting all sim allocations" });
  }
};


exports.getAllocationDataByAlloId = async (req, res) => {
  try {
    const simc = await simAlloModel
      .aggregate([
        {
          $match: { allo_id: parseInt(req.params.id) },
        },
        // {
        //     $lookup: {
        //         from: 'simmodels',
        //         localField: 'sim_id',
        //         foreignField: 'sim_id',
        //         as: 'sim'
        //     }
        // },
        // {
        //     $unwind: '$sim'
        // },
        {
          $lookup: {
            from: "usermodels",
            localField: "user_id",
            foreignField: "user_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: "$_id",
            sim_no: "$sim_no",
            user_id: "$user_id",
            // provider: "$provider",
            Remarks: "$Remarks",
            created_by: "$created_by",
            status: "$status",
            // register: "$register",
            // mobileNo: "$sim.mobileNumber",
            s_type: "$s_type",
            // desi: "$desi",
            // dept: "$dept",
            sim_id: "$sim_id",
            type: "$type",
            allo_id: "$allo_id",
            submitted_at: "$submitted_at",
            deleted_status: "$deleted_status",
            userName: "$user.user_name",
          },
        },
      ])
      .exec();

    if (!simc) {
      res.status(500).send({ success: false });
    }
    res.status(200).send({ data: simc[0] });
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, sms: "Error getting all sim datas" });
  }
};

exports.editAllocation = async (req, res) => {
  try {
    const findSimId = await simAlloModel.findOne({ sim_id: req.body.sim_id });

    if (findSimId) {
      const updateFields = {};
      const allowedFields = ['user_id', 'sim_id', 'Remarks', 'created_by', 'submitted_by', 'reason', 'status', 'deleted_status', 'submitted_at'];

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updateFields[field] = req.body[field];
        }
      });
      const editSim = await simAlloModel.findOneAndUpdate(
        { sim_id: parseInt(req.body.sim_id) },
        updateFields,
        { new: true }
      );

      const assetHistoryData = {
        sim_id: editSim.sim_id,
        action_date_time: editSim.Creation_date,
        action_by: editSim.created_by,
        asset_detail: "",
        action_to: editSim.submitted_by,
        asset_remark: editSim.Remarks,
        asset_action: "Asset Allocated Updated"
      };

      const newAssetHistory = await assetHistoryModel.create(assetHistoryData);
      return response.returnTrue(200, req, res, "Asset allocation Update Successfully", editSim);
    } else {
      const simc = new simAlloModel({
        user_id: req.body.user_id,
        sim_id: req.body.sim_id,
        category_id: req.body.category_id,
        sub_category_id: req.body.sub_category_id,
        Remarks: req.body.Remarks,
        // dept_id: req.body.dept_id,
        created_by: req.body.created_by,
        submitted_by: req.body.submitted_by,
        reason: req.body.reason,
        status: req.body.status,
        deleted_status: req.body.deleted_status,
        submitted_at: req.body.submitted_at,
      });
      const simv = await simc.save();

      const assetHistoryData = {
        sim_id: simv.sim_id,
        action_date_time: simv.Creation_date,
        action_by: simv.created_by,
        asset_detail: "",
        action_to: simv.submitted_by,
        asset_remark: simv.Remarks,
        asset_action: "Asset Allocated"
      };

      const newAssetHistory = await assetHistoryModel.create(assetHistoryData);
      return response.returnTrue(200, req, res, "Asset allocation added Successfully", simv);
    }
  } catch (err) {
    return res
      .status(500)
      .send({ error: err.message, sms: "Error updating asset allocation" });
  }
};

exports.deleteAllocation = async (req, res) => {
  simAlloModel
    .deleteOne(req.params.allo_id)
    .then((item) => {
      if (item) {
        return res
          .status(200)
          .json({ success: true, message: "asset allocation deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "asset allocation not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, message: err });
    });
};

exports.getSimAllocationDataById = async (req, res) => {
  try {
    const simc = await simAlloModel
      .aggregate([
        {
          $match: { sim_id: parseInt(req.params.id), deleted_status: 0 },
        },
        {
          $lookup: {
            from: "usermodels",
            localField: "user_id",
            foreignField: "user_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        // {
        //   $unwind: "$user",
        // },
        {
          $lookup: {
            from: "simmodels",
            localField: "sim_id",
            foreignField: "sim_id",
            as: "sim",
          },
        },
        // {
        //   $unwind: "$sim",
        // },
        {
          $unwind: {
            path: "$sim",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: "$_id",
            sim_no: "$sim_no",
            assetsName: "$sim.assetsName",
            Remarks: "$Remarks",
            created_by: "$created_by",
            Creation_date: "$sim.Creation_date",
            Last_updated_date: "$sim.Last_updated_date",
            status: "$status",
            // mobile_number: "$sim.mobileNumber",
            userName: "$user.user_name",
            sim_id: "$sim_id",
            allo_id: "$allo_id",
            reason: "$reason",
            submitted_at: "$submitted_at",
          },
        },
      ])
      .exec();
    if (!simc) {
      res.status(500).send({ success: false });
    }
    res.status(200).send(simc);
  } catch (err) {
    res
      .status(500)
      .send({ error: err, sms: "Error getting all asset allocatinos" });
  }
};

exports.alldataofsimallocment = async (req, res) => {
  try {
    const simc = await simAlloModel.aggregate([
      {
        $lookup: {
          from: "simmodels",
          localField: "sim_id",
          foreignField: "sim_id",
          as: "sim",
        },
      },
      {
        $unwind: {
          path: "$sim",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "user_id",
          foreignField: "user_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "assetscategorymodels",
          localField: "sim.category_id",
          foreignField: "category_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "assetssubcategorymodels",
          localField: "sim.sub_category_id",
          foreignField: "sub_category_id",
          as: "subcategory",
        },
      },
      {
        $unwind: {
          path: "$subcategory",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: "$_id",
          user_id: "$user_id",
          sim_id: "$sim_id",
          asset_id: "$sim.sim_no",
          assetsName: "$sim.assetsName",
          user_name: "$user.user_name",
          category_name: "$category.category_name",
          sub_category_name: "$subcategory.sub_category_name",
          Remarks: "$Remarks",
          created_by: "$created_by",
          status: "$status",
          s_type: "$s_type",
          allo_id: "$allo_id",
          submitted_at: "$submitted_at",
          deleted_status: "$deleted_status",
        },
      },
    ]);

    if (!simc || simc.length === 0) {
      res.status(404).send({ success: false, message: "No data found" });
    } else {
      res.status(200).send({ data: simc });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting all asset datas" });
  }
};

// exports.getAssetDepartmentCount = async (req, res) => {
//   try {
//     const simc = await simAlloModel.aggregate([
//       {
//         $lookup: {
//           from: "usermodels",
//           localField: "user_id",
//           foreignField: "user_id",
//           as: "user",
//         },
//       },
//       {
//         $unwind: {
//           path: "$user",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $lookup: {
//           from: "departmentmodels",
//           localField: "user.dept_id",
//           foreignField: "dept_id",
//           as: "department",
//         },
//       },
//       {
//         $unwind: {
//           path: "$department",
//           // preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $project: {
//           _id: "$_id",
//           user_id: "$user_id",
//           user_name: "$user.user_name",
//           dept_id: "$user.dept_id",
//           dept_name: "$department.dept_name"
//         }
//       },
//       {
//         $group: {
//           _id: "$user_id",
//           dept_name: { $first: "$dept_name" },
//           count: { $sum: 1 },
//           user_id: { $first: "$user_id" },
//           user_name: { $first: "$user_name" },
//           dept_id: { $first: "$dept_id" },
//           // category_id: { $first: "$category_id" },
//           // category_name: { $first: "$category_name" },
//           // sub_category_id: { $first: "$sub_category_id" },
//           // sub_category_name: { $first: "$sub_category_name" }
//         },
//       }
//     ]);

//     if (!simc || simc.length === 0) {
//       res.status(404).send({ success: false, message: "No data found" });
//     } else {
//       res.status(200).send({ data: simc });
//     }
//   } catch (err) {
//     res
//       .status(500)
//       .send({ error: err.message, message: "Error getting user count of department" });
//   }
// };

exports.getAssetDepartmentCount = async (req, res) => {
  try {
    const simc = await simAlloModel.aggregate([
      {
        $lookup: {
          from: "usermodels",
          localField: "user_id",
          foreignField: "user_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "departmentmodels",
          localField: "user.dept_id",
          foreignField: "dept_id",
          as: "department",
        },
      },
      {
        $unwind: {
          path: "$department",
        },
      },
      {
        $project: {
          _id: "$_id",
          user_id: "$user_id",
          user_name: "$user.user_name",
          dept_id: "$user.dept_id",
          dept_name: "$department.dept_name",
        }
      },
      {
        $group: {
          _id: "$user_id",
          dept_name: { $first: "$dept_name" },
          count: { $addToSet: "$dept_id" },
          user_name: { $first: "$user_name" },
          dept_id: { $first: "$dept_id" }
        },
      },
      {
        $project: {
          _id: 0,
          user_id: "$_id",
          dept_id: 1,
          user_name: 1,
          dept_name: 1,
          count: { $size: "$count" },
        },
      },
    ]);

    if (!simc || simc.length === 0) {
      res.status(404).send({ success: false, message: "No data found" });
    } else {
      res.status(200).send({ data: simc });
    }
  } catch (err) {
    res.status(500).send({ error: err.message, message: "Error getting user count of department" });
  }
};


// exports.getAssetUsersDepartment = async (req, res) => {
//   try {
//     const dept_id = parseInt(req.params.dept_id);
//     const userDetails = await simAlloModel.aggregate([
//       {
//         $lookup: {
//           from: 'simmodels',
//           localField: 'sim_id',
//           foreignField: 'sim_id',
//           as: 'simDetails',
//         },
//       },
//       {
//         $unwind: {
//           path: '$simDetails',
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $lookup: {
//           from: 'assetscategorymodels',
//           localField: 'simDetails.category_id',
//           foreignField: 'category_id',
//           as: 'categoryDetails',
//         },
//       },
//       {
//         $unwind: {
//           path: '$categoryDetails',
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $lookup: {
//           from: 'assetssubcategorymodels',
//           localField: 'simDetails.sub_category_id',
//           foreignField: 'sub_category_id',
//           as: 'subcategoryDetails',
//         },
//       },
//       {
//         $unwind: {
//           path: '$subcategoryDetails',
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $lookup: {
//           from: 'usermodels',
//           localField: 'user_id',
//           foreignField: 'user_id',
//           as: 'userDetails',
//         },
//       },
//       {
//         $unwind: {
//           path: '$userDetails',
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $lookup: {
//           from: 'departmentmodels',
//           localField: 'userDetails.dept_id',
//           foreignField: 'dept_id',
//           as: 'department',
//         },
//       },
//       {
//         $unwind: {
//           path: '$department',
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $match: {
//           "userDetails.dept_id": parseInt(dept_id),
//         },
//       },
//       {
//         $group: {
//           _id: '$user_id',
//           dept_id: { $first: '$userDetails.dept_id' },
//           user_id: { $first: '$user_id' },
//           user_name: { $first: '$userDetails.user_name' },
//           sim_id: { $first: '$sim_id' },
//           asset_name: { $first: '$simDetails.assetsName' },
//           dept_name: { $first: '$department.dept_name' },
//           category_id: { $first: '$simDetails.category_id' },
//           sub_category_id: { $first: '$simDetails.sub_category_id' },
//           category_name: { $first: '$categoryDetails.category_name' },
//           sub_category_name: { $first: '$subcategoryDetails.sub_category_name' },
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           dept_id: 1,
//           user_id: 1,
//           sim_id: 1,
//           asset_name: 1,
//           user_name: 1,
//           dept_name: 1,
//           category_id: 1,
//           sub_category_id: 1,
//           category_name: 1,
//           sub_category_name: 1,
//         },
//       },
//     ]);

//     res.status(200).send({ data: userDetails });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message, sms: 'Internal Server Error' });
//   }
// };


exports.getAssetUsersDepartment = async (req, res) => {
  try {
    const dept_id = parseInt(req.params.dept_id);
    const userDetails = await simAlloModel.aggregate([
      {
        $lookup: {
          from: 'simmodels',
          localField: 'sim_id', // Adjust this field if necessary
          foreignField: 'sim_id',
          as: 'simDetails',
        },
      },
      {
        $unwind: {
          path: '$simDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'assetscategorymodels',
          localField: 'simDetails.category_id',
          foreignField: 'category_id',
          as: 'categoryDetails',
        },
      },
      {
        $unwind: {
          path: '$categoryDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'assetssubcategorymodels',
          localField: 'simDetails.sub_category_id',
          foreignField: 'sub_category_id',
          as: 'subcategoryDetails',
        },
      },
      {
        $unwind: {
          path: '$subcategoryDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'usermodels',
          localField: 'user_id',
          foreignField: 'user_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: {
          path: '$userDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'departmentmodels',
          localField: 'userDetails.dept_id',
          foreignField: 'dept_id',
          as: 'department',
        },
      },
      {
        $unwind: {
          path: '$department',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "userDetails.dept_id": dept_id, // No need to parse again if it's already a number
        },
      },
      {
        $group: {
          _id: '$user_id',
          dept_id: { $first: '$userDetails.dept_id' },
          user_id: { $first: '$user_id' },
          user_name: { $first: '$userDetails.user_name' },
          sim_id: { $first: '$sim_id' },
          asset_name: { $first: '$simDetails.asset_name' },
          dept_name: { $first: '$department.dept_name' },
          category_id: { $first: '$simDetails.category_id' },
          sub_category_id: { $first: '$simDetails.sub_category_id' },
          category_name: { $first: '$categoryDetails.category_name' },
          sub_category_name: { $first: '$subcategoryDetails.sub_category_name' },
        },
      },
      {
        $project: {
          _id: 1,
          dept_id: 1,
          user_id: 1,
          sim_id: 1,
          asset_name: 1,
          user_name: 1,
          dept_name: 1,
          category_id: 1,
          sub_category_id: 1,
          category_name: 1,
          sub_category_name: 1,
        },
      },
    ]);

    res.status(200).send({ data: userDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message, sms: 'Internal Server Error' });
  }
};

// exports.getAssetUsersDepartment = async (req, res) => {
//   try {
//     const dept_id = parseInt(req.params.dept_id);
//     const userDetails = await simAlloModel.aggregate([
//       {
//         $lookup: {
//           from: 'simmodels',
//           localField: 'sim_id',
//           foreignField: 'sim_id',
//           as: 'sim',
//         },
//       },
//       {
//         $unwind: {
//           path: '$sim',
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $lookup: {
//           from: 'assetscategorymodels',
//           localField: 'simDetails.category_id',
//           foreignField: 'category_id',
//           as: 'categoryDetails',
//         },
//       },
//       {
//         $unwind: {
//           path: '$categoryDetails',
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $lookup: {
//           from: 'assetssubcategorymodels',
//           localField: 'simDetails.sub_category_id',
//           foreignField: 'sub_category_id',
//           as: 'subcategoryDetails',
//         },
//       },
//       {
//         $unwind: {
//           path: '$subcategoryDetails',
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $lookup: {
//           from: 'usermodels',
//           localField: 'user_id',
//           foreignField: 'user_id',
//           as: 'userDetails',
//         },
//       },
//       {
//         $unwind: {
//           path: '$userDetails',
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $lookup: {
//           from: 'departmentmodels',
//           localField: 'userDetails.dept_id',
//           foreignField: 'dept_id',
//           as: 'department',
//         },
//       },
//       {
//         $unwind: {
//           path: '$department',
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $match: {
//           "userDetails.dept_id": dept_id,
//         },
//       },
//       {
//         $group: {
//           _id: '$user_id',
//           dept_id: { $first: '$userDetails.dept_id' },
//           user_id: { $first: '$user_id' },
//           user_name: { $first: '$userDetails.user_name' },
//           sim_id: { $first: '$sim_id' },
//           asset_name: { $first: '$sim.asset_name' },
//           dept_name: { $first: '$department.dept_name' },
//           category_id: { $first: '$sim.category_id' },
//           sub_category_id: { $first: '$sim.sub_category_id' },
//           category_name: { $first: '$categoryDetails.category_name' },
//           sub_category_name: { $first: '$subcategoryDetails.sub_category_name' },
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           dept_id: 1,
//           user_id: 1,
//           sim_id: 1,
//           asset_name: 1,
//           user_name: 1,
//           dept_name: 1,
//           category_id: 1,
//           sub_category_id: 1,
//           category_name: 1,
//           sub_category_name: 1,
//         },
//       },
//     ]);

//     res.status(200).send({ data: userDetails });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message, sms: 'Internal Server Error' });
//   }
// };

exports.getAssetUsersDepartment = async (req, res) => {
  try {
    const dept_id = parseInt(req.params.dept_id);
    const userDetails = await simAlloModel.aggregate([
      {
        $lookup: {
          from: 'simmodels',
          localField: 'sim_id',
          foreignField: 'sim_id',
          as: 'sim',
        },
      },
      {
        $unwind: {
          path: '$sim',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'assetscategorymodels',
          localField: 'sim.category_id',
          foreignField: 'category_id',
          as: 'categoryDetails',
        },
      },
      {
        $unwind: {
          path: '$categoryDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'assetssubcategorymodels',
          localField: 'sim.sub_category_id',
          foreignField: 'sub_category_id',
          as: 'subcategoryDetails',
        },
      },
      {
        $unwind: {
          path: '$subcategoryDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'usermodels',
          localField: 'user_id',
          foreignField: 'user_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: {
          path: '$userDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'departmentmodels',
          localField: 'userDetails.dept_id',
          foreignField: 'dept_id',
          as: 'department',
        },
      },
      {
        $unwind: {
          path: '$department',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "userDetails.dept_id": dept_id,
        },
      },
      {
        $group: {
          _id: '$user_id',
          dept_id: { $first: '$userDetails.dept_id' },
          user_id: { $first: '$user_id' },
          user_name: { $first: '$userDetails.user_name' },
          sim_id: { $first: '$sim_id' },
          asset_name: { $first: '$sim.assetsName' },
          dept_name: { $first: '$department.dept_name' },
          category_id: { $first: '$sim.category_id' },
          sub_category_id: { $first: '$sim.sub_category_id' },
          category_name: { $first: '$categoryDetails.category_name' },
          sub_category_name: { $first: '$subcategoryDetails.sub_category_name' },
        },
      },
      {
        $project: {
          _id: 1,
          dept_id: 1,
          user_id: 1,
          sim_id: 1,
          asset_name: 1,
          user_name: 1,
          dept_name: 1,
          category_id: 1,
          sub_category_id: 1,
          category_name: 1,
          sub_category_name: 1,
        },
      },
    ]);

    res.status(200).send({ data: userDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message, sms: 'Internal Server Error' });
  }
};


exports.getTotalAssetInCategory = async (req, res) => {
  try {
    const assets = await simModel
      .aggregate([
        {
          $match: {
            category_id: parseInt(req.params.category_id),
            status: "Available",
          }
        },
        {
          $lookup: {
            from: "assetscategorymodels",
            localField: "category_id",
            foreignField: "category_id",
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$category",
          },
        },
        {
          $lookup: {
            from: "assetssubcategorymodels",
            localField: "sub_category_id",
            foreignField: "sub_category_id",
            as: "subcategory",
          },
        },
        {
          $unwind: {
            path: "$subcategory",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: "$_id",
            sim_id: "$sim_id",
            asset_id: "$sim_no",
            status: "$status",
            asset_type: "$s_type",
            assetsName: "$assetsName",
            category_id: "$category_id",
            sub_category_id: "$sub_category_id",
            category_name: "$category.category_name",
            sub_category_name: "$subcategory.sub_category_name"
          },
        },
      ])
      .exec();

    if (!assets || assets.length === 0) {
      return res.status(404).send({ success: false, message: 'No assets found for the given category_id' });
    }

    res.status(200).send({ success: true, data: assets });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err, message: 'Error getting asset details' });
  }
};

exports.getTotalAssetInCategoryAllocated = async (req, res) => {
  try {
    const assets = await simModel.aggregate([
      {
        $match: {
          category_id: parseInt(req.params.category_id),
          status: "Allocated",
        },
      },
      {
        $lookup: {
          from: "assetscategorymodels",
          localField: "category_id",
          foreignField: "category_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
        },
      },
      {
        $lookup: {
          from: "assetssubcategorymodels",
          localField: "sub_category_id",
          foreignField: "sub_category_id",
          as: "subcategory",
        },
      },
      {
        $unwind: {
          path: "$subcategory",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: "$_id",
          sim_id: "$sim_id",
          asset_id: "$sim_no",
          status: "$status",
          asset_type: "$s_type",
          assetsName: "$assetsName",
          category_id: "$category_id",
          sub_category_id: "$sub_category_id",
          category_name: "$category.category_name",
          sub_category_name: "$subcategory.sub_category_name",
        },
      },
    ]).exec();
    if (!assets || assets.length === 0) {
      return res.status(404).send({ success: false, message: 'No assets found for the given category_id' });
    }

    res.status(200).send({ success: true, data: assets });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err, message: 'Error getting asset details' });
  }
};

exports.showAssetDataToHR = async (req, res) => {
  try {
    const imageUrl = `${vari.IMAGE_URL}`;
    const HrData = await simModel
      .aggregate([
        {
          $lookup: {
            from: "repairrequestmodels",
            localField: "sim_id",
            foreignField: "sim_id",
            as: "repair",
          },
        },
        {
          $unwind: {
            path: "$repair",
          },
        },
        {
          $lookup: {
            from: "usermodels",
            localField: "repair.req_by",
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
          $lookup: {
            from: 'departmentmodels',
            localField: 'userdata.dept_id',
            foreignField: 'dept_id',
            as: 'department'
          }
        },

        {
          $unwind: {
            path: "$department",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'designationmodels',
            localField: 'userdata.user_designation',
            foreignField: 'desi_id',
            as: 'designation'
          }
        },
        {
          $unwind: {
            path: "$designation",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "assetscategorymodels",
            localField: "category_id",
            foreignField: "category_id",
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "assetssubcategorymodels",
            localField: "sub_category_id",
            foreignField: "sub_category_id",
            as: "subcategory",
          },
        },
        {
          $unwind: {
            path: "$subcategory",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "vendormodels",
            localField: "vendor_id",
            foreignField: "vendor_id",
            as: "vendor",
          },
        },
        {
          $unwind: {
            path: "$vendor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "assetbrandmodels",
            localField: "asset_brand_id",
            foreignField: "asset_brand_id",
            as: "brand",
          },
        },
        {
          $unwind: {
            path: "$brand",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "assetmodalmodels",
            localField: "asset_modal_id",
            foreignField: "asset_modal_id",
            as: "modal",
          },
        },
        {
          $unwind: {
            path: "$modal",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: "$_id",
            sim_id: "$sim_id",
            repair_id: "$repair.repair_id",
            asset_id: "$sim_no",
            asset_name: "$assetsName",
            status: "$repair.status",
            category_id: "$category_id",
            sub_category_id: "$sub_category_id",
            vendor_id: "$vendor_id",
            inWarranty: "$inWarranty",
            warrantyDate: "$warrantyDate",
            dateOfPurchase: "$dateOfPurchase",
            category_name: "$category.category_name",
            sub_category_name: "$subcategory.sub_category_name",
            vendor_name: "$vendor.vendor_name",
            vendor_contact_no: "$vendor.vendor_contact_no",
            vendor_email_id: "$vendor.vendor_email_id",
            asset_brand_id: "$brand.asset_brand_id",
            asset_brand_name: "$brand.asset_brand_name",
            asset_modal_id: "$modal.asset_modal_id",
            asset_modal_name: "$modal.asset_modal_name",
            priority: "$repair.priority",
            invoiceCopy: {
              $concat: [imageUrl, "$invoiceCopy"]
            },
            req_by: "$repair.req_by",
            req_by_name: "$userdata.user_name",
            req_by_designation: "$designation.desi_name",
            req_by_department: "$department.dept_name",
            img1: {
              $concat: [imageUrl, "$repair.img1"]
            },
            img2: {
              $concat: [imageUrl, "$repair.img2"]
            },
            img3: {
              $concat: [imageUrl, "$repair.img3"]
            },
            img4: {
              $concat: [imageUrl, "$repair.img4"]
            },
            req_date: "$repair.repair_request_date_time"
          },
        },
      ])
      .exec();
    if (!HrData) {
      return res.status(500).json({ success: false, message: "No data found" });
    }
    res.status(200).json({ data: HrData });
  } catch (err) {
    res.status(500).send({ error: err, sms: "Error getting Hr details" });
  }
};

exports.showAssetDataToUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const userData = await simModel.aggregate([
      {
        $lookup: {
          from: "repairrequestmodels",
          localField: "sim_id",
          foreignField: "sim_id",
          as: "repair",
        },
      },
      {
        $unwind: {
          path: "$repair",
        },
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "repair.req_by",
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
        $lookup: {
          from: "assetscategorymodels",
          localField: "category_id",
          foreignField: "category_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "assetssubcategorymodels",
          localField: "sub_category_id",
          foreignField: "sub_category_id",
          as: "subcategory",
        },
      },
      {
        $unwind: {
          path: "$subcategory",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "vendormodels",
          localField: "vendor_id",
          foreignField: "vendor_id",
          as: "vendor",
        },
      },
      {
        $unwind: {
          path: "$vendor",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "assetbrandmodels",
          localField: "asset_brand_id",
          foreignField: "asset_brand_id",
          as: "brand",
        },
      },
      {
        $unwind: {
          path: "$brand",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "assetmodalmodels",
          localField: "asset_modal_id",
          foreignField: "asset_modal_id",
          as: "modal",
        },
      },
      {
        $unwind: {
          path: "$modal",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "assetrequestmodels",
          localField: "sub_category_id",
          foreignField: "sub_category_id",
          as: "assetrequest",
        },
      },
      {
        $unwind: {
          path: "$assetrequest",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "assetrequest.multi_tag",
          foreignField: "user_id",
          as: "userMulti",
        },
      },
      {
        $unwind: {
          path: "$userMulti",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: "$_id",
          sim_id: "$sim_id",
          asset_id: "$sim_no",
          asset_name: "$assetsName",
          status: "$status",
          category_id: "$category_id",
          sub_category_id: "$sub_category_id",
          vendor_id: "$vendor_id",
          inWarranty: "$inWarranty",
          warrantyDate: "$warrantyDate",
          dateOfPurchase: "$dateOfPurchase",
          category_name: "$category.category_name",
          sub_category_name: "$subcategory.sub_category_name",
          vendor_name: "$vendor.vendor_name",
          vendor_contact_no: "$vendor.vendor_contact_no",
          vendor_email_id: "$vendor.vendor_email_id",
          multi_tag: "$repair.multi_tag",
          asset_brand_id: "$brand.asset_brand_id",
          asset_brand_name: "$brand.asset_brand_name",
          asset_modal_id: "$modal.asset_modal_id",
          asset_modal_name: "$modal.asset_modal_name",
          priority: "$repair.priority",
          req_by: "$repair.req_by",
          req_by_name: "$userdata.user_name",
          req_date: "$repair.repair_request_date_time",
          asset_request_detail: "$assetrequest.detail",
          asset_request_priority: "$assetrequest.priority",
          asset_request_asset_request_status: "$assetrequest.asset_request_status",
          asset_request_request_by: "$assetrequest.request_by",
          asset_request_by_name: "$userRequest.user_name",
          asset_request_multi_tag_name: "$userMulti.user_name",
          asset_repair_request_status: "$repair.status"
        },
      },
    ]).exec();
    if (!userData) {
      return res.status(500).json({ success: false, message: "No data found" });
    }
    const filteredData = userData.filter((item) => {
      const multiTagArray = item.multi_tag[0].split(',');
      return multiTagArray.includes(user_id);
    });
    if (filteredData.length === 0) {
      return res.status(404).json({ success: false, message: "No data found for the user_id" });
    }
    res.status(200).json({ data: filteredData });
  } catch (err) {
    res.status(500).send({ error: err.message, sms: "Error getting user details" });
  }
};

exports.showNewAssetDataToUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const userData = await assetRequestModel.aggregate([
      {
        $lookup: {
          from: "simmodels",
          localField: "sub_category_id",
          foreignField: "sub_category_id",
          as: "sim",
        },
      },
      {
        $unwind: {
          path: "$sim",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "multi_tag",
          foreignField: "user_id",
          as: "userdata1",
        },
      },
      {
        $unwind: {
          path: "$userdata1",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "request_by",
          foreignField: "user_id",
          as: "userdataRequest",
        },
      },
      {
        $unwind: {
          path: "$userdataRequest",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "assetscategorymodels",
          localField: "category_id",
          foreignField: "sim.category_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "assetssubcategorymodels",
          localField: "sub_category_id",
          foreignField: "sub_category_id",
          as: "subcategory",
        },
      },
      {
        $unwind: {
          path: "$subcategory",
          // preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          sim_id: { $first: "$sim.sim_id" },
          asset_id: { $first: "$sim.sim_no" },
          asset_name: { $first: "$sim.assetsName" },
          status: { $first: "$sim.status" },
          category_id: { $first: "$sim.category_id" },
          category_name: { $first: "$category.category_name" },
          sub_category_id: { $first: "$sub_category_id" },
          sub_category_name: { $first: "$subcategory.sub_category_name" },
          vendor_id: { $first: "$sim.vendor_id" },
          inWarranty: { $first: "$sim.inWarranty" },
          warrantyDate: { $first: "$sim.warrantyDate" },
          dateOfPurchase: { $first: "$sim.dateOfPurchase" },
          multi_tag: { $first: "$multi_tag" },
          priority: { $first: "$priority" },
          req_date: { $first: "$date_and_time_of_asset_request" },
          asset_request_multi_tag_name: { $first: "$userdata1.user_name" },
          asset_new_request_status: { $first: "$assetRequest.asset_request_status" },
          asset_request_by: { $first: "$request_by" },
          req_by_name: { $first: "$userdataRequest.user_name" }
        },
      },
      // {
      //   $project: {
      //     _id: "$_id",
      //     sim_id: "$sim.sim_id",
      //     asset_id: "$sim.sim_no",
      //     asset_name: "$sim.assetsName",
      //     status: "$sim.status",
      //     category_id: "$sim.category_id",
      //     sub_category_id: "$sim.sub_category_id",
      //     vendor_id: "$sim.vendor_id",
      //     inWarranty: "$sim.inWarranty",
      //     warrantyDate: "$sim.warrantyDate",
      //     dateOfPurchase: "$sim.dateOfPurchase",
      //     multi_tag: "$multi_tag",
      //     priority: "$priority",
      //     req_date: "$date_and_time_of_asset_request",
      //     asset_request_multi_tag_name: "$userdata1.user_name",
      //     asset_new_request_status: "$assetRequest.asset_request_status",
      //     asset_request_id: "$assetRequest._id"
      //   },
      // },
    ]).exec();

    if (!userData) {
      return res.status(500).json({ success: false, message: "No data found" });
    }

    if (userData.length === 0) {
      return res.status(404).json({ success: false, message: "No data found for the user_id" });
    }

    res.status(200).json({ data: userData });
  } catch (err) {
    res.status(500).send({ error: err.message, sms: "Error getting user details" });
  }
}

// Asset Request to Report L1
exports.showAssetDataToUserReport = async (req, res) => {
  try {
    const { user_id } = req.params;

    const userData = await assetRequestModel.aggregate([
      {
        $lookup: {
          from: "assetssubcategorymodels",
          localField: "sub_category_id",
          foreignField: "sub_category_id",
          as: "subcategory",
        },
      },
      {
        $unwind: {
          path: "$subcategory",
          // preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "request_by",
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
        $match: {
          "userdata.Report_L1": parseInt(user_id),
        },
      },
      {
        $project: {
          _id: "$_id",
          category_name: "$category.category_name",
          sub_category_name: "$subcategory.sub_category_name",
          multi_tag: "$multi_tag",
          priority: "$priority",
          req_by: "$request_by",
          req_by_name: "$userdata.user_name",
          req_date: "$date_and_time_of_asset_request",
          asset_request_by_name: "$userRequest.user_name",
          asset_request_multi_tag_name: "$userdata.user_name",
          asset_new_request_status: "$asset_request_status",
          users_manager: "$userMulti.Report_L1"
        },
      },
    ]).exec();

    if (!userData) {
      return res.status(500).json({ success: false, message: "No data found" });
    }

    if (userData.length === 0) {
      return res.status(404).json({ success: false, message: "No data found for the user_id" });
    }

    res.status(200).json({ data: userData });
  } catch (err) {
    res.status(500).send({ error: err.message, sms: "Error getting user details" });
  }
};