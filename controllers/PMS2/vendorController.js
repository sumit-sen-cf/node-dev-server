const constant = require("../../common/constant");
const response = require("../../common/response");
const { updatePageMasterModel } = require("../../helper/helper");
const bankDetailsModel = require("../../models/PMS2/bankDetailsModel");
const paymentMethodModel = require("../../models/PMS2/paymentMethodModel");
const vendorGroupLinkModel = require("../../models/PMS2/vendorGroupLinkModel");
const vendorModel = require("../../models/PMS2/vendorModel");
const companyDetailsModel = require("../../models/PMS2/companyDetailsModel");
const XLSX = require('xlsx');
const bulkVendorModel = require("../../models/PMS2/bulkVendorModel");
const pageCatAssignmentModel = require("../../models/PMS2/pageCatAssignment");
const pageMasterModel = require("../../models/PMS2/pageMasterModel");
const pagePriceTypeModel = require("../../models/PMS2/pagePriceTypeModel");
const pagePriceMultipleModel = require("../../models/PMS2/pagePriceMultipleModel");

exports.createVendorData = async (req, res) => {
    try {
        const { vendor_type, vendor_platform, pay_cycle, bank_name, page_count, primary_field,
            vendor_name, home_pincode, country_code, mobile, alternate_mobile, email, personal_address,
            home_address, home_city, home_state, created_by, vendor_category, closed_by, busi_type } = req.body;

        const data = await vendorModel.findOne({ mobile: mobile });

        if (data) {
            return response.returnFalse(
                409,
                req,
                res,
                `This Mobile Number is Already Exist.`,
                {}
            );
        } else {
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
        }
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

        const {
            vendor_type, vendor_platform, pay_cycle, bank_name, company_details, primary_field, vendor_name,
            home_pincode, country_code, mobile, alternate_mobile, email, personal_address, home_address,
            home_city, home_state, vendor_category, updated_by, closed_by, busi_type, bank_details, vendorLinks, payment_method
        } = req.body;

        // Find the vendor by ID
        const existingVendor = await vendorModel.findById(vendor_id);
        if (!existingVendor) {
            return response.returnFalse(200, req, res, 'Vendor not found', {});
        }

        const previousVendorName = existingVendor.vendor_name; // Capture the current vendor_name

        // Update vendor fields
        Object.assign(existingVendor, {
            vendor_type, vendor_platform, pay_cycle, bank_name, company_details, primary_field, vendor_name,
            home_pincode, country_code, mobile, alternate_mobile, email, personal_address, home_address,
            home_city, home_state, vendor_category, updated_by, closed_by, busi_type
        });
        // Save updated vendor data
        const updatedVendorData = await existingVendor.save();
        if (!updatedVendorData) {
            return response.returnFalse(500, req, res, `Oops! Something went wrong while updating vendor data.`, {});
        }

        // Step 6: If `vendor_name` is updated, update related records in other models
        if (vendor_name && previousVendorName !== vendor_name) {
            // Call the helper function to update related records in other models
            const updateRelatedModelsResult = await updatePageMasterModel(
                previousVendorName, // Old vendor name
                vendor_name, // New vendor name
                vendorModel, // Base model
                "vendor_name", // Base model field (current model field name)
                "vendor_name" // Target model field (related model field to update)
            );

            if (updateRelatedModelsResult.matchedCount > 0) {
                console.log(`${updateRelatedModelsResult.modifiedCount} records updated in related models.`);
            } else {
                console.log('No records found in related models to update.');
            }
        }

        // Update bank details
        if (bank_details?.length && Array.isArray(bank_details)) {
            for (const element of bank_details) {
                if (element?._id) {
                    // Existing document: update it
                    element.updated_by = updated_by;
                    await bankDetailsModel.updateOne({ _id: element._id }, { $set: element });
                } else {
                    // New document: insert it
                    element.created_by = updated_by;
                    element.vendor_id = vendor_id;
                    await bankDetailsModel.create(element);
                }
            }
        }

        // Update vendor links
        if (vendorLinks?.length && Array.isArray(vendorLinks)) {
            for (const element of vendorLinks) {
                if (element?._id) {
                    // Existing document: update it
                    element.updated_by = updated_by;
                    await vendorGroupLinkModel.updateOne({ _id: element._id }, { $set: element });
                } else {
                    // New document: insert it
                    element.created_by = updated_by;
                    element.vendor_id = vendor_id;
                    await vendorGroupLinkModel.create(element);
                }
            }
        }

        // Update payment methods
        if (payment_method?.length && Array.isArray(payment_method)) {
            for (const element of payment_method) {
                if (element?._id) {
                    // Existing document: update it
                    element.updated_by = updated_by;
                    await paymentMethodModel.updateOne({ _id: element._id }, { $set: element });
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
};


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
            $or: [
                { _id: { $in: vendorIds } },
                { created_by: user_id }
            ]
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

exports.getAllVendorsForUsersWithStartEndDate = async (req, res) => {
    try {
        const { user_id, start_date, end_date } = req.body;

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
            _id: { $in: vendorIds },
            createdAt: {
                $gte: new Date(start_date),
                $lte: new Date(end_date)
            }
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

exports.getAllVendorListWithStartEndDate = async (req, res) => {
    try {
        const page = req.query?.page ? parseInt(req.query.page) : null;
        const limit = req.query?.limit ? parseInt(req.query.limit) : null;

        const { start_date, end_date } = req.body;

        const skip = (page && limit) ? (page - 1) * limit : 0;

        const query = {
            status: { $ne: constant.DELETED }
        };

        if (start_date && end_date) {
            query.createdAt = {
                $gte: new Date(start_date),
                $lte: new Date(end_date)
            };
        }

        const vendorList = await vendorModel.find(query).skip(skip).limit(limit);

        const vendorsCount = await vendorModel.countDocuments(query);

        if (vendorList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }

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
};

exports.updatePriceWithVendorId = async (req, res) => {
    try {
        const { vendor_id, newPrice, page_price_type_id } = req.body;

        const pageData = await pageMasterModel.find({ vendor_id: vendor_id }).select({ _id: 1, p_id: 1, page_name: 1 });

        if (pageData.length === 0) {
            return response.returnFalse(200, req, res, "No Record Found", []);
        }

        const pageMasterIds = pageData.map(page => page._id);

        const pagePriceData = await pagePriceMultipleModel.find({
            page_master_id: { $in: pageMasterIds }
        }).select({ page_master_id: 1, page_price_type_id: 1 });

        if (pagePriceData.length === 0) {
            return response.returnFalse(200, req, res, "No Price Data Found", []);
        }

        const pagePriceTypeIds = pagePriceData.map(pagePrice => pagePrice.page_price_type_id);

        const result = await pagePriceMultipleModel.updateOne(
            {
                page_price_type_id: page_price_type_id
            },
            { $set: { price: newPrice } },
            { new: true }
        );

        // const priceTypes = await pagePriceTypeModel.find({
        //     _id: { $in: pagePriceTypeIds }
        // }).select({ _id: 1 });

        // if (priceTypes.length === 0) {
        //     return response.returnFalse(200, req, res, "No Price Type Data Found", []);
        // }

        // const updatePromises = priceTypes.map(async (pagePrice) => {

        //     await pagePriceMultipleModel.updateOne(
        //         {
        //             page_price_type_id: pagePrice._id
        //         },
        //         { $set: { price: newPrice } },
        //         { new: true }
        //     );
        // });

        // await Promise.all(updatePromises);

        const updatedPages = await pageMasterModel.find(
            { vendor_id: vendor_id },
            { page_name: 1, _id: 0 }
        );

        const pageNames = updatedPages.map(page => page.page_name);

        return res.status(200).json({
            success: true,
            message: "pages prices updated successfully.",
            updatedPages: pageNames
        });

    } catch (err) {
        return response.returnFalse(500, req, res, `${err.message}`, {});
    }
};

exports.updatePageCountWithVendorID = async (req, res) => {
    try {
        const pageData = await pageMasterModel.aggregate([
            {
                $group: {
                    _id: "$vendor_id",
                    pageCount: { $sum: 1 }
                }
            }
        ]);

        console.log("pageData", pageData);
        const bulkOps = pageData.map(data => {
            return {
                updateOne: {
                    filter: { _id: data._id },
                    update: { $set: { page_count: data.pageCount } }
                }
            };
        });
        if (bulkOps.length > 0) {
            await vendorModel.bulkWrite(bulkOps);
        }

        res.status(200).json({
            success: true,
            message: "Page counts updated successfully!",
            data: pageData
        });


    } catch (err) {
        // Handle error
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
};
