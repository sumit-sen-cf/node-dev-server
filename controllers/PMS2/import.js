const fs = require("fs");
const path = require("path");

// Construct the absolute path to the JSON file
const filePath = path.join(__dirname, 'CountryCode.json');
const file = fs.readFileSync(filePath, "utf8");
const countryCodeModel = require("../../models/PMS2/countryCodeModel");
exports.importVendor = () => {
  try {
    const data = JSON.parse(file);
    data.forEach(async (element) => {
      const savingData = new countryCodeModel({
        country_name:  element?.country_name,
        code:  element?.code,
        phone:  element?.phone,
        created_by:  1,
      });
      let savedData = await savingData.save();
      console.log(savedData);
    });
    console.log("Saved.......")
  } catch (error) {
    console.log(error);
  }
};
