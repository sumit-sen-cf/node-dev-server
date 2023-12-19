const response = require("../common/response.js");
const vendorModel = require("../models/vendorModel.js");

exports.addVendor = async (req, res) => {
  try {
    const vendord = new vendorModel({
      vendor_name: req.body.vendor_name,
      vendor_contact_no: req.body.vendor_contact_no,
      vendor_email_id: req.body.vendor_email_id,
      vendor_address: req.body.vendor_address,
      description: req.body.description,
      created_by: req.body.created_by,
      last_updated_by: req.body.last_updated_by,
      vendor_type: req.body.vendor_type,
      vendor_category: req.body.vendor_category,
      secondary_contact_no: req.body.secondary_contact_no,
      secondary_person_name: req.body.secondary_person_name
    });
    const simv = await vendord.save();
    return response.returnTrue(
      200,
      req,
      res,
      "Vendor Created Successfully",
      simv
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.getVendors = async (req, res) => {
  try {
    const vendors = await vendorModel.find();
    if (!vendors) {
      return response.returnFalse(200, req, res, "No Reord Found...", []);
    }
    res.status(200).send(vendors)
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.getSingleVendor = async (req, res) => {
  try {
    const singlevendor = await vendorModel.findOne({
      vendor_id: parseInt(req.params.vendor_id),
    });
    if (!singlevendor) {
      return response.returnFalse(200, req, res, "No Reord Found...", {});
    }
    return response.returnTrue(
      200,
      req,
      res,
      "Vendor Data Fetch Successfully",
      singlevendor
    );
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.editVendor = async (req, res) => {
  try {
    const editvendor = await vendorModel.findOneAndUpdate(
      { vendor_id: parseInt(req.body.vendor_id) },
      {
        vendor_name: req.body.vendor_name,
        vendor_contact_no: req.body.vendor_contact_no,
        vendor_email_id: req.body.vendor_email_id,
        vendor_address: req.body.vendor_address,
        description: req.body.description,
        created_by: req.body.created_by,
        last_updated_by: req.body.last_updated_by,
        last_updated_date: req.body.last_updated_date,
        vendor_type: req.body.vendor_type,
        vendor_category: req.body.vendor_category,
        secondary_contact_no: req.body.secondary_contact_no,
        secondary_person_name: req.body.secondary_person_name
      },
      { new: true }
    );
    if (!editvendor) {
      return response.returnFalse(
        200,
        req,
        res,
        "No Reord Found With This Vendor Id",
        {}
      );
    }
    return response.returnTrue(200, req, res, "Updation Successfully", editvendor);
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};

exports.deleteVendor = async (req, res) => {
  vendorModel.deleteOne({ vendor_id: req.params.vendor_id }).then(item => {
    if (item) {
      return res.status(200).json({ success: true, message: 'Vendor Category deleted' })
    } else {
      return res.status(404).json({ success: false, message: 'Vendor Category not found' })
    }
  }).catch(err => {
    return res.status(400).json({ success: false, message: err })
  })
};