const response = require("../common/response.js");
const opExecutionModel = require("../models/opExecutionModel.js");
const opCampaignPhaseModel = require("../models/opCampaignPhaseModel.js");
const opCampaignPlanModel = require("../models/opCampaignPlanModel.js");
const opCampaignModel = require("../models/opCampaignModel.js");
const commitmentModel = require("../models/commitmentModel.js");
const axios = require('axios');
const mongoose = require('mongoose');

exports.addOPExecution = async (req, res) => {
    const { pages, campaignId, plan_id, planName, phase_id, phaseName, postPerPage, storyPerPage } = req.body;

    for (const page of pages) {
        if (!page.postPerPage || !page.storyPerPage) {
            return res.send("All pages should contain storyPerPage and postPerPage");
        }
    }

    try {

        const insertData = pages.map(page => ({
            phase_id,
            phaseName,
            plan_id,
            planName,
            campaignId,
            postPerPage: page.postPerPage || postPerPage,
            storyPerPage: page.storyPerPage || storyPerPage,
            postRemaining: page.postPerPage,
            storyRemaining: page.storyPerPage,
            ...page
        }));

        const exeData = await opExecutionModel.insertMany(insertData);

        return response.returnTrue(
            200,
            req,
            res,
            "Execution Created Successfully",
            exeData
        );
    } catch (error) {
        return response.returnFalse(500, req, res, error.message, {});
    }
};

