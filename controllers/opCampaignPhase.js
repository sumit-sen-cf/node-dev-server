const response = require("../common/response.js");
const opCampaignPhaseModel = require("../models/opCampaignPhaseModel.js");
const opCampaignPlanModel = require("../models/opCampaignPlanModel.js");

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
                    $match: { campaignId: req.params.id }
                },
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

        const inventoryDataListPre = await axios.get(
            'https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList'
        );
        const inventoryDataList = inventoryDataListPre.data.body;

        const enrichedCampaignPhases = campaignPhases.map(phase => {
            const inventoryData = inventoryDataList.find(item => item.p_id === phase.p_id) || {};
            return {
                ...phase,
                page_name: inventoryData.page_name || null,
                follower_count: inventoryData.follower_count || null,
                page_link: inventoryData.page_link || null,
                cat_name: inventoryData.cat_name || null
            };
        });

        res.status(200).send(enrichedCampaignPhases)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.deleteCampaignPhaseDataByCampaignId = async (req, res) => {
    opCampaignPhaseModel.deleteMany({ campaignId: req.params.id }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'Campaign Phase Data deleted By Campaign Id' })
        } else {
            return res.status(404).json({ success: false, message: 'Campaign Phase Data by this Campaign Id not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err.message })
    })
};

exports.deleteCampaignPhase = async (req, res) => {
    opCampaignPhaseModel.deleteOne({ _id: req.params.id }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'Campaign Phase Data deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'Campaign Phase Data not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err.message })
    })
};

exports.replacePhasePage = async (req, res, next) => {
    const id = req.body._id;

    const result = await opCampaignPlanModel.findByIdAndUpdate(req.body._id,
        { 
            p_id: req.body.new_pid
        }, 
        { new: true }
    );

    const result2 = await opCampaignPhaseModel.findOneAndUpdate({ campaignId: id, p_id: req.body.old_pid }, 
    {
        p_id: req.body.new_pid
    })

    res.status(200).json({ data: result })
}