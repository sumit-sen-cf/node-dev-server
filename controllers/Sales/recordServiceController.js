const multer = require("multer");
const salesRecordServiceModel = require("../../models/Sales/recordServiceModel.js");
const { uploadImage, deleteImage, moveImage } = require("../../common/uploadImage.js");
const response = require("../../common/response.js");
const constant = require("../../common/constant.js");

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
        const recordServiceDetail = await salesRecordServiceModel.findOne({
            _id: id,
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

        // Calculate the number of records to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;

        let addFieldsObj = {
            $addFields: {
                excel_upload_url: {
                    $cond: {
                        if: { $ne: ["$excel_upload", ""] },
                        then: {
                            $concat: [
                                constant.GCP_SALES_RECORD_SERVICE_FOLDER_URL,
                                "/",
                                "$excel_upload",
                            ],
                        },
                        else: "$excel_upload",
                    },
                },
            },
        };

        const pipeline = [addFieldsObj];

        if (page && limit) {
            pipeline.push(
                { $skip: skip },
                { $limit: limit }
            );
        }
        const recordServiceList = await salesRecordServiceModel.aggregate(pipeline);
        const recordServiceCount = await salesRecordServiceModel.countDocuments(addFieldsObj);

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
        const { updated_by } = req.body;
        const saleBookingId = Number(req.params.id);

        //Record service details obj add in array
        if (recordServiceDetails.length && Array.isArray(recordServiceDetails)) {
            for (let element of recordServiceDetails) {
                if (element?._id) {
                    // Existing document: update it
                    element.updated_by = updated_by;
                    await salesRecordServiceModel.updateOne({
                        _id: element._id
                    }, {
                        $set: element
                    });
                } else {
                    // New document: insert it
                    element.created_by = updated_by;
                    element.sale_booking_id = saleBookingId;
                    await salesRecordServiceModel.create(element);
                }
            }
        }
        //send success response
        return res.status(200).json({
            status: 200,
            message: "Record Services multiple data updated successfully!",
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
}