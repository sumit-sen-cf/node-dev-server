const response = require("../common/response.js");
const opCampaignPlanModel = require("../models/opCampaignPlanModel.js")
const XLSX = require('xlsx');
const axios = require('axios');
const mongoose = require('mongoose');

exports.addCampaignPlan = async (req, res) => {
    const { pages, campaignId, planName, postPerPage, storyPerPage } = req.body;

    if (!Array.isArray(pages) || !campaignId || !planName) {
        return res.send("Invalid Input Data");
    }

    for (const page of pages) {
        if (!page.postPerPage || !page.storyPerPage) {
            return res.send("All pages should contain storyPerPage and postPerPage");
        }
    }

    try {

        const insertData = pages.map(page => ({
            planName,
            campaignId,
            postPerPage: page.postPerPage || postPerPage,
            storyPerPage: page.storyPerPage || storyPerPage,
            postRemaining: page.postPerPage,
            storyRemaining: page.storyPerPage,
            ...page
        }));

        await opCampaignPlanModel.insertMany(insertData);

        const campaignPlanData = await opCampaignPlanModel.find({ campaignId });

        return response.returnTrue(
            200,
            req,
            res,
            "Campaign Plan Created Successfully",
            campaignPlanData
        );
    } catch (error) {
        return response.returnFalse(500, req, res, error.message, {});
    }
};

exports.getCampaignPlan = async (req, res) => {
    try {
        const id = mongoose.Types.ObjectId(req.params.id);

        const data = await opCampaignPlanModel.find({ campaignId: id });

        if (!data || data.length === 0) {
            return res.status(200).json({ data: [], msg: "Data not found" });
        }

        const response = await axios.get(
            'https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList'
        );
        const inventoryDataList = response.data.body;

        const inventoryDataMap = inventoryDataList.reduce((acc, item) => {
            acc[item.p_id] = {
                page_name: item.page_name,
                follower_count: item.follower_count,
                page_link: item.page_link,
                cat_name: item.cat_name
            };
            return acc;
        }, {});

        const mergedData = data.map(plan => {
            const inventoryInfo = inventoryDataMap[plan.p_id] || {};
            return {
                ...plan._doc,
                ...inventoryInfo
            };
        });

        return res.status(200).json({
            message: "Campaign Plan data fetched successfully",
            data: mergedData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

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
};

exports.updateSingleCampaignPlan = async (req, res) => {
    const id = req.params.id;

    const result = await opCampaignPlanModel.findOneAndUpdate({ _id: id }, req.body, { new: true });

    if (!result) {
        return res.send("Data not Found For This Id")
    }

    res.send({ data: result, status: 200 })
};

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
    opCampaignPlanModel.deleteOne({ _id: req.params._id }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'Campaign Plan Data deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'Campaign Plan Data  not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err.message })
    })
};

exports.getNsendExcelDataInJson = async (req, res) => {
    try {
        const excelUrl = req.body.excelUrl;
        const response = await axios.get(excelUrl, { responseType: 'arraybuffer' });

        const workbook = XLSX.read(response.data, { type: 'buffer' });
        const sheetName = workbook.SheetNames[1];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet);
        const nonEmptyData = jsonData.filter(obj => Object.keys(obj).length !== 0);

        res.json(nonEmptyData);
    } catch (error) {
        console.error('Error extracting data from Excel:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.replacePlanPage = async (req, res, next) => {
    const { campaignId, new_pid, old_pid } = req.body;

    if (!campaignId || !Array.isArray(new_pid) || !old_pid) {
        return res.status(400).json({ success: false, message: 'CampaignId, new_pid array, and old_pid are required' });
    }

    try {

        const planData = await opCampaignPlanModel.findOne({ campaignId }).select({ planName: 1 });

        if (!planData) {
            return res.status(404).json({ success: false, message: 'Plan data not found for the given campaignId' });
        }

        const deleteResult = await opCampaignPlanModel.deleteOne({ campaignId, p_id: old_pid });

        const results = await Promise.all(new_pid.map(async (pid) => {
            const newPlan = await opCampaignPlanModel.create({
                planName: planData.planName,
                p_id: pid,
                postPerPage: 1,
                storyPerPage: 1,
                campaignId
            });
            return newPlan;
        }));

        res.status(200).json({ success: true, data: results });

    } catch (error) {
        next(error);
    }
};