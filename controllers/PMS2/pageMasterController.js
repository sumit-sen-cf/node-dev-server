const constant = require("../../common/constant");
const response = require("../../common/response");
const pageMasterModel = require("../../models/PMS2/pageMasterModel");
const pagePriceMultipleModel = require("../../models/PMS2/pagePriceMultipleModel");
const pageCatAssignment = require("../../models/PMS2/pageCatAssignment");
const vendorModel = require("../../models/PMS2/vendorModel");
const pageCatAssignmentModel = require("../../models/PMS2/pageCatAssignment");
const pageFollowerCountLogModel = require("../../models/PMS2/pageFollowerCountLogModel");
const pageTagCategoryModel = require("../../models/PMS2/pageTagCategoryModel");
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const pageMasterLogModel = require("../../models/PMS2/pageMasterLogModel");
const pageLanguageModel = require("../../models/PMS2/pageLanguagesModel");
const pageLanguageWithPageNameModel = require("../../models/PMS2/pageLanguageWithPageNameModel");
// const { ObjectId } = require('mongodb');

exports.addPageMaster = async (req, res) => {
    try {
        //get data from body 
        const { page_profile_type_id, page_category_id, platform_id, vendor_id, page_profile_type_name, page_category_name, page_sub_category_name, platform_name, page_language_name, vendor_name, page_name, page_name_type, page_price_list, primary_page, page_link, page_mast_status, preference_level,
            content_creation, ownership_type, rate_type, variable_type, description, page_closed_by, followers_count, engagment_rate, tags_page_category, tags_page_category_name, page_language_id, created_by, story, post, both_, m_post_price, m_story_price, m_both_price, page_sub_category_id, bio, page_activeness } = req.body;

        //save data in Db collection
        const savingObj = await pageMasterModel.create({
            page_profile_type_id,
            page_profile_type_name,
            page_category_id,
            page_category_name,
            platform_id,
            platform_name,
            vendor_id,
            vendor_name,
            page_name,
            page_name_type,
            primary_page,
            page_link,
            page_mast_status,
            preference_level,
            content_creation,
            ownership_type,
            rate_type,
            variable_type,
            page_language_name,
            page_language_id,
            page_price_list,
            description,
            page_closed_by,
            followers_count,
            engagment_rate,
            tags_page_category,
            tags_page_category_name,
            created_by,
            story, post, both_, m_post_price, m_story_price, m_both_price,
            page_sub_category_id,
            page_sub_category_name,
            bio,
            page_activeness
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

        const tagCategoryDocs = tags_page_category.map(tag_id => ({
            page_id: savingObj._id,
            page_name: page_name,
            page_category_id: tag_id,
            created_by: created_by
        }));

        const savedTags = await pageTagCategoryModel.insertMany(tagCategoryDocs);

        const pageLaguages = page_language_id.map(page_lang_id => ({
            page_id: savingObj._id,
            page_name: page_name,
            page_language_id: page_lang_id,
            created_by: created_by
        }));

        const languagesData = await pageLanguageWithPageNameModel.insertMany(pageLaguages);

        const vendor = await vendorModel.findById(vendor_id);

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

        if (pageCount >= 2) {
            updatedObj.vendor_type = new ObjectId('666856424366007df1dfacc2');
        }

        if (primary_page === 'Yes') {
            updatedObj["primary_page"] = savingObj._id;
        }
        // Check if primary_page is true
        await vendorModel.findByIdAndUpdate(vendor_id, {
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
            page_mast_status: { $ne: constant.DELETED },
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

// exports.getAllPageMasterDetails = async (req, res) => {
//     try {
//         const page = req.query.page ? parseInt(req.query.page) : null;
//         const limit = req.query.limit ? parseInt(req.query.limit) : null;
//         const skip = (page - 1) * limit;
//         let pageMasterDetails;

//         if (page && limit) {
//             pageMasterDetails = await pageMasterModel.find({
//                 status: { $ne: constant.DELETED },
//             }).skip(skip).limit(limit);
//         } else {
//             pageMasterDetails = await pageMasterModel.find({
//                 status: { $ne: constant.DELETED },
//             });
//         }

//         if (pageMasterDetails?.length <= 0) {
//             return response.returnFalse(200, req, res, `No Record Found`, []);
//         }

//         const pageMasterDataCount = await pageMasterModel.countDocuments();

//         //send success response
//         return response.returnTrueWithPagination(
//             200,
//             req,
//             res,
//             "page master list fetch successfully!",
//             pageMasterDetails,
//             {
//                 start_record: skip + 1,
//                 end_record: skip + pageMasterDetails?.length,
//                 total_records: pageMasterDataCount,
//                 currentPage: page,
//                 total_page: Math.ceil(pageMasterDataCount / limit),

//             }
//         );
//     } catch (error) {
//         return response.returnFalse(500, req, res, `${error.message}`, {});
//     }
// };


exports.getAllPageMasterDetails = async (req, res) => {
    try {
        let pageMasterDetails;

        // Extract page and limit from query parameters, default to null if not provided
        // const page = parseInt(req.query.page) || 1;
        // const limit = parseInt(req.query.limit) || 10;
        // const skip = (page - 1) * limit;

        // console.log("req.query.page", req.query.page);
        // console.log("req.query.limit", req.query.limit);

        const matchQuery = {
            page_mast_status: { $ne: constant.DELETED }
        };

        // regexFields = ['page_name', 'vendor_id']; // Add more fields as needed// Loop through all query parameters
        // for (const [key, value] of Object.entries(req.query)) {
        //     if (regexFields.includes(key)) { // Use regex for fields in the regexFields list 
        //         matchQuery[key] = { $regex: new RegExp(value, 'i') }; // 'i' for case-insensitive 
        //     } else { // Use exact match for other fields 
        //         matchQuery[key] = value;
        //     }
        // }

        const pipeline = [
            { $match: matchQuery },
            {
                $lookup: {
                    from: "pms2pagepricemultiplemodels",
                    localField: "_id",
                    foreignField: "page_master_id",
                    as: "price_details",
                    pipeline: [
                        { $project: { _id: 1, page_price_type_id: 1, page_master_id: 1, price: 1 } }
                    ]
                }
            },
            {
                $lookup: {
                    from: "pms2pagepricetypemodels",
                    localField: "price_details.page_price_type_id",
                    foreignField: "_id",
                    as: "pagePriceData",
                    pipeline: [
                        { $project: { _id: 1, name: 1 } }
                    ]
                }
            },
            {
                $match: { "price_details.0": { $exists: true }, "pagePriceData.0": { $exists: true } }
            },
            {
                $project: {
                    _id: 1,
                    p_id: 1,
                    page_name: 1,
                    page_link: 1,
                    page_category_id: 1,
                    follower_count_before_update: 1,
                    vendor_id: 1,
                    temp_vendor_id: 1,
                    price_type: 1,
                    story: 1,
                    post: 1,
                    both_: 1,
                    m_post_price: 1,
                    m_story_price: 1,
                    m_both_price: 1,
                    created_at: 1,
                    createdAt: 1,
                    ownership_type: 1,
                    page_closed_by: 1,
                    page_profile_type_id: 1,
                    page_name_type: 1,
                    rate_type: 1,
                    update_date: 1,
                    est_update: 1,
                    last_updated_by: 1,
                    page_mast_status: 1,
                    updatedAt: 1,
                    followers_count: 1,
                    platform_id: 1,
                    preference_level: 1,
                    temp_page_cat_id: 1,
                    content_creation: 1,
                    tags_page_category: 1,
                    platform_active_on: 1,
                    created_by: 1,
                    bio: 1,
                    page_language_ids: 1,
                    page_activeness: 1,
                    page_sub_category_id: 1,
                    price_details_obj: {
                        $reduce: {
                            input: "$price_details",
                            initialValue: {},
                            in: {
                                $mergeObjects: [
                                    "$$value",
                                    {
                                        $arrayToObject: {
                                            $map: {
                                                input: {
                                                    $filter: {
                                                        input: "$pagePriceData",
                                                        as: "priceType",
                                                        cond: {
                                                            $eq: ["$$priceType._id", "$$this.page_price_type_id"]
                                                        }
                                                    }
                                                },
                                                as: "matchedPriceType",
                                                in: {
                                                    k: "$$matchedPriceType.name",
                                                    v: "$$this.price"
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    price_details: {
                        $arrayToObject: {
                            $map: {
                                input: {
                                    $objectToArray: "$price_details_obj"
                                },
                                as: "priceDetail",
                                in: {
                                    k: "$$priceDetail.k",
                                    v: "$$priceDetail.v"
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    price_details_obj: 0
                }
            },
            // { $skip: skip },
            // { $limit: limit }
        ];

        pageMasterDetails = await pageMasterModel.aggregate(pipeline);

        // console.log("Pipeline Results Length: ", pageMasterDetails.length);

        // const pagesCount = await pageMasterModel.countDocuments(matchQuery)
        if (pageMasterDetails?.length <= 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }

        return response.returnTrue(
            200,
            req,
            res,
            "Page master list fetched successfully!",
            pageMasterDetails,
            // {
            //     start_record: skip + 1,
            //     end_record: skip + pageMasterDetails.length,
            //     total_records: pagesCount,
            //     current_page: page,
            //     total_page: Math.ceil(pagesCount / limit),
            // }
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};


exports.updateSinglePageMasterDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const pageData = await pageMasterModel.findOne({ _id: id });

        if (pageData.vendor_id !== req.body.vendor_id) {
            const pageData1 = await vendorModel.findOne({ _id: req.body.vendor_id });
            if (!pageData1) {
                return response.returnFalse(404, req, res, `Vendor not found`, {});
            }

            const result = await vendorModel.updateOne(
                { _id: pageData.vendor_id },
                { $inc: { page_count: -1 } },
                { new: true }
            );

            const plusPageCount = await vendorModel.updateOne(
                { _id: req.body.vendor_id },
                { $inc: { page_count: 1 } },
                { new: true }
            );
        }

        const followerLogsData = new pageFollowerCountLogModel({
            page_id: id,
            page_name: pageData.page_name,
            follower_count: pageData.followers_count,
            bio: pageData.bio,
            created_by: pageData.created_by
        })

        const result = await followerLogsData.save();

        const { page_profile_type_id, page_category_id, platform_id, vendor_id, page_category_name, page_language_name, page_price_list, page_profile_type_name, page_sub_category_name, platform_name, tags_page_category_name, vendor_name, page_name, page_name_type, primary_page, page_link,
            page_mast_status, preference_level, content_creation, ownership_type, rate_type, variable_type, description, page_closed_by,
            followers_count, engagment_rate, tags_page_category, platform_active_on, last_updated_by, story, post, both_, m_post_price,
            m_story_price, m_both_price, page_sub_category_id, bio, page_activeness } = req.body;

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
                primary_page,
                page_link,
                page_mast_status,
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
                last_updated_by,
                story, post, both_, m_post_price, m_story_price, m_both_price,
                page_sub_category_id,
                bio,
                page_activeness,
                page_category_name,
                page_language_name,
                page_price_list,
                page_profile_type_name,
                page_sub_category_name,
                platform_name,
                tags_page_category_name,
                vendor_name
            }
        }, {
            new: true, upsert: true
        });
        if (!pageMasterDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }

        const pageLogData = new pageMasterLogModel({
            page_id: id,
            before_update_page_data: pageData,
            after_update_page_data: pageMasterDetails
        });

        const pageMasterLogData = await pageLogData.save();

        const data = await pageTagCategoryModel.deleteMany({ page_id: id });

        if (tags_page_category) {
            const tagCategoryDocs = tags_page_category.map(tag_id => ({
                page_id: pageMasterDetails._id,
                page_name: pageMasterDetails.page_name,
                page_category_id: tag_id,
                created_by: pageMasterDetails.created_by
            }));

            const savedTags = await pageTagCategoryModel.insertMany(tagCategoryDocs);
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

        const findVendorData = await pageMasterModel.findOne({ _id: id });
        const vendor = await vendorModel.findOne({ _id: new ObjectId(findVendorData.vendor_id) });

        const updatedVendor = await vendorModel.findOneAndUpdate(
            { _id: new ObjectId(findVendorData.vendor_id) },
            { $set: { page_count: vendor.page_count - 1 } },
            { new: true }
        );

        const pageMasterDeleted = await pageMasterModel.findOneAndUpdate({
            _id: id,
            page_mast_status: {
                $ne: constant.DELETED
            }
        }, {
            $set: {
                page_mast_status: constant.DELETED,
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

exports.getPageMasterDataVendorWise = async (req, res) => {
    try {
        const { id } = req.params;
        const pageMasterDetail = await pageMasterModel.find({
            vendor_id: id,
            page_mast_status: {
                $ne: constant.DELETED
            }
        });
        if (!pageMasterDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully Fetch page master detail Data vendor id wise",
            pageMasterDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getPageMasterDetailBYPID = async (req, res) => {
    try {
        const pageId = parseInt(req.params.p_id);
        const pageMasterDetail = await pageMasterModel.findOne({
            p_id: pageId,
            page_mast_status: { $ne: constant.DELETED },
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

exports.getPageMasterData = async (req, res) => {
    try {
        const simc = await pageMasterModel.aggregate([
            {
                $lookup: {
                    from: 'pms2pagecategorymodels',
                    localField: 'page_category_id',
                    foreignField: '_id',
                    as: 'pageData'
                }
            },
            {
                $unwind: {
                    path: "$pageData",
                    preserveNullAndEmptyArrays: true,
                },
            },
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
                $lookup: {
                    from: 'pms2pagepricetypemodels',
                    localField: 'platfrom_id',
                    foreignField: 'platform_id',
                    as: 'pricetypeData'
                }
            },
            {
                $unwind: {
                    path: "$pricetypeData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    p_id: 1,
                    page_name: 1,
                    page_link: 1,
                    // page_status: 1,
                    follower_count_before_update: 1,
                    vendor_id: 1,
                    temp_vendor_id: 1,
                    price_type: 1,
                    story: 1,
                    post: 1,
                    both_: 1,
                    m_post_price: 1,
                    m_story_price: 1,
                    m_both_price: 1,
                    created_at: 1,
                    ownership_type: 1,
                    page_closed_by: 1,
                    page_profile_type_id: 1,
                    page_name_type: 1,
                    rate_type: 1,
                    update_date: 1,
                    est_update: 1,
                    last_updated_by: 1,
                    page_mast_status: 1,
                    updatedAt: 1,
                    page_category_id: 1,
                    followers_count: 1,
                    platform_id: 1,
                    preference_level: 1,
                    temp_page_cat_id: 1,
                    content_creation: 1,
                    tags_page_category: 1,
                    platform_active_on: 1,
                    page_cat_name: "$pageData.page_category",
                    num_vendor_id: "$VendorData.vendor_id",
                    vendor_name: "$VendorData.vendor_name",
                    price_type_name: "$pricetypeData.name"
                }
            },
            {
                $group: {
                    _id: "$p_id",
                    data: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: "$data" }
            }
        ]).exec();
        if (!simc) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(simc)
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'error getting all page Data' })
    }
}

exports.getAllPagesForUsers = async (req, res) => {
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
            $or: [
                { page_sub_category_id: { $in: subCategoryIds } },
                { created_by: user_id }
            ]
        });


        if (!subCatData || subCatData.length === 0) {
            return response.returnFalse(200, req, res, "No matching Page Sub Categories found", []);
        }

        return response.returnTrue(
            200,
            req,
            res,
            "Page Datas retrieved successfully!",
            subCatData
        );

    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllPagesForUsersWithStartEndDate = async (req, res) => {
    try {
        const { user_id, start_date, end_date } = req.body;

        const usersData = await pageCatAssignmentModel
            .find({ user_id: user_id })
            .select({ page_sub_category_id: 1, _id: 0 });

        if (!usersData || usersData.length === 0) {
            return response.returnFalse(200, req, res, "No Record Found", {});
        }

        const subCategoryIds = usersData.map(item => item.page_sub_category_id);

        const subCatData = await pageMasterModel.find({
            page_sub_category_id: { $in: subCategoryIds },
            createdAt: {
                $gte: new Date(start_date),
                $lte: new Date(end_date)
            }
        });


        if (!subCatData || subCatData.length === 0) {
            return response.returnFalse(200, req, res, "No matching Page Sub Categories found", []);
        }

        return response.returnTrue(
            200,
            req,
            res,
            "Page Datas retrieved successfully!",
            subCatData
        );

    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllPageMasterDetailsWithStartEndDate = async (req, res) => {
    try {
        const { start_date, end_date } = req.body;

        let pageMasterDetails;

        const matchQuery = {
            page_mast_status: { $ne: constant.DELETED }
        };

        if (start_date && end_date) {
            matchQuery.
                createdAt = {
                $gte: new Date(start_date),
                $lte: new Date(end_date)
            };
        }

        const pipeline = [
            { $match: matchQuery },
            {
                $lookup: {
                    from: "pms2pagepricemultiplemodels",
                    localField: "_id",
                    foreignField: "page_master_id",
                    as: "price_details",
                    pipeline: [
                        { $project: { _id: 1, page_price_type_id: 1, page_master_id: 1, price: 1 } }
                    ]
                }
            },
            {
                $lookup: {
                    from: "pms2pagepricetypemodels",
                    localField: "price_details.page_price_type_id",
                    foreignField: "_id",
                    as: "pagePriceData",
                    pipeline: [
                        { $project: { _id: 1, name: 1 } }
                    ]
                }
            },
            {
                $match: { "price_details.0": { $exists: true }, "pagePriceData.0": { $exists: true } }
            },
            {
                $project: {
                    _id: 1,
                    p_id: 1,
                    page_name: 1,
                    page_link: 1,
                    page_category_id: 1,
                    follower_count_before_update: 1,
                    vendor_id: 1,
                    temp_vendor_id: 1,
                    price_type: 1,
                    story: 1,
                    post: 1,
                    both_: 1,
                    m_post_price: 1,
                    m_story_price: 1,
                    m_both_price: 1,
                    created_at: 1,
                    createdAt: 1,
                    ownership_type: 1,
                    page_closed_by: 1,
                    page_profile_type_id: 1,
                    page_name_type: 1,
                    rate_type: 1,
                    update_date: 1,
                    est_update: 1,
                    last_updated_by: 1,
                    page_mast_status: 1,
                    updatedAt: 1,
                    followers_count: 1,
                    platform_id: 1,
                    preference_level: 1,
                    temp_page_cat_id: 1,
                    content_creation: 1,
                    tags_page_category: 1,
                    platform_active_on: 1,
                    created_by: 1,
                    bio: 1,
                    page_sub_category_id: 1,
                    price_details_obj: {
                        $reduce: {
                            input: "$price_details",
                            initialValue: {},
                            in: {
                                $mergeObjects: [
                                    "$$value",
                                    {
                                        $arrayToObject: {
                                            $map: {
                                                input: {
                                                    $filter: {
                                                        input: "$pagePriceData",
                                                        as: "priceType",
                                                        cond: {
                                                            $eq: ["$$priceType._id", "$$this.page_price_type_id"]
                                                        }
                                                    }
                                                },
                                                as: "matchedPriceType",
                                                in: {
                                                    k: "$$matchedPriceType.name",
                                                    v: "$$this.price"
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    price_details: {
                        $arrayToObject: {
                            $map: {
                                input: {
                                    $objectToArray: "$price_details_obj"
                                },
                                as: "priceDetail",
                                in: {
                                    k: "$$priceDetail.k",
                                    v: "$$priceDetail.v"
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    price_details_obj: 0
                }
            }
        ];

        pageMasterDetails = await pageMasterModel.aggregate(pipeline);

        if (pageMasterDetails?.length <= 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }

        return response.returnTrue(
            200,
            req,
            res,
            "Page master list fetched successfully!",
            pageMasterDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

//All Api's Of Page Cat Assignments

exports.addPageCategoryAssignmentToUser = async (req, res) => {
    try {
        const { user_id, page_sub_category_id, created_by } = req.body;

        const pageCatData = await pageCatAssignment.findOne({ user_id: user_id });

        if (pageCatData) {
            return response.returnFalse(400, req, res, "Please Edit, as this user is already assigned to a sub-category", {});
        } else {

            if (!user_id || !Array.isArray(page_sub_category_id) || page_sub_category_id.length === 0) {
                return response.returnFalse(400, req, res, "Invalid input data", {});
            }

            const pageCats = page_sub_category_id.map(item => {
                return {
                    user_id: user_id,
                    page_sub_category_id: item,
                    created_by: created_by
                };
            });

            const savingResults = await pageCatAssignment.insertMany(pageCats);

            return response.returnTrue(200, req, res, "Successfully assigned page category data", savingResults);
        }
    } catch (err) {
        return response.returnFalse(500, req, res, `${err.message}`, {});
    }
};

exports.editPageCategoryAssignmentToUser = async (req, res) => {
    try {
        const { user_id, page_sub_category_id } = req.body;

        const existingPage = await pageCatAssignment.find({ user_id: user_id });

        if (existingPage) {
            await pageCatAssignment.updateMany(
                { user_id },
                { $set: { status: constant.DELETED } }
            );
        }

        if (Array.isArray(page_sub_category_id) && page_sub_category_id.length > 0) {
            for (const subCategoryId of page_sub_category_id) {
                const newPageCatData = new pageCatAssignment({
                    user_id: user_id,
                    page_sub_category_id: subCategoryId
                });
                await newPageCatData.save();
            }
        }

        return response.returnTrue(
            200,
            req,
            res,
            "Page Category Assignment Data Updated and New Page Category Assignments Inserted Successfully",
            {}
        );

    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.deletePageCategoryAssignment = async (req, res) => {
    pageCatAssignment.findByIdAndDelete(req.params._id).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'Sub cat assigned for user deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'Sub cat assigned Data not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err.message })
    })
};

exports.getAllPageCategoryAssignments = async (req, res) => {
    try {
        const user_id = req.params.user_id;

        const data = await pageCatAssignment.find({ user_id: user_id });

        return response.returnTrue(
            200,
            req,
            res,
            "Successfully get all page Master Data",
            data
        );
    } catch (err) {
        return response.returnFalse(500, req, res, `${err.message}`, {});
    }
}

exports.getAllPageCatAssignment = async (req, res) => {
    try {
        const pageCatAssiData = await pageCatAssignment
            .aggregate([
                {
                    $match: {
                        status: {
                            $ne: constant.DELETED
                        }
                    }
                },
                {
                    $lookup: {
                        from: "pms2pagesubcatmodels",
                        localField: "page_sub_category_id",
                        foreignField: "_id",
                        as: "pageSubCatData",
                    },
                },
                {
                    $unwind: {
                        path: "$pageSubCatData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "user_id",
                        foreignField: "user_id",
                        as: "userData",
                    },
                },
                {
                    $unwind: {
                        path: "$userData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        user_id: 1,
                        user_name: "$userData.user_name",
                        page_sub_category_id: 1,
                        page_sub_category_name: "$pageSubCatData.page_sub_category",
                        created_by: 1,
                        created_by_name: "$userCreatedData.user_name"
                    },
                },
                {
                    $group: {
                        _id: "$user_name",
                        pageCatAssigns: { $push: "$$ROOT" }
                    },
                },
                {
                    $project: {
                        _id: 0,
                        user_id: "$_id",
                        pageCatAssigns: 1
                    }
                }
            ]);
        const formattedResult = pageCatAssiData.map(item => ({
            [item.user_id]: item.pageCatAssigns
        }));

        if (formattedResult.length === 0) {
            return response.returnFalse(200, req, res, "No Record Found...", []);
        }

        return response.returnTrue(
            200,
            req,
            res,
            "Successfully get all Page Category Assignment Data",
            formattedResult
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getAllPageLanguages = async (req, res) => {
    try {
        const data = await pageLanguageModel.find();

        return response.returnTrue(
            200,
            req,
            res,
            "Successfully get all page languages Data",
            data
        );
    } catch (err) {
        return response.returnFalse(500, req, res, `${err.message}`, {});
    }
}

// exports.getPageDatas = async (req, res) => {
//     try {

//         let query = {};
//         const page = parseInt(req.query.page);
//         const limit = parseInt(req.query.limit);
//         const skip = (page - 1) * limit;

//         if (page && limit) {
//             const pageData = await pageMasterModel.find(query).limit(limit).skip(skip);
//         }
//         const searchableFields = ['page_category_name', 'page_sub_category_name', 'vendor_name', 'page_name', 'platform_name', 'profile_type_name', 'ownership_type', 'page_profile_type_name', 'page_activeness'];
//         searchableFields.forEach((field) => {
//             if (req.query[field]) {
//                 query[field] = { $regex: `^${req.query[field]}$`, $options: "i" };
//             }
//         });

//         const pageData = await pageMasterModel.find({
//             ...query,
//             page_mast_status: { $ne: 2 }
//         });

//         const totalCount = await pageMasterModel.countDocuments({
//             ...query,
//             page_mast_status: { $ne: 2 }
//         });

//         return response.returnTrue(
//             200,
//             req,
//             res,
//             "Successfully fetched Page Data excluding status 2",
//             { pageData, totalCount }
//         );
//     } catch (error) {
//         return response.returnFalse(500, req, res, error.message, {});
//     }
// };


// exports.getAllCounts = async (req, res) => {
//     try {

//         const totalPages = await pageMasterModel.aggregate([
//             {
//                 $match: {
//                     page_mast_status: { $ne: 2 }
//                 }
//             },
//             {
//                 $count: "totalPages"
//             }
//         ]);

//         const totalFilteredPages = totalPages.length ? totalPages[0].totalPages : 0;

//         const preferenceLevelCounts = await pageMasterModel.aggregate([
//             {
//                 $match: {
//                     page_mast_status: { $ne: 2 }
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$preference_level",
//                     count: { $sum: 1 }
//                 }
//             }
//         ]);

//         const pageActivenessCounts = await pageMasterModel.aggregate([
//             {
//                 $match: {
//                     page_mast_status: { $ne: 2 }
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$page_activeness",
//                     count: { $sum: 1 }
//                 }
//             }
//         ]);


//         const followerCount = await pageMasterModel.aggregate([
//             {
//                 $match: {
//                     page_mast_status: { $ne: 2 }
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$followers_count",
//                     count: { $sum: 1 }
//                 }
//             }
//         ]);

//         const pageClosedBYCounts = await pageMasterModel.aggregate([
//             {
//                 $match: {
//                     page_mast_status: { $ne: 2 }
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$page_closed_by",
//                     count: { $sum: 1 }
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "usermodels",
//                     localField: "_id",
//                     foreignField: "user_id",
//                     as: "userDetails"
//                 }
//             },
//             {
//                 $unwind: "$userDetails"
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     page_closed_by: "$_id",
//                     user_name: "$userDetails.user_name",
//                     count: 1
//                 }
//             }
//         ]);

//         const preferenceLevelData = {
//             high: 0,
//             medium: 0,
//             low: 0
//         };
//         preferenceLevelCounts.forEach(item => {
//             if (item._id === "high") preferenceLevelData.high = item.count;
//             if (item._id === "medium") preferenceLevelData.medium = item.count;
//             if (item._id === "low") preferenceLevelData.low = item.count;
//         });

//         const pageActivenessData = {
//             active: 0,
//             semi_active: 0,
//             dead: 0,
//             super_active: 0
//         };
//         pageActivenessCounts.forEach(item => {
//             if (item._id === "active") pageActivenessData.active = item.count;
//             if (item._id === "semi_active") pageActivenessData.semi_active = item.count;
//             if (item._id === "dead") pageActivenessData.dead = item.count;
//             if (item._id === "super_active") pageActivenessData.super_active = item.count;
//         });

//         const followerCountData = {
//             "less than 1 lac": 0,
//             "1-10 lacs": 0,
//             "10-20 lacs": 0,
//             "20-30 lacs": 0,
//             "more than 30 lac": 0
//         };

//         followerCount.forEach(item => {
//             if (item._id >= 0 && item._id < 100000) {
//                 followerCountData["less than 1 lac"] += item.count;
//             } else if (item._id >= 100000 && item._id < 1000000) {
//                 followerCountData["1-10 lacs"] += item.count;
//             } else if (item._id >= 1000000 && item._id < 2000000) {
//                 followerCountData["10-20 lacs"] += item.count;
//             } else if (item._id >= 2000000 && item._id < 3000000) {
//                 followerCountData["20-30 lacs"] += item.count;
//             } else if (item._id >= 3000000) {
//                 followerCountData["more than 30 lac"] += item.count;
//             }
//         });

//         const result = {
//             totalPages: totalFilteredPages,
//             preference_level: preferenceLevelData,
//             status: pageActivenessData,
//             followercount: followerCountData,
//             pageClosedBYCounts: pageClosedBYCounts
//         };

//         return response.returnTrue(200, req, res, "Successfully fetched counts", result);

//     } catch (err) {
//         return response.returnFalse(500, req, res, err.message, {});
//     }
// }

exports.getPageDatas = async (req, res) => {
    try {
        // Build the query first
        let query = {
            page_mast_status: { $ne: 2 }  // Exclude status 2
        };

        const searchableFields = ['page_category_name', 'page_sub_category_name', 'vendor_name', 'page_name', 'platform_name', 'profile_type_name', 'ownership_type', 'page_profile_type_name', 'page_activeness'];
        searchableFields.forEach((field) => {
            if (req.query[field]) {
                query[field] = { $regex: `^${req.query[field]}$`, $options: "i" };
            }
        });

        // Pagination logic: Only apply pagination if both 'page' and 'limit' are provided
        let pageDataPromise;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        if (page && limit) {
            const skip = (page - 1) * limit;
            pageDataPromise = pageMasterModel.find(query).limit(limit).skip(skip);
        } else {
            // If pagination is not provided, fetch all data
            pageDataPromise = pageMasterModel.find(query);
        }

        // Use Promise.all to parallelize fetching data and counting documents
        const [pageData, totalCount] = await Promise.all([
            pageDataPromise,
            pageMasterModel.countDocuments(query)
        ]);

        // Return the response
        return response.returnTrue(
            200,
            req,
            res,
            "Successfully fetched Page Data excluding status 2",
            { pageData, totalCount }
        );
    } catch (error) {
        return response.returnFalse(500, req, res, error.message, {});
    }
};


exports.getAllCounts = async (req, res) => {
    try {
        // Common match filter
        const matchFilter = { page_mast_status: { $ne: 2 } };

        const [
            totalPages,
            preferenceLevelCounts,
            pageActivenessCounts,
            followerCount,
            pageClosedBYCounts
        ] = await Promise.all([
            // Total Pages
            pageMasterModel.aggregate([
                { $match: matchFilter },
                { $count: "totalPages" }
            ]),

            // Preference Level Counts
            pageMasterModel.aggregate([
                { $match: matchFilter },
                {
                    $group: {
                        _id: "$preference_level",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Page Activeness Counts
            pageMasterModel.aggregate([
                { $match: matchFilter },
                {
                    $group: {
                        _id: "$page_activeness",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Follower Counts
            pageMasterModel.aggregate([
                { $match: matchFilter },
                {
                    $group: {
                        _id: "$followers_count",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Page Closed By Counts with Lookup
            pageMasterModel.aggregate([
                { $match: matchFilter },
                {
                    $group: {
                        _id: "$page_closed_by",
                        count: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "userDetails"
                    }
                },
                { $unwind: "$userDetails" },
                {
                    $project: {
                        _id: 0,
                        page_closed_by: "$_id",
                        user_name: "$userDetails.user_name",
                        count: 1
                    }
                }
            ])
        ]);

        const totalFilteredPages = totalPages.length ? totalPages[0].totalPages : 0;

        const preferenceLevelData = {
            high: 0,
            medium: 0,
            low: 0
        };
        preferenceLevelCounts.forEach(item => {
            if (item._id === "high") preferenceLevelData.high = item.count;
            if (item._id === "medium") preferenceLevelData.medium = item.count;
            if (item._id === "low") preferenceLevelData.low = item.count;
        });

        const pageActivenessData = {
            active: 0,
            semi_active: 0,
            dead: 0,
            super_active: 0
        };
        pageActivenessCounts.forEach(item => {
            if (item._id === "active") pageActivenessData.active = item.count;
            if (item._id === "semi_active") pageActivenessData.semi_active = item.count;
            if (item._id === "dead") pageActivenessData.dead = item.count;
            if (item._id === "super_active") pageActivenessData.super_active = item.count;
        });

        const followerCountData = {
            "less than 1 lac": 0,
            "1-10 lacs": 0,
            "10-20 lacs": 0,
            "20-30 lacs": 0,
            "more than 30 lac": 0
        };

        followerCount.forEach(item => {
            if (item._id >= 0 && item._id < 100000) {
                followerCountData["less than 1 lac"] += item.count;
            } else if (item._id >= 100000 && item._id < 1000000) {
                followerCountData["1-10 lacs"] += item.count;
            } else if (item._id >= 1000000 && item._id < 2000000) {
                followerCountData["10-20 lacs"] += item.count;
            } else if (item._id >= 2000000 && item._id < 3000000) {
                followerCountData["20-30 lacs"] += item.count;
            } else if (item._id >= 3000000) {
                followerCountData["more than 30 lac"] += item.count;
            }
        });

        const result = {
            totalPages: totalFilteredPages,
            preference_level: preferenceLevelData,
            status: pageActivenessData,
            followercount: followerCountData,
            pageClosedBYCounts
        };

        return response.returnTrue(200, req, res, "Successfully fetched counts", result);

    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};



exports.getPageNameWithClosedBy = async (req, res) => {
    try {
        const { start_date, end_date } = req.body;

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        const result = await pageMasterModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: "$page_closed_by",
                    count: { $sum: 1 },
                    page_details: { $push: { name: "$page_name", createdAt: "$createdAt" } }
                }
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    count: 1,
                    page_closed_by: "$_id",
                    user_name: "$user.user_name",
                    page_count: { $size: "$page_details" },
                    allpages_name: "$page_details"
                }
            }
        ]);

        return response.returnTrue(200, req, res, "Successfully fetched counts", result);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getAllCountsByFilter = async (req, res) => {
    try {

        const { preference_level, page_activeness, followers_count_range } = req.body;

        let matchConditions = { page_mast_status: { $ne: 2 } };

        if (preference_level || page_activeness || followers_count_range) {
            if (preference_level && preference_level.length > 0) {
                matchConditions.preference_level = { $in: preference_level };
            }

            if (page_activeness && page_activeness.length > 0) {
                matchConditions.page_activeness = { $in: page_activeness };
            }

            if (followers_count_range && followers_count_range.length > 0) {
                const followerConditions = [];

                followers_count_range.forEach(range => {
                    switch (range) {
                        case "less than 1 lac":
                            followerConditions.push({ followers_count: { $gte: 0, $lt: 100000 } });
                            break;
                        case "1-10 lacs":
                            followerConditions.push({ followers_count: { $gte: 100000, $lt: 1000000 } });
                            break;
                        case "10-20 lacs":
                            followerConditions.push({ followers_count: { $gte: 1000000, $lt: 2000000 } });
                            break;
                        case "20-30 lacs":
                            followerConditions.push({ followers_count: { $gte: 2000000, $lt: 3000000 } });
                            break;
                        case "more than 30 lac":
                            followerConditions.push({ followers_count: { $gte: 3000000 } });
                            break;
                        default:
                            break;
                    }
                });

                if (followerConditions.length > 0) {
                    matchConditions.$or = followerConditions;
                }
            }

            const filteredPages = await pageMasterModel.aggregate([
                {
                    $match: matchConditions
                },
                {
                    $project: {
                        page_name: 1,
                        page_activeness: 1,
                        followers_count: 1,
                        createdAt: 1,
                        page_profile_type_id: 1,
                        page_profile_type_name: 1,
                        page_category_id: 1,
                        page_category_name: 1,
                        platform_id: 1,
                        platform_name: 1,
                        vendor_id: 1,
                        vendor_name: 1,
                        page_name_type: 1,
                        primary_page: 1,
                        page_link: 1,
                        page_mast_status: 1,
                        preference_level: 1,
                        content_creation: 1,
                        ownership_type: 1,
                        rate_type: 1,
                        variable_type: 1,
                        page_language_name: 1,
                        page_language_id: 1,
                        page_price_list: 1,
                        description: 1,
                        page_closed_by: 1,
                        engagment_rate: 1,
                        tags_page_category: 1,
                        tags_page_category_name: 1,
                        created_by: 1,
                        page_sub_category_id: 1,
                        page_sub_category_name: 1,
                        bio: 1
                    }
                }
            ]);

            const totalPages = await pageMasterModel.aggregate([
                {
                    $match: {
                        page_mast_status: { $ne: 2 }
                    }
                },
                {
                    $count: "totalPages"
                }
            ]);

            const totalFilteredPages = totalPages.length ? totalPages[0].totalPages : 0;

            const preferenceLevelCounts = await pageMasterModel.aggregate([
                {
                    $match: {
                        page_mast_status: { $ne: 2 }
                    }
                },
                {
                    $group: {
                        _id: "$preference_level",
                        count: { $sum: 1 }
                    }
                }
            ]);

            const pageActivenessCounts = await pageMasterModel.aggregate([
                {
                    $match: {
                        page_mast_status: { $ne: 2 }
                    }
                },
                {
                    $group: {
                        _id: "$page_activeness",
                        count: { $sum: 1 }
                    }
                }
            ]);

            const followerCount = await pageMasterModel.aggregate([
                {
                    $match: {
                        page_mast_status: { $ne: 2 }
                    }
                },
                {
                    $group: {
                        _id: "$followers_count",
                        count: { $sum: 1 }
                    }
                }
            ]);

            const pageClosedBYCounts = await pageMasterModel.aggregate([
                {
                    $match: {
                        page_mast_status: { $ne: 2 }
                    }
                },
                {
                    $group: {
                        _id: "$page_closed_by",
                        count: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "userDetails"
                    }
                },
                {
                    $unwind: "$userDetails"
                },
                {
                    $project: {
                        _id: 0,
                        page_closed_by: "$_id",
                        user_name: "$userDetails.user_name",
                        count: 1
                    }
                }
            ]);

            const preferenceLevelData = {
                high: 0,
                medium: 0,
                low: 0
            };
            preferenceLevelCounts.forEach(item => {
                if (item._id === "high") preferenceLevelData.high = item.count;
                if (item._id === "medium") preferenceLevelData.medium = item.count;
                if (item._id === "low") preferenceLevelData.low = item.count;
            });

            const pageActivenessData = {
                active: 0,
                semi_active: 0,
                dead: 0,
                super_active: 0
            };
            pageActivenessCounts.forEach(item => {
                if (item._id === "active") pageActivenessData.active = item.count;
                if (item._id === "semi_active") pageActivenessData.semi_active = item.count;
                if (item._id === "dead") pageActivenessData.dead = item.count;
                if (item._id === "super_active") pageActivenessData.super_active = item.count;
            });

            const followerCountData = {
                "less than 1 lac": 0,
                "1-10 lacs": 0,
                "10-20 lacs": 0,
                "20-30 lacs": 0,
                "more than 30 lac": 0
            };

            followerCount.forEach(item => {
                if (item._id >= 0 && item._id < 100000) {
                    followerCountData["less than 1 lac"] += item.count;
                } else if (item._id >= 100000 && item._id < 1000000) {
                    followerCountData["1-10 lacs"] += item.count;
                } else if (item._id >= 1000000 && item._id < 2000000) {
                    followerCountData["10-20 lacs"] += item.count;
                } else if (item._id >= 2000000 && item._id < 3000000) {
                    followerCountData["20-30 lacs"] += item.count;
                } else if (item._id >= 3000000) {
                    followerCountData["more than 30 lac"] += item.count;
                }
            });

            const result = {
                totalPages: totalFilteredPages,
                preference_level: preferenceLevelData,
                status: pageActivenessData,
                followercount: followerCountData,
                pageClosedBYCounts: pageClosedBYCounts,
                filteredPages: filteredPages
            };

            return response.returnTrue(200, req, res, "Successfully fetched counts", result);
        } else {
            const totalPages = await pageMasterModel.aggregate([
                {
                    $match: {
                        page_mast_status: { $ne: 2 }
                    }
                },
                {
                    $count: "totalPages"
                }
            ]);

            const totalFilteredPages = totalPages.length ? totalPages[0].totalPages : 0;

            const preferenceLevelCounts = await pageMasterModel.aggregate([
                {
                    $match: {
                        page_mast_status: { $ne: 2 }
                    }
                },
                {
                    $group: {
                        _id: "$preference_level",
                        count: { $sum: 1 }
                    }
                }
            ]);

            const pageActivenessCounts = await pageMasterModel.aggregate([
                {
                    $match: {
                        page_mast_status: { $ne: 2 }
                    }
                },
                {
                    $group: {
                        _id: "$page_activeness",
                        count: { $sum: 1 }
                    }
                }
            ]);


            const followerCount = await pageMasterModel.aggregate([
                {
                    $match: {
                        page_mast_status: { $ne: 2 }
                    }
                },
                {
                    $group: {
                        _id: "$followers_count",
                        count: { $sum: 1 }
                    }
                }
            ]);

            const pageClosedBYCounts = await pageMasterModel.aggregate([
                {
                    $match: {
                        page_mast_status: { $ne: 2 }
                    }
                },
                {
                    $group: {
                        _id: "$page_closed_by",
                        count: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "userDetails"
                    }
                },
                {
                    $unwind: "$userDetails"
                },
                {
                    $project: {
                        _id: 0,
                        page_closed_by: "$_id",
                        user_name: "$userDetails.user_name",
                        count: 1
                    }
                }
            ]);

            const preferenceLevelData = {
                high: 0,
                medium: 0,
                low: 0
            };
            preferenceLevelCounts.forEach(item => {
                if (item._id === "high") preferenceLevelData.high = item.count;
                if (item._id === "medium") preferenceLevelData.medium = item.count;
                if (item._id === "low") preferenceLevelData.low = item.count;
            });

            const pageActivenessData = {
                active: 0,
                semi_active: 0,
                dead: 0,
                super_active: 0
            };
            pageActivenessCounts.forEach(item => {
                if (item._id === "active") pageActivenessData.active = item.count;
                if (item._id === "semi_active") pageActivenessData.semi_active = item.count;
                if (item._id === "dead") pageActivenessData.dead = item.count;
                if (item._id === "super_active") pageActivenessData.super_active = item.count;
            });

            const followerCountData = {
                "less than 1 lac": 0,
                "1-10 lacs": 0,
                "10-20 lacs": 0,
                "20-30 lacs": 0,
                "more than 30 lac": 0
            };

            followerCount.forEach(item => {
                if (item._id >= 0 && item._id < 100000) {
                    followerCountData["less than 1 lac"] += item.count;
                } else if (item._id >= 100000 && item._id < 1000000) {
                    followerCountData["1-10 lacs"] += item.count;
                } else if (item._id >= 1000000 && item._id < 2000000) {
                    followerCountData["10-20 lacs"] += item.count;
                } else if (item._id >= 2000000 && item._id < 3000000) {
                    followerCountData["20-30 lacs"] += item.count;
                } else if (item._id >= 3000000) {
                    followerCountData["more than 30 lac"] += item.count;
                }
            });

            const result = {
                totalPages: totalFilteredPages,
                preference_level: preferenceLevelData,
                status: pageActivenessData,
                followercount: followerCountData,
                pageClosedBYCounts: pageClosedBYCounts
            };

            return response.returnTrue(200, req, res, "Successfully fetched counts", result);
        }

    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}
exports.categoryWiseInventoryDetails = async (req, res) => {
    try {
        const analyticsData = await pageMasterModel.aggregate([
            {
                $match: {
                    page_mast_status: { $ne: constant.DELETED }
                }
            },
            // Group by page_category_name and page_sub_category_name
            {
                $group: {
                    _id: {
                        page_category_name: "$page_category_name",
                        page_sub_category_name: "$page_sub_category_name"
                    },
                    totalFollowersCount: { $sum: "$followers_count" },
                    uniqueVendorIds: { $addToSet: "$vendor_id" },
                    pageCount: { $sum: 1 }
                }
            },
            // Count unique vendor_id
            {
                $addFields: {
                    uniqueVendorCount: { $size: "$uniqueVendorIds" }
                }
            },
            // Project final result without the uniqueVendorIds array
            // {
            //     $project: {
            //         uniqueVendorIds: 0
            //     }
            // },
            // Group by page_category_name to restructure data
            {
                $group: {
                    _id: "$_id.page_category_name",
                    subCategories: {
                        $push: {
                            page_sub_category_name: "$_id.page_sub_category_name",
                            totalFollowersCount: "$totalFollowersCount",
                            uniqueVendorCount: "$uniqueVendorCount",
                            pageCount: "$pageCount"
                        }
                    },
                    // Calculate total followers, vendor count, and page count for the entire category
                    totalFollowersCount: { $sum: "$totalFollowersCount" },
                    allUniqueVendorIds: { $addToSet: "$uniqueVendorIds" },
                    totalPageCount: { $sum: "$pageCount" }
                }
            },
            // Count unique vendor_id for the entire category
            {
                $addFields: {
                    uniqueVendorCount: {
                        $size: {
                            $reduce: {
                                input: "$allUniqueVendorIds",
                                initialValue: [],
                                in: { $setUnion: ["$$value", "$$this"] }
                            }
                        }
                    }
                }
            },
            // Project the final result with correct field inclusion/exclusion
            {
                $project: {
                    subCategories: 1,
                    totalFollowersCount: 1,
                    uniqueVendorCount: 1,
                    totalPageCount: 1
                }
                // OR use exclusion:
                // $project: { allUniqueVendorIds: 0 }
            }
        ]);
        return response.returnTrue(200, req, res, "Successfully fetched data", analyticsData);
    } catch (error) {
        return response.returnFalse(500, req, res, error.message, {});
    }
}
