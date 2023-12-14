const response = require("../common/response");
const brandSchema = require("../models/brandModel");

exports.addBrand = async (req, res) => {
  try {
    const {
      brand_name,
      category_id,
      sub_category_id,
      igusername,
      whatsapp,
      user_id,
      major_category,
      website,
    } = req.body;
    let check = await brandSchema.findOne({
      brand_name: brand_name.toLowerCase().trim(),
    });
    if (check) {
      return response.returnFalse(
        200,
        req,
        res,
        "Brand name must be unique",
        {}
      );
    }
    const brandObj = new brandSchema({
      brand_name,
      category_id,
      sub_category_id,
      igusername,
      whatsapp,
      user_id,
      major_category,
      website,
    });

    const savedBrand = await brandObj.save();
    res.send({ data: savedBrand, status: 200 });
  } catch (err) {
    res
      .status(500)
      .send({ erroradd_brand: err.message, message: "This brand cannot be created" });
  }
};

exports.getBrands = async (req, res) => {
  try {
    const brands = await brandSchema.aggregate([
      {
        $lookup: {
          from: "projectxcategorymodels",
          localField: "category_id",
          foreignField: "category_id",
          as: "data1",
        },
      },
      {
        $lookup: {
          from: "projectxsubcategorymodels",
          localField: "sub_category_id",
          foreignField: "sub_category_id",
          as: "data2",
        },
      },
      {
        $unwind: "$data1",
      },
      {
        $unwind: "$data2",
      },
      {
        $project: {
          _id: 1,
          brand_id: 1,
          brand_name: 1,
          category_id: 1,
          sub_category_id: 1,
          igusername: 1,
          website: 1,
          whatsapp: 1,
          major_category: 1,
          user_id: 1,
          updated_at: 1,
          created_at: 1,
          projectx_category_name: "$data1.category_name",
          projectx_subcategory_name: "$data2.sub_category_name",
        },
      },
    ]);
    if (brands.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      res.status(200).send({ data: brands });
    }
  } catch (err) {
    res.status(500).send({ error: err.message, message: "Error getting all brands" });
  }
};

exports.getBrandById = async (req, res) => {
  try {
    // const brand = await brandSchema.findOne({
    //   brand_id: parseInt(req.params.id),
    // });
    let match_condition = {
      brand_id: parseInt(req.params.id),
    };
    let brand = await brandSchema.aggregate([
      {
        $match: match_condition,
      },
      {
        $lookup: {
          from: "projectxcategorymodels",
          localField: "category_id",
          foreignField: "category_id",
          as: "data1",
        },
      },
      {
        $lookup: {
          from: "projectxsubcategorymodels",
          localField: "sub_category_id",
          foreignField: "sub_category_id",
          as: "data2",
        },
      },
      {
        $unwind: "$data1",
      },
      {
        $unwind: "$data2",
      },
      {
        $project: {
          _id: 1,
          brand_id: 1,
          brand_name: 1,
          category_id: 1,
          sub_category_id: 1,
          igusername: 1,
          whatsapp: 1,
          website: 1,
          major_category: 1,
          user_id: 1,
          updated_at: 1,
          created_at: 1,
          projectx_category_name: "$data1.category_name",
          projectx_subcategory_name: "$data2.sub_category_name",
        },
      },
    ]);
    if (brand.length === 0) {
      return res
        .status(200)
        .send({ success: false, data: {}, message: "No Record found" });
    } else {
      res.status(200).send({ data: brand[0] });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting brand details" });
  }
};

exports.editBrand = async (req, res) => {
  try {
    const {
      brand_id,
      brand_name,
      category_id,
      sub_category_id,
      igusername,
      whatsapp,
      user_id,
      major_category,
      website,
    } = req.body;
    let check = await brandSchema.findOne({
      brand_name: brand_name.toLowerCase().trim(),
      brand_id: { $ne: brand_id },
    });
    if (check) {
      return response.returnFalse(
        200,
        req,
        res,
        "Brand name must be unique",
        {}
      );
    }
    const editBrandObj = await brandSchema.findOneAndUpdate(
      { brand_id: parseInt(brand_id) }, // Filter condition
      {
        $set: {
          brand_name,
          category_id,
          sub_category_id,
          igusername,
          whatsapp,
          user_id,
          major_category,
          website,
          updated_at: Date.now(),
        },
      },
      { new: true }
    );

    if (!editBrandObj) {
      return res
        .status(200)
        .send({ success: false, message: "Brand not found" });
    }

    return res.status(200).send({ success: true, data: editBrandObj });
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error updating brand details" });
  }
};

exports.deleteBrand = async (req, res) => {
  const id = parseInt(req.params.id);
  const condition = { brand_id: id };
  try {
    const result = await brandSchema.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `Brand with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `Brand with ID ${id} not found`,
      });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: err });
  }
};

exports.checkSubCatAndCat = async (req, res) => {
  try {
    const check = await brandSchema.findOne({
      sub_category_id: parseInt(req.body.sub_category_id),
      category_id: parseInt(req.body.category_id),
    });
    if (!check) {
      return response.returnTrue(
        200,
        req,
        res,
        "You can proceed with this combination..",
        {}
      );
    } else {
      return response.returnFalse(
        200,
        req,
        res,
        "This combination should be unique.",
        {}
      );
    }
  } catch (err) {
    return response.returnTrue(500, req, res, err.message, {});
  }
};
