const { message } = require("../../common/message")
const mongoose = require("mongoose");
const salesServiceMasterModel = require("../../models/Sales/salesServiceMasterModel");

/**
 * Api is to used for the sales_service_master data add in the DB collection.
 */
exports.createSalesServiceMaster = async (req, res) => {
    try {
        const { service_name, post_type, amount_status, is_excel_upload, no_of_hours_status, goal_status, day_status,
            quantity_status, brand_name_status, hashtag, indiviual_amount_status, start_end_date_status,
            per_month_amount_status, no_of_creators, deliverables_info, remarks, created_by, last_updated_by } = req.body;
        const addSalesServiceMasterDetails = new salesServiceMasterModel({
            service_name: service_name,
            post_type: post_type,
            amount_status: amount_status,
            is_excel_upload: is_excel_upload,
            no_of_hours_status: no_of_hours_status,
            goal_status: goal_status,
            day_status: day_status,
            quantity_status: quantity_status,
            brand_name_status: brand_name_status,
            hashtag: hashtag,
            indiviual_amount_status: indiviual_amount_status,
            start_end_date_status: start_end_date_status,
            per_month_amount_status: per_month_amount_status,
            no_of_creators: no_of_creators,
            deliverables_info: deliverables_info,
            remarks: remarks,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addSalesServiceMasterDetails.save();
        return res.status(200).json({
            status: 200,
            message: "Sales service data added successfully!",
            data: addSalesServiceMasterDetails,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the sales_service_master data get_ByID in the DB collection.
 */
exports.getSalesServiceMasterDetails = async (req, res) => {
    try {
        const salesServiceMasterData = await salesServiceMasterModel.aggregate([
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
                    service_name: 1,
                    post_type: 1,
                    amount_status: 1,
                    is_excel_upload: 1,
                    no_of_hours_status: 1,
                    goal_status: 1,
                    day_status: 1,
                    quantity_status: 1,
                    brand_name_status: 1,
                    hashtag: 1,
                    indiviual_amount_status: 1,
                    start_end_date_status: 1,
                    per_month_amount_status: 1,
                    no_of_creators: 1,
                    deliverables_info: 1,
                    remarks: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (salesServiceMasterData) {
            return res.status(200).json({
                status: 200,
                message: "Sales service master details successfully!",
                data: salesServiceMasterData,
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

/**
 * Api is to used for the sales_service_master data update in the DB collection.
 */
exports.updateSalesServiceMasterDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { service_name, post_type, amount_status, is_excel_upload, no_of_hours_status, goal_status, day_status,
            quantity_status, brand_name_status, hashtag, indiviual_amount_status, start_end_date_status,
            per_month_amount_status, no_of_creators, deliverables_info, remarks, created_by, last_updated_by } = req.body;
        const salesServiceMasterData = await salesServiceMasterModel.findOne({ _id: id });
        if (!salesServiceMasterData) {
            return res.send("Invalid sales_service_master Id...");
        }
        await salesServiceMasterData.save();
        const salesServiceMasterUpdated = await salesServiceMasterModel.findOneAndUpdate({ _id: id }, {
            $set: {
                service_name,
                post_type,
                amount_status,
                is_excel_upload,
                no_of_hours_status,
                goal_status,
                day_status,
                quantity_status,
                brand_name_status,
                hashtag,
                indiviual_amount_status,
                start_end_date_status,
                per_month_amount_status,
                no_of_creators,
                deliverables_info,
                remarks,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "sales service master data updated successfully!",
            data: salesServiceMasterUpdated,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};


/**
 * Api is to used for the sales_service_master data get_list in the DB collection.
 */
exports.getSalesServiceMasterList = async (req, res) => {
    try {
        const salesServiceMasterListData = await salesServiceMasterModel.aggregate([
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
                    service_name: 1,
                    post_type: 1,
                    amount_status: 1,
                    is_excel_upload: 1,
                    no_of_hours_status: 1,
                    goal_status: 1,
                    day_status: 1,
                    quantity_status: 1,
                    brand_name_status: 1,
                    hashtag: 1,
                    indiviual_amount_status: 1,
                    start_end_date_status: 1,
                    per_month_amount_status: 1,
                    no_of_creators: 1,
                    deliverables_info: 1,
                    remarks: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (salesServiceMasterListData) {
            return res.status(200).json({
                status: 200,
                message: "Sales service master details list successfully!",
                data: salesServiceMasterListData,
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

/**
 * Api is to used for the sales_service_master data delete in the DB collection.
 */
exports.deleteSalesServiceMaster = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const salesServiceMasterDelete = await salesServiceMasterModel.findOne({ _id: id });
        if (!salesServiceMasterDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await salesServiceMasterModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Sales service master data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};