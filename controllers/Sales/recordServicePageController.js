const mongoose = require("mongoose");
const vari = require("../../variables.js");
const { message } = require("../../common/message");
const recordServicePagesModel = require("../../models/Sales/recordServicePageModel.js");

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
                    Sales_Booking: "$salesbooking",
                    salesservicemasters: "$salesservicemaster",
                    recordservicemaster: "$recordservicemaster"
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