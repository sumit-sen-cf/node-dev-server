const repairRequestModel = require("../models/repairRequestModel.js");
const simAlloModel = require("../models/simAlloModel.js");
const replacementModel = require("../models/requestReplacementModel.js");
const multer = require("multer");

const upload = multer({ dest: "uploads/assets" }).fields([
    { name: "img1", maxCount: 1 },
    { name: "img2", maxCount: 1 },
    { name: "img3", maxCount: 1 },
    { name: "img4", maxCount: 1 },
    { name: "recovery_image_upload1", maxCount: 1 },
    { name: "recovery_image_upload2", maxCount: 1 },
]);

exports.addRepairRequest = [
    upload,
    async (req, res) => {
        try {
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
                multi_tag: req.body.multi_tag,
                status: "Requested",
                // status: req.body.status,
                req_by: req.body.req_by,
                req_date: req.body.req_date,
                img1: req.files.img1 ? req.files.img1[0].filename : "",
                img2: req.files.img2 ? req.files.img2[0].filename : "",
                img3: req.files.img3 ? req.files.img3[0].filename : "",
                img4: req.files.img4 ? req.files.img4[0].filename : "",
                recovery_remark: req.body.recovery_remark,
                recovery_image_upload1: req.files.recovery_image_upload1 ? req.files.recovery_image_upload1[0].filename : "",
                recovery_image_upload2: req.files.recovery_image_upload2 ? req.files.recovery_image_upload2[0].filename : "",
                recovery_by: req.body.recovery_by,
                scrap_remark: req.body.scrap_remark,
                accept_by: req.body.accept_by
            });
            const repairedAssets = await repairdata.save();


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
                        recovery_date_time: "$recovery_date_time"
                    },
                },
            ])
            .exec();
        const assetRepairDataBaseUrl = "http://34.93.221.166:3000/uploads/assets/";
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
            ])
            .exec();
        const assetRepairDataBaseUrl = "http://34.93.221.166:3000/uploads/assets/";
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
        const assetRepairDataBaseUrl = "http://34.93.221.166:3000/uploads/assets/";
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

const upload1 = multer({ dest: "uploads/assets" }).fields([
    { name: "img1", maxCount: 1 },
    { name: "img2", maxCount: 1 },
    { name: "img3", maxCount: 1 },
    { name: "img4", maxCount: 1 },
    { name: "recovery_image_upload1", maxCount: 1 },
    { name: "recovery_image_upload2", maxCount: 1 },
]);

exports.editRepairRequest = [
    upload1,
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
                updateFields.img1 = req.files["img1"] ? req.files["img1"][0].filename : existingRepairRequest.img1;
                updateFields.img2 = req.files["img2"] ? req.files["img2"][0].filename : existingRepairRequest.img2;
                updateFields.img3 = req.files["img3"] ? req.files["img3"][0].filename : existingRepairRequest.img3;
                updateFields.img4 = req.files["img4"] ? req.files["img4"][0].filename : existingRepairRequest.img4;
                updateFields.recovery_image_upload1 = req.files["recovery_image_upload1"] ? req.files["recovery_image_upload1"][0].filename : existingRepairRequest.recovery_image_upload1;
                updateFields.recovery_image_upload2 = req.files["recovery_image_upload2"] ? req.files["recovery_image_upload2"][0].filename : existingRepairRequest.recovery_image_upload2;
            }

            const editrepairdata = await repairRequestModel.findOneAndUpdate(
                { repair_id: parseInt(req.body.repair_id) },
                updateFields,
                { new: true }
            );

            if (!editrepairdata) {
                return res.status(500).send({ success: false });
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