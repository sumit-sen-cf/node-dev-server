const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const pmsVendorMastModel = require('../../models/PMS/pmsVendorMastModel');
const multer = require("multer");
const vari = require("../../variables.js");
const { storage } = require('../../common/uploadFile.js')

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "upload_pan_image", maxCount: 1 },
    { name: "upload_gst_image", maxCount: 1 },
    { name: "upload_pan_image", maxCount: 1 },
    { name: "upload_gst_image", maxCount: 1 }
]);
//POST- TmsCatMast
exports.createPmsVendorMast = [
    upload, async (req, res) => {
        try {
            const panPattern = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
            const gstPattern = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}?$/;

            const checkDuplicacy = await pmsVendorMastModel.findOne({ vendorMast_name: req.body.vendorMast_name });
            if (checkDuplicacy) {
                return res.status(403).json({
                    status: 403,
                    message: "PMS vendore-mast alredy exist!",
                });
            }
            // Validate PAN format
            if (!panPattern.test(req.body.pan_no)) {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid PAN format! PAN should be in the format: ABCDE1234F",
                });
            }
            // Validate GST format
            if (!gstPattern.test(req.body.gst_no)) {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid GST format! GST should be in the format: 12ABCDE1234F1Z1",
                });
            }

            const { type_id,vendorMast_Id, platform_id, payMethod_id, cycle_id, vendorMast_name, country_code, mobile, alternate_mobile, email,
                personal_address, pan_no, gst_no, comapny_name, company_address, company_city, created_date_time, company_pincode, company_state,
                threshold_limit, home_address, home_city, home_state, created_by, last_updated_date, last_updated_by } = req.body;
            const addVendorMastData = new pmsVendorMastModel({
                type_id: type_id,
                vendorMast_Id:vendorMast_Id,
                platform_id: platform_id,
                payMethod_id: payMethod_id,
                cycle_id: cycle_id,
                vendorMast_name: vendorMast_name,
                country_code: country_code,
                mobile: mobile,
                alternate_mobile: alternate_mobile,
                email: email,
                personal_address: personal_address,
                pan_no: pan_no,
                gst_no: gst_no,
                comapny_name: comapny_name,
                company_address: company_address,
                company_city: company_city,
                company_pincode: company_pincode,
                company_state: company_state,
                threshold_limit: threshold_limit,
                home_address: home_address,
                home_city: home_city,
                home_state: home_state,
                created_date_time: created_date_time,
                created_by: created_by,
                last_updated_date: last_updated_date,
                last_updated_by: last_updated_by
            });
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            if (req.files.upload_pan_image && req.files.upload_pan_image[0].originalname) {
                const blob1 = bucket.file(req.files.upload_pan_image[0].originalname);
                addVendorMastData.upload_pan_image = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => {
                });
                blobStream1.end(req.files.upload_pan_image[0].buffer);
            }
            if (req.files.upload_gst_image && req.files.upload_gst_image[0].originalname) {
                const blob2 = bucket.file(req.files.upload_gst_image[0].originalname);
                addVendorMastData.upload_gst_image = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                });
                blobStream2.end(req.files.upload_gst_image[0].buffer);
            }

            await addVendorMastData.save();
            return res.status(200).json({
                status: 200,
                message: "PMS vendor mast data added successfully!",
                data: addVendorMastData,
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: message.ERROR_MESSAGE,
            });
        }
    }];

//GET - PMS_Vendor_Mast-By-ID
exports.getVendorMastDetail = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const pmsVedorMastData = await pmsVendorMastModel.aggregate([
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
                $project: {
                    type_id: 1,
                    platform_id: 1,
                    payMethod_id: 1,
                    cycle_id: 1,
                    vendorMast_name: 1,
                    country_code: 1,
                    mobile: 1,
                    alternate_mobile: 1,
                    email: 1,
                    personal_address: 1,
                    pan_no: 1,
                    gst_no: 1,
                    comapny_name: 1,
                    company_address: 1,
                    company_city: 1,
                    company_pincode: 1,
                    company_state: 1,
                    threshold_limit: 1,
                    home_address: 1,
                    home_city: 1,
                    home_state: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    upload_pan_image: {
                        $concat: [imageUrl, "$upload_pan_image"],
                    },
                    upload_gst_image: {
                        $concat: [imageUrl, "$upload_gst_image"],
                    },
                },
            },
        ])
        if (pmsVedorMastData) {
            return res.status(200).json({
                status: 200,
                message: "PMS vendor mast details successfully!",
                data: pmsVedorMastData,
            });
        }
        return res.status(404).json({
            status: 404,
            message: message.DATA_NOT_FOUND,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};

//PUT - updateVendorMast_By-ID
exports.updateVendorMast = [
    upload,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { type_id, platform_id, payMethod_id, cycle_id, vendorMast_name, country_code, mobile, alternate_mobile, email,
                personal_address, pan_no, gst_no, comapny_name, company_address, company_city, created_date_time, company_pincode, company_state,
                threshold_limit, home_address, home_city, home_state, created_by, last_updated_date, last_updated_by } = req.body;
            const VendorMastData = await pmsVendorMastModel.findOne({ _id: id });
            if (!VendorMastData) {
                return res.send("Invalid Vendore-Mast Id...");
            }
            if (req.files) {
                VendorMastData.upload_pan_image = req.files["upload_pan_image"] ? req.files["upload_pan_image"][0].filename : assetReturnRequest.upload_pan_image;
                VendorMastData.upload_gst_image = req.files["upload_gst_image"] ? req.files["upload_gst_image"][0].filename : assetReturnRequest.upload_gst_image;
            }
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            if (req.files?.upload_pan_image && req.files?.upload_pan_image[0].originalname) {
                const blob1 = bucket.file(req.files.upload_pan_image[0].originalname);
                VendorMastData.upload_pan_image = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => {
                });
                blobStream1.end(req.files.upload_pan_image[0].buffer);
            }
            if (req.files?.upload_gst_image && req.files?.upload_gst_image[0].originalname) {
                const blob2 = bucket.file(req.files.upload_gst_image[0].originalname);
                VendorMastData.upload_gst_image = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                });
                blobStream2.end(req.files.upload_gst_image[0].buffer);
            }
            await VendorMastData.save();
            const vendorData = await pmsVendorMastModel.findOneAndUpdate({ _id: id }, {
                $set: {
                    type_id,
                    platform_id,
                    payMethod_id,
                    cycle_id,
                    vendorMast_name,
                    country_code,
                    mobile,
                    alternate_mobile,
                    email,
                    personal_address,
                    pan_no,
                    gst_no,
                    comapny_name,
                    company_address,
                    company_city,
                    created_date_time,
                    company_pincode,
                    company_state,
                    threshold_limit,
                    home_address,
                    home_city,
                    home_state,
                    created_by,
                    last_updated_date,
                    last_updated_by
                },
            },
                { new: true }
            );
            return res.status(200).json({
                message: "PMS vendor-mast data updated successfully!",
                data: vendorData,
            });
        } catch (error) {
            return res.status(500).json({
                message: message.ERROR_MESSAGE,
            });
        }
    }];

