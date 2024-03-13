const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const pmsPageMastModel = require('../../models/PMS/pmsPageMastModel');

//POST- PMS_Page_Mast
exports.createPageMast = async (req, res) => {
    try {
        const checkDuplicacy = await pmsPageMastModel.findOne({ page_user_name: req.body.page_user_name });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "PMS page-mast data alredy exist!",
            });
        }
        const { page_user_name, link, platform_id, page_catg_id, tag_category, page_level, page_status, page_closed_by,
            page_name_type, content_creation, ownership_type, vendorMast_id, followers_count, profile_type_id, platform_active_on,
            engagment_rate, description, created_by, last_updated_by } = req.body;
        const pageMastData = new pmsPageMastModel({
            page_user_name: page_user_name,
            link: link,
            platform_id: platform_id,
            page_catg_id: page_catg_id,
            tag_category: tag_category,
            page_level: page_level,
            page_status: page_status,
            page_closed_by: page_closed_by,
            page_name_type: page_name_type,
            content_creation: content_creation,
            ownership_type: ownership_type,
            vendorMast_id: vendorMast_id,
            followers_count: followers_count,
            profile_type_id: profile_type_id,
            platform_active_on: platform_active_on,
            engagment_rate: engagment_rate,
            description: description,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await pageMastData.save();
        return res.status(200).json({
            status: 200,
            message: "PMS page-mast data added successfully!",
            data: pageMastData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_Vendor_Type-By-ID
exports.getPageMastDetail = async (req, res) => {
    try {
        const pmsPageMastData = await pmsPageMastModel.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(req.params.id) },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    page_user_name: 1,
                    pageMast_id: 1,
                    link: 1,
                    platform_id: 1,
                    page_catg_id: 1,
                    tag_category: 1,
                    page_level: 1,
                    page_status: 1,
                    page_closed_by: 1,
                    page_name_type: 1,
                    content_creation: 1,
                    ownership_type: 1,
                    vendorMast_id: 1,
                    followers_count: 1,
                    profile_type_id: 1,
                    platform_active_on: 1,
                    engagment_rate: 1,
                    description: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (pmsPageMastData) {
            return res.status(200).json({
                status: 200,
                message: "PMS page type details successfully!",
                data: pmsPageMastData,
            });
        }
        return res.status(404).json({
            status: 404,
            message: message.DATA_NOT_FOUND,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};


//PUT - updatePageMast_By-ID
exports.updatePageMast = async (req, res) => {
    try {
        const { id } = req.params;
        const { page_user_name, link, platform_id, page_catg_id, tag_category, page_level, page_status, page_closed_by,
            page_name_type, content_creation, ownership_type, vendorMast_id, followers_count, profile_type_id, platform_active_on,
            engagment_rate, description, created_by, last_updated_by } = req.body;
        const pageMastData = await pmsPageMastModel.findOne({ _id: id });
        if (!pageMastData) {
            return res.send("Invalid page-mast Id...");
        }
        await pageMastData.save();
        const pageMastUpdated = await pmsPageMastModel.findOneAndUpdate({ _id: id }, {
            $set: {
                page_user_name,
                link,
                platform_id,
                page_catg_id,
                tag_category,
                page_level,
                page_status,
                page_closed_by,
                page_name_type,
                content_creation,
                ownership_type,
                vendorMast_id,
                followers_count,
                profile_type_id,
                platform_active_on,
                engagment_rate,
                description,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "PMS page-mast data updated successfully!",
            data: pageMastUpdated,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_Page_Mast_List
exports.getPageMastList = async (req, res) => {
    try {
        const pmsPageMastData = await pmsPageMastModel.aggregate([
            {
                $lookup: {
                    from: "pmsplatforms",
                    localField: "platform_id",
                    foreignField: "_id",
                    as: "pmsplatform",
                },
            },
            {
                $unwind: {
                    path: "$pmsplatform",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "pmspagecategories",
                    localField: "page_catg_id",
                    foreignField: "_id",
                    as: "pmspagecategorie",
                },
            },
            {
                $unwind: {
                    path: "$pmspagecategorie",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user_data",
                },
            },
            {
                $unwind: {
                    path: "$user_data",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    page_user_name: 1,
                    pageMast_id: 1,
                    link: 1,
                    platform_id: 1,
                    page_catg_id: 1,
                    tag_category: 1,
                    page_level: 1,
                    page_status: 1,
                    page_closed_by: 1,
                    page_name_type: 1,
                    content_creation: 1,
                    ownership_type: 1,
                    vendorMast_id: 1,
                    followers_count: 1,
                    profile_type_id: 1,
                    platform_active_on: 1,
                    engagment_rate: 1,
                    description: 1,
                    created_by: 1,
                    last_updated_by_name: "$user_data.user_name",
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    PMS_paform_data: {
                        platform_id: "$pmsplatform._id",
                        platform_name: "$pmsplatform.platform_name",
                        description: "$pmsplatform.description"
                    },
                    PMS_Pagecategories: {
                        page_catg_id: "$pmspagecategorie._id",
                        page_category: "$pmspagecategorie.page_category",
                        description: "$pmspagecategorie.description",
                        created_by: "$pmspagecategorie.created_by"
                    }
                }
            }
        ])
        if (!pmsPageMastData) {
            return res.status(500).send({
                succes: true,
                message: "PMS page-mast data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "PMS page-mast data list successfully!",
            data: pmsPageMastData
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//DELETE - PMS_Page_Catg-By-ID
exports.deletePageMastData = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const pageMastData = await pmsPageMastModel.findOne({ _id: id });
        if (!pageMastData) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await pmsPageMastModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "PMS page-mast data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};