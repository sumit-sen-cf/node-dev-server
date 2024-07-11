const response = require("../common/response.js");
const opCampaignPhaseModel = require("../models/opCampaignPhaseModel.js");
const opCampaignPlanModel = require("../models/opCampaignPlanModel.js");
const opExecutionModel = require("../models/opExecutionModel.js")
const axios = require('axios');
const mongoose = require('mongoose');

exports.addCampaignPhase = async (req, res) => {

    const { pages, campaignId, start_date, end_date, description, postPerPage, storyPerPage } = req.body;
    const phaseName = req.body.phaseName.trim();

    for (const page of pages) {
        if (!page.postPerPage || !page.storyPerPage) {
            return res.send("All pages should contain storyPerPage and postPerPage");
        }
    }

    try {
        const insertData = pages.map(page => ({
            campaignId,
            phaseName,
            start_date,
            end_date,
            description,
            postRemaining: page.postPerPage,
            storyRemaining: page.storyPerPage,
            ...page
        }));

        const campaignPhaseData = await opCampaignPhaseModel.insertMany(insertData);

        const executionData = campaignPhaseData.map(phase => ({
            phase_id: phase._id,
            campaignId: phase.campaignId,
            p_id: phase.p_id,
            phaseName: phase.phaseName,
            start_date: phase.start_date,
            end_date: phase.end_date
        }));

        const executionResult = await opExecutionModel.insertMany(executionData);

        res.status(200).send({
            message: "Campaign Phase Created Successfully",
            campaignPhaseData,
            executionResult
        });

    } catch (error) {
        return response.returnFalse(500, req, res, error.message, {});
    }
}

exports.getOpCampaignPhases = async (req, res) => {
    try {
        const campaignPhases = await opCampaignPhaseModel
            .aggregate([
                {
                    $match: { campaignId: mongoose.Types.ObjectId(req.params.id) }
                },
                {
                    $project: {
                        _id: 1,
                        phaseName: 1,
                        p_id: 1,
                        description: 1,
                        postPerPage: 1,
                        storyPerPage: 1
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
    const { campaignId, p_id } = req.body;

    if (!campaignId || !p_id) {
        return res.status(400).json({ success: false, message: 'CampaignId and p_id are required' });
    }

    try {
        const phaseDeletionResult = await opCampaignPhaseModel.deleteOne({ campaignId: campaignId, p_id: p_id });

        const planDeletionResult = await opCampaignPlanModel.deleteOne({ campaignId: campaignId, p_id: p_id });

        return res.status(200).json({
            success: true,
            message: 'Page Deleted From Plan and Phase'
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

exports.deleteCampaignPhase = async (req, res) => {
    opCampaignPhaseModel.deleteOne({ _id: req.params._id }).then(item => {
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
    const { campaignId, new_pid, old_pid, phaseName } = req.body;

    try {

        const planData = await opCampaignPlanModel.findOne({ campaignId }).select({ planName: 1 });
        const phaseData = await opCampaignPhaseModel.findOne({ campaignId, phaseName }).select({ phaseName: 1, description: 1, start_date: 1, end_date: 1 });

        if (!planData || !phaseData) {
            return res.status(404).json({ success: false, message: 'Plan or Phase data not found for the given campaignId and phaseName' });
        }

        const oldPhaseExists = await opCampaignPhaseModel.findOne({ campaignId, p_id: old_pid });
        const oldPlanExists = await opCampaignPlanModel.findOne({ campaignId, p_id: old_pid });

        if (oldPhaseExists && oldPlanExists) {

            await opCampaignPhaseModel.deleteOne({ campaignId, p_id: old_pid });
            await opCampaignPlanModel.deleteOne({ campaignId, p_id: old_pid });

            const newResults = await Promise.all(new_pid.map(async (p_id) => {
                const newPlan = await opCampaignPlanModel.create({
                    planName: planData.planName,
                    p_id: p_id,
                    postPerPage: 1,
                    storyPerPage: 1,
                    campaignId
                });

                const newPhase = await opCampaignPhaseModel.create({
                    phaseName: phaseData.phaseName,
                    p_id: p_id,
                    description: phaseData.description,
                    postPerPage: 1,
                    storyPerPage: 1,
                    campaignId,
                    start_date: phaseData.start_date,
                    end_date: phaseData.end_date
                });

                return { newPlan, newPhase };
            }));

            return res.status(200).json({ success: true, data: newResults });
        } else {
            return res.status(404).json({ success: false, message: 'Old phase or plan data not found for the given old_pid' });
        }
    } catch (error) {
        next(error);
    }
};