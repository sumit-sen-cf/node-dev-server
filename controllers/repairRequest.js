const repairRequestModel = require("../models/repairRequestModel.js");
const multer = require("multer");

const upload = multer({ dest: "uploads/assets" }).fields([
    { name: "img1", maxCount: 1 },
    { name: "img2", maxCount: 1 },
    { name: "img3", maxCount: 1 },
    { name: "img4", maxCount: 1 },
]);

exports.addRepairRequest = [
    upload,
    async (req, res) => {
        try {
            const repairdata = new repairRequestModel({
                sim_id: req.body.sim_id,
                priority: req.body.priority,
                repair_request_date_time: req.body.repair_request_date_time,
                problem_detailing: req.body.problem_detailing,
                multi_tag: req.body.multi_tag,
                status: req.body.status,
                req_by: req.body.req_by,
                req_date: req.body.req_date,
                img1: req.files.img1 ? req.files.img1[0].filename : "",
                img2: req.files.img2 ? req.files.img2[0].filename : "",
                img3: req.files.img3 ? req.files.img3[0].filename : "",
                img4: req.files.img4 ? req.files.img4[0].filename : "",
            });
            const repairedAssets = await repairdata.save();

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
                    $project: {
                        repair_id: "$repair_id",
                        sim_id: "$sim_id",
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
                        req_date: "$req_date"
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
                    $project: {
                        repair_id: "$repair_id",
                        sim_id: "$sim_id",
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
                        req_date: "$req_date"
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
]);

exports.editRepairRequest = [
    upload1,
    async (req, res) => {
        try {
            const existingRepairRequest = await repairRequestModel.findOne({
                repair_id: parseInt(req.body.repair_id),
            });

            const updateFields = {
                sim_id: req.body.sim_id,
                repair_request_date_time: req.body.repair_request_date_time,
                priority: req.body.priority,
                problem_detailing: req.body.problem_detailing,
                multi_tag: req.body.multi_tag,
                status: req.body.status,
                req_by: req.body.req_by,
                req_date: req.body.req_date,
                updated_at: req.body.updated_at
            };

            if (req.files) {
                updateFields.img1 = req.files["img1"] ? req.files["img1"][0].filename : existingRepairRequest.img1;
                updateFields.img2 = req.files["img2"] ? req.files["img2"][0].filename : existingRepairRequest.img2;
                updateFields.img3 = req.files["img3"] ? req.files["img3"][0].filename : existingRepairRequest.img3;
                updateFields.img4 = req.files["img4"] ? req.files["img4"][0].filename : existingRepairRequest.img4;
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