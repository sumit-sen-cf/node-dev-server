const response = require("../common/response.js");
const opCampaignPlanModel = require("../models/opCampaignPlanModel.js")


exports.addCampaignPlan = async (req, res) => {

    const { pages, campaignId, campaignName, planName } = req.body;

    if (!Array.isArray(pages) || !campaignId || !campaignName || !planName) {
        return res.send("Invalid Input Data");
    }

    for (const page of pages) {
        if (!page.postPerPage || !page.storyPerPage) {
            return res.send("All pages should contain storyPerPage and postPerPage");
        }
    }

    const insertData = pages.map(page => ({
        planName,
        campaignId,
        campaignName,
        postRemaining: page.postPerPage,
        storyRemaining: page.storyPerPage,
        ...page
    }));

    try {
        await opCampaignPlanModel.insertMany(insertData);

        const campaignPlanData = await opCampaignPlanModel.find({ campaignId });

        return response.returnTrue(
            200,
            req,
            res,
            "Campaign Plan  Created Successfully",
            campaignPlanData
        );
    } catch (error) {
        return response.returnFalse(500, req, res, err.message, {});
    }

}

exports.getCampaignPlan = async (req, res) => {
    const id = req.params.id;

    const data = await opCampaignPlanModel.find({ campaignId: id })

    if (!data) {
        return res.send("Data not found");
    }

    response.returnTrue(
        200,
        req,
        res,
        "Campaign Plan  data Fetched Successfully",
        data
    );
}


exports.getSingleCampaignPlan = async (req, res) => {

    const singlePlanData = await opCampaignPlanModel.find({ _id: req.params._id })

    if (!singlePlanData) {
        return res.send("Data not found");
    }

    response.returnTrue(
        200,
        req,
        res,
        "Single Campaign Plan data Fetched Successfully",
        singlePlanData
    );
}

exports.updateSingleCampaignPlan = async (req, res) => {
    const id = req.params.id;

    const result = await opCampaignPlanModel.findOneAndUpdate({ _id: id }, req.body, { new: true });

    if (!result) {
        return res.send("Data not Found For This Id")
    }

    res.send({ data: result, status: 200 })
}

exports.deleteCampaignPlanDataByCampaignId = async (req, res) => {
    opCampaignPlanModel.deleteMany({ campaignId: req.params.id }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'Campaign Plan Data deleted By Campaign Id' })
        } else {
            return res.status(404).json({ success: false, message: 'Campaign Plan Data by this Campaign Id not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err.message })
    })
};

exports.deleteCampaignPlan = async (req, res) => {
    opCampaignPlanModel.deleteOne({ _id: req.params.id }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'Campaign Plan Data deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'Campaign Plan Data  not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err.message })
    })
};