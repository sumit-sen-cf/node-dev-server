const constant = require("../../common/constant");
const response = require("../../common/response");
const bankDetailsModel = require("../../models/PMS2/bankDetailsModel");
const paymentMethodModel = require("../../models/PMS2/paymentMethodModel");
const vendorGroupLinkModel = require("../../models/PMS2/vendorGroupLinkModel");
const vendorModel = require("../../models/PMS2/vendorModel");
const companyDetailsModel = require("../../models/PMS2/companyDetailsModel");
const XLSX = require('xlsx');
const bulkVendorModel = require("../../models/PMS2/bulkVendorModel");
const pageCatAssignmentModel = require("../../models/PMS2/pageCatAssignment");
const pageMasterModel = require("../../models/PMS2/pageMasterModel");

exports.createVendorData = async (req, res) => {
    try {
        const { vendor_type, vendor_platform, pay_cycle, bank_name, page_count, primary_field,
            vendor_name, home_pincode, country_code, mobile, alternate_mobile, email, personal_address,
            home_address, home_city, home_state, created_by, vendor_category, closed_by, busi_type } = req.body;
        const addVendorData = new vendorModel({
            vendor_type,
            vendor_platform,
            pay_cycle,
            bank_name,
            primary_field,
            vendor_name,
            home_pincode,
            country_code,
            mobile,
            alternate_mobile,
            page_count,
            email,
            personal_address,
            home_address,
            home_city,
            vendor_category,
            home_state,
            created_by,
            closed_by,
            busi_type
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
        let paymentMethodUpdatedArray = [];
        let companyDetailsUpdatedArray = [];

        let bankDetails = (req.body?.bank_details) || [];
        let vendorLinkDetails = (req.body?.vendorLinks) || [];
        let paymentMethodDetails = (req.body?.paymentMethod) || [];
        let companyDetails = (req.body?.company_details) || [];

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

        //payment method details obj in add vender id
        if (paymentMethodDetails.length) {
            await paymentMethodDetails.forEach(element => {
                element.vendor_id = vendorDataSaved._id;
                element.created_by = created_by;
                paymentMethodUpdatedArray.push(element);
            });
        }

        //company details obj in add vender id
        if (companyDetails.length) {
            await companyDetails.forEach(element => {
                element.vendor_id = vendorDataSaved._id;
                element.created_by = created_by;
                companyDetailsUpdatedArray.push(element);
            });
        }

        //add data in db collection
        await bankDetailsModel.insertMany(bankDataUpdatedArray);
        await vendorGroupLinkModel.insertMany(vendorlinksUpdatedArray);
        await paymentMethodModel.insertMany(paymentMethodUpdatedArray);
        await companyDetailsModel.insertMany(companyDetailsUpdatedArray);

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
        // Extract page and limit from query parameters, default to null if not provided
        const page = req.query?.page ? parseInt(req.query.page) : null;
        const limit = req.query?.limit ? parseInt(req.query.limit) : null;

        // Calculate the number of records to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;

        // Retrieve the list of records with pagination applied
        const vendorList = await vendorModel.find({
            status: {
                $ne: constant.DELETED
            }
        }).skip(skip).limit(limit);

        // Get the total count of records in the collection
        const vendorsCount = await vendorModel.countDocuments();

        // If no records are found, return a response indicating no records found
        if (vendorList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of records and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Vendor list retrieved successfully!",
            vendorList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + vendorList.length : vendorList.length,
                total_records: vendorsCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(vendorsCount / limit) : 1,
            }
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}


exports.updateVendorData = async (req, res) => {
    try {
        const { vendor_id } = req.params;

        // Assuming vendor_id is passed as a URL parameter
        const { vendor_type, vendor_platform, pay_cycle, bank_name, page_count, company_details, primary_field, vendor_name,
            home_pincode, country_code, mobile, alternate_mobile, email, personal_address, home_address, home_city, home_state,
            vendor_category, updated_by, closed_by, busi_type } = req.body;

        // Find the vendor by ID
        const existingVendor = await vendorModel.findById(vendor_id);
        if (!existingVendor) {
            return response.returnFalse(404, req, res, `Vendor not found`, {});
        }

        // Update vendor fields
        existingVendor.vendor_type = vendor_type;
        existingVendor.closed_by = closed_by;
        existingVendor.vendor_platform = vendor_platform;
        existingVendor.pay_cycle = pay_cycle;
        existingVendor.bank_name = bank_name;
        existingVendor.company_details = company_details;
        // existingVendor.page_count = page_count;
        existingVendor.primary_field = primary_field;
        existingVendor.vendor_name = vendor_name;
        existingVendor.home_pincode = home_pincode;
        existingVendor.country_code = country_code;
        existingVendor.mobile = mobile;
        existingVendor.alternate_mobile = alternate_mobile;
        existingVendor.email = email;
        existingVendor.personal_address = personal_address;
        existingVendor.home_address = home_address;
        existingVendor.home_city = home_city;
        existingVendor.home_state = home_state;
        existingVendor.updated_by = updated_by;
        existingVendor.vendor_category = vendor_category;
        existingVendor.busi_type = busi_type;

        // Save updated vendor data
        const updatedVendorData = await existingVendor.save();
        if (!updatedVendorData) {
            return response.returnFalse(500, req, res, `Oops! Something went wrong while updating vendor data.`, {});
        }

        // let bankDetails = (req.body?.bank_details && JSON.parse(req.body.bank_details)) || [];
        // let vendorLinkDetails = (req.body?.vendorLinks && JSON.parse(req.body.vendorLinks)) || [];
        let bankDetails = (req.body?.bank_details) || [];
        let vendorLinkDetails = (req.body?.vendorLinks) || [];
        let paymentMethodDetails = (req.body?.payment_method) || [];


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

        //update payment_method
        if (paymentMethodDetails.length && Array.isArray(paymentMethodDetails)) {
            for (const element of paymentMethodDetails) {
                if (element?._id) {
                    // Existing document: update it
                    element.updated_by = updated_by;
                    await paymentMethodModel.updateOne({
                        _id: element._id
                    }, {
                        $set: element
                    });
                } else {
                    // New document: insert it
                    element.created_by = updated_by;
                    element.vendor_id = vendor_id;
                    await paymentMethodModel.create(element);
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
        const { vendor_type, vendor_platform, pay_cycle, bank_name, page_count, company_details, primary_field,
            vendor_name, home_pincode, country_code, mobile, alternate_mobile, email, personal_address,
            home_address, home_city, home_state, vendor_category, busi_type } = req.body;

        let updateVendordata = {
            vendor_type,
            vendor_platform,
            pay_cycle,
            bank_name,
            company_details,
            primary_field,
            vendor_name,
            page_count,
            home_pincode,
            country_code,
            mobile,
            alternate_mobile,
            email,
            personal_address,
            home_address,
            home_city,
            vendor_category,
            home_state,
            updated_by,
            busi_type
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

/**
 * Api is get the vendor model data BY Vendor-Id
 */
exports.getVendorDetailsBYVendorId = async (req, res) => {
    try {
        const vendorId = parseInt(req.params.vendor_id);

        const getVenorData = await vendorModel.findOne({
            vendor_id: vendorId,
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

exports.insertBulkVendor = async (req, res) => {
    try {
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

        const { vendor_id, category_id } = req.body;
        const vendorsData = worksheet.map((row) => ({
            page_id: row.page_id,
            vendor_id: vendor_id,
            category_id: category_id,
            page_name: row.page_name,
            story: row.story,
            post: row.post,
            both: row.both,
            m_story: row.m_story,
            m_post: row.m_post,
            m_both: row.m_both,
            reel: row.reel,
            carousel: row.carousel,
        }))

        await bulkVendorModel.insertMany(vendorsData);
        return response.returnTrue(200, req, res, "Bulk Vendor data added successfully!", {});
    } catch (err) {
        return response.returnFalse(500, req, res, `${err.message}`, {})
    }
}

// exports.bulkVendorData = async (req, res) => {
//     try {
//         const page = req.query.page;
//         let limit = 0; 

//         if (page && !isNaN(page) && parseInt(page) > 0) {
//             limit = parseInt(page) * 10;
//         }
//         const vendors = await bulkVendorModel.find().limit(limit);

//         return response.returnTrue(200, req, res, "Bulk Vendor data fetched successfully!", vendors);
//     } catch (err) {
//         return response.returnFalse(500, req, res, `${err.message}`, {});
//     }
// }

exports.bulkVendorData = async (req, res) => {
    try {
        const page = req.query.page;
        let limit = 0;

        if (page && !isNaN(page) && parseInt(page) > 0) {
            limit = parseInt(page) * 10;
        }

        const vendors = await bulkVendorModel.aggregate([
            {
                $lookup: {
                    from: 'pms2vendormodels',
                    localField: 'vendor_id',
                    foreignField: '_id',
                    as: 'VendorData'
                }
            },
            {
                $unwind: {
                    path: "$VendorData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    page_name: 1,
                    vendor_id: 1,
                    story: 1,
                    post: 1,
                    both: 1,
                    m_story: 1,
                    m_post: 1,
                    m_both: 1,
                    reel: 1,
                    carousel: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    vendor_name: '$VendorData.vendor_name'
                }
            }
        ]);

        return response.returnTrue(200, req, res, "Bulk Vendor data fetched successfully!", vendors);
    } catch (err) {
        return response.returnFalse(500, req, res, `${err.message}`, {});
    }
}

exports.getAllVendorsForUsers = async (req, res) => {
    try {
        const { user_id } = req.body;

        const usersData = await pageCatAssignmentModel
            .find({ user_id: user_id })
            .select({ page_sub_category_id: 1, _id: 0 });

        if (!usersData || usersData.length === 0) {
            return response.returnFalse(200, req, res, "No Record Found", []);
        }

        const subCategoryIds = usersData.map(item => item.page_sub_category_id);

        const subCatData = await pageMasterModel.find({
            page_sub_category_id: { $in: subCategoryIds }
        });


        if (!subCatData || subCatData.length === 0) {
            return response.returnFalse(200, req, res, "No matching Page Sub Categories found", {});
        }

        const vendorIds = subCatData.map(item => item.vendor_id);

        const vendorData = await vendorModel.find({
            _id: { $in: vendorIds }
        });

        return response.returnTrue(
            200,
            req,
            res,
            "Page Sub Categories retrieved successfully!",
            vendorData
        );

    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};