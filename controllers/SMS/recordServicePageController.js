const recordServicePagesModel = require("../../models/SMS/recordServicePagesModel");
const mongoose = require("mongoose");
const { message } = require("../../common/message");
const vari = require("../../variables.js");
const { storage } = require('../../common/uploadFile.js');

/**
 * Api is to used for the record_service_page data add in the DB collection.
 */
exports.createRecordServicePage = async (req, res) => {
    try {
        const { record_service_master_id, sale_booking_id, sales_service_master_id, pageMast_id, page_post_type, page_rate, page_sale_rate,
            remarks, sale_executive_id, created_by, last_updated_by } = req.body;
        const addRecordServicePageDetails = new recordServicePagesModel({
            record_service_master_id: record_service_master_id,
            sale_booking_id: sale_booking_id,
            sales_service_master_id: sales_service_master_id,
            pageMast_id: pageMast_id,
            page_post_type: page_post_type,
            page_rate: page_rate,
            page_sale_rate: page_sale_rate,
            sale_executive_id: sale_executive_id,
            created_by: created_by,
            remarks: remarks,
            last_updated_by: last_updated_by
        });
        await addRecordServicePageDetails.save();
        return res.status(200).json({
            status: 200,
            message: "Record service page data added successfully!",
            data: addRecordServicePageDetails,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};


exports.getRecordServiceMasterDetail = async (req, res) => {
    try {
        const recordServicePageData = await recordServicePagesModel.aggregate([
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
                $lookup: {
                    from: "usermodels",
                    localField: "last_updated_by",
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
                $lookup: {
                    from: "usermodels",
                    localField: "sale_executive_id",
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
                    record_service_master_id: 1,
                    sale_booking_id: 1,
                    sales_service_master_id: 1,
                    pageMast_id: 1,
                    page_post_type: 1,
                    page_rate: 1,
                    page_sale_rate: 1,
                    remarks: 1,
                    sale_executive_id: 1,
                    sale_executive_by_name: "$user.user_name",
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (recordServicePageData) {
            return res.status(200).json({
                status: 200,
                message: "Record service page details successfully!",
                data: recordServicePageData,
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
 * Api is to used for the record_service_page data update in the DB collection.
 */
exports.updateRecordServicePage = async (req, res) => {
    try {
        const { id } = req.params;
        const { record_service_master_id, sale_booking_id, sales_service_master_id, pageMast_id, page_post_type, page_rate, page_sale_rate,
            remarks, sale_executive_id, created_by, last_updated_by } = req.body;
        const recordServicePageData = await recordServicePagesModel.findOne({ _id: id });
        if (!recordServicePageData) {
            return res.send("Invalid record_service_page Id...");
        }
        await recordServicePageData.save();
        const recordServicePageUpdated = await recordServicePagesModel.findOneAndUpdate({ _id: id }, {
            $set: {
                record_service_master_id,
                sale_booking_id,
                sales_service_master_id,
                pageMast_id,
                page_post_type,
                page_rate,
                page_sale_rate,
                sale_executive_id,
                remarks,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "Record service page data updated successfully!",
            data: recordServicePageUpdated,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};


/**
 * Api is to used for the record_service_page data get_List in the DB collection.
 */
exports.getRecordServicePageList = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const recordServicePageListData = await recordServicePagesModel.aggregate([
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
                $lookup: {
                    from: "recordservicemasters",
                    localField: "record_service_master_id",
                    foreignField: "_id",
                    as: "recordservicemaster",
                },
            },
            {
                $unwind: {
                    path: "$recordservicemaster",
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $lookup: {
                    from: "salesbookings",
                    localField: "sale_booking_id",
                    foreignField: "sale_booking_id",
                    as: "salesbooking",
                },
            },
            {
                $unwind: {
                    path: "$salesbooking",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "salesservicemasters",
                    localField: "sales_service_master_id",
                    foreignField: "_id",
                    as: "salesservicemaster",
                },
            },
            {
                $unwind: {
                    path: "$salesservicemaster",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    record_service_master_id: 1,
                    sale_booking_id: 1,
                    sales_service_master_id: 1,
                    pageMast_id: 1,
                    page_post_type: 1,
                    page_rate: 1,
                    page_sale_rate: 1,
                    remarks: 1,
                    sale_executive_id: 1,
                    sale_executive_by_name: "$user.user_name",
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    recordservicemasters: {
                        sale_booking_id: "$recordservicemaster.sale_booking_id",
                        sales_service_master_id: "$recordservicemaster.sales_service_master_id",
                        amount: "$recordservicemaster.amount",
                        no_of_hours: "$recordservicemaster.no_of_hours",
                        goal: "$recordservicemaster.goal",
                        day: "$recordservicemaster.day",
                        quantity: "$recordservicemaster.quantity",
                        brand_name: "$recordservicemaster.brand_name",
                        hashtag: "$recordservicemaster.hashtag",
                        individual_amount: "$recordservicemaster.individual_amount",
                        start_date: "$recordservicemaster.start_date",
                        end_date: "$recordservicemaster.end_date",
                        per_month_amount: "$recordservicemaster.per_month_amount",
                        no_of_creators: "$recordservicemaster.no_of_creators",
                        deliverables_info: "$recordservicemaster.deliverables_info",
                        remarks: "$recordservicemaster.remarks",
                        sale_executive_id: "$recordservicemaster.sale_executive_id",
                        sale_executive_by_name: "$recordservicemaster.sale_executive_by_name",
                        created_date_time: "$recordservicemaster.created_date_time",
                        created_by: "$recordservicemaster.created_by",
                        created_by_name: "$user.user_name",
                        last_updated_date: "$recordservicemaster.last_updated_date",
                        last_updated_by: "$recordservicemaster.last_updated_by",
                        excel_upload: {
                            $concat: [imageUrl, "$recordservicemaster.excel_upload"],
                        },
                        Sales_Booking: {
                            sales_booking_id: "$salesbooking.sale_booking_id",
                            sale_booking_date: "$salesbooking.sale_booking_date",
                            campaign_amount: "$salesbooking.campaign_amount",
                            base_amount: "$salesbooking.base_amount",
                            gst_amount: "$salesbooking.gst_amount",
                            description: "$salesbooking.description",
                            credit_approval_status: "$salesbooking.credit_approval_status",
                            reason_credit_approval: "$salesbooking.reason_credit_approval",
                            balance_payment_ondate: "$salesbooking.balance_payment_ondate",
                            gst_status: "$salesbooking.gst_status",
                            tds_status: "$salesbooking.tds_status",
                            Booking_close_date: "$salesbooking.Booking_close_date",
                            tds_verified_amount: "$salesbooking.tds_verified_amount",
                            tds_verified_remark: "$salesbooking.tds_verified_remark",
                            booking_remarks: "$salesbooking.booking_remarks",
                            incentive_status: "$salesbooking.incentive_status",
                            payment_credit_status: "$salesbooking.payment_credit_status",
                            booking_status: "$salesbooking.booking_status",
                            incentive_sharing_user_id: "$salesbooking.incentive_sharing_user_id",
                            incentive_sharing_percent: "$salesbooking.incentive_sharing_percent",
                            bad_debt: "$salesbooking.bad_debt",
                            bad_debt_reason: "$salesbooking.bad_debt_reason",
                            no_badge_achivement: "$salesbooking.no_badge_achivement",
                            old_sale_booking_id: "$salesbooking.old_sale_booking_id",
                            sale_booking_type: "$salesbooking.sale_booking_type",
                            service_taken_amount: "$salesbooking.service_taken_amount",
                            get_incentive_status: "$salesbooking.get_incentive_status",
                            incentive_amount: "$salesbooking.incentive_amount",
                            earned_incentive_amount: "$salesbooking.earned_incentive_amount",
                            unearned_incentive_amount: "$salesbooking.unearned_incentive_amount",
                            payment_type: "$salesbooking.payment_type",
                            created_by: "$salesbooking.created_by",
                            managed_by: "$salesbooking.managed_by",
                            last_updated_by: "$salesbooking.last_updated_by",
                            creation_date: "$salesbooking.creation_date",
                            last_updated_date: "$salesbooking.last_updated_date"
                        },
                        Sales_Service_Master: {
                            service_name: "$salesservicemaster.service_name",
                            post_type: "$salesservicemaster.post_type",
                            amount_status: "$salesservicemaster.amount_status",
                            is_excel_upload: "$salesservicemaster.is_excel_upload",
                            no_of_hours_status: "$salesservicemaster.no_of_hours_status",
                            goal_status: "$salesservicemaster.goal_status",
                            day_status: "$salesservicemaster.day_status",
                            quantity_status: "$salesservicemaster.quantity_status",
                            brand_name_status: "$salesservicemaster.brand_name_status",
                            hashtag: "$salesservicemaster.hashtag",
                            indiviual_amount_status: "$salesservicemaster.indiviual_amount_status",
                            start_end_date_status: "$salesservicemaster.start_end_date_status",
                            per_month_amount_status: "$salesservicemaster.per_month_amount_status",
                            no_of_creators: "$salesservicemaster.no_of_creators",
                            deliverables_info: "$salesservicemaster.deliverables_info",
                            remarks: "$salesservicemaster.remarks",
                            created_date_time: "$salesservicemaster.created_date_time",
                            created_by: "$salesservicemaster.created_by",
                            created_by_name: "$user.user_name",
                            last_updated_date: "$salesservicemaster.last_updated_date",
                            last_updated_by: "$salesservicemaster.last_updated_by",
                        }
                    }
                },
            },
            {
                $group: {
                    _id: "$_id",
                    data: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: "$data" }
            }
        ])
        if (recordServicePageListData) {
            return res.status(200).json({
                status: 200,
                message: "Record Service Page details list successfully!",
                data: recordServicePageListData,
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
 * Api is to used for the reocrd_service_page data delete in the DB collection.
 */
exports.deleteRecordServicePage = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const recordServicePageDelete = await recordServicePagesModel.findOne({ _id: id });
        if (!recordServicePageDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await recordServicePagesModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Record service page data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};