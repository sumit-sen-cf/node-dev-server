const repairRequestModel = require("../models/repairRequestModel.js");
const assetRepairRequestSumModel = require("../models/assetRepairRequestSumModel.js");
const simModel = require("../models/simModel.js");
const assetHistoryModel = require("../models/assetHistoryModel.js");
const simAlloModel = require("../models/simAlloModel.js");
const replacementModel = require("../models/requestReplacementModel.js");
const multer = require("multer");
const vari = require("../variables.js");
const { storage } = require('../common/uploadFile.js');

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "img1", maxCount: 1 },
    { name: "img2", maxCount: 1 },
    { name: "img3", maxCount: 1 },
    { name: "img4", maxCount: 1 },
    { name: 'recovery_image_upload1', maxCount: 1 },
    { name: 'recovery_image_upload2', maxCount: 1 },
]);

exports.addRepairRequest = [
    upload,
    async (req, res) => {
        try {
            const uniqueMultiTagValues = [...new Set(req.body.multi_tag.split(',').map(Number))];
            const repairdata = new repairRequestModel({
                sim_id: req.body.sim_id,
                acknowledge_date: req.body.acknowledge_date,
                acknowledge_remark: req.body.acknowledge_remark,
                submission_date: req.body.submission_date,
                submission_remark: req.body.submission_remark,
                resolved_date: req.body.resolved_date,
                resolved_remark: req.body.resolved_remark,
                asset_reason_id: req.body.asset_reason_id,
                priority: req.body.priority,
                repair_request_date_time: req.body.repair_request_date_time,
                problem_detailing: req.body.problem_detailing,
                multi_tag: uniqueMultiTagValues,
                // multi_tag: req.body.multi_tag.split(',').map(Number),
                status: req.body.status,
                // status: req.body.status,
                req_by: req.body.req_by,
                req_date: req.body.req_date,
                // img1: req.files.img1 ? req.files.img1[0].filename : "",
                // img2: req.files.img2 ? req.files.img2[0].filename : "",
                // img3: req.files.img3 ? req.files.img3[0].filename : "",
                // img4: req.files.img4 ? req.files.img4[0].filename : "",
                recovery_remark: req.body.recovery_remark,
                // recovery_image_upload1: req.files.recovery_image_upload1 ? req.files.recovery_image_upload1[0].filename : "",
                // recovery_image_upload2: req.files.recovery_image_upload2 ? req.files.recovery_image_upload2[0].filename : "",
                recovery_by: req.body.recovery_by,
                scrap_remark: req.body.scrap_remark,
                accept_by: req.body.accept_by
            });

            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            if (req.files.img1 && req.files.img1[0].originalname) {
                const blob1 = bucket.file(req.files.img1[0].originalname);
                repairdata.img1 = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => {
                    // res.status(200).send("Success")
                });
                blobStream1.end(req.files.img1[0].buffer);
            }
            if (req.files.img2 && req.files.img2[0].originalname) {
                const blob2 = bucket.file(req.files.img2[0].originalname);
                repairdata.img2 = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                    // res.status(200).send("Success") 
                });
                blobStream2.end(req.files.img2[0].buffer);
            }
            if (req.files.img3 && req.files.img3[0].originalname) {
                const blob3 = bucket.file(req.files.img3[0].originalname);
                repairdata.img3 = blob3.name;
                const blobStream3 = blob3.createWriteStream();
                blobStream3.on("finish", () => {
                    // res.status(200).send("Success") 
                });
                blobStream3.end(req.files.img3[0].buffer);
            }
            if (req.files.img4 && req.files.img4[0].originalname) {
                const blob4 = bucket.file(req.files.img4[0].originalname);
                repairdata.img4 = blob4.name;
                const blobStream4 = blob4.createWriteStream();
                blobStream4.on("finish", () => {
                    // res.status(200).send("Success") 
                });
                blobStream4.end(req.files.img4[0].buffer);
            }
            if (req.files.recovery_image_upload1 && req.files.recovery_image_upload1[0].originalname) {
                const blob4 = bucket.file(req.files.recovery_image_upload1[0].originalname);
                repairdata.recovery_image_upload1 = blob4.name;
                const blobStream4 = blob4.createWriteStream();
                blobStream4.on("finish", () => {
                    // res.status(200).send("Success") 
                });
                blobStream4.end(req.files.recovery_image_upload1[0].buffer);
            }
            if (req.files.recovery_image_upload2 && req.files.recovery_image_upload2[0].originalname) {
                const blob4 = bucket.file(req.files.recovery_image_upload2[0].originalname);
                repairdata.recovery_image_upload2 = blob4.name;
                const blobStream4 = blob4.createWriteStream();
                blobStream4.on("finish", () => {
                    // res.status(200).send("Success") 
                });
                blobStream4.end(req.files.recovery_image_upload2[0].buffer);
            }

            const repairedAssets = await repairdata.save();
            // Added the Data in AssetHistoryModel 
            const assetHistoryData = {
                sim_id: repairedAssets.sim_id,
                action_date_time: repairedAssets.repair_request_date_time,
                action_by: repairedAssets.req_by,
                asset_detail: repairedAssets.problem_detailing,
                action_to: 0,
                asset_remark: "",
                asset_action: "Asset Repair Request"
            };

            const newAssetHistory = await assetHistoryModel.create(assetHistoryData);



            // Commented part is underworking because their is need for complete clarification for each field while working with model i have not clear understanding for fields that's why i commented this code 
            // await simAlloModel.findOneAndUpdate({  sim_id: req.body.sim_id }, {
            //    repair_status: "Requested", 
            //   }, { new: true })

            // if(req.body.flagForReplacement === "temp"){
            //     const simc = new simAlloModel({
            //         user_id: req.body.user_id,
            //         sim_id: req.body.sim_id,
            //         category_id: req.body.category_id,
            //         sub_category_id: req.body.sub_category_id,
            //         Remarks: req.body.Remarks,
            //         created_by: req.body.created_by,
            //         submitted_by: req.body.submitted_by,
            //         reason: req.body.reason,
            //         status: req.body.status,
            //         deleted_status: req.body.deleted_status,
            //         submitted_at: req.body.submitted_at,
            //       });
            //       const simv = await simc.save();
            //     const allocatedData = new replacementModel({
            //         assignment_type: "repairRequest", 
            //         old_asset_id: "repairRequest", 
            //         new_asset_id: "repairRequest", 
            // });
            // const allocatedDataSaved = await allocatedData.save();
            // }
            res.send({ repairedAssets, status: 200 });
        } catch (err) {
            return res.status(500).send({
                error: err.message,
                sms: "This addRepairRequest data cannot be created",
            });
        }
    },
];

