const response = require("../common/response.js");
const opCampaignPhaseModel = require("../models/opCampaignPhaseModel.js");


exports.addCampaignPhase = async (req, res) => {

    const { pages, campaignId, planId, phaseName, start_date, end_date, postPerPage, storyPerPage } = req.body;

    if (!Array.isArray(pages) || !campaignId || !campaignName || !phaseName || !planId || !start_date || !end_date || !postPerPage || !storyPerPage) {
        return res.send("Invalid Input Data");
    }

    for (const page of pages) {
        if (!page.postPerPage || !page.storyPerPage) {
            return res.send("All pages should contain storyPerPage and postPerPage");
        }
    }

    const insertData = pages.map(page => ({
        campaignId,
        planId,
        phaseName,
        start_date,
        end_date,
        postRemaining: page.postPerPage,
        storyRemaining: page.storyPerPage,
        ...page
    }));

    try {
        const campaignPhaseData = await opCampaignPhaseModel.insertMany(insertData);

        // const campaignPlanData = await opCampaignPhaseModel.find({ campaignId });

        return response.returnTrue(
            200,
            req,
            res,
            "Campaign Phase  Created Successfully",
            campaignPhaseData
        );
    } catch (error) {
        return response.returnFalse(500, req, res, err.message, {});
    }

}

exports.getOpCampaignPhases = async (req, res) => {
    try {
        const campaignPhases = await opCampaignPhaseModel
            .aggregate([
                {
                    $lookup: {
                        from: "opcampaignmodels",
                        localField: "campaignId",
                        foreignField: "_id",
                        as: "campaignData",
                    },
                },
                {
                    $unwind: {
                        path: "$campaignData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "opcampaignplanmodels",
                        localField: "pre_campaign_id",
                        foreignField: "_id",
                        as: "campaignPlanData",
                    },
                },
                {
                    $unwind: {
                        path: "$campaignPlanData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        phaseName: 1,
                        p_id: 1,
                        description: 1,
                        postPerPage: 1,
                        storyPerPage: 1,
                        planId: 1,
                        plan_data: {
                            planName: "$campaignPlanData.planName"
                        },
                        campaignId: 1,
                        campaign_data: {
                            campaignName: "$campaignData.campaignName"
                        }

                    },
                }
            ]);
        if (!campaignPhases) {
            return response.returnFalse(200, req, res, "No Reord Found...", []);
        }
        res.status(200).send(campaignPhases)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};
