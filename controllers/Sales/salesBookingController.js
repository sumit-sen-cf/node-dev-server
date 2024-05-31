const response = require("../../common/response");
const vari = require("../../variables");
const multer = require("multer");
const { storage } = require('../../common/uploadFile');
const salesBookingStatus = require('../../models/SMS/salesBookingStatus');
const deleteSalesbookingModel = require("../../models/SMS/deleteSalesbookingModel");
const salesBookingModel = require("../../models/Sales/salesBookingModel");
const { uploadImage, deleteImage, moveImage } = require("../../common/uploadImage");
const constant = require("../../common/constant.js");
const pageStatesModel = require("../../models/PMS2/pageStatesModel.js");

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "record_service_file", maxCount: 1 },
]);

/**
 * Api is to used for the sales booking data add in the DB collection.
 */

exports.addSalesBooking = [
    upload, async (req, res) => {
        try {
            //sales Booking data obj create 
            const createSaleBooking = new salesBookingModel({
                account_id: req.body.account_id,
                sale_booking_date: req.body.sale_booking_date,
                campaign_amount: req.body.campaign_amount,
                campaign_name: req.body.campaign_name,
                brand_id: req.body.brand_id,
                base_amount: req.body.base_amount,
                gst_amount: req.body.gst_amount,
                description: req.body.description,
                credit_approval_status: req.body.credit_approval_status,
                reason_credit_approval: req.body.reason_credit_approval,
                reason_credit_approval_own_reason: req.body.reason_credit_approval_own_reason || "",
                balance_payment_ondate: req.body.balance_payment_ondate,
                gst_status: req.body.gst_status,
                tds_status: req.body.tds_status,
                Booking_close_date: req.body.Booking_close_date,
                tds_verified_amount: req.body.tds_verified_amount,
                tds_verified_remark: req.body.tds_verified_remark,
                booking_remarks: req.body.booking_remarks,
                incentive_status: req.body.incentive_status,
                payment_credit_status: req.body.payment_credit_status,
                booking_status: req.body.booking_status,
                incentive_sharing_user_id: req.body.incentive_sharing_user_id,
                incentive_sharing_percent: req.body.incentive_sharing_percent,
                bad_debt: req.body.bad_debt,
                bad_debt_reason: req.body.bad_debt_reason,
                no_badge_achivement: req.body.no_badge_achivement,
                old_sale_booking_id: req.body.old_sale_booking_id,
                sale_booking_type: req.body.sale_booking_type,
                service_taken_amount: req.body.service_taken_amount,
                get_incentive_status: req.body.get_incentive_status,
                incentive_amount: req.body.incentive_amount,
                earned_incentive_amount: req.body.earned_incentive_amount,
                unearned_incentive_amount: req.body.unearned_incentive_amount,
                payment_type: req.body.payment_type,
                final_invoice: req.body.final_invoice,
                created_by: req.body.created_by,
            })

            // Define the image fields 
            const imageFields = {
                record_service_file: 'RecordServicesFile',
            };
            for (const [field] of Object.entries(imageFields)) {            //itreates 
                if (req.files[field] && req.files[field][0]) {
                    createSaleBooking[field] = await uploadImage(req.files[field][0], "SalesRecordServiceFiles");
                }
            }

            //save data in the collection
            const saleBookingAdded = await createSaleBooking.save();

            //success response send
            return response.returnTrue(200, req, res, "Sales Booking Created Successfully", saleBookingAdded);
        } catch (err) {
            return response.returnFalse(500, req, res, err.message, {});
        }
    }];

/**
 * Api is to used for the sales booking data update in the DB collection.
 */