exports.getAllRepairRequests = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const assetsdata = await repairRequestModel
            .aggregate([
                {
                    $lookup: {
                        from: "simmodels",
                        localField: "sim_id",
                        foreignField: "sim_id",
                        as: "sim",
                    },
                },
                {
                    $unwind: {
                        path: "$sim",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "assetreasonmodels",
                        localField: "asset_reason_id",
                        foreignField: "asset_reason_id",
                        as: "assetreasonmodelData",
                    },
                },
                {
                    $unwind: "$assetreasonmodelData",
                },
                {
                    $project: {
                        repair_id: "$repair_id",
                        sim_id: "$sim_id",
                        repair_status: "$repair_status",
                        acknowledge_date: "$acknowledge_date",
                        acknowledge_remark: "$acknowledge_remark",
                        submission_date: "$submission_date",
                        submission_remark: "$submission_remark",
                        resolved_date: "$resolved_date",
                        resolved_remark: "$resolved_remark",
                        asset_reason_id: "$asset_reason_id",
                        reason_name: "$assetreasonmodelData.reason",
                        asset_name: "$sim.assetsName",
                        priority: "$priority",
                        problem_detailing: "$problem_detailing",
                        multi_tag: "$multi_tag",
                        status: "$status",
                        img1: {
                            $concat: [imageUrl, "$img1"],
                        },
                        img2: {
                            $concat: [imageUrl, "$img2"],
                        },
                        img3: {
                            $concat: [imageUrl, "$img3"],
                        },
                        img4: {
                            $concat: [imageUrl, "$img4"],
                        },
                        recovery_image_upload1: {
                            $concat: [imageUrl, "$recovery_image_upload1"],
                        },
                        recovery_image_upload2: {
                            $concat: [imageUrl, "$recovery_image_upload2"],
                        },
                        created_at: "$created_at",
                        updated_at: "$updated_at",
                        repair_request_date_time: "$repair_request_date_time",
                        req_by: "$req_by",
                        req_date: "$req_date",
                        recovery_remark: "$recovery_remark",
                        recovery_by: "$recovery_by",
                        recovery_date_time: "$recovery_date_time"
                    },
                },
            ])
            .exec();
        const assetRepairDataBaseUrl = `${vari.IMAGE_URL}`;
        const dataWithImageUrl = assetsdata.map((assetrepairdatas) => ({
            ...assetrepairdatas,
            img1_url: assetrepairdatas.img1 ? assetRepairDataBaseUrl + assetrepairdatas.img1 : null,
            img2_url: assetrepairdatas.img2 ? assetRepairDataBaseUrl + assetrepairdatas.img2 : null,
            img3_url: assetrepairdatas.img3 ? assetRepairDataBaseUrl + assetrepairdatas.img3 : null,
            img4_url: assetrepairdatas.img4 ? assetRepairDataBaseUrl + assetrepairdatas.img4 : null,
            recovery_image_upload1_url: assetrepairdatas.recovery_image_upload1 ? assetRepairDataBaseUrl + assetrepairdatas.recovery_image_upload1 : null,
            recovery_image_upload2_url: assetrepairdatas.recovery_image_upload2 ? assetRepairDataBaseUrl + assetrepairdatas.recovery_image_upload2 : null,
        }));
        if (dataWithImageUrl?.length === 0) {
            res
                .status(200)
                .send({ success: true, data: [], message: "No Record found" });
        } else {
            res.status(200).send({ data: dataWithImageUrl });
        }
    } catch (err) {
        return res
            .status(500)
            .send({ error: err.message, sms: "Error getting all Assets Repair Data" });
    }
};

