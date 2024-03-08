const response = require("../common/response.js");
const assetBrandModel = require("../models/assetsBrandModel.js");
const simModel = require("../models/simModel.js");

exports.addAssetBrand = async (req, res) => {
  const { asset_brand_name } = req.body;
  try {
    const assetBrandData = new assetBrandModel({
      asset_brand_name
    });
    const savedassetbranddata = await assetBrandData.save();
    res.status(200).send({
      data: savedassetbranddata,
      message: "assetBrandData created success",
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "Error adding assetBrandData to database",
    });
  }
};

exports.getAssetBrands = async (req, res) => {
  try {

    const assetBrandData = await assetBrandModel
      .aggregate([
        {
          $lookup: {
            from: "simmodels",
            localField: "asset_brand_id",
            foreignField: "asset_brand_id",
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
          $project: {
            sim_id: "$sim.sim_id",
            asset_name: "$sim.assetsName",
            status: "$sim.status",
            asset_brand_id: "$asset_brand_id",
            asset_brand_name: "$asset_brand_name"
          },
        },
        {
          $group: {
            _id: "$asset_brand_id",
            asset_brand_name: { $first: "$asset_brand_name" },
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
          },
        },
        {
          $sort: { _id: -1 },
        },
      ])

    if (assetBrandData.length === 0) {
      res
        .status(404)
        .send({ success: false, data: [], message: "No Record found" });
    } else {
      res.status(200).send({ data: assetBrandData });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting all assetBrandData" });
  }
};

exports.getAssetBrandById = async (req, res) => {
  try {
    const assetBrandData = await assetBrandModel.findOne({
      asset_brand_id: parseInt(req.params.id),
    });
    if (!assetBrandData) {
      return res
        .status(200)
        .send({ success: false, data: {}, message: "No Record found" });
    } else {
      res.status(200).send({ data: assetBrandData });
    }
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "Error getting assetBrand details",
    });
  }
};

exports.editAssetBrand = async (req, res) => {
  try {
    const editAssetData = await assetBrandModel.findOneAndUpdate({ asset_brand_id: req.body.asset_brand_id }, {
      asset_brand_name: req.body.asset_brand_name,
      updated_at: req.body.updated_at
    }, { new: true })
    if (!editAssetData) {
      res.status(500).send({ success: false })
    }
    res.status(200).send({ success: true, data: editAssetData })
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "Error updating the assetbranddata in the database",
    });
  }
};

exports.deleteAssetBrand = async (req, res) => {
  const id = req.params.id;
  const condition = { asset_brand_id: id };
  try {
    const result = await assetBrandModel.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `AssetBrand with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `AssetBrand with ID ${id} not found`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the AssetBrand",
      error: error.message,
    });
  }
};

exports.getTotalAvailableAssetInBrand = async (req, res) => {
  try {
    const assets = await simModel
      .aggregate([
        {
          $match: {
            asset_brand_id: parseInt(req.params.asset_brand_id),
            status: "Available",
          }
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
            asset_brand_id: "$brand.asset_brand_id",
            asset_brand_name: "$brand.asset_brand_name"
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

exports.getTotalAllocatedAssetInBrand = async (req, res) => {
  try {
    const assets = await simModel
      .aggregate([
        {
          $match: {
            asset_brand_id: parseInt(req.params.asset_brand_id),
            status: "Allocated",
          }
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
            asset_brand_id: "$brand.asset_brand_id",
            asset_brand_name: "$brand.asset_brand_name"
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