exports.editSalesBooking = [
    upload, async (req, res) => {
        try {
            const { id } = req.params;

            const updateData = {
                account_id: req.body.account_id,
                sale_booking_date: req.body.sale_booking_date,
                campaign_amount: req.body.campaign_amount,
                campaign_name: req.body.campaign_name,
                brand_id: req.body.brand_id,
                base_amount: req.body.base_amount,
                gst_amount: req.body.gst_amount,
                description: req.body.description,
                credit_approval_status: req.body.credit_approval_status,
                reason_credit_approval: req.body.reason_credit_approval,
                reason_credit_approval_own_reason: req.body.reason_credit_approval_own_reason || "",
                balance_payment_ondate: req.body.balance_payment_ondate,
                gst_status: req.body.gst_status,
                tds_status: req.body.tds_status,
                Booking_close_date: req.body.Booking_close_date,
                tds_verified_amount: req.body.tds_verified_amount,
                tds_verified_remark: req.body.tds_verified_remark,
                booking_remarks: req.body.booking_remarks,
                incentive_status: req.body.incentive_status,
                payment_credit_status: req.body.payment_credit_status,
                booking_status: req.body.booking_status,
                incentive_sharing_user_id: req.body.incentive_sharing_user_id,
                incentive_sharing_percent: req.body.incentive_sharing_percent,
                bad_debt: req.body.bad_debt,
                bad_debt_reason: req.body.bad_debt_reason,
                no_badge_achivement: req.body.no_badge_achivement,
                old_sale_booking_id: req.body.old_sale_booking_id,
                sale_booking_type: req.body.sale_booking_type,
                service_taken_amount: req.body.service_taken_amount,
                get_incentive_status: req.body.get_incentive_status,
                incentive_amount: req.body.incentive_amount,
                earned_incentive_amount: req.body.earned_incentive_amount,
                unearned_incentive_amount: req.body.unearned_incentive_amount,
                payment_type: req.body.payment_type,
                final_invoice: req.body.final_invoice,
                created_by: req.body.created_by,
            };

            // Fetch the old document and update it
            const updatedSalesBooking = await salesBookingModel.findByIdAndUpdate({ _id: id }, updateData, { new: true });

            if (!updatedSalesBooking) {
                return response.returnFalse(404, req, res, `Sales booking data not found`, {});
            }

            // Define the image fields 
            const imageFields = {
                record_service_file: 'RecordServicesFile',
            };

            // Remove old images not present in new data and upload new images
            for (const [fieldName] of Object.entries(imageFields)) {
                if (req.files && req.files[fieldName] && req.files[fieldName][0]) {

                    // Delete old image if present
                    if (updatedSalesBooking[fieldName]) {
                        await deleteImage(`SalesRecordServiceFiles/${updatedSalesBooking[fieldName]}`);
                    }
                    // Upload new image
                    updatedSalesBooking[fieldName] = await uploadImage(req.files[fieldName][0], "SalesRecordServiceFiles");
                }
            }
            // Save the updated document with the new image URLs
            await updatedSalesBooking.save();

            return response.returnTrue(200, req, res, "Sales booking data updated successfully!", updatedSalesBooking);
        } catch (error) {
            return response.returnFalse(500, req, res, `${error.message}`, {});
        }
    }];

/**
 * Api is to get all the sales booking data from DB collection.
 */