exports.getOPExecutions = async (req, res) => {
    try {
        const id = req.params._id;

        const exeData = await opExecutionModel.find({ campaignId: id });

        if (!exeData || exeData.length === 0) {
            return res.status(200).send("exeData not found");
        }

        const response = await axios.get(
            'https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList'
        );
        const inventoryDataList = response?.data?.body;

        const inventoryDataMap = inventoryDataList.reduce((acc, item) => {
            acc[item.p_id] = {
                page_name: item.page_name,
                follower_count: item.follower_count,
                page_link: item.page_link,
                cat_name: item.cat_name
            };
            return acc;
        }, {});

        const mergedData = exeData.map(plan => {
            const inventoryInfo = inventoryDataMap[plan.p_id] || {};
            return {
                ...plan._doc,
                ...inventoryInfo
            };
        });

        return res.status(200).json({
            message: "Execution Data fetched successfully",
            data: mergedData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

exports.updateOPExecution = async (req, res) => {
    const id = mongoose.Types.ObjectId(req.body.id);

    const exeUpadateData = await opExecutionModel.findOneAndUpdate({ _id: id }, req.body, { new: true });

    if (!exeUpadateData) {
        return res.send("Data not Found For This Id")
    }

    res.send({ data: exeUpadateData, status: 200 })
}

exports.getAllPhasesByCampId = async (req, res) => {
    const id = mongoose.Types.ObjectId(req.params._id);

    const result = await opCampaignPhaseModel.aggregate([
        { $match: { campaignId: id } },
        { $group: { _id: "$phaseName", data: { $first: "$$ROOT" } } },
        { $replaceRoot: { newRoot: "$data" } }
    ]).sort({ createdAt: 1 });

    if (result.length === 0) {
        return res.status(404).json({ data: [], sms: 'No data found for this campaign ID' });
    }

    res.status(200).json({
        data: result
    });
}

exports.getAllPhasesByPhaseName = async (req, res) => {
    try {
        let name = req.params.phaseName;

        name = name.trim();

        const result = await opCampaignPhaseModel.find({ phaseName: name });

        const response = await axios.get(
            'https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList'
        );
        const inventoryDataList = response?.data?.body;

        const inventoryDataMap = inventoryDataList.reduce((acc, item) => {
            acc[item.p_id] = {
                page_name: item.page_name,
                follower_count: item.follower_count,
                page_link: item.page_link,
                cat_name: item.cat_name
            };
            return acc;
        }, {});

        const mergedData = result.map(plan => {
            const inventoryInfo = inventoryDataMap[plan.p_id] || {};
            return {
                ...plan._doc,
                ...inventoryInfo
            };
        });

        return res.status(200).json({
            message: "Execution Data fetched successfully",
            data: mergedData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}

exports.getCampCommits = async (req, res) => {
    const id = mongoose.Types.ObjectId(req.params._id);

    const commitData = await opCampaignModel.findOne({ _id: id });

    const commitmentData = {};

    if (commitData && commitData.commitments) {
        for (const item of commitData.commitments) {
            const cmt = await commitmentModel.findOne({ cmtId: item.selectValue });
            if (cmt) {
                commitmentData[cmt.cmtName] = item.textValue;
            }
        }
    }

    const result = { commitmentdata: commitmentData };

    const pageCount = await opExecutionModel.find({ campaignId: id }).count();

    const resultnew = await opExecutionModel.aggregate([
        {
            $match: { campaignId: id }
        },
        {
            $group: {
                _id: null,
                executed: { $sum: { $cond: [{ $gt: ["$post_like", 0] }, 1, 0] } },
                remaining: { $sum: { $cond: [{ $eq: ["$post_like", 0] }, 1, 0] } },
                post_likes: { $sum: "$post_like" },
                post_comments: { $sum: "$post_comment" },
                post_views: { $sum: "$post_views" }
            }
        },
        {
            $project: {
                _id: 0,
                executed: 1,
                remaining: 1,
                post_likes: 1,
                post_comments: 1,
                post_views: 1
            }
        }
    ]);

    res.status(200).json({ completedData: resultnew[0], commitmentdata: result.commitmentdata, page_count: pageCount });
}

exports.addNewPage = async (req, res) => {

    const assignmentData = await opExecutionModel.findOne({
        phaseName: req.body.phaseName,
        campaignId: req.body._id
    });

    const add = await opCampaignPhaseModel({
        phaseName: req.body.phaseName,
        p_id: req.body.p_id,
        postPerPage: 1,
        postRemaining: 0,
        storyPerPage: 1,
        storyRemaining: 0,
        campaignId: req.body._id,
        description: "",
        start_date: null,
        end_date: null
    })
    const finalAdd = await add.save();

    const data = await opCampaignPlanModel.find({ campaignId: req.body._id }).select({ planName: 1 });

    const add1 = await opCampaignPlanModel({
        planName: data[0].planName,
        p_id: req.body.p_id,
        postPerPage: 1,
        postRemaining: 0,
        storyPerPage: 1,
        storyRemaining: 0,
        campaignId: req.body._id,
        isExecuted: false
    })

    const finalAdd1 = await add1.save()

    const data1 = await opCampaignPhaseModel.find({ campaignId: req.body._id }).select({ _id: 1 });

    const add2 = await opExecutionModel({
        campaignId: req.body._id,
        phase_id: data1[0].phase_id,
        phaseName: req.body.phaseName,
        p_id: req.body.p_id,
        postPerPage: 1,
        postRemaining: 0,
        storyPerPage: 1,
        storyRemaining: 0,
        ass_status: 'pending',
        isExecuted: false,
        post_link: "",
        post_date: null,
        post_type: "",
        post_like: 0,
        post_comment: 0,
        post_views: 0,
        post_captions: "",
        post_media: "",
        last_link_hit_date: null,
        story_link: "",
        story_date: null,
        story_like: 0,
        story_comment: 0,
        story_views: 0,
        story_captions: "",
        story_media: "",
        story_last_link_hit_date: null
    })

    const finalAdd2 = await add1.save()
    res.status(200).json({ data: finalAdd2 })
}

exports.getPhaseCommits = async (req, res) => {
    let name = req.params.phaseName;
    name = name.trim();
    const result = await opExecutionModel.aggregate([
        {
            $match: { phaseName: name }
        },
        {
            $group: {
                _id: null,
                post_likes: { $sum: "$post_like" },
                post_comments: { $sum: "$post_comment" },
                post_views: { $sum: "$post_views" }
            }
        },
        {
            $project: {
                _id: 0,
                post_likes: 1,
                post_comments: 1,
                post_views: 1
            }
        }
    ]);

    if (result.length === 0) {
        return res.status(404).json({
            message: "No data found for the provided phaseName."
        });
    }

    res.status(200).json({
        data: result[0]
    });
};

exports.phaseCreatedCampaign = async (req, res) => {
    try {
        const campaignPhaseIds = await opCampaignPhaseModel.distinct("campaignId");

        const campaigns = await opCampaignModel.aggregate([
            {
                $match: {
                    _id: { $in: campaignPhaseIds }
                }
            },
            {
                $lookup: {
                    from: "execampaignmodels",
                    localField: "pre_campaign_id",
                    foreignField: "_id",
                    as: "exeCampData",
                },
            },
            {
                $unwind: {
                    path: "$exeCampData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    pre_brand_id: 1,
                    pre_campaign_id: 1,
                    campaign_data: {
                        _id: "$exeCampData._id",
                        exeCmpId: "$exeCampData.exe_campaign_id",
                        exeCmpName: "$exeCampData.exe_campaign_name",
                        exeHashTag: "$exeCampData.exe_hash_tag"
                    },
                    pre_industry_id: 1,
                    pre_agency_id: 1,
                    pre_goal_id: 1,
                    hash_tag: 1,
                }
            }
        ]);

        if (!campaigns || campaigns.length === 0) {
            return response.returnFalse(200, req, res, "No Record Found...", []);
        }

        res.status(200).send(campaigns);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
}