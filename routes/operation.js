const express = require("express");
const router = express.Router();
const brand = require("../controllers/operationNew/brand");

router.get("/", (req, res) => {
    res.send({ message: "Welcome to Operation module." });
});

/**
 * brand routes 
 */
router.post("/add_brand", brand.addBrand);
router.get("/get_brands", brand.getBrands);
router.get("/check_unique_brand", brand.checkSubCatAndCat);
router.get("/get_brand/:id", brand.getBrandById);
router.put("/edit_brand", brand.editBrand);
router.delete("/delete_brand/:id", brand.deleteBrand);

module.exports = router; 