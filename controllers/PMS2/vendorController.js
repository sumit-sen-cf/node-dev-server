const constant = require("../../common/constant");
const response = require("../../common/response");
const { uploadImage } = require("../../common/upload");
const bankDetailsModel = require("../../models/PMS2/bankDetailsModel");
const vendorGroupLinkModel = require("../../models/PMS2/vendorGroupLinkModel");
const vendorModel = require("../../models/PMS2/vendorModel");

exports.createVendorData = async (req, res) => {
    try {
        const { vendor_type, vendor_platform, pay_cycle, payment_method, vendor_name, country_code, mobile, alternate_mobile, email, personal_address, pan_no, gst_no,
            company_name, company_address, company_city, company_pincode, company_state, threshold_limit,
            home_address, home_city, home_state, created_by, vendor_category,
        } = req.body;
        //type_id
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
        let bankDetails = req.body?.bank_details && JSON.parse(req.body.bank_details);
        let vendorLinkDetails = req.body?.vendorLinks && JSON.parse(req.body?.vendorLinks);

        //bank details obj in add vender id
        await bankDetails.forEach(element => {
            element.vendor_id = addVendorData._id;
            bankDataUpdatedArray.push(element);
        });

        //vendor links details obj in add vender id
        await vendorLinkDetails.forEach(element => {
            element.vendor_id = addVendorData._id;
            vendorlinksUpdatedArray.push(element);
        });

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