exports.getAllRepairRequestsByAssetReasonId = async (req, res) => {
    try {
        const assetsdata = await repairRequestModel
            .aggregate([

                {
                    $match: { asset_reason_id: parseInt(req.params.id) },
                },

                {
                    $lookup: {
                        from: "simmodels",
                        localField: "sim_id",
                        foreignField: "sim_id",
                        as: "sim",
                    },
                },
                {
                    $unwind: {
                        path: "$sim",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "assetreasonmodels",
                        localField: "asset_reason_id",
                        foreignField: "asset_reason_id",
                        as: "assetreasonmodelData",
                    },
                },
                {
                    $unwind: "$assetreasonmodelData",
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "recovery_by",
                        foreignField: "user_id",
                        as: "recoveryByData",
                    },
                },
                {
                    $unwind: {
                        path: "$recoveryByData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "accept_by",
                        foreignField: "user_id",
                        as: "acceptByData",
                    },
                },
                {
                    $unwind: {
                        path: "$acceptByData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "multi_tag",
                        foreignField: "user_id",
                        as: "multiTagUsers",
                    },
                },
                // {
                //     $unwind: {
                //         path: "$multiTagUsers",
                //         preserveNullAndEmptyArrays: true,
                //     },
                // },
                {
                    $project: {
                        repair_id: "$repair_id",
                        sim_id: "$sim_id",
                        acknowledge_date: "$acknowledge_date",
                        acknowledge_remark: "$acknowledge_remark",
                        submission_date: "$submission_date",
                        submission_remark: "$submission_remark",
                        resolved_date: "$resolved_date",
                        resolved_remark: "$resolved_remark",
                        asset_reason_id: "$asset_reason_id",
                        reason_name: "$assetreasonmodelData.reason",
                        asset_name: "$sim.assetsName",
                        priority: "$priority",
                        problem_detailing: "$problem_detailing",
                        multi_tag: "$multi_tag",
                        status: "$status",
                        img1: "$img1",
                        img2: "$img2",
                        img3: "$img3",
                        img4: "$img4",
                        created_at: "$created_at",
                        updated_at: "$updated_at",
                        repair_request_date_time: "$repair_request_date_time",
                        req_by: "$req_by",
                        req_date: "$req_date",
                        recovery_remark: "$recovery_remark",
                        recovery_image_upload1: "$recovery_image_upload1",
                        recovery_image_upload2: "$recovery_image_upload2",
                        recovery_by: "$recovery_by",
                        recovery_by_name: "$recoveryByData.user_name",
                        recovery_date_time: "$recovery_date_time",
                        scrap_remark: "$scrap_remark",
                        accept_by: "$accept_by",
                        accept_by_name: "$acceptByData.user_name",
                        multi_tag_users_name: "$multiTagUsers.user_name"
                    },
                },
                // {
                //     $group: {
                //         _id: "$repair_id",
                //         data: { $first: "$$ROOT" }
                //     }
                // },
                // {
                //     $replaceRoot: { newRoot: "$data" }
                // }
            ]);
        const assetRepairDataBaseUrl = `${vari.IMAGE_URL}`;
        const dataWithImageUrl = assetsdata.map((assetrepairdatas) => ({
            ...assetrepairdatas,
            img1_url: assetrepairdatas.img1 ? assetRepairDataBaseUrl + assetrepairdatas.img1 : null,
            img2_url: assetrepairdatas.img2 ? assetRepairDataBaseUrl + assetrepairdatas.img2 : null,
            img3_url: assetrepairdatas.img3 ? assetRepairDataBaseUrl + assetrepairdatas.img3 : null,
            img4_url: assetrepairdatas.img4 ? assetRepairDataBaseUrl + assetrepairdatas.img4 : null,
            recovery_image_upload1_url: assetrepairdatas.recovery_image_upload1 ? assetRepairDataBaseUrl + assetrepairdatas.recovery_image_upload1 : null,
            recovery_image_upload2_url: assetrepairdatas.recovery_image_upload2 ? assetRepairDataBaseUrl + assetrepairdatas.recovery_image_upload2 : null,
        }));
        if (dataWithImageUrl?.length === 0) {
            res
                .status(200)
                .send({ success: true, data: [], message: "No Record found" });
        } else {
            res.status(200).send({ data: dataWithImageUrl });
        }
    } catch (err) {
        return res
            .status(500)
            .send({ error: err.message, sms: "Error getting all Assets Repair Data" });
    }
};

