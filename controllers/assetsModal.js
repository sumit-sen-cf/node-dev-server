const assetModalModel = require("../models/assetModalModel.js");

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
      ])
      .exec();
    if (!assetBrandData) {
      return response.returnFalse(200, req, res, "No Reord Found...", []);
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
