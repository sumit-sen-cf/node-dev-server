const constant = require("../../common/constant");
const response = require("../../common/response");
const { uploadImage, deleteImage } = require('../../common/uploadImage.js');
const bankDetailsModel = require("../../models/PMS2/bankDetailsModel");
// const documentDetailsModel = require("../../models/PMS2/documentDetailsModel.js");
const vendorGroupLinkModel = require("../../models/PMS2/vendorGroupLinkModel");
const vendorModel = require("../../models/PMS2/vendorModel");
const vari = require("../../variables.js");
const imageUrl = vari.IMAGE_URL;
const multer = require("multer");

// const upload = multer({
//     storage: multer.memoryStorage()
// }).fields([
//     { name: "document_image_upload", maxCount: 5 },
// ]);

exports.createVendorData =  async (req, res) => {
        try {
            const { vendor_type, vendor_platform, pay_cycle, bank_name, company_details, payment_method, primary_field,
                vendor_name, home_pincode, country_code, mobile, alternate_mobile, email, personal_address,
                home_address, home_city, home_state, created_by, vendor_category, } = req.body;
            const addVendorData = new vendorModel({
                vendor_type,
                vendor_platform,
                pay_cycle,
                bank_name,
                company_details,
                payment_method,
                primary_field,
                vendor_name,
                home_pincode,
                country_code,
                mobile,
                alternate_mobile,
                email,
                personal_address,
                // pan_no,
                //gst_no,
                // threshold_limit,
                home_address,
                home_city,
                vendor_category,
                home_state,
                created_by
            });

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
            // let documentDataUpdatedArray = [];
            let bankDetails = (req.body?.bank_details && JSON.parse(req.body.bank_details)) || [];
            let vendorLinkDetails = (req.body?.vendorLinks && JSON.parse(req.body?.vendorLinks)) || [];
            // let documentDetails = (req.body?.documentData && JSON.parse(req.body?.documentData)) || [];

            //bank details obj in add vender id
            if (bankDetails.length) {
                await bankDetails.forEach(element => {
                    element.vendor_id = vendorDataSaved._id;
                    element.created_by = created_by;
                    bankDataUpdatedArray.push(element);
                });
            }

            //vendor links details obj in add vender id
            if (vendorLinkDetails.length) {
                await vendorLinkDetails.forEach(element => {
                    element.vendor_id = vendorDataSaved._id;
                    element.created_by = created_by;
                    vendorlinksUpdatedArray.push(element);
                });
            }

            // if (documentDetails.length) {
            //     for (const element of documentDetails) {
            //         element.vendor_id = vendorDataSaved._id;
            //         element.created_by = created_by;
            //         if (req.files[element.document_image_upload] && req.files[element.document_image_upload][0]) {
            //             element.document_image = await uploadImage(req.files[element.document_image_upload][0], "PMS2DocumentImage");
            //         }

            //         documentDataUpdatedArray.push(element);
            //     }
            // }

            //add data in db collection
            await bankDetailsModel.insertMany(bankDataUpdatedArray);
            await vendorGroupLinkModel.insertMany(vendorlinksUpdatedArray);
            // await documentDetailsModel.insertMany(documentDataUpdatedArray);

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
    }

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
        const { vendor_type, vendor_platform, pay_cycle, bank_name, company_details, payment_method, primary_field, vendor_name,
            home_pincode, country_code, mobile, alternate_mobile, email, personal_address, home_address, home_city, home_state,
            vendor_category, updated_by } = req.body;

        // Find the vendor by ID
        const existingVendor = await vendorModel.findById(vendor_id);
        if (!existingVendor) {
            return response.returnFalse(404, req, res, `Vendor not found`, {});
        }

        // Update vendor fields
        existingVendor.vendor_type = vendor_type;
        existingVendor.vendor_platform = vendor_platform;
        existingVendor.pay_cycle = pay_cycle;
        existingVendor.bank_name = bank_name;
        existingVendor.company_details = company_details;
        existingVendor.payment_method = payment_method;
        existingVendor.primary_field = primary_field;
        existingVendor.vendor_name = vendor_name;
        existingVendor.home_pincode = home_pincode;
        existingVendor.country_code = country_code;
        existingVendor.mobile = mobile;
        existingVendor.alternate_mobile = alternate_mobile;
        existingVendor.email = email;
        existingVendor.personal_address = personal_address;
        // existingVendor.pan_no = pan_no;
        // existingVendor.gst_no = gst_no;
        // existingVendor.threshold_limit = threshold_limit;
        existingVendor.home_address = home_address;
        existingVendor.home_city = home_city;
        existingVendor.home_state = home_state;
        existingVendor.updated_by = updated_by;
        existingVendor.vendor_category = vendor_category;

        // const imageFields = {
        //     pan_image: 'PanImages',
        //     gst_image: 'GstImages',
        // };

        // // Remove old images not present in new data and upload new images
        // for (const [fieldName] of Object.entries(imageFields)) {
        //     if (req.files && req.files[fieldName] && req.files[fieldName][0]) {

        //         // Delete old image if present
        //         if (existingVendor[fieldName]) {
        //             await deleteImage(`PMS2VendorImages/${existingVendor[fieldName]}`);
        //         }
        //         // Upload new image
        //         existingVendor[fieldName] = await uploadImage(req.files[fieldName][0], "PMS2VendorImages");
        //     }
        // }

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
        const { vendor_type, vendor_platform, pay_cycle, payment_method, bank_name, vendor_name, country_code, mobile,
            alternate_mobile, email, personal_address, home_address, home_city, home_state, updated_by, vendor_category } = req.body;

        let updateVendordata = {
            vendor_type,
            vendor_platform,
            pay_cycle,
            bank_name,
            company_details,
            payment_method,
            primary_field,
            vendor_name,
            home_pincode,
            country_code,
            mobile,
            alternate_mobile,
            email,
            personal_address,
            // pan_no,
            //gst_no,
            // threshold_limit,
            home_address,
            home_city,
            vendor_category,
            home_state,
            updated_by
        }

        // if (req.files?.pan_image && req.files.pan_image[0]) {
        //     updateVendordata.pan_image = await uploadImage(req.files.pan_image[0]);
        // }

        // if (req.files?.gst_image && req.files.gst_image[0]) {
        //     updateVendordata.gst_image = await uploadImage(req.files.gst_image[0]);
        // }

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