exports.getSingleRepairRequests = async (req, res) => {
    try {
        const assetsdata = await repairRequestModel
            .aggregate([
                {
                    $match: { repair_id: parseInt(req.params.id) },
                },
                {
                    $lookup: {
                        from: "simmodels",
                        localField: "sim_id",
                        foreignField: "sim_id",
                        as: "sim",
                    },
                },
                {
                    $unwind: {
                        path: "$sim",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "user_id",
                        foreignField: "recovery_by",
                        as: "recoveryByData",
                    },
                },
                {
                    $unwind: {
                        path: "$recoveryByData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "user_id",
                        foreignField: "accept_by",
                        as: "acceptByData",
                    },
                },
                {
                    $unwind: {
                        path: "$acceptByData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        repair_id: "$repair_id",
                        sim_id: "$sim_id",
                        acknowledge_date: "$acknowledge_date",
                        acknowledge_remark: "$acknowledge_remark",
                        submission_date: "$submission_date",
                        submission_remark: "$submission_remark",
                        resolved_date: "$resolved_date",
                        resolved_remark: "$resolved_remark",
                        asset_reason_id: "$asset_reason_id",
                        asset_name: "$sim.assetsName",
                        priority: "$priority",
                        problem_detailing: "$problem_detailing",
                        multi_tag: "$multi_tag",
                        status: "$status",
                        img1: "$img1",
                        img2: "$img2",
                        img3: "$img3",
                        img4: "$img4",
                        created_at: "$created_at",
                        updated_at: "$updated_at",
                        repair_request_date_time: "$repair_request_date_time",
                        req_by: "$req_by",
                        req_date: "$req_date",
                        recovery_remark: "$recovery_remark",
                        recovery_image_upload1: "$recovery_image_upload1",
                        recovery_image_upload2: "$recovery_image_upload2",
                        recovery_by: "$recovery_by",
                        recovery_by_name: "$recoveryByData.user_name",
                        recovery_date_time: "$recovery_date_time",
                        scrap_remark: "$scrap_remark",
                        accept_by: "$accept_by",
                        accept_by_name: "$acceptByData.user_name"
                    },
                },
            ])
            .exec();
        const assetRepairDataBaseUrl = `${vari.IMAGE_URL}`;
        const dataWithImageUrl = assetsdata.map((assetrepairdatas) => ({
            ...assetrepairdatas,
            img1_url: assetrepairdatas.img1 ? assetRepairDataBaseUrl + assetrepairdatas.img1 : null,
            img2_url: assetrepairdatas.img2 ? assetRepairDataBaseUrl + assetrepairdatas.img2 : null,
            img3_url: assetrepairdatas.img3 ? assetRepairDataBaseUrl + assetrepairdatas.img3 : null,
            img4_url: assetrepairdatas.img4 ? assetRepairDataBaseUrl + assetrepairdatas.img4 : null,
            recovery_image_upload1_url: assetrepairdatas.recovery_image_upload1 ? assetRepairDataBaseUrl + assetrepairdatas.recovery_image_upload1 : null,
            recovery_image_upload2_url: assetrepairdatas.recovery_image_upload2 ? assetRepairDataBaseUrl + assetrepairdatas.recovery_image_upload2 : null,
        }));
        if (dataWithImageUrl?.length === 0) {
            res
                .status(200)
                .send({ success: true, data: [], message: "No Record found" });
        } else {
            res.status(200).send({ data: dataWithImageUrl });
        }
    } catch (err) {
        return res
            .status(500)
            .send({ error: err.message, sms: "Error getting single Asset Repair Data " });
    }
};


