const constant = require("../../common/constant");
const response = require("../../common/response");
const { uploadImage } = require("../../common/upload");
const bankDetailsModel = require("../../models/PMS2/bankDetailsModel");
const vendorGroupLinkModel = require("../../models/PMS2/vendorGroupLinkModel");
const vendorModel = require("../../models/PMS2/vendorModel");
const vari = require("../../variables.js");
const imageUrl = vari.IMAGE_URL;

exports.createVendorData = async (req, res) => {
    try {
        const { vendor_type, vendor_platform, pay_cycle, payment_method, vendor_name, country_code, mobile, alternate_mobile, email, personal_address, pan_no, gst_no,
            company_name, company_address, company_city, company_pincode, company_state, threshold_limit,
            home_address, home_city, home_state, created_by, vendor_category,
        } = req.body;
        const addVendorData = vendorModel({
            vendor_type,
            vendor_platform,
            pay_cycle,
            payment_method,
            vendor_name,
            country_code,
            mobile,
            alternate_mobile,
            email,
            personal_address,
            pan_no,
            gst_no,
            company_name,
            company_address,
            company_city,
            company_pincode,
            company_state,
            threshold_limit,
            home_address,
            home_city,
            vendor_category,
            home_state,
            created_by
        });

        if (req.files?.pan_image && req.files.pan_image[0]) {
            addVendorData.pan_image = await uploadImage(req.files.pan_image[0]);
        }

        if (req.files?.gst_image && req.files.gst_image[0]) {
            addVendorData.gst_image = await uploadImage(req.files.gst_image[0]);
        }
        const vendorDataSaved = await addVendorData.save();
        if (!vendorDataSaved) {
            return response.returnFalse(
                500,
                req,
                res,
                `Oop's "Something went wrong while saving vendor data.`,
                {}
            );
        }

        let bankDataUpdatedArray = [];
        let vendorlinksUpdatedArray = [];
        let bankDetails = (req.body?.bank_details && JSON.parse(req.body.bank_details)) || [];
        let vendorLinkDetails = (req.body?.vendorLinks && JSON.parse(req.body?.vendorLinks)) || [];

        //bank details obj in add vender id
        if (bankDetails.length) {
            await bankDetails.forEach(element => {
                element.vendor_id = addVendorData._id;
                bankDataUpdatedArray.push(element);
            });
        }

        //vendor links details obj in add vender id
        if (vendorLinkDetails.length) {
            await vendorLinkDetails.forEach(element => {
                element.vendor_id = addVendorData._id;
                vendorlinksUpdatedArray.push(element);
            });
        }

        //add data in db collection
        await bankDetailsModel.insertMany(bankDataUpdatedArray);
        await vendorGroupLinkModel.insertMany(vendorlinksUpdatedArray);

        //send success response
        return response.returnTrue(
            200,
            req,
            res,
            "Vendor data added successfully!",
            vendorDataSaved
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is get the vendor model data BY-Id
 */
exports.getVendorDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const getVenorData = await vendorModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!getVenorData) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Vendor details retrieve successfully!",
            getVenorData
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is get all the vendor model data
 */
exports.getAllVendorList = async (req, res) => {
    try {
        const vendorDataList = await vendorModel.find({
            status: { $ne: constant.DELETED },
        });
        if (vendorDataList?.length <= 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Vendor data list fetch successfully!",
            vendorDataList
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};


exports.updateVendorData = async (req, res) => {
    try {
        const { vendor_id } = req.params; // Assuming vendor_id is passed as a URL parameter
        const {
            vendor_type, vendor_platform, pay_cycle, payment_method, vendor_name, country_code, mobile, alternate_mobile,
            email, personal_address, pan_no, gst_no, company_name, company_address, company_city, company_pincode,
            company_state, threshold_limit, home_address, home_city, home_state, updated_by, vendor_category
        } = req.body;
        // Find the vendor by ID
        const existingVendor = await vendorModel.findById(vendor_id);
        if (!existingVendor) {
            return response.returnFalse(404, req, res, `Vendor not found`, {});
        }

        // Update vendor fields
        existingVendor.vendor_type = vendor_type;
        existingVendor.vendor_platform = vendor_platform;
        existingVendor.pay_cycle = pay_cycle;
        existingVendor.payment_method = payment_method;
        existingVendor.vendor_name = vendor_name;
        existingVendor.country_code = country_code;
        existingVendor.mobile = mobile;
        existingVendor.alternate_mobile = alternate_mobile;
        existingVendor.email = email;
        existingVendor.personal_address = personal_address;
        existingVendor.pan_no = pan_no;
        existingVendor.gst_no = gst_no;
        existingVendor.company_name = company_name;
        existingVendor.company_address = company_address;
        existingVendor.company_city = company_city;
        existingVendor.company_pincode = company_pincode;
        existingVendor.company_state = company_state;
        existingVendor.threshold_limit = threshold_limit;
        existingVendor.home_address = home_address;
        existingVendor.home_city = home_city;
        existingVendor.home_state = home_state;
        existingVendor.updated_by = updated_by;
        existingVendor.vendor_category = vendor_category;

        if (req.files?.pan_image && req.files.pan_image[0]) {
            existingVendor.pan_image = await uploadImage(req.files.pan_image[0]);
        }

        if (req.files?.gst_image && req.files.gst_image[0]) {
            existingVendor.gst_image = await uploadImage(req.files.gst_image[0]);
        }

        // Save updated vendor data
        const updatedVendorData = await existingVendor.save();
        if (!updatedVendorData) {
            return response.returnFalse(500, req, res, `Oops! Something went wrong while updating vendor data.`, {});
        }

        let bankDetails = (req.body?.bank_details && JSON.parse(req.body.bank_details)) || [];
        let vendorLinkDetails = (req.body?.vendorLinks && JSON.parse(req.body.vendorLinks)) || [];

        // Update vendor links
        if (bankDetails.length) {
            for (const element of bankDetails) {
                await bankDetailsModel.updateOne({
                    _id: element._id
                }, element,
                    {
                        upsert: true
                    }
                );
            }
        }
        // Update vendor links
        if (vendorLinkDetails.length) {
            for (const element of vendorLinkDetails) {
                await vendorGroupLinkModel.updateOne({
                    _id: element._id
                }, element,
                    {
                        upsert: true
                    }
                );
            }
        }
        // Send success response
        return response.returnTrue(200, req, res, "Vendor data updated successfully!", updatedVendorData);
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

exports.updateVendorDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, vendor_platform, pay_cycle, payment_method, vendor_name, country_code, mobile, alternate_mobile, email, personal_address, pan_no, gst_no,
            company_name, company_address, company_city, company_pincode, company_state, threshold_limit,
            home_address, home_city, home_state, updated_by, vendor_category, } = req.body;

        let updateVendordata = {
            type,
            vendor_platform,
            pay_cycle,
            payment_method,
            vendor_name,
            country_code,
            mobile,
            alternate_mobile,
            email,
            personal_address,
            pan_no,
            gst_no,
            company_name,
            company_address,
            company_city,
            company_pincode,
            company_state,
            threshold_limit,
            home_address,
            home_city,
            vendor_category,
            home_state,
            updated_by
        }

        if (req.files?.pan_image && req.files.pan_image[0]) {
            updateVendordata.pan_image = await uploadImage(req.files.pan_image[0]);
        }

        if (req.files?.gst_image && req.files.gst_image[0]) {
            updateVendordata.gst_image = await uploadImage(req.files.gst_image[0]);
        }

        const updateResult = await vendorModel.updateOne({
            _id: id
        }, {
            $set: updateVendordata
        });

        if (updateResult.matchedCount === 0) {
            return response.returnTrue(500, req, res, `Vendor details failed successfully.`);
        } else if (updateResult.modifiedCount === 0) {
            return response.returnFalse(200, req, res, `Vendor details are not updated.`);
        } else {
            return response.returnTrue(200, req, res, `Vendor details updated successfully.`);
        }
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

exports.deleteVendorData = async (req, res) => {
    try {
        const { id } = req.params;
        const vendorDataDeleted = await vendorModel.findOneAndUpdate({ _id: id, status: { $ne: constant.DELETED } },
            {
                $set: {
                    status: constant.DELETED,
                },
            },
            { new: true }
        );
        if (!vendorDataDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            `Vendor data deleted successfully id ${id}`,
            vendorDataDeleted
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllVendorDeleted = async (req, res) => {
    try {
        // Find all vendor that are not deleted
        const vendorData = await vendorModel.find({ status: constant.DELETED });

        if (!vendorData) {
            return response.returnFalse(200, req, res, 'No Records Found', {});
        }

        return response.returnTrue(200, req, res, 'Vendor retrieved successfully!', vendorData);
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};