const response = require("../../common/response");
const vari = require("../../variables");
const multer = require("multer");
const { storage } = require('../../common/uploadFile');
const salesBooking = require('../../models/SMS/salesBooking');
const salesBookingStatus = require('../../models/SMS/salesBookingStatus');

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "plan_file", maxCount: 1 },
]);

/**
 * Api is to used for the sales booking data add in the DB collection.
 */
exports.addSalesBooking = [upload, async (req, res) => {
    try {
        //sales Booking data obj create 
        const simc = new salesBooking({
            customer_id: req.body.customer_id,
            sale_booking_date: req.body.sale_booking_date,
            campaign_amount: req.body.campaign_amount,
            base_amount: req.body.base_amount,
            gst_amount: req.body.gst_amount,
            description: req.body.description,
            credit_approval_status: req.body.credit_approval_status,
            reason_credit_approval: req.body.reason_credit_approval,
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
            created_by: req.body.created_by,
            managed_by: req.body.managed_by,
            last_updated_by: req.body.last_updated_by,
            creation_date: req.body.creation_date,
            last_updated_date: req.body.last_updated_date
        })

        if (req.files && req.files.plan_file && req.files.plan_file[0].originalname) {
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);
            const blob1 = bucket.file(req.files.plan_file[0].originalname);
            simc.plan_file = blob1.name;
            const blobStream1 = blob1.createWriteStream();
            blobStream1.on("finish", () => { });
            blobStream1.end(req.files.plan_file[0].buffer);
        }

        //save data in the collection
        const simv = await simc.save();

        //success response send
        return response.returnTrue(200, req, res, "Sales Booking Created Successfully", simv);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}];

/**
 * Api is to used for the sales booking data update in the DB collection.
 */
exports.editSalesBooking = [upload, async (req, res) => {
    try {

        const existingSalesBooking = await salesBooking.findOne({ _id: req.params.id });

        if (!existingSalesBooking) {
            return res.status(404).send({ success: false, message: 'Sales Booking Data not found' });
        }

        //find by id and update data
        const editSalesBooking = await salesBooking.findOneAndUpdate({
            _id: req.params.id
        }, {
            customer_id: req.body.customer_id,
            sale_booking_date: req.body.sale_booking_date,
            campaign_amount: req.body.campaign_amount,
            base_amount: req.body.base_amount,
            gst_amount: req.body.gst_amount,
            description: req.body.description,
            credit_approval_status: req.body.credit_approval_status,
            reason_credit_approval: req.body.reason_credit_approval,
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
            plan_file: req.files && req.files?.plan_file && req.files?.plan_file[0] ? req.files?.plan_file[0].originalname : existingSalesBooking.plan_file,
            payment_type: req.body.payment_type,
            created_by: req.body.created_by,
            managed_by: req.body.managed_by,
            last_updated_by: req.body.last_updated_by,
            creation_date: req.body.creation_date,
            last_updated_date: req.body.last_updated_date
        }, {
            new: true
        });

        if (!editSalesBooking) {
            return res.status(500).send({ success: false })
        }

        if (req.files && req.files.plan_file && req.files.plan_file[0].originalname) {
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);
            const blob1 = bucket.file(req.files.plan_file[0].originalname);
            editSalesBooking.plan_file = blob1.name;
            const blobStream1 = blob1.createWriteStream();
            blobStream1.on("finish", () => { });
            blobStream1.end(req.files.plan_file[0].buffer);
        }

        //success response send
        return response.returnTrue(200, req, res, "Sales Booking updated Successfully", editSalesBooking);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}];

/**
 * Api is to get all the sales booking data from DB collection.
 */
exports.getAllSalesBooking = async (req, res) => {
    try {
        //get all data in DB collection
        const SalesBookingData = await salesBooking.aggregate([{
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
                localField: "managed_by",
                foreignField: "user_id",
                as: "managedUserData",
            },
        }, {
            $unwind: {
                path: "$managedUserData",
                preserveNullAndEmptyArrays: true,
            },

        }, {
            $lookup: {
                from: "usermodels",
                localField: "last_updated_by",
                foreignField: "user_id",
                as: "lastUpdatedUserData",
            },
        }, {
            $unwind: {
                path: "$lastUpdatedUserData",
                preserveNullAndEmptyArrays: true,
            },
        }, {
            $project: {
                customer_id: 1,
                sale_booking_date: 1,
                campaign_amount: 1,
                base_amount: 1,
                gst_amount: 1,
                description: 1,
                credit_approval_status: 1,
                reason_credit_approval: 1,
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
                created_by: 1,
                created_by_name: "$createdUserData.user_name",
                managed_by: 1,
                managed_by_name: "$managedUserData.user_name",
                last_updated_by: 1,
                last_updated_by_name: "$lastUpdatedUserData.user_name",
                creation_date: 1,
                last_updated_date: 1
            }
        }]);

        //if data not found
        if (!SalesBookingData) {
            return response.returnFalse(200, req, res, "No Reord Found...", []);
        }

        //success response send
        return response.returnTrue(200, req, res, "Sales Booking all data fatched Successfully", SalesBookingData);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

/**
 * Api is to get Id sales booking data from DB collection.
 */
exports.getSingleSalesBooking = async (req, res) => {
    try {
        //get data by id
        const SalesBookingData = await salesBooking.findOne({
            _id: req.params.id
        });

        //if not found then error return
        if (!SalesBookingData) {
            return response.returnFalse(200, req, res, "No Reord Found...", []);
        }

        //success response send
        return response.returnTrue(200, req, res, "Sales Booking Id data fatched Successfully", SalesBookingData);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

/**
 * Api is to delete sales booking data from DB collection.
 */
exports.deleteSalesBooking = async (req, res) => {
    //deleted data by id
    await salesBooking.deleteOne({
        _id: req.params.id
    }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'sales Booking Data deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'sales Booking Data not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
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