exports.editRepairRequest = [
    upload,
    async (req, res) => {
        try {
            const existingRepairRequest = await repairRequestModel.findOne({
                repair_id: parseInt(req.body.repair_id),
            });

            const updateFields = {
                acknowledge_date: req.body.acknowledge_date,
                acknowledge_remark: req.body.acknowledge_remark,
                submission_date: req.body.submission_date,
                submission_remark: req.body.submission_remark,
                resolved_date: req.body.resolved_date,
                resolved_remark: req.body.resolved_remark,
                sim_id: req.body.sim_id,
                asset_reason_id: req.body.asset_reason_id,
                repair_request_date_time: req.body.repair_request_date_time,
                priority: req.body.priority,
                problem_detailing: req.body.problem_detailing,
                multi_tag: req.body.multi_tag,
                status: req.body.status,
                req_by: req.body.req_by,
                req_date: req.body.req_date,
                updated_at: req.body.updated_at,
                recovery_remark: req.body.recovery_remark,
                recovery_image_upload1: req.body.recovery_image_upload1,
                recovery_image_upload2: req.body.recovery_image_upload2,
                recovery_by: req.body.recovery_by,
                recovery_date_time: req.body.recovery_date_time,
                scrap_remark: req.body.scrap_remark,
                accept_by: req.body.accept_by
            };

            if (req.files) {
                updateFields.img1 = req.files?.img1 ? req.files.img1[0].originalname : existingRepairRequest.img1;
                updateFields.img2 = req.files?.img2 ? req.files.img2[0].originalname : existingRepairRequest.img2;
                updateFields.img3 = req.files?.img3 ? req.files.img3[0].originalname : existingRepairRequest.img3;
                updateFields.img4 = req.files?.img4 ? req.files.img4[0].originalname : existingRepairRequest.img4;
                updateFields.recovery_image_upload1 = req.files?.recovery_image_upload1 ? req.files.recovery_image_upload1[0].originalname : existingRepairRequest.recovery_image_upload1;
                updateFields.recovery_image_upload2 = req.files?.recovery_image_upload2 ? req.files.recovery_image_upload2[0].originalname : existingRepairRequest.recovery_image_upload2;
            }

            const editrepairdata = await repairRequestModel.findOneAndUpdate(
                { repair_id: parseInt(req.body.repair_id) },
                updateFields,
                { new: true }
            );

            if (!editrepairdata) {
                return res.status(500).send({ success: false });
            }

            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            if (req.files?.img1 && req.files?.img1[0].originalname) {
                const blob1 = bucket.file(req.files?.img1[0].originalname);
                editrepairdata.img1 = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => {
                    // res.status(200).send("Success")
                });
                blobStream1.end(req.files.img1[0].buffer);
            }
            if (req.files?.img2 && req.files?.img2[0].originalname) {
                const blob2 = bucket.file(req.files?.img2[0].originalname);
                editrepairdata.img2 = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                    // res.status(200).send("Success") 
                });
                blobStream2.end(req.files.img2[0].buffer);
            }
            if (req.files?.img3 && req.files?.img3[0].originalname) {
                const blob3 = bucket.file(req.files?.img3[0].originalname);
                editrepairdata.img3 = blob3.name;
                const blobStream3 = blob3.createWriteStream();
                blobStream3.on("finish", () => {
                    // res.status(200).send("Success") 
                });
                blobStream3.end(req.files.img3[0].buffer);
            }
            if (req.files?.img4 && req.files?.img4[0].originalname) {
                const blob4 = bucket.file(req.files?.img4[0].originalname);
                editrepairdata.img4 = blob4.name;
                const blobStream4 = blob4.createWriteStream();
                blobStream4.on("finish", () => {
                    // res.status(200).send("Success") 
                });
                blobStream4.end(req.files.img4[0].buffer);
            }
            if (req.files?.recovery_image_upload1 && req.files?.recovery_image_upload1[0].originalname) {
                const blob4 = bucket.file(req.files?.recovery_image_upload1[0].originalname);
                editrepairdata.recovery_image_upload1 = blob4.name;
                const blobStream4 = blob4.createWriteStream();
                blobStream4.on("finish", () => {
                    // res.status(200).send("Success") 
                });
                blobStream4.end(req.files.recovery_image_upload1[0].buffer);
            }
            if (req.files?.recovery_image_upload2 && req.files?.recovery_image_upload2[0].originalname) {
                const blob4 = bucket.file(req.files.recovery_image_upload2[0].originalname);
                editrepairdata.recovery_image_upload2 = blob4.name;
                const blobStream4 = blob4.createWriteStream();
                blobStream4.on("finish", () => {
                    // res.status(200).send("Success") 
                });
                blobStream4.end(req.files.recovery_image_upload2[0].buffer);
            }

            if (req.body.status === "Recover") {
                const repairSummaryData = {
                    sim_id: editrepairdata.sim_id,
                    req_by: editrepairdata.req_by,
                    recovery_remark: editrepairdata.recovery_remark,
                    recovery_by: editrepairdata.recovery_by,
                    recovery_image_upload1: editrepairdata.recovery_image_upload1,
                    recovery_image_upload2: editrepairdata.recovery_image_upload2,
                    repair_request_date_time: editrepairdata.repair_request_date_time
                };

                await assetRepairRequestSumModel.create(repairSummaryData);
            }

            return res.status(200).send({ success: true, data: editrepairdata });
        } catch (err) {
            return res
                .status(500)
                .send({ error: err.message, sms: "Error updating reapir request data details" });
        }
    },
];

