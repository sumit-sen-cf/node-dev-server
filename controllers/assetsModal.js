const assetModalModel = require("../models/assetModalModel.js");
const simModel = require("../models/simModel.js");
const response = require("../common/response.js");

exports.addAssetModal = async (req, res) => {
  const { asset_brand_id, asset_modal_name } = req.body;
  try {
    const assetModalData = new assetModalModel({
      asset_brand_id,
      asset_modal_name
    });
    const savedassetModaldata = await assetModalData.save();
    res.status(200).send({
      data: savedassetModaldata,
      message: "assetModalData created success",
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "Error adding assetModalData to database",
    });
  }
};

exports.getAssetModals = async (req, res) => {
  try {
    const assetBrandData = await assetModalModel
      .aggregate([
        {
          $lookup: {
            from: "simmodels",
            localField: "asset_modal_id",
            foreignField: "asset_modal_id",
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
          $project: {
            _id: 1,
            asset_modal_id: "$asset_modal_id",
            asset_brand_name: "$assetBrand.asset_brand_name",
            asset_brand_id: "$asset_brand_id",
            asset_modal_name: "$asset_modal_name",
            sim_id: "$sim.sim_id",
            asset_name: "$sim.assetsName",
            status: "$sim.status",
            creation_date: "$creation_date",
            updated_at: "$updated_at"
          },
        },
        {
          $group: {
            _id: "$asset_modal_id",
            asset_modal_name: { $first: "$asset_modal_name" },
            total_available_asset: {
              $sum: {
                $cond: [{ $eq: ["$status", "Available"] }, 1, 0],
              },
            },
            total_allocated_asset: {
              $sum: {
                $cond: [{ $eq: ["$status", "Allocated"] }, 1, 0],
              },
            },
            asset_brand_name: { $first: "$asset_brand_name" },
            asset_brand_id: { $first: "$asset_brand_id" },
            sim_id: { $first: "$sim_id" },
            asset_name: { $first: "$asset_name" },
            status: { $first: "$status" },
            creation_date: { $first: "$creation_date" },
            updated_at: { $first: "$updated_at" },
          },
        },
      ])
      .exec();
    if (!assetBrandData) {
      return response.returnFalse(200, req, res, "No Record Found...", []);
    }
    res.status(200).send(assetBrandData)
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.getAssetModalById = async (req, res) => {
  try {
    const assetBrandData = await assetModalModel
      .aggregate([
        {
          $match: { asset_modal_id: parseInt(req.params.id) },
        },
        {
          $lookup: {
            from: "assetsbrandmodels",
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
          $project: {
            _id: 1,
            asset_modal_id: "$asset_modal_id",
            asset_brand_name: "$assetBrand.asset_brand_name",
            asset_brand_id: "$asset_brand_id",
            asset_modal_name: "$asset_modal_name",
            creation_date: "$creation_date",
            updated_at: "$updated_at"
          },
        },
      ])
      .exec();

    return res.status(200).send(assetBrandData);
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.getAssetModalByAssetBrandId = async (req, res) => {
  try {
    const assetBrandData = await assetModalModel
      .aggregate([
        {
          $match: { asset_brand_id: parseInt(req.params.id) },
        },
        {
          $lookup: {
            from: "assetsbrandmodels",
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
          $project: {
            _id: 1,
            asset_modal_id: "$asset_modal_id",
            asset_brand_name: "$assetBrand.asset_brand_name",
            asset_brand_id: "$asset_brand_id",
            asset_modal_name: "$asset_modal_name",
            creation_date: "$creation_date",
            updated_at: "$updated_at"
          },
        },
      ])
      .exec();

    return res.status(200).send(assetBrandData);
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.editAssetModal = async (req, res) => {
  try {
    const editAssetModalData = await assetModalModel.findOneAndUpdate({ asset_modal_id: req.body.asset_modal_id }, {
      asset_brand_id: req.body.asset_brand_id,
      asset_modal_name: req.body.asset_modal_name,
      updated_at: req.body.updated_at
    }, { new: true })
    if (!editAssetModalData) {
      res.status(500).send({ success: false })
    }
    res.status(200).send({ success: true, data: editAssetModalData })
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "Error updating the assetbranddata in the database",
    });
  }
};

exports.deleteAssetModal = async (req, res) => {
  const id = req.params.id;
  const condition = { asset_modal_id: id };
  try {
    const result = await assetModalModel.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `AssetModal with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `AssetModal with ID ${id} not found`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the AssetModal",
      error: error.message,
    });
  }
};

exports.getTotalAvailableAssetInModal = async (req, res) => {
  try {
    const assets = await simModel
      .aggregate([
        {
          $match: {
            asset_modal_id: parseInt(req.params.asset_modal_id),
            status: "Available",
          }
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
            sim_id: "$sim_id",
            asset_id: "$sim_no",
            status: "$status",
            asset_type: "$s_type",
            assetsName: "$assetsName",
            category_id: "$category_id",
            sub_category_id: "$sub_category_id",
            category_name: "$category.category_name",
            sub_category_name: "$subcategory.sub_category_name",
            asset_modal_id: "$modal.asset_modal_id",
            asset_modal_name: "$modal.asset_modal_name"
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

exports.getTotalAllocatedAssetInModal = async (req, res) => {
  try {
    const assets = await simModel
      .aggregate([
        {
          $match: {
            asset_modal_id: parseInt(req.params.asset_modal_id),
            status: "Allocated",
          }
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
            sim_id: "$sim_id",
            asset_id: "$sim_no",
            status: "$status",
            asset_type: "$s_type",
            assetsName: "$assetsName",
            category_id: "$category_id",
            sub_category_id: "$sub_category_id",
            category_name: "$category.category_name",
            sub_category_name: "$subcategory.sub_category_name",
            asset_modal_id: "$modal.asset_modal_id",
            asset_modal_name: "$modal.asset_modal_name"
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