//GET - TMS_Task-List
exports.getAllVendorMastList = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const tmsVendorkMastList = await pmsVendorMastModel.aggregate([
            {
                $lookup: {
                    from: "pmsvendortypemodels",
                    localField: "type_id",
                    foreignField: "_id",
                    as: "pmsVendorType",
                },
            },
            {
                $unwind: {
                    path: "$pmsVendorType",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "pmsplatforms",
                    localField: "platform_id",
                    foreignField: "_id",
                    as: "pmsPlatform",
                },
            },
            {
                $unwind: {
                    path: "$pmsPlatform",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "pmspaymethods",
                    localField: "payMethod_id",
                    foreignField: "_id",
                    as: "pmspaymethod",
                },
            },
            {
                $unwind: {
                    path: "$pmspaymethod",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "pmspaycycles",
                    localField: "cycle_id",
                    foreignField: "_id",
                    as: "pmsPayCycle",
                },
            },
            {
                $unwind: {
                    path: "$pmsPayCycle",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "assign_by",
                    foreignField: "user_id",
                    as: "user_data",
                },
            },
            {
                $unwind: {
                    path: "$user_data",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    type_id: "$type_id",
                    platform_id: "$platform_id",
                    payMethod_id: "$payMethod_id",
                    cycle_id: "$cycle_id",
                    vendorMast_name: 1,
                    country_code: 1,
                    mobile: 1,
                    alternate_mobile: 1,
                    email: 1,
                    personal_address: 1,
                    pan_no: 1,
                    gst_no: 1,
                    comapny_name: 1,
                    company_address: 1,
                    company_city: 1,
                    created_date_time: 1,
                    company_pincode: 1,
                    company_state: 1,
                    threshold_limit: 1,
                    home_address: 1,
                    home_city: 1,
                    home_state: 1,
                    created_by: 1,
                    last_updated_by: 1,
                    upload_pan_image: {
                        $concat: [imageUrl, "$upload_pan_image"],
                    },
                    upload_gst_image: {
                        $concat: [imageUrl, "$upload_gst_image"],
                    },
                    PMSType_data: {
                        type_id: "$pmsVendorType.type_id",
                        type_name: "$pmsVendorType.type_name",
                        description_type: "$pmsVendorType.description",
                        created_by: "$pmsVendorType.created_by",
                        last_updated_by: "$pmsVendorType.last_updated_by",
                        created_by_name: "$user_data.user_name",
                    },
                    PMSPlatform_data: {
                        platform_id: "$pmsPlatform.platform_id",
                        platform_name: "$pmsPlatform.platform_name",
                        description_platform: "$pmsPlatform.description",
                        created_by: "$pmsPlatform.created_by",
                        last_updated_by: "$pmsPlatform.last_updated_by",
                        created_by_name: "$user_data.user_name",
                    },
                    PMSpaymethod_data: {
                        pmspaymethod_id: "$pmspaymethod.paymethod_id",
                        pmspaymethod_name: "$pmspaymethod.paymethod_name",
                        description_pmspaymethod: "$pmspaymethod.description",
                        created_by: "$pmspaymethod.created_by",
                        last_updated_by: "$pmspaymethod.last_updated_by",
                        created_by_name: "$user_data.user_name",
                    },
                    PMSPayCycle_data: {
                        pmsPayCycle_id: "$pmsPayCycle.cycle_id",
                        pmsPayCycle_name: "$pmsPayCycle.cycle_name",
                        description_pmsPayCycle: "$pmsPayCycle.description",
                        created_by: "$pmsPayCycle.created_by",
                        last_updated_by: "$pmsPayCycle.last_updated_by",
                        created_by_name: "$user_data.user_name",
                    }
                }
            },
        ])
        const totalVendorList = await pmsVendorMastModel.countDocuments(tmsVendorkMastList);
        if (!totalVendorList) {
            return res.status(404).send({
                succes: true,
                message: "PMS Vendor-mast data request list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "Vendor-mast list created successfully!",
            task_data: totalVendorList, tmsVendorkMastList
        });
    } catch (err) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//DELETE - PMS_vendor_Mast_ By-ID
exports.vendorMastDelete = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const vendorMastData = await pmsVendorMastModel.findOne({ _id: id });
        if (!vendorMastData) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await pmsVendorMastModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "PMS vendor-mast data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};