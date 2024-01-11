const simModel = require("../models/simModel.js");
const simAlloModel = require("../models/simAlloModel.js");
const userModel = require("../models/userModel.js");

exports.addSim = async (req, res) => {
  try {
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
      inWarranty: req.body.inWarranty || "",
      warrantyDate: req.body.warrantyDate || "",
      dateOfPurchase: req.body.dateOfPurchase || "",
      selfAuditPeriod: req.body.selfAuditPeriod || 0,
      hrAuditPeriod: req.body.hrAuditPeriod || 0,
      selfAuditUnit: req.body.selfAuditUnit || 0,
      hrAuditUnit: req.body.hrAuditUnit || 0,
      invoiceCopy: req.file?.filename,
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
    const simv = await simc.save();
    res.send({ simv, status: 200 });
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, sms: "This asset cannot be created" });
  }
};

// exports.getSims = async (req, res) => {
//     try{
//         const simc = await simModel.aggregate([
//             {
//                 $lookup: {
//                     from: 'departmentmodels',
//                     localField: 'dept',
//                     foreignField: 'dept_id',
//                     as: 'department'
//                 }
//             },
//             {
//                 $unwind: '$department'
//             },
//             {
//                 $lookup: {
//                     from: 'designationmodels',
//                     localField: 'desi',
//                     foreignField: 'desi_id',
//                     as: 'designation'
//                 }
//             },
//             {
//                 $unwind: '$designation'
//             },
//             {
//                 $project: {
//                     department_name: '$department.dept_name',
//                     designation: '$designation.desi_name',
//                     _id: "$_id",
//                     sim_no: "$sim_no",
//                     provider: "$provider",
//                     Remarks: "$Remarks",
//                     created_by: "$created_by",
//                     status: "$status",
//                     register: "$register",
//                     mobileNumber: "$mobileNumber",
//                     s_type: "$s_type",
//                     desi: "$desi",
//                     dept: "$dept",
//                     sim_id: "$sim_id",
//                     type: "$type",
//                     date_difference: {
//                         $cond: [
//                           {
//                             $and: [
//                               { $eq: ["$status", "Allocated"] },
//                               { $eq: ["$allocation.submitted_at", null] }
//                             ]
//                           },
//                           {
//                             $subtract: [new Date(), "$Last_updated_date"]
//                           },
//                           null
//                         ]
//                     }
//                 }
//             }
//         ]).exec();

//         const uniqueIds = new Set();
//         const uniqueData = simc.filter(item => {
//             const id = item._id.toString();
//             if (!uniqueIds.has(id)) {
//                 uniqueIds.add(id);
//                 return true;
//             }
//             return false;
//         });

//         if(!simc){
//             res.status(500).send({success:false})
//         }
//         res.status(200).send({data:uniqueData})
//     } catch(err){
//         res.status(500).send({error:err.message,sms:'Error getting all sim datas'})
//     }
// };

exports.getSims = async (req, res) => {
  try {
    const assetsImagesUrl = "http://34.93.221.166:3000/uploads/";
    const simc = await simModel
      .aggregate([
        {
          $lookup: {
            from: "usermodels",
            localField: "user_id",
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
            from: "usermodels",
            localField: "created_by",
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
            user_name: "$userdata.user_name",
            category_name: "$category.category_name",
            sub_category_name: "$subcategory.sub_category_name",
            vendor_name: "$vendor.vendor_name",
            created_by_name: "$user.user_name",
            allocated_username: "$allocated_username.user_name",
            Last_updated_date: "$Last_updated_date",
            invoiceCopy_url: { $concat: [assetsImagesUrl, "$invoiceCopy"] },
            submitted_at: "$simallocation.submitted_at",
            asset_financial_type: "$asset_finacial_type",
            depreciation_percentage: "$depreciation_percentage",
            asset_brand_id: "$asset_brand_id",
            asset_modal_id: "$asset_modal_id",
            asset_brand_name: "$assetBrand.asset_brand_name",
            asset_modal_name: "$assetModal.asset_modal_name",
            date_difference: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "Allocated"] },
                    { $eq: ["$simallocation.submitted_at", null] },
                  ],
                },
                {
                  $subtract: [new Date(), "$Last_updated_date"],
                },
                null,
              ],
            },
          },
        },
      ])
      .exec();

    // const uniqueIds = new Set();
    // const uniqueData = simc.filter((item) => {
    //   const id = item._id.toString();
    //   if (!uniqueIds.has(id)) {
    //     uniqueIds.add(id);
    //     return true;
    //   }
    //   return false;
    // });

    // if (!simc) {
    //   res.status(500).send({ success: false });
    // }
    // res.status(200).send({ data: uniqueData });
    if (!simc) {
      return res.status(500).json({ success: false, message: "No data found" });
    }

    const uniqueData = Array.from(new Set(simc.map((item) => item._id))).map(
      (sim_id) => simc.find((item) => item._id === sim_id)
    );

    res.status(200).json({ data: uniqueData });
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, sms: "Error getting all sim datas" });
  }
};