exports.deleteRepairRequest = async (req, res) => {
    repairRequestModel.deleteOne({ repair_id: req.params.id }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'Repair Request deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'Repair Request not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
};


// Asset Repair Request To ReportL1
exports.showRepairRequestAssetDataToUserReport = async (req, res) => {
    try {
        const { user_id } = req.params;

        const userData = await simModel.aggregate([
            {
                $lookup: {
                    from: "repairrequestmodels",
                    localField: "sim_id",
                    foreignField: "sim_id",
                    as: "assetRepair",
                },
            },
            {
                $unwind: {
                    path: "$assetRepair",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "assetRepair.req_by",
                    foreignField: "user_id",
                    as: "userdata",
                },
            },
            {
                $unwind: {
                    path: "$userdata",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    "userdata.Report_L1": parseInt(user_id),
                },
            },
            {
                $project: {
                    _id: "$_id",
                    sim_id: "$sim_id",
                    asset_id: "$sim_no",
                    asset_name: "$assetsName",
                    repair_id: "$assetRepair.repair_id",
                    req_by: "$assetRepair.req_by",
                    req_by_name: "$userdata.user_name",
                    acknowledge_date: "$assetRepair.acknowledge_date",
                    acknowledge_remark: "$assetRepair.acknowledge_remark",
                    submission_date: "$assetRepair.submission_date",
                    submission_remark: "$assetRepair.submission_remark",
                    resolved_date: "$assetRepair.resolved_date",
                    resolved_remark: "$assetRepair.resolved_remark",
                    asset_reason_id: "$assetRepair.asset_reason_id",
                    priority: "$assetRepair.priority",
                    repair_request_date_time: "$assetRepair.repair_request_date_time",
                    problem_detailing: "$assetRepair.problem_detailing",
                    multi_tag: "$assetRepair.multi_tag",
                    multi_tag_names: "$userdata.user_name",
                    asset_repair_request_status: "$assetRepair.status"
                },
            }
        ]);

        if (!userData || userData.length === 0) {
            return res.status(404).json({ success: false, message: "No data found for the user_id" });
        }

        res.status(200).json({ data: userData });
    } catch (err) {
        res.status(500).send({ error: err.message, sms: "Error getting user details" });
    }
};

//Tagged Person api for repair request

exports.showAssetRepairRequestDataToUser = async (req, res) => {
    try {
        const user_id = parseInt(req.params.user_id);
        const userData = await simModel.aggregate([
            {
                $lookup: {
                    from: "repairrequestmodels",
                    localField: "sim_id",
                    foreignField: "sim_id",
                    as: "assetRepair",
                },
            },
            {
                $unwind: {
                    path: "$assetRepair",
                    // preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "assetRepair.req_by",
                    foreignField: "user_id",
                    as: "userdata",
                },
            },
            {
                $unwind: {
                    path: "$userdata",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "assetssubcategorymodels",
                    localField: "sub_category_id",
                    foreignField: "sub_category_id",
                    as: "subcategory",
                },
            },
            {
                $unwind: {
                    path: "$subcategory",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "assetscategorymodels",
                    localField: "category_id",
                    foreignField: "category_id",
                    as: "category",
                },
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "repairrequestmodels",
                    let: { sim_id: "$sim_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$sim_id", "$$sim_id"] },
                            },
                        },
                        {
                            $lookup: {
                                from: "usermodels",
                                localField: "multi_tag",
                                foreignField: "user_id",
                                as: "userMulti",
                            },
                        },
                        {
                            $unwind: {
                                path: "$userMulti",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                multi_tag_names: { $push: "$userMulti.user_name" },
                            },
                        },
                    ],
                    as: "multiTags",
                },
            },
            {
                $unwind: {
                    path: "$multiTags",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: "$_id",
                    sim_id: "$sim_id",
                    asset_id: "$sim_no",
                    asset_name: "$assetsName",
                    asset_category_id: "$asset_category_id",
                    asset_category_name: "$category.category_name",
                    asset_sub_category_id: "$asset_sub_category_id",
                    asset_sub_category_name: "$subcategory.sub_category_name",
                    repair_id: "$assetRepair.repair_id",
                    req_by: "$assetRepair.req_by",
                    asset_repair_req_date: "$assetRepair.req_date",
                    req_by_name: "$userdata.user_name",
                    acknowledge_date: "$assetRepair.acknowledge_date",
                    acknowledge_remark: "$assetRepair.acknowledge_remark",
                    submission_date: "$assetRepair.submission_date",
                    submission_remark: "$assetRepair.submission_remark",
                    resolved_date: "$assetRepair.resolved_date",
                    resolved_remark: "$assetRepair.resolved_remark",
                    asset_reason_id: "$assetRepair.asset_reason_id",
                    priority: "$assetRepair.priority",
                    repair_request_date_time: "$assetRepair.repair_request_date_time",
                    problem_detailing: "$assetRepair.problem_detailing",
                    multi_tag: "$assetRepair.multi_tag",
                    multi_tag_names: "$multiTags.multi_tag_names",
                    asset_repair_request_status: "$assetRepair.status"
                },
            },
        ]);

        if (!userData || userData.length === 0) {
            return res.status(404).json({ success: false, message: "No data found" });
        }

        // const userReportL1 = await userModel.find({ user_id: userData[0].req_by })
        // const reportData = userReportL1[0].Report_L1;

        // const assetReqBy = parseInt(userData[0].req_by)
        // if (assetReqBy === user_id || reportData === user_id || 633 === user_id) {
        //     return res.status(404).send("data not found")
        // }

        const filteredUserData = userData.filter(item => {
            return item.multi_tag.includes(user_id);
        });
        res.status(200).json({ data: filteredUserData });
    } catch (err) {
        res.status(500).send({ error: err.message, sms: "Error getting user details" });
    }
};

