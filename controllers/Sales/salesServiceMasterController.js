const { message } = require("../../common/message")
const mongoose = require("mongoose");
const salesServiceMasterModel = require("../../models/Sales/salesServiceMasterModel");
const response = require("../../common/response");
const constant = require("../../common/constant");

/**
 * Api is to used for the sales_service_master data add in the DB collection.
 */
exports.createSalesServiceMaster = async (req, res) => {
    try {
        const { service_name, post_type, amount_status, no_of_hours_status, goal_status, day_status,
            quantity_status, brand_name_status, hashtag, indiviual_amount_status, start_end_date_status,
            per_month_amount_status, no_of_creators, deliverables_info, remarks, created_by } = req.body;
        const addSalesServiceMaster = await salesServiceMasterModel.create({
            service_name: service_name,
            post_type: post_type,
            amount_status: amount_status,
            // is_excel_upload: is_excel_upload,
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
        });
        return response.returnTrue(
            200,
            req,
            res,
            "Sales booking details retrive successfully!",
            addSalesServiceMaster
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the sales_service_master data get_ByID in the DB collection.
 */
exports.getServiceMasterDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const serviceMasterDetail = await salesServiceMasterModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!serviceMasterDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Sales service master details retrive successfully!",
            serviceMasterDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the sales_service_master data update in the DB collection.
 */
exports.updateSalesServiceMaster = async (req, res) => {
    try {
        const { id } = req.params;
        const { service_name, post_type, amount_status, no_of_hours_status, goal_status, day_status,
            quantity_status, brand_name_status, hashtag, indiviual_amount_status, start_end_date_status,
            per_month_amount_status, no_of_creators, deliverables_info, remarks, status, updated_by } = req.body;
        const serviceMasterUpdated = await salesServiceMasterModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                service_name,
                post_type,
                amount_status,
                // is_excel_upload,
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
                status,
                updated_by
            },
        },
            { new: true }
        );
        return response.returnTrue(
            200,
            req,
            res,
            "Service master update successfully!",
            serviceMasterUpdated
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};


/**
 * Api is to used for the sales_service_master data get_list in the DB collection.
 */
exports.getServiceMasterList = async (req, res) => {
    try {
        const page = req.query?.page ? parseInt(req.query.page) : null;
        const limit = req.query?.limit ? parseInt(req.query.limit) : null;
        const skip = (page && limit) ? (page - 1) * limit : 0;
        const sort = { createdAt: -1 };

        const serviceMasterList = await salesServiceMasterModel.find({
            status: {
                $ne: constant.DELETED
            }
        }).skip(skip).limit(limit).sort(sort);
        const serviceMasterCount = await salesServiceMasterModel.countDocuments();

        if (serviceMasterList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Sales service list retrieved successfully!",
            serviceMasterList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + serviceMasterList.length : serviceMasterList.length,
                total_records: serviceMasterCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(serviceMasterCount / limit) : 1,
            }
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the sales_service_master data delete in the DB collection.
 */
exports.deleteServiceMaster = async (req, res) => {
    try {
        const { id } = req.params;
        const serviceMasterDeleted = await salesServiceMasterModel.findOneAndUpdate({
            _id: id,
            status: { $ne: constant.DELETED }
        },
            {
                $set: {
                    status: constant.DELETED,
                },
            },
            { new: true }
        );
        if (!serviceMasterDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            `Service master deleted successfully id ${id}`,
            serviceMasterDeleted
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};