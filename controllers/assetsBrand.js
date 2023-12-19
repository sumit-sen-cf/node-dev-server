const assetBrandModel = require("../models/assetsBrandModel.js");

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
    const assetBrandData = await assetBrandModel.find();
    if (assetBrandData.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
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
        asset_brand_name : req.body.asset_brand_name,
        updated_at : req.body.updated_at
      }, { new: true })
      if (!editagency) {
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