// All Data of repair request
exports.getAllRepairRequestsForSummary = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const assetsdata = await repairRequestModel
            .aggregate([
                {
                    $match: {
                        status: "Recover"
                    }
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "req_by",
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
                    $lookup: {
                        from: "simmodels",
                        localField: "sim_id",
                        foreignField: "sim_id",
                        as: "sim",
                    },
                },
                {
                    $unwind: {
                        path: "$sim",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "assetreasonmodels",
                        localField: "asset_reason_id",
                        foreignField: "asset_reason_id",
                        as: "assetreasonmodelData",
                    },
                },
                {
                    $unwind: "$assetreasonmodelData",
                },
                // {
                //     $lookup: {
                //         from: "assetreturnmodels",
                //         localField: "sim_id",
                //         foreignField: "sim_id",
                //         as: "assetreturnData",
                //     },
                // },
                // {
                //     $unwind: {
                //         path: "$assetreturnData",
                //         preserveNullAndEmptyArrays: true,
                //     },
                // },
                // {
                //     $match: {
                //         "assetreturnData.asset_return_status": "RecovedByHR"
                //     }
                // },
                // {
                //     $lookup: {
                //         from: "usermodels",
                //         localField: "assetreturnData.asset_return_by",
                //         foreignField: "user_id",
                //         as: "user",
                //     },
                // },
                // {
                //     $unwind: {
                //         path: "$user",
                //         preserveNullAndEmptyArrays: true,
                //     },
                // },
                {
                    $project: {
                        repair_id: "$repair_id",
                        sim_id: "$sim_id",
                        repair_status: "$repair_status",
                        acknowledge_date: "$acknowledge_date",
                        acknowledge_remark: "$acknowledge_remark",
                        submission_date: "$submission_date",
                        submission_remark: "$submission_remark",
                        resolved_date: "$resolved_date",
                        resolved_remark: "$resolved_remark",
                        asset_reason_id: "$asset_reason_id",
                        reason_name: "$assetreasonmodelData.reason",
                        assetName: "$sim.assetsName",
                        priority: "$priority",
                        problem_detailing: "$problem_detailing",
                        multi_tag: "$multi_tag",
                        status: "$status",
                        img1: {
                            $concat: [imageUrl, "$img1"],
                        },
                        img2: {
                            $concat: [imageUrl, "$img2"],
                        },
                        img3: {
                            $concat: [imageUrl, "$img3"],
                        },
                        img4: {
                            $concat: [imageUrl, "$img4"],
                        },
                        recovery_image_upload1: {
                            $concat: [imageUrl, "$recovery_image_upload1"],
                        },
                        recovery_image_upload2: {
                            $concat: [imageUrl, "$recovery_image_upload2"],
                        },
                        created_at: "$created_at",
                        updated_at: "$updated_at",
                        repair_request_date_time: "$repair_request_date_time",
                        req_by: "$req_by",
                        req_by_name: "$user_data.user_name",
                        req_date: "$req_date",
                        recovery_remark: "$recovery_remark",
                        recovery_by: "$recovery_by",
                        recovery_date_time: "$recovery_date_time",
                        // asset_return_remark: "$assetreturnData.asset_return_remark",
                        // return_asset_data_time: "$assetreturnData.return_asset_data_time",
                        // asset_return_by: "$assetreturnData.asset_return_by",
                        // asset_return_status: "$assetreturnData.asset_return_status",
                        // asset_return_recover_by: "$assetreturnData.asset_return_recover_by",
                        // asset_return_recover_by_remark: "$assetreturnData.asset_return_recover_by_remark",
                        // asset_return_recovered_date_time: "$assetreturnData.asset_return_recovered_date_time",
                        // return_asset_image_1: {
                        //     $concat: [imageUrl, "$assetreturnData.return_asset_image_1"],
                        // },
                        // return_asset_image_2: {
                        //     $concat: [imageUrl, "$assetreturnData.return_asset_image_2"],
                        // },
                        // asset_return_by_name: "$user.user_name"
                    },
                },
            ]);
        res.status(200).send({ data: assetsdata });
    } catch (err) {
        return res
            .status(500)
            .send({ error: err.message, sms: "Error getting all Assets Repair Data" });
    }
};


