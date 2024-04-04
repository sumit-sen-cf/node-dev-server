const multer = require("multer");
const vari = require("../../variables.js");
const { storage } = require('../../common/uploadFile.js');
const mongoose = require("mongoose");
const { message } = require("../../common/message");
const recordServiceMasterModel = require("../../models/SMS/recordServiceMasterModel.js");

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "excel_upload", maxCount: 10 }
]);

exports.createRecordServiceMaster = [
    upload, async (req, res) => {
        try {
            const { sale_booking_id, sales_service_master_id, amount, no_of_hours, goal, day, quantity, brand_name, hashtag, individual_amount, start_date,
                end_date, per_month_amount, no_of_creators, deliverables_info, remarks, sale_executive_id, created_by, last_updated_by } = req.body;
            const addRecordServiceMasterData = new recordServiceMasterModel({
                sale_booking_id: sale_booking_id,
                sales_service_master_id: sales_service_master_id,
                amount: amount,
                no_of_hours: no_of_hours,
                goal: goal,
                day: day,
                quantity: quantity,
                brand_name: brand_name,
                hashtag: hashtag,
                individual_amount: individual_amount,
                start_date: start_date,
                end_date: end_date,
                per_month_amount: per_month_amount,
                no_of_creators: no_of_creators,
                deliverables_info: deliverables_info,
                remarks: remarks,
                sale_executive_id: sale_executive_id,
                created_by: created_by,
                last_updated_by: last_updated_by
            });
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            if (req.files.excel_upload && req.files.excel_upload[0].originalname) {
                const blob1 = bucket.file(req.files.excel_upload[0].originalname);
                addRecordServiceMasterData.excel_upload = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => {
                });
                blobStream1.end(req.files.excel_upload[0].buffer);
            }
            await addRecordServiceMasterData.save();
            return res.status(200).json({
                status: 200,
                message: "Record service master data added successfully!",
                data: addRecordServiceMasterData,
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message ? error.message : message.ERROR_MESSAGE,
            });
        }
    }];


exports.getRecordServiceMasterDetail = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const recordServiceMasterData = await recordServiceMasterModel.aggregate([
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
                    sale_booking_id: 1,
                    sales_service_master_id: 1,
                    amount: 1,
                    no_of_hours: 1,
                    goal: 1,
                    day: 1,
                    quantity: 1,
                    brand_name: 1,
                    hashtag: 1,
                    individual_amount: 1,
                    start_date: 1,
                    end_date: 1,
                    per_month_amount: 1,
                    no_of_creators: 1,
                    deliverables_info: 1,
                    remarks: 1,
                    sale_executive_id: 1,
                    sale_executive_by_name: "$user.user_name",
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    excel_upload: {
                        $concat: [imageUrl, "$excel_upload"],
                    },
                },
            },
        ])
        if (recordServiceMasterData) {
            return res.status(200).json({
                status: 200,
                message: "Record service master details successfully!",
                data: recordServiceMasterData,
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
 * Api is to used for the record_service_master data update in the DB collection.
 */
exports.updateRecordServiceMaster = [
    upload, async (req, res) => {
        try {
            const { id } = req.params;
            const { sale_booking_id, sales_service_master_id, amount, no_of_hours, goal, day, quantity, brand_name, hashtag,
                individual_amount, start_date, end_date, per_month_amount, no_of_creators, deliverables_info, remarks,
                sale_executive_id, created_by, last_updated_by } = req.body;
            const recordServiceMasterData = await recordServiceMasterModel.findOne({ _id: id });
            if (!recordServiceMasterData) {
                return res.send("Invalid record_Service_master Id...");
            }
            if (req.files) {
                recordServiceMasterData.excel_upload = req.files["excel_upload"] ? req.files["excel_upload"][0].filename : recordServiceMasterData.excel_upload;
            }
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            if (req.files?.excel_upload && req.files?.excel_upload[0].originalname) {
                const blob1 = bucket.file(req.files.excel_upload[0].originalname);
                recordServiceMasterData.excel_upload = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => {
                });
                blobStream1.end(req.files.excel_upload[0].buffer);
            }
            await recordServiceMasterData.save();
            const recordServiceMasterUpdated = await recordServiceMasterModel.findOneAndUpdate({ _id: id }, {
                $set: {
                    sale_booking_id,
                    sales_service_master_id,
                    amount,
                    no_of_hours,
                    goal,
                    day,
                    quantity,
                    brand_name,
                    hashtag,
                    individual_amount,
                    start_date,
                    end_date,
                    no_of_creators,
                    deliverables_info,
                    per_month_amount,
                    sale_executive_id,
                    remarks,
                    created_by,
                    last_updated_by
                },
            },
                { new: true }
            );
            return res.status(200).json({
                message: "Record service master data updated successfully!",
                data: recordServiceMasterUpdated,
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message ? error.message : message.ERROR_MESSAGE,
            });
        }
    }];

exports.getRecordServiceMasterList = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const recordServiceMasterList = await recordServiceMasterModel.aggregate([
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
                    sale_booking_id: 1,
                    sales_service_master_id: 1,
                    amount: 1,
                    no_of_hours: 1,
                    goal: 1,
                    day: 1,
                    quantity: 1,
                    brand_name: 1,
                    hashtag: 1,
                    individual_amount: 1,
                    start_date: 1,
                    end_date: 1,
                    per_month_amount: 1,
                    no_of_creators: 1,
                    deliverables_info: 1,
                    remarks: 1,
                    sale_executive_id: 1,
                    sale_executive_by_id: "$user.user_id",
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    excel_upload: {
                        $concat: [imageUrl, "$excel_upload"],
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
                    salesservicemasters: {
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
        if (recordServiceMasterList) {
            return res.status(200).json({
                status: 200,
                message: "Record service master details list successfully!",
                data: recordServiceMasterList,
            });
        }
        return res.status(404).json({
            status: 404,
            message: message.DATA_NOT_FOUND,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};


/**
 * Api is to used for the reocrd_service_master data delete in the DB collection.
 */
exports.deleteRecordServiceMaster = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const recordServiceMasterDelete = await recordServiceMasterModel.findOne({ _id: id });
        if (!recordServiceMasterDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await recordServiceMasterModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Record service master data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};