exports.getSingleSim = async (req, res) => {
  try {
    const singlesim = await simModel.findOne({
      sim_id: parseInt(req.params.id),
    });
    if (!singlesim) {
      return res.status(500).send({ success: false });
    }
    res.status(200).send({ data: singlesim });
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
        inWarranty: req.body.inWarranty || "",
        warrantyDate: req.body.warrantyDate || null,
        dateOfPurchase: req.body.dateOfPurchase || null,
        selfAuditPeriod: req.body.selfAuditPeriod || 0,
        hrAuditPeriod: req.body.hrAuditPeriod || 0,
        selfAuditUnit: req.body.selfAuditUnit || 0,
        hrAuditUnit: req.body.hrAuditUnit || 0,
        invoiceCopy: req.file?.filename,
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
    res.status(200).send({ success: true, data: editsim });
  } catch (err) {
    res
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
    const assetData = await simAlloModel
      .aggregate([
        {
          $match: { user_id: parseInt(req.params.id) },
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
          $project: {
            _id: "$_id",
            user_id: "$user_id",
            category_id: "$category_id",
            sub_category_id: "$sub_category_id",
            sim_no: "$sim_no",
            assetsName: "$sim.assetsName",
            Remarks: "$Remarks",
            sub_category_name: "$subcategory.sub_category_name",
            category_name: "$category.category_name",
            created_by: "$created_by",
            status: "$status",
            user_name: "$user.user_name",
            s_type: "$s_type",
            sim_id: "$sim_id",
            type: "$type",
            allo_id: "$allo_id",
            submitted_at: "$submitted_at",
          },
        },
      ])
      .exec();
    if (assetData && assetData.length <= 0) {
      return res.status(500).send({ success: false, message: "No Record Found" });
    }
    return res.status(200).send({ data: assetData });
  } catch (err) {
    return res
      .status(500)
      .send({ error: err.message, sms: "Error getting all sim allocatinos" });
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
    const editsim = await simAlloModel.findOneAndUpdate(
      { allo_id: req.body.allo_id },
      {
        user_id: req.body.user_id,
        sim_id: req.body.sim_id,
        Remarks: req.body.Remarks,
        // dept_id: req.body.dept_id,
        created_by: req.body.created_by,
        submitted_by: req.body.submitted_by,
        reason: req.body.reason,
        status: req.body.status,
        deleted_status: req.body.deleted_status,
        submitted_at: req.body.submitted_at,
      },
      { new: true }
    );
    if (!editsim) {
      res.status(500).send({ success: false });
    }
    res.status(200).send({ success: true, data: editsim });
  } catch (err) {
    res
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
        $project: {
          _id: "$_id",
          user_id: "$user.user_id",
          user_name: "$user.user_name",
          dept_id: "$user.dept_id",
          dept_name: "$department.dept_name",
          category_id: "$category.category_id",
          category_name: "$category.category_name",
          sub_category_id: "$subcategory.sub_category_id",
          sub_category_name: "subcategory.sub_category_name"
        }
      },
      {
        $group: {
          _id: "$dept_id",
          dept_name: { $first: "$dept_name" },
          count: { $sum: 1 },
          user_name: { $first: "$user_name" },
          dept_id: { $first: "$dept_id" },
          category_id: { $first: "$category_id" },
          category_name: { $first: "$category_name" },
          sub_category_id: { $first: "$sub_category_id" },
          sub_category_name: { $first: "$sub_category_name" },

          // user_id : { $first: "$user_id" }
        },
      }
    ]);

    if (!simc || simc.length === 0) {
      res.status(404).send({ success: false, message: "No data found" });
    } else {
      res.status(200).send({ data: simc });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting user count of department" });
  }
};

exports.getAssetUsersDepartment = async (req, res) => {
  try {
    const dept_id = parseInt(req.params.dept_id);
    const userDetails = await userModel.aggregate([
      {
        $match: {
          dept_id: dept_id
        },
      },
      {
        $lookup: {
          from: 'simAlloModel',
          localField: 'user_id',
          foreignField: 'user_id',
          as: 'simAlloDetails',
        },
      },
      {
        $unwind: {
          path: '$simAlloDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'assetscategorymodels',
          localField: 'category_id',
          foreignField: 'simAlloDetails.category_id',
          as: 'categoryDetails',
        },
      },
      {
        $unwind: {
          path: '$categoryDetails'
        },
      },
      {
        $lookup: {
          from: 'assetssubcategorymodels',
          localField: 'sub_category_id',
          foreignField: 'simAlloDetails.sub_category_id',
          as: 'subcategoryDetails',
        },
      },
      {
        $unwind: {
          path: '$subcategoryDetails'
        },
      },
      {
        $project: {
          dept_id: 1,
          user_id: 1,
          user_name: 1,
          category_id: '$categoryDetails.category_id',
          sub_category_id: '$subcategoryDetails.sub_category_id',
          category_name: '$categoryDetails.category_name',
          sub_category_name: '$subcategoryDetails.sub_category_name',
        },
      },
      {
        $group: {
          _id: '$dept_id',
          user_id: { $first: '$user_id' },
          user_name: { $first: '$user_name' },
          category_id: { $first: '$category_id' },
          sub_category_id: { $first: '$sub_category_id' },
          category_name: { $first: '$category_name' },
          sub_category_name: { $first: '$sub_category_name' },
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
    const imageUrl = "http://34.93.221.166:3000/uploads/";
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
          req_date: "$repair.repair_request_date_time"
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