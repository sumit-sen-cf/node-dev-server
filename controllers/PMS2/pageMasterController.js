const constant = require("../../common/constant");
const response = require("../../common/response");
const pageMasterModel = require("../../models/PMS2/pageMasterModel");
const pagePriceMultipleModel = require("../../models/PMS2/pagePriceMultipleModel");
const vendorModel = require("../../models/PMS2/vendorModel");

exports.addPageMaster = async (req, res) => {
    try {
        //get data from body 
        const { page_profile_type_id, page_category_id, platform_id, vendor_id, page_name, page_name_type, primary_page, page_link, status, preference_level,
            content_creation, ownership_type, rate_type, variable_type, description, page_closed_by, followers_count, engagment_rate, tags_page_category,
            platform_active_on, created_by } = req.body;

        //save data in Db collection
        const savingObj = await pageMasterModel.create({
            page_profile_type_id,
            page_category_id,
            platform_id,
            vendor_id,
            page_name,
            page_name_type,
            primary_page,
            page_link,
            status,
            preference_level,
            content_creation,
            ownership_type,
            rate_type,
            variable_type,
            description,
            page_closed_by,
            followers_count,
            engagment_rate,
            tags_page_category,
            platform_active_on,
            created_by,
        });

        if (!savingObj) {
            return response.returnFalse(
                500,
                req,
                res,
                `Oop's Something went wrong while saving page master data.`,
                {}
            );
        }

        // Check if primary_page is true
        const vendor = await vendorModel.findOne({
            vendor_id: vendor_id
        });
        // Check if vendor exists
        if (!vendor) {
            return response.returnFalse(
                404,
                req,
                res,
                `Vendor not found`,
                {}
            );
        }
        // Update vendor primary_page count
        let pageCount = vendor.page_count;
        pageCount += 1;
        let updatedObj = {
            page_count: pageCount
        };

        if (primary_page) {
            updatedObj["primary_page"] = savingObj._id;
        }
        // Check if primary_page is true
        await vendorModel.updateOne({
            $set: updatedObj
        });

        let pagePriceMultipleUpdatedArray = [];
        let pagePriceDetails = (req.body?.page_price_multiple) || [];

        //page price details length check
        if (pagePriceDetails.length) {
            await pagePriceDetails.forEach(element => {
                element.page_master_id = savingObj._id;
                element.created_by = created_by;
                pagePriceMultipleUpdatedArray.push(element);
            });
        }

        //add data in db collection
        const savingPagePriceMultipleObj = await pagePriceMultipleModel.insertMany(pagePriceMultipleUpdatedArray);

        //success response send
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Saved page Master Data",
            {
                savingObj, savingPagePriceMultipleObj
            }
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getSinglePageMasterDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const pageMasterDetail = await pageMasterModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!pageMasterDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch page master detail Data",
            pageMasterDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllPageMasterDetails = async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : null;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const skip = (page - 1) * limit;
        let pageMasterDetails;

        if (page && limit) {
            pageMasterDetails = await pageMasterModel.find({
                status: { $ne: constant.DELETED },
            }).skip(skip).limit(limit);
        } else {
            pageMasterDetails = await pageMasterModel.find({
                status: { $ne: constant.DELETED },
            });
        }

        if (pageMasterDetails?.length <= 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }

        const pageMasterDataCount = await pageMasterModel.countDocuments();

        //send success response
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "page master list fetch successfully!",
            pageMasterDetails,
            {
                start_record: skip + 1,
                end_record: skip + pageMasterDetails?.length,
                total_records: pageMasterDataCount,
                currentPage: page,
                total_page: Math.ceil(pageMasterDataCount / limit),

            }
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.updateSinglePageMasterDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const { page_profile_type_id, page_category_id, platform_id, vendor_id,
            page_name, page_name_type, page_link, status, preference_level,
            content_creation, ownership_type, rate_type, variable_type, description,
            page_closed_by, followers_count, engagment_rate, tags_page_category,
            platform_active_on, last_updated_by
        } = req.body;

        const pageMasterDetails = await pageMasterModel.findOneAndUpdate({
            _id: id
        }, {
            $set: {
                page_profile_type_id,
                page_category_id,
                platform_id,
                vendor_id,
                page_name,
                page_name_type,
                page_link,
                status,
                preference_level,
                content_creation,
                ownership_type,
                rate_type,
                variable_type,
                description,
                page_closed_by,
                followers_count,
                engagment_rate,
                tags_page_category,
                platform_active_on,
                last_updated_by
            }
        }, {
            new: true
        });
        if (!pageMasterDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }

        let pagePriceDetails = (req.body?.page_price_multiple) || [];

        // Update vendor links
        if (pagePriceDetails.length && Array.isArray(pagePriceDetails)) {
            for (const element of pagePriceDetails) {
                if (element?._id) {
                    // Existing document: update it
                    element.last_updated_by = last_updated_by;
                    await pagePriceMultipleModel.updateOne({
                        _id: element._id
                    }, {
                        $set: element
                    });
                } else {
                    // New document: insert it
                    element.created_by = last_updated_by;
                    element.page_master_id = pageMasterDetails._id;
                    await pagePriceMultipleModel.create(element);
                }
            }
        }

        //send success response
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Update Page master Details Data",
            pageMasterDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.deletePageMasterDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const pageMasterDeleted = await pageMasterModel.findOneAndUpdate({
            _id: id,
            status: {
                $ne: constant.DELETED
            }
        }, {
            $set: {
                status: constant.DELETED,
            }
        }, {
            new: true
        });
        if (!pageMasterDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            `Successfully Delete Page Master Data for id ${id}`,
            pageMasterDeleted
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

// exports.addPageMaster = async (req, res) => {
//     try {
//         //get data from body
//         const {
//             page_profile_type_id,
//             page_category_id,
//             platform_id,
//             vendor_id,
//             page_name,
//             page_name_type,
//             primary_page,
//             page_link,
//             status,
//             preference_level,
//             content_creation,
//             ownership_type,
//             rate_type,
//             variable_type,
//             description,
//             page_closed_by,
//             followers_count,
//             engagment_rate,
//             tags_page_category,
//             platform_active_on,
//             created_by
//         } = req.body;

//         //save data in Db collection
//         const savingObj = await pageMasterModel.create({
//             page_profile_type_id,
//             page_category_id,
//             platform_id,
//             vendor_id,
//             page_name,
//             page_name_type,
//             primary_page,
//             page_link,
//             status,
//             preference_level,
//             content_creation,
//             ownership_type,
//             rate_type,
//             variable_type,
//             description,
//             page_closed_by,
//             followers_count,
//             engagment_rate,
//             tags_page_category,
//             platform_active_on,
//             created_by,
//         });

//         if (!savingObj) {
//             return response.returnFalse(
//                 500,
//                 req,
//                 res,
//                 `Oop's Something went wrong while saving page master data.`,
//                 {}
//             );
//         }

//         // Check if primary_page is true
//         const vendor = await vendorModel.findOne({
//             vendor_id: vendor_id
//         });
//         console.log("vendor-------------------------------------------------------", vendor)
//         // Check if vendor exists
//         if (!vendor) {
//             return response.returnFalse(
//                 404,
//                 req,
//                 res,
//                 `Vendor not found`,
//                 {}
//             );
//         }
//         // Update vendor primary_page count
//         let pageCount = vendor.page_count;
//         console.log("pageCount++++++++++++++++++++", pageCount);
//         pageCount += 1;
//         let updatedObj = {
//             page_count: pageCount
//         };

//         if (primary_page) {
//             updatedObj["primary_page"] = savingObj._id;
//         }
//         console.log("updatedObj-------------------------------------------------------", updatedObj);
//         // Check if primary_page is true
//         await vendorModel.updateOne({
//             $set: updatedObj
//         });

//         let pagePriceMultipleUpdatedArray = [];
//         let pagePriceDetails = (req.body?.page_price_multiple) || [];

//         //page price details length check
//         if (pagePriceDetails.length) {
//             await pagePriceDetails.forEach(element => {
//                 element.page_master_id = savingObj._id;
//                 element.created_by = created_by;
//                 pagePriceMultipleUpdatedArray.push(element);
//             });
//         }

//         //add data in db collection
//         const savingPagePriceMultipleObj = await pagePriceMultipleModel.insertMany(pagePriceMultipleUpdatedArray);

//         //success response send
//         return response.returnTrue(
//             200,
//             req,
//             res,
//             "Successfully Saved page Master Data",
//             {
//                 savingObj, savingPagePriceMultipleObj
//             }
//         );
//     } catch (error) {
//         return response.returnFalse(500, req, res, `${error.message}`, {});
//     }
// };