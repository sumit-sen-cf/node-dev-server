const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const pmsPageMastModel = require('../../models/PMS/pmsPageMastModel');

//POST- PMS_Pay_Method
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
            page_name_type, content_creation, ownership_type, owner_vendor_id, followers_count, profile_type_id, platform_active_on,
            engagment_rate, description,  created_by,  last_updated_by } = req.body;
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
            owner_vendor_id: owner_vendor_id,
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
        console.log("err-------------------",error)
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};
