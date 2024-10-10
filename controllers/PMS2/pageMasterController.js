const constant = require("../../common/constant");
const response = require("../../common/response");
const pageMasterModel = require("../../models/PMS2/pageMasterModel");
const pagePriceMultipleModel = require("../../models/PMS2/pagePriceMultipleModel");
const pageCatAssignment = require("../../models/PMS2/pageCatAssignment");
const vendorModel = require("../../models/PMS2/vendorModel");
const pageCatAssignmentModel = require("../../models/PMS2/pageCatAssignment");
const pageFollowerCountLogModel = require("../../models/PMS2/pageFollowerCountLogModel");
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
// const { ObjectId } = require('mongodb');

exports.addPageMaster = async (req, res) => {
    try {
        //get data from body 
        const { page_profile_type_id, page_category_id, platform_id, vendor_id, page_name, page_name_type, primary_page, page_link, page_mast_status, preference_level,
            content_creation, ownership_type, rate_type, variable_type, description, page_closed_by, followers_count, engagment_rate, tags_page_category,
            platform_active_on, created_by, story, post, both_, m_post_price, m_story_price, m_both_price, page_sub_category_id } = req.body;

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
            created_by,
            story, post, both_, m_post_price, m_story_price, m_both_price,
            page_sub_category_id
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
        const vendor = await vendorModel.findById(vendor_id);
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

        const matchQuery = {
            page_mast_status: { $ne: constant.DELETED }
        };

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


exports.updateSinglePageMasterDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const pageData = await pageMasterModel.findOne({ _id: id });

        const followerLogsData = new pageFollowerCountLogModel({
            p_id: pageData.p_id,
            page_name: pageData.page_name,
            follower_count: pageData.followers_count,
            bio: pageData.bio,
            created_by: pageData.created_by
        })

        const result = await followerLogsData.save();

        const { page_profile_type_id, page_category_id, platform_id, vendor_id, page_name, page_name_type, primary_page, page_link,
            page_mast_status, preference_level, content_creation, ownership_type, rate_type, variable_type, description, page_closed_by,
            followers_count, engagment_rate, tags_page_category, platform_active_on, last_updated_by, story, post, both_, m_post_price,
            m_story_price, m_both_price, page_sub_category_id } = req.body;

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
                page_sub_category_id
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


exports.addPageCategoryAssignmentToUser = async (req, res) => {
    try {
        const { user_id, page_sub_category_id, created_by } = req.body;

        if (!user_id || !Array.isArray(page_sub_category_id) || page_sub_category_id.length === 0) {
            return response.returnFalse(400, req, res, "Invalid input data", {});
        }

        const pageCats = page_sub_category_id.map(item => item.value);

        const savingResults = [];

        for (let i = 0; i < pageCats.length; i++) {
            const savingObj = await pageCatAssignment.create({
                user_id: user_id,
                page_sub_category_id: pageCats[i],
                created_by: created_by
            });
            savingResults.push(savingObj);
        }

        return response.returnTrue(200, req, res, "Successfully assigned page master data", savingResults);
    } catch (err) {
        return response.returnFalse(500, req, res, `${err.message}`, {});
    }
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

        const data = await pageCatAssignment.find();

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

exports.getAllPagesForUsers = async (req, res) => {
    try {
        const { user_id } = req.body;

        const usersData = await pageCatAssignmentModel
            .find({ user_id: user_id })
            .select({ page_sub_category_id: 1, _id: 0 });

        if (!usersData || usersData.length === 0) {
            return response.returnFalse(200, req, res, "No Record Found", {});
        }

        const subCategoryIds = usersData.map(item => item.page_sub_category_id);

        const subCatData = await pageMasterModel.find({
            page_sub_category_id: { $in: subCategoryIds }
        });


        if (!subCatData || subCatData.length === 0) {
            return response.returnFalse(200, req, res, "No matching Page Sub Categories found", {});
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