const assetRepairRequestSumModel = require("../models/assetRepairRequestSumModel.js");
const assetReturnSumModel = require("../models/assetReturnSumModel.js");
const vari = require("../variables.js");

exports.getAllRepairSummaryData = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const assetsdata = await assetRepairRequestSumModel
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
                        localField: "req_by",
                        foreignField: "user_id",
                        as: "reqByData",
                    },
                },
                {
                    $unwind: {
                        path: "$reqByData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        repair_id: "$repair_id",
                        sim_id: "$sim_id",
                        asset_name: "$sim.assetsName",
                        repair_request_date_time: "$repair_request_date_time",
                        recovery_image_upload1: {
                            $concat: [imageUrl, "$recovery_image_upload1"],
                        },
                        recovery_image_upload2: {
                            $concat: [imageUrl, "$recovery_image_upload2"],
                        },
                        created_at: "$created_at",
                        updated_at: "$updated_at",
                        req_by: "$req_by",
                        req_by_name: "$reqByData.user_name",
                        recovery_remark: "$recovery_remark",
                        recovery_by: "$recovery_by",
                        recovery_by_name: "$recoveryByData.user_name"
                    },
                },
                {
                    $group: {
                        _id: "$asset_repair_sum_id",
                        data: { $first: "$$ROOT" }
                    }
                },
                {
                    $replaceRoot: { newRoot: "$data" }
                }
            ]);
        res.status(200).send({ data: assetsdata })
    } catch (err) {
        return res
            .status(500)
            .send({ error: err.message, sms: "Error getting all Assets Repair Data" });
    }
};


exports.getAllReturnSummaryData = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const assetsdata = await assetReturnSumModel
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
                        from: "usermodels",
                        localField: "asset_return_by",
                        foreignField: "user_id",
                        as: "returnByData",
                    },
                },
                {
                    $unwind: {
                        path: "$returnByData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "asset_return_recover_by",
                        foreignField: "user_id",
                        as: "recoverByData",
                    },
                },
                {
                    $unwind: {
                        path: "$recoverByData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        sim_id: "$sim_id",
                        asset_name: "$sim.assetsName",
                        return_asset_data_time: "$return_asset_data_time",
                        asset_return_remark: "$asset_return_remark",
                        recover_asset_image_1: {
                            $concat: [imageUrl, "$recover_asset_image_1"],
                        },
                        recover_asset_image_2: {
                            $concat: [imageUrl, "$recover_asset_image_2"],
                        },
                        asset_return_by: "$asset_return_by",
                        asset_return_by_name: "$returnByData.user_name",
                        asset_return_recover_by: "$asset_return_recover_by",
                        asset_return_recover_by_name: "$recoverByData.user_name",
                        asset_return_recover_by_remark: "$asset_return_recover_by_remark"
                    },
                },
                {
                    $group: {
                        _id: "$sim_id",
                        data: { $first: "$$ROOT" }
                    }
                },
                {
                    $replaceRoot: { newRoot: "$data" }
                }
            ]);
        res.status(200).send({ data: assetsdata })
    } catch (err) {
        return res
            .status(500)
            .send({ error: err.message, sms: "Error getting all Assets Repair Data" });
    }
};