exports.getAllSalesBooking = async (req, res) => {
    try {
        const page = (req.query.page && parseInt(req.query.page)) || null;
        const limit = (req.query.limit && parseInt(req.query.limit)) || null;
        const skip = (page && limit) ? (page - 1) * limit : 0;
        let saleBookingList;

        let matchQuery = {
            status: { $ne: constant.DELETED }
        };
        let addFieldsObj = {
            $addFields: {
                record_service_file_url: {
                    $cond: {
                        if: { $ne: ["$record_service_file", ""] },
                        then: {
                            $concat: [
                                constant.GCP_VENDOR_FOLDER_URL,
                                "/",
                                "$record_service_file",
                            ],
                        },
                        else: "$record_service_file",
                    },
                },
            },
        };

        const pipeline = [{ $match: matchQuery }, addFieldsObj];

        if (page && limit) {
            pipeline.push(
                { $skip: skip },
                { $limit: limit }
            );
        }

        saleBookingList = await salesBookingModel.aggregate(pipeline);
        const salesBookingCount = await salesBookingModel.countDocuments(matchQuery);

        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Sales booking list retreive successfully!",
            saleBookingList,
            {
                start_record: skip + 1,
                end_record: skip + saleBookingList.length,
                total_records: salesBookingCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(salesBookingCount / limit) : 1,
            }
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

/**
 * Api is to get Id sales booking data from DB collection.
 */
exports.getSingleSalesBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const salesBookingDetail = await salesBookingModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!salesBookingDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Page states details retrive successfully!",
            salesBookingDetail
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

/**
 * Api is to delete sales booking data from DB collection.
 */
exports.deleteSalesBooking = [upload, async (req, res) => {
    try {
        const salesBookingData = await salesBookingModel.findById(req.params.id);
        if (!salesBookingData) {
            return res.status(404).json({ success: false, message: 'Sales Booking Data not found' });
        }

        // Create a new instance of deleteSalesbookingModel with data from salesBookingData
        const addNewDeletedData = new deleteSalesbookingModel({
            account_id: salesBookingData.account_id,
            sale_booking_date: salesBookingData.sale_booking_date,
            campaign_amount: salesBookingData.campaign_amount,
            campaign_name: salesBookingData.campaign_name,
            brand_id: salesBookingData.brand_id,
            base_amount: salesBookingData.base_amount,
            gst_amount: salesBookingData.gst_amount,
            description: salesBookingData.description,
            credit_approval_status: salesBookingData.credit_approval_status,
            reason_credit_approval: salesBookingData.reason_credit_approval,
            reason_credit_approval_own_reason: salesBookingData.reason_credit_approval_own_reason || "",
            balance_payment_ondate: salesBookingData.balance_payment_ondate,
            gst_status: salesBookingData.gst_status,
            tds_status: salesBookingData.tds_status,
            Booking_close_date: salesBookingData.Booking_close_date,
            tds_verified_amount: salesBookingData.tds_verified_amount,
            tds_verified_remark: salesBookingData.tds_verified_remark,
            booking_remarks: salesBookingData.booking_remarks,
            incentive_status: salesBookingData.incentive_status,
            payment_credit_status: salesBookingData.payment_credit_status,
            booking_status: salesBookingData.booking_status,
            incentive_sharing_user_id: salesBookingData.incentive_sharing_user_id,
            incentive_sharing_percent: salesBookingData.incentive_sharing_percent,
            bad_debt: salesBookingData.bad_debt,
            bad_debt_reason: salesBookingData.bad_debt_reason,
            no_badge_achivement: salesBookingData.no_badge_achivement,
            old_sale_booking_id: salesBookingData.old_sale_booking_id,
            sale_booking_type: salesBookingData.sale_booking_type,
            service_taken_amount: salesBookingData.service_taken_amount,
            get_incentive_status: salesBookingData.get_incentive_status,
            incentive_amount: salesBookingData.incentive_amount,
            earned_incentive_amount: salesBookingData.earned_incentive_amount,
            unearned_incentive_amount: salesBookingData.unearned_incentive_amount,
            payment_type: salesBookingData.payment_type,
            final_invoice: salesBookingData.final_invoice,
            deleted_by: salesBookingData.deleted_by,
            record_service_file: salesBookingData.record_service_file,
            // Add any additional fields that may be necessary
        });

        if (salesBookingData && salesBookingData.record_service_file) {
            // Move the uploaded file to the 'DeletedSalesRecordService' directory
            await moveImage("SalesRecordServiceFiles", "DeletedSalesRecordService", salesBookingData.record_service_file);
        }
        // Save the new deleted data record
        await addNewDeletedData.save();
        // Delete the sales booking record
        await salesBookingModel.deleteOne({ _id: req.params.id });

        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Page states deleted successfully!",
            addNewDeletedData,
        )
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}];

/**
 * Api is to get_delete_sales_booking data from DB collection.
 */
exports.getNewSalesBooking = async (req, res) => {
    try {
        const newDeleteSalesBokingData = await deleteSalesbookingModel.aggregate([
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "createdUserData",
                },
            }, {
                $unwind: {
                    path: "$createdUserData",
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $lookup: {
                    from: "usermodels",
                    localField: "updated_by",
                    foreignField: "user_id",
                    as: "lastUpdatedUserData",
                },
            }, {
                $unwind: {
                    path: "$lastUpdatedUserData",
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $lookup: {
                    from: "accountMasterModel",
                    localField: "account_id",
                    foreignField: "account_id",
                    as: "accountMasterData",
                },
            }, {
                $unwind: {
                    path: "$accountMasterData",
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $project: {
                    account_id: 1,
                    account_name: "$accountMasterData.account_name",
                    sale_booking_date: 1,
                    campaign_amount: 1,
                    campaign_name: 1,
                    brand_id: 1,
                    base_amount: 1,
                    gst_amount: 1,
                    description: 1,
                    credit_approval_status: 1,
                    reason_credit_approval: 1,
                    reason_credit_approval_own_reason: 1,
                    balance_payment_ondate: 1,
                    gst_status: 1,
                    tds_status: 1,
                    Booking_close_date: 1,
                    tds_verified_amount: 1,
                    tds_verified_remark: 1,
                    booking_remarks: 1,
                    incentive_status: 1,
                    payment_credit_status: 1,
                    booking_status: 1,
                    incentive_sharing_user_id: 1,
                    incentive_sharing_percent: 1,
                    bad_debt: 1,
                    bad_debt_reason: 1,
                    no_badge_achivement: 1,
                    old_sale_booking_id: 1,
                    sale_booking_type: 1,
                    service_taken_amount: 1,
                    get_incentive_status: 1,
                    incentive_amount: 1,
                    earned_incentive_amount: 1,
                    unearned_incentive_amount: 1,
                    payment_type: 1,
                    final_invoice: 1,
                    created_by: 1,
                    created_by_name: "$createdUserData.user_name",
                    updated_by: 1,
                    updated_by_name: "$lastUpdatedUserData.user_name",
                    createdAt: 1,
                    updatedAt: 1
                }
            }]);

        //if data not found
        if (!newDeleteSalesBokingData) {
            return response.returnFalse(200, req, res, "No Reord Found...", []);
        }

        //success response send
        return response.returnTrue(200, req, res, "deleted Sales Booking all data fatched Successfully", newDeleteSalesBokingData);
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
}

/**
 * Api is to get all the pending, approved, rejected requested for creadit approval data list get from DB collection.
 */
exports.getAllStatusForCreditApprovalSalesBookingList = async (req, res) => {
    try {
        let status = req.query?.status;

        //get all data in DB collection
        const SalesBookingData = await salesBooking.aggregate([{
            $match: {
                payment_credit_status: "sent_for_credit_approval",
                credit_approval_status: status,
            }
        }, {
            $lookup: {
                from: "usermodels",
                localField: "created_by",
                foreignField: "user_id",
                as: "createdUserData",
            }
        }, {
            $unwind: {
                path: "$createdUserData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "accountMasterModel",
                localField: "account_id",
                foreignField: "account_id",
                as: "accountMasterData",
            }
        }, {
            $unwind: {
                path: "$accountMasterData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "salesbookingpayments",
                localField: "sale_booking_id",
                foreignField: "sale_booking_id",
                as: "salesbookingpaymentsData",
            }
        }, {
            $unwind: {
                path: "$salesbookingpaymentsData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "reasoncreditapprovals",
                localField: "reason_credit_approval",
                foreignField: "_id",
                as: "reasoncreditapprovalData",
            }
        }, {
            $unwind: {
                path: "$reasoncreditapprovalData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $project: {
                sale_booking_date: 1,
                campaign_amount: 1,
                description: 1,
                credit_approval_status: 1,
                reason_credit_approval: 1,
                reason_credit_approval_name: "$reasoncreditapprovalData.reason",
                reason_credit_approval_own_reason: 1,
                balance_payment_ondate: 1,
                payment_credit_status: 1,
                booking_status: 1,
                sale_booking_id: 1,
                account_id: 1,
                account_name: "$accountMasterData.account_name",
                created_by: 1,
                created_by_name: "$createdUserData.user_name",
                createdAt: 1,
                updatedAt: 1,
                salesbookingpaymentsData: "$salesbookingpaymentsData"
            }
        }, {
            $group: {
                _id: "$sale_booking_id",
                sale_booking_date: { $first: "$sale_booking_date" },
                campaign_amount: { $first: "$campaign_amount" },
                description: { $first: "$description" },
                credit_approval_status: { $first: "$credit_approval_status" },
                reason_credit_approval: { $first: "$reason_credit_approval" },
                reason_credit_approval_name: { $first: "$reason_credit_approval_name" },
                reason_credit_approval_own_reason: { $first: "$reason_credit_approval_own_reason" },
                balance_payment_ondate: { $first: "$balance_payment_ondate" },
                payment_credit_status: { $first: "$payment_credit_status" },
                booking_status: { $first: "$booking_status" },
                sale_booking_id: { $first: "$sale_booking_id" },
                account_id: { $first: "$account_id" },
                account_name: { $first: "$account_name" },
                created_by: { $first: "$created_by" },
                created_by_name: { $first: "$created_by_name" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                paid_amount: {
                    $sum: {
                        $cond: [{
                            $eq: ["$salesbookingpaymentsData.payment_approval_status", "approved"]
                        }, "$salesbookingpaymentsData.payment_amount", 0]
                    }
                }
            }
        }]);

        //if data not found
        if (!SalesBookingData) {
            return response.returnFalse(200, req, res, "No Reord Found...", []);
        }
        //success response send
        return response.returnTrue(200, req, res, "Credit approval Sales Booking Status data fatched", SalesBookingData);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

/**
 * Api is to update credit approval status change in sales booking data in DB collection.
 */
exports.editCreditApprovalStatusChange = async (req, res) => {
    try {
        //get sale booking id
        let saleBookingId = req.params?.id;

        //if not found then error return
        if (!saleBookingId) {
            return response.returnFalse(200, req, res, "Sale Booking Id is required...", []);
        }

        //status change in sale booking collection.
        await salesBooking.updateOne({
            sale_booking_id: Number(saleBookingId),
            credit_approval_status: "pending"
        }, {
            credit_approval_status: req.body.status,
            credit_approval_by: parseInt(req.body.approved_by),
        });

        //success response send
        return response.returnTrue(200, req, res, "Sales Booking Credit Approval Status update Successfully");
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

/**
 * Api is to used for the sales booking status data add in the DB collection.
 */
exports.addSalesBookingStatus = async (req, res) => {
    try {
        //salesBookingStatus data obj create 
        const simc = new salesBookingStatus({
            status_name: req.body.status_name,
            status_desc: req.body.status_desc,
            status_type: req.body.status_type,
            status_order: req.body.status_order
        })

        //save data in the collection
        const simv = await simc.save();

        //success response send
        return response.returnTrue(200, req, res, "Sales Booking Status Created Successfully", simv);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};


exports.getSalesBookingPaymentDetail = async (req, res) => {
    try {
        const salesBookingGetData = await salesBooking.aggregate([
            {
                $match: {
                    sale_booking_id: Number(req.params.id)
                }
            },
            {
                $lookup: {
                    from: "accountMasterModel",
                    localField: "account_id",
                    foreignField: "account_id",
                    as: "accountMasterData",
                },
            },
            {
                $unwind: {
                    path: "$accountMasterData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    account_id: 1,
                    sale_booking_date: 1,
                    campaign_amount: 1,
                    base_amount: 1,
                    gst_amount: 1,
                    description: 1,
                    credit_approval_status: 1,
                    reason_credit_approval: 1,
                    reason_credit_approval_own_reason: 1,
                    balance_payment_ondate: 1,
                    gst_status: 1,
                    tds_status: 1,
                    Booking_close_date: 1,
                    tds_verified_amount: 1,
                    tds_verified_remark: 1,
                    booking_remarks: 1,
                    incentive_status: 1,
                    payment_credit_status: 1,
                    booking_status: 1,
                    incentive_sharing_user_id: 1,
                    incentive_sharing_percent: 1,
                    bad_debt: 1,
                    bad_debt_reason: 1,
                    no_badge_achivement: 1,
                    old_sale_booking_id: 1,
                    sale_booking_id: 1,
                    sale_booking_type: 1,
                    service_taken_amount: 1,
                    get_incentive_status: 1,
                    incentive_amount: 1,
                    earned_incentive_amount: 1,
                    unearned_incentive_amount: 1,
                    payment_type: 1,
                    final_invoice: 1,
                    created_by: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    account_master_data: {
                        _id: "$accountMasterData._id",
                        account_name: "$accountMasterData.account_name",
                        account_id: "$accountMasterData.account_id"
                    }
                },
            },
        ])
        if (salesBookingGetData) {
            return res.status(200).json({
                status: 200,
                message: "Sales booking all payment details successfully!",
                data: salesBookingGetData,
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
}


