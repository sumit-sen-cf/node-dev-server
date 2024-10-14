const multer = require("multer");
const response = require("../../common/response.js");
const constant = require("../../common/constant.js");
const salesBookingModel = require("../../models/Sales/salesBookingModel");
const salesRecordServiceModel = require("../../models/Sales/recordServiceModel.js");
const { uploadImage, deleteImage, moveImage } = require("../../common/uploadImage.js");
const { getIncentiveAmountRecordServiceWise, calculateIncentiveSharingUserWise,
    incentiveSharingDataCopy, uniqueUserIdsWithIncentiveAmountAdd
} = require("../../helper/functions.js");

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "excel_upload", maxCount: 10 }
]);

exports.createRecordServiceMaster = [
    upload, async (req, res) => {
        try {
            const addRecordServiceMaster = new salesRecordServiceModel({
                sale_booking_id: req.body.sale_booking_id,
                sales_service_master_id: req.body.sales_service_master_id,
                amount: req.body.amount,
                no_of_hours: req.body.no_of_hours,
                goal: req.body.goal,
                day: req.body.day,
                quantity: req.body.quantity,
                brand_name: req.body.brand_name,
                hashtag: req.body.hashtag,
                individual_amount: req.body.individual_amount,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                per_month_amount: req.body.per_month_amount,
                no_of_creators: req.body.no_of_creators,
                deliverables_info: req.body.deliverables_info,
                remarks: req.body.remarks,
                sale_executive_id: req.body.sale_executive_id,
                created_by: req.body.created_by,
            });
            // Define the image fields 
            const imageFields = {
                excel_upload: 'ExcelUploadFile',
            };
            for (const [field] of Object.entries(imageFields)) {            //itreates 
                if (req.files[field] && req.files[field][0]) {
                    addRecordServiceMaster[field] = await uploadImage(req.files[field][0], "SalesRecordServiceFiles");
                }
            }
            await addRecordServiceMaster.save();
            // Return a success response with the updated record details
            return response.returnTrue(200, req, res, "Sales record service created successfully", addRecordServiceMaster);

        } catch (err) {
            // Return an error response in case of any exceptions
            return response.returnFalse(500, req, res, err.message, {});
        }
    }];

exports.getRecordServiceMasterDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const recordServiceDetail = await salesRecordServiceModel.find({
            sale_booking_id: id,
            status: { $ne: constant.DELETED },
        });
        if (!recordServiceDetail) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Sales record service details retrive successfully!",
            recordServiceDetail
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the record_service_master data update in the DB collection.
 */
exports.updateRecordServiceMaster = [
    upload, async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = {
                sale_booking_id: req.body.sale_booking_id,
                sales_service_master_id: req.body.sales_service_master_id,
                amount: req.body.amount,
                no_of_hours: req.body.no_of_hours,
                goal: req.body.goal,
                day: req.body.day,
                quantity: req.body.quantity,
                brand_name: req.body.brand_name,
                hashtag: req.body.hashtag,
                individual_amount: req.body.individual_amount,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                per_month_amount: req.body.per_month_amount,
                no_of_creators: req.body.no_of_creators,
                deliverables_info: req.body.deliverables_info,
                remarks: req.body.remarks,
                updated_by: req.body.updated_by,
            };

            // Fetch the old document and update it
            const updatedRecordService = await salesRecordServiceModel.findByIdAndUpdate({ _id: id }, updateData, { new: true });

            if (!updatedRecordService) {
                return response.returnFalse(404, req, res, `Record service data not found`, {});
            }

            // Define the image fields 
            const imageFields = {
                excel_upload: 'ExcelUploadFile',
            };

            // Remove old images not present in new data and upload new images
            for (const [fieldName] of Object.entries(imageFields)) {
                if (req.files && req.files[fieldName] && req.files[fieldName][0]) {

                    // Delete old image if present
                    if (updatedRecordService[fieldName]) {
                        await deleteImage(`SalesRecordServiceFiles/${updatedRecordService[fieldName]}`);
                    }
                    // Upload new image
                    updatedRecordService[fieldName] = await uploadImage(req.files[fieldName][0], "SalesRecordServiceFiles");
                }
            }
            // Save the updated document with the new image URLs
            await updatedRecordService.save();

            // Return a success response with the updated record details
            return response.returnTrue(200, req, res, "Record service data updated successfully!", updatedRecordService);
        } catch (error) {
            // Return an error response in case of any exceptions
            return response.returnFalse(500, req, res, `${error.message}`, {});
        }
    }];

