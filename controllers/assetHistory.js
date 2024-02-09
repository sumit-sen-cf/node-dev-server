const assetHistoryModel = require("../models/assetHistoryModel.js");
const response = require("../common/response.js");

exports.getAllAssetsHistrory = async (req, res) => {
    try {
        const assetHistoryData = await assetHistoryModel.aggregate([
            {
                $lookup: {
                    from: 'simmodels',
                    localField: 'sim_id',
                    foreignField: 'sim_id',
                    as: 'sim'
                }
            },
            {
                $unwind: {
                    path: "$sim",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'usermodels',
                    localField: 'action_by',
                    foreignField: 'user_id',
                    as: 'userAsset'
                }
            },
            {
                $unwind: {
                    path: "$userAsset",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: "$sim_id",
                    sim_id: { $first: "$sim_id" },
                    asset_name: { $first: "$sim.assetsName" },
                    asset_action_date_time: { $first: "$action_date_time" },
                    asset_action_by: { $first: "$action_by" },
                    asset_action_by_name: { $first: "$userAsset.user_name" },
                    asset_detail: { $first: "$asset_detail" },
                    action_to: { $first: "$action_to" },
                    asset_remark: { $first: "$asset_remark" },
                    asset_action: { $first: "$asset_action" }
                }
            },
            {
                $project: {
                    sim_id: 1,
                    asset_name: 1,
                    asset_action_date_time: 1,
                    asset_action_by: 1,
                    asset_action_by_name: 1,
                    asset_detail: 1,
                    action_to: 1,
                    asset_remark: 1,
                    asset_action: 1
                }
            },
        ]).exec();
        if (!assetHistoryData) {
            res.status(500).send({ success: false })
        }
        res.status(200).send({ results: assetHistoryData })
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error getting all asset history' })
    }
}


exports.getSingleAssetHistory = async (req, res) => {
    try {
        // const singleAssetHistory = await assetHistoryModel.find({
        //     sim_id: parseInt(req.params.sim_id),
        // }).sort({ action_date_time: -1 });

        const singleAssetHistory = await assetHistoryModel.aggregate([
            {
                $match: { sim_id: parseInt(req.params.sim_id) }
            },
            {
                $lookup: {
                    from: 'simmodels',
                    localField: 'sim_id',
                    foreignField: 'sim_id',
                    as: 'sim'
                }
            },
            {
                $unwind: {
                    path: "$sim",
                    // preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'usermodels',
                    localField: 'action_by',
                    foreignField: 'user_id',
                    as: 'userAsset'
                }
            },
            {
                $unwind: {
                    path: "$userAsset",
                    // preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: "$_id",
                    sim_id: "$sim_id",
                    asset_name: "$sim.assetsName",
                    asset_action_date_time: "$action_date_time",
                    asset_action_by: "$action_by",
                    asset_action_by_name: "$userAsset.user_name",
                    asset_detail: "$asset_detail",
                    action_to: "$action_to",
                    asset_remark: "$asset_remark",
                    asset_action: "$asset_action"
                }
            }
        ]).sort({ action_date_time: -1 });

        if (!singleAssetHistory) {
            return response.returnFalse(200, req, res, "No Record Found...", {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "singleAssetHistory Data Fetch Successfully",
            singleAssetHistory
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};