exports.getSingleRepairRequestsByReqBy = async (req, res) => {
    try {
        const assetsdata = await repairRequestModel
            .aggregate([
                {
                    $match: { req_by: parseInt(req.params.req_by) },
                },
                {
                    $lookup: {
                        from: "simmodels",
                        localField: "sim_id",
                        foreignField: "sim_id",
                        as: "sim",
                    },
                },
                {
                    $unwind: {
                        path: "$sim",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                // {
                //     $lookup: {
                //         from: "usermodels",
                //         localField: "user_id",
                //         foreignField: "recovery_by",
                //         as: "recoveryByData",
                //     },
                // },
                // {
                //     $unwind: {
                //         path: "$recoveryByData",
                //         preserveNullAndEmptyArrays: true,
                //     },
                // },
                // {
                //     $lookup: {
                //         from: "usermodels",
                //         localField: "user_id",
                //         foreignField: "accept_by",
                //         as: "acceptByData",
                //     },
                // },
                // {
                //     $unwind: {
                //         path: "$acceptByData",
                //         preserveNullAndEmptyArrays: true,
                //     },
                // },
                {
                    $project: {
                        repair_id: "$repair_id",
                        sim_id: "$sim_id",
                        acknowledge_date: "$acknowledge_date",
                        acknowledge_remark: "$acknowledge_remark",
                        submission_date: "$submission_date",
                        submission_remark: "$submission_remark",
                        resolved_date: "$resolved_date",
                        resolved_remark: "$resolved_remark",
                        asset_reason_id: "$asset_reason_id",
                        asset_name: "$sim.assetsName",
                        priority: "$priority",
                        problem_detailing: "$problem_detailing",
                        multi_tag: "$multi_tag",
                        status: "$status",
                        img1: "$img1",
                        img2: "$img2",
                        img3: "$img3",
                        img4: "$img4",
                        created_at: "$created_at",
                        updated_at: "$updated_at",
                        repair_request_date_time: "$repair_request_date_time",
                        req_by: "$req_by",
                        req_date: "$req_date",
                        recovery_remark: "$recovery_remark",
                        recovery_image_upload1: "$recovery_image_upload1",
                        recovery_image_upload2: "$recovery_image_upload2",
                        recovery_by: "$recovery_by",
                        // recovery_by_name: "$recoveryByData.user_name",
                        recovery_date_time: "$recovery_date_time",
                        scrap_remark: "$scrap_remark",
                        accept_by: "$accept_by",
                        // accept_by_name: "$acceptByData.user_name"
                    },
                },
            ])
            .exec();
        const assetRepairDataBaseUrl = `${vari.IMAGE_URL}`;
        const dataWithImageUrl = assetsdata.map((assetrepairdatas) => ({
            ...assetrepairdatas,
            img1_url: assetrepairdatas.img1 ? assetRepairDataBaseUrl + assetrepairdatas.img1 : null,
            img2_url: assetrepairdatas.img2 ? assetRepairDataBaseUrl + assetrepairdatas.img2 : null,
            img3_url: assetrepairdatas.img3 ? assetRepairDataBaseUrl + assetrepairdatas.img3 : null,
            img4_url: assetrepairdatas.img4 ? assetRepairDataBaseUrl + assetrepairdatas.img4 : null,
            recovery_image_upload1_url: assetrepairdatas.recovery_image_upload1 ? assetRepairDataBaseUrl + assetrepairdatas.recovery_image_upload1 : null,
            recovery_image_upload2_url: assetrepairdatas.recovery_image_upload2 ? assetRepairDataBaseUrl + assetrepairdatas.recovery_image_upload2 : null,
        }));
        if (dataWithImageUrl?.length === 0) {
            res
                .status(200)
                .send({ success: true, data: [], message: "No Record found" });
        } else {
            res.status(200).send({ data: dataWithImageUrl });
        }
    } catch (err) {
        return res
            .status(500)
            .send({ error: err.message, sms: "Error getting single Asset Repair Data " });
    }
};