exports.getRecordServiceMasterList = async (req, res) => {
    try {
        // Extract page and limit from query parameters, default to null if not provided
        const page = req.query?.page ? parseInt(req.query.page) : null;
        const limit = req.query?.limit ? parseInt(req.query.limit) : null;
        const sort = { createdAt: -1 };

        // Calculate the number of records to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;

        //for match conditions
        let matchQuery = {};
        if (req.query?.userId) {
            matchQuery["created_by"] = Number(req.query.userId);
        }

        const pipeline = [{
            $match: matchQuery
        }, {
            $lookup: {
                from: "usermodels",
                localField: "sale_executive_id",
                foreignField: "user_id",
                as: "userData",
            }
        }, {
            $unwind: {
                path: "$userData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "salesbookingmodels",
                localField: "sale_booking_id",
                foreignField: "sale_booking_id",
                as: "salesBookingData",
            }
        }, {
            $unwind: {
                path: "$salesBookingData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "accountmastermodels",
                localField: "salesBookingData.account_id",
                foreignField: "account_id",
                as: "accountData",
            }
        }, {
            $unwind: {
                path: "$accountData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "salesservicemastermodels",
                localField: "sales_service_master_id",
                foreignField: "_id",
                as: "salesServiceMasterData",
            }
        }, {
            $unwind: {
                path: "$salesServiceMasterData",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $project: {
                sale_booking_id: 1,
                account_id: 1,
                account_name: "$accountData.account_name",
                sale_executive_id: 1,
                sale_executive_name: "$userData.user_name",
                sales_service_master_id: 1,
                sales_service_master_name: "$salesServiceMasterData.service_name",
                campaign_name: "$salesBookingData.campaign_name",
                campaign_amount: "$salesBookingData.campaign_amount",
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
                created_by: 1,
                updated_by: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        }, {
            $sort: sort
        }];

        if (page && limit) {
            pipeline.push(
                { $skip: skip },
                { $limit: limit },
            );
        }
        const recordServiceList = await salesRecordServiceModel.aggregate(pipeline);
        const recordServiceCount = await salesRecordServiceModel.countDocuments(matchQuery);

        // Return a success response with the list of records and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Record service list retreive successfully!",
            recordServiceList,
            {
                start_record: skip + 1,
                end_record: skip + recordServiceList.length,
                total_records: recordServiceCount,
                current_page: page || 1,
                total_page: (page && limit) ? Math.ceil(recordServiceCount / limit) : 1,
            }
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the reocrd_service_master data delete in the DB collection.
 */
exports.deleteRecordServiceMaster = async (req, res) => {
    try {
        const { id } = req.params;
        const recordServiceDeleted = await salesRecordServiceModel.findOneAndUpdate({
            _id: id, status: { $ne: constant.DELETED }
        },
            {
                $set: {
                    status: constant.DELETED,
                },
            },
            { new: true }
        );
        if (!recordServiceDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            `Record service deleted successfully id ${id}`,
            recordServiceDeleted
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

/**
 * Api is to used for multiple update_record service data in the DB collection.
 */
exports.updateMultipleRecordService = async (req, res) => {
    try {
        // get record service data from body
        let recordServiceDetails = (req.body?.record_services) || [];
        let copyRecordServicesDetails = JSON.parse(JSON.stringify(req.body?.record_services || []));

        const { old_sales_booking_created_by, updated_by } = req.body;
        const saleBookingId = Number(req.params.id);

        // Get distinct IDs from the database
        const distinctIds = await salesRecordServiceModel.distinct('_id', {
            sale_booking_id: saleBookingId
        });

        // Create a set of IDs from recordServiceDetails
        const documentIds = new Set(recordServiceDetails?.map(doc => doc?._id));

        // Delete documents that are not included in accountPocDetails
        for (let id of distinctIds) {
            if (!documentIds.has(id.toString())) {
                // await salesRecordServiceModel.deleteOne({ _id: id });
                const recordServiceDeleted = await salesRecordServiceModel.findOneAndUpdate({
                    _id: id,
                    status: {
                        $ne: constant.DELETED
                    }
                }, {
                    $set: {
                        status: constant.DELETED,
                    }
                }, {
                    new: true
                });
            }
        }

        let totalIncentiveAmount = 0;
        let totalRecordServiceAmount = 0;
        const recordServiceCounts = (recordServiceDetails && recordServiceDetails.length) ? recordServiceDetails.length : 0;
        //Record service details obj add in array
        if (recordServiceDetails.length && Array.isArray(recordServiceDetails)) {
            for (let element of recordServiceDetails) {
                delete element.incentive_sharing_users_array;
                delete element.service_percentage;
                if (element?._id) {
                    // Existing document: update it
                    element.updated_by = updated_by;
                    const updatedData = await salesRecordServiceModel.findByIdAndUpdate({
                        _id: element._id
                    }, {
                        $set: element
                    }, {
                        new: true
                    });

                    //record service wise incentive calculate
                    const incentiveAmount = await getIncentiveAmountRecordServiceWise(updatedData.sales_service_master_id, updatedData.amount);
                    totalIncentiveAmount += incentiveAmount;
                    totalRecordServiceAmount += updatedData.amount;
                } else {
                    // New document: insert it
                    element.created_by = updated_by;
                    element.updated_by = updated_by;
                    element.sale_booking_id = saleBookingId;
                    const createdData = await salesRecordServiceModel.create(element);

                    //record service wise incentive calculate
                    const incentiveAmount = await getIncentiveAmountRecordServiceWise(createdData.sales_service_master_id, createdData.amount);
                    totalIncentiveAmount += incentiveAmount;
                    totalRecordServiceAmount += createdData.amount;
                }
            }
        }

        let tempIncentiveAmount = 0;
        let sharedIncentiveDetailsArray = [];
        //account sharing percentage
        const accountPercentage = (req.body && req.body.account_percentage) ? req.body.account_percentage : 100;
        totalIncentiveAmount = (totalIncentiveAmount * accountPercentage) / 100;
        //multiple incentive sharing calculate and check.
        if (copyRecordServicesDetails.length && (req.body.is_incentive_sharing == true || req.body.is_incentive_sharing == 'true')) {
            for (let element of copyRecordServicesDetails) {
                //service to get incentive user's array.
                const incentiveSharingArrayDetails = (element && element.incentive_sharing_users_array) ? element.incentive_sharing_users_array : [];
                if (incentiveSharingArrayDetails.length && Array.isArray(incentiveSharingArrayDetails)) {
                    //service wise percentage calculation.
                    let totalServiceIncentiveAmount = (totalIncentiveAmount * element.service_percentage) / 100;
                    //User's wise Incentive Share distrbution.
                    const sharedIncentiveData = await calculateIncentiveSharingUserWise(incentiveSharingArrayDetails, totalServiceIncentiveAmount, old_sales_booking_created_by);
                    //Created by user's amount add with all services. 
                    tempIncentiveAmount += sharedIncentiveData.cretedByIncentiveShareAmount;
                    //User's wise incentive amount array merge with all services. 
                    sharedIncentiveDetailsArray = [...sharedIncentiveDetailsArray, ...sharedIncentiveData.sharedIncentiveDetailsArray];
                }
            }
            //All created by user's amount add in totalIncentiveAmount.
            totalIncentiveAmount = tempIncentiveAmount;
            //get unique user ids with incentive amount plus
            sharedIncentiveDetailsArray = await uniqueUserIdsWithIncentiveAmountAdd(sharedIncentiveDetailsArray);
        }

        //update incentive amount in sale booking collection
        await salesBookingModel.updateOne({
            sale_booking_id: saleBookingId
        }, {
            $set: {
                incentive_amount: totalIncentiveAmount,
                record_service_amount: totalRecordServiceAmount,
                record_service_counts: recordServiceCounts,
                unearned_incentive_amount: totalIncentiveAmount
            }
        })

        //Copy Sale Booking data in sharedIncentiveSaleBookingModel for incentive sharing
        if (req.body.is_incentive_sharing == true || req.body.is_incentive_sharing == 'true') {
            await incentiveSharingDataCopy(sharedIncentiveDetailsArray, saleBookingId);
        }

        //send success response
        return res.status(200).json({
            status: 200,
            message: "Record Services multiple data updated successfully!",
        })
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}