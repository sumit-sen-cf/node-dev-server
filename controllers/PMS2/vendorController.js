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
                element.created_by = created_by;
                bankDataUpdatedArray.push(element);
            });
        }

        //vendor links details obj in add vender id
        if (vendorLinkDetails.length) {
            await vendorLinkDetails.forEach(element => {
                element.vendor_id = addVendorData._id;
                element.created_by = created_by;
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
// exports.getAllVendorList = async (req, res) => {
//     try {
//         const page = (req.query.page && parseInt(req.query.page)) || 1;
//         const limit = (req.query.limit && parseInt(req.query.limit)) || 50;
//         const skip = (page - 1) * limit;
//         let vendorDataList;

//         let matchQuery = {
//             status: { $ne: constant.DELETED }
//         };

//         let addFieldsObj = {
//             $addFields: {
//                 pan_image_url: {
//                     $cond: {
//                         if: { $ne: ["$pan_image", ""] },
//                         then: {
//                             $concat: [
//                                 constant.GCP_VENDOR_FOLDER_URL,
//                                 "/",
//                                 "$pan_image",
//                             ],
//                         },
//                         else: "$pan_image",
//                     },
//                 }, gst_image_url: {
//                     $cond: {
//                         if: { $ne: ["$gst_image", ""] },
//                         then: {
//                             $concat: [
//                                 constant.GCP_VENDOR_FOLDER_URL,
//                                 "/",
//                                 "$gst_image",
//                             ],
//                         },
//                         else: "$gst_image",
//                     },
//                 },
//             },
//         }

//         if (page && limit) {
//             const skip = (page - 1) * limit;
//             vendorDataList = await vendorModel.aggregate([
//                 { $match: matchQuery },
//                 { $skip: skip },
//                 { $limit: limit },
//                 addFieldsObj
//             ]);
//         } else {
//             vendorDataList = await vendorModel.aggregate([
//                 { $match: matchQuery },
//                 addFieldsObj
//             ]);
//         }
//         const vendorDataCount = await vendorModel.countDocuments()
//         return response.returnTrueWithPagination(
//             200,
//             req,
//             res,
//             "Vendor data list fetch successfully!",
//             vendorDataList,
//             {
//                 start_record: skip + 1,
//                 end_record: skip + vendorDataList?.length,
//                 total_records: vendorDataCount,
//                 currentPage: page,
//                 total_page: Math.ceil(vendorDataCount / limit),

//             }
//         );
//     } catch (error) {
//         return response.returnFalse(500, req, res, `${error.message}`, {});
//     }
// };


exports.getAllVendorList = async (req, res) => {
    try {
        const page = (req.query.page && parseInt(req.query.page)) || null;
        const limit = (req.query.limit && parseInt(req.query.limit)) || null;
        const skip = (page && limit) ? (page - 1) * limit : 0;
        let vendorDataList;

        let matchQuery = {
            status: { $ne: constant.DELETED }
        };

        let addFieldsObj = {
            $addFields: {
                pan_image_url: {
                    $cond: {
                        if: { $ne: ["$pan_image", ""] },
                        then: {
                            $concat: [
                                constant.GCP_VENDOR_FOLDER_URL,
                                "/",
                                "$pan_image",
                            ],
                        },
                        else: "$pan_image",
                    },
                },
                gst_image_url: {
                    $cond: {
                        if: { $ne: ["$gst_image", ""] },
                        then: {
                            $concat: [
                                constant.GCP_VENDOR_FOLDER_URL,
                                "/",
                                "$gst_image",
                            ],
                        },
                        else: "$gst_image",
                    },
                },
            },
        };

        const pipeline = [{ $match: matchQuery }, addFieldsObj];
        
        if (page && limit) {
            pipeline.push(
                { $skip: skip },
                { $limit: limit }
            );
        }

        vendorDataList = await vendorModel.aggregate(pipeline);
        const vendorDataCount = await vendorModel.countDocuments(matchQuery);

        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Vendor data list fetched successfully!",
            vendorDataList,
            {
                start_record: skip + 1,
                end_record: skip + vendorDataList.length,
                total_records: vendorDataCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(vendorDataCount / limit) : 1,
            }
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}


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

        //update bank details
        if (bankDetails.length && Array.isArray(bankDetails)) {
            for (const element of bankDetails) {
                if (element?._id) {
                    // Existing document: update it
                    element.updated_by = updated_by;
                    await bankDetailsModel.updateOne({
                        _id: element._id
                    }, {
                        $set: element
                    });
                } else {
                    // New document: insert it
                    element.created_by = updated_by;
                    element.vendor_id = vendor_id;
                    await bankDetailsModel.create(element);
                }
            }
        }

        //update vendor links
        if (vendorLinkDetails.length && Array.isArray(vendorLinkDetails)) {
            for (const element of vendorLinkDetails) {
                if (element?._id) {
                    // Existing document: update it
                    element.updated_by = updated_by;
                    await vendorGroupLinkModel.updateOne({
                        _id: element._id
                    }, {
                        $set: element
                    });
                } else {
                    // New document: insert it
                    element.created_by = updated_by;
                    element.vendor_id = vendor_id;
                    await vendorGroupLinkModel.create(element);
                }
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