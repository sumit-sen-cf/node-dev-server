const nodemailer = require('nodemailer');
const helper = require('../helper/helper.js');
const planMakingPrimaryModel = require('../models/planMakingPrimaryModel.js')
const planMakingSecModel = require('../models/planMakingSecModel.js')

exports.addPlanMaking = async (req, res) => {
    try {
        const pageData = req.body.pageData;
        const createData = new planMakingPrimaryModel({
            plan_name: req.body.plan_name,
            total_cost: req.body.total_cost,
            post_per_page: req.body.post_per_page,
            story_per_page: req.body.story_per_page,
            followers: req.body.followers,
            // saved_date: 
            saved_by: req.body.saved_by,
            plan_status: req.body.plan_status
        });
        const dataToAdd = await createData.save();
        
        for(let i=0; i<pageData.length; i++){
            const savePageData = new planMakingSecModel({
                plan_making_id: dataToAdd._id,
                p_id: pageData[i].p_id,
                page_name: pageData[i].page_name,
                page_link: pageData[i].page_link,
                status: pageData[i].status,
                cost_per_post: pageData[i].cost_per_post,
                cost_per_story: pageData[i].cost_per_story,
                both_cost: pageData[i].both_cost
            })
            const dataAdding = await savePageData.save();
        }
        res.status(200).send({data:dataToAdd,message:'Plan creation successfully'})
    } catch (error) {
        return res.status(500).send({error:error.message, message:'data cannot be added'});
    }
}

exports.getAllPlanMakingData = async (req, res) => {
    try {
        const vendorData = await planMakingPrimaryModel.aggregate([
            {
                $lookup: {
                    from: "planmakingsecmodels",
                    localField: "_id",
                    foreignField: "plan_making_id",
                    as: "planPageDetails",
                },
            }, {
                $unwind: {
                    path: "$planPageDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    plan_name: 1,
                    total_cost: 1,
                    post_per_page: 1,
                    story_per_page: 1,
                    followers: 1,
                    saved_date: 1, 
                    saved_by: 1,
                    plan_status: 1,
                    // plan_making_id: dataToAdd._id,
                    p_id: '$planPageDetails.p_id',
                    page_name: '$planPageDetails.page_name',
                    page_link: '$planPageDetails.page_link',
                    status: '$planPageDetails.status',
                    cost_per_post: '$planPageDetails.cost_per_post',
                    cost_per_story: '$planPageDetails.cost_per_story',
                    both_cost: '$planPageDetails.both_cost'
                }
            }
        ]);
        if (!vendorData) {
            return res.status(200).json({ data: [], message: 'No Reord Found...' });
        }
        return res.status(200).json({ data: vendorData, message: 'Data fetched successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'error while getting data' })
    }
}

exports.getSinglePlanMakingData = async (req, res) => {
    try {
        const vendorData = await planMakingPrimaryModel.aggregate([
            {
                $match:{_id: req.params._id}
            },
            {
                $lookup: {
                    from: "planmakingsecmodels",
                    localField: "_id",
                    foreignField: "plan_making_id",
                    as: "planPageDetails",
                },
            }, {
                $unwind: {
                    path: "$planPageDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    plan_name: 1,
                    total_cost: 1,
                    post_per_page: 1,
                    story_per_page: 1,
                    followers: 1,
                    saved_date: 1, 
                    saved_by: 1,
                    plan_status: 1,
                    // plan_making_id: dataToAdd._id,
                    p_id: '$planPageDetails.p_id',
                    page_name: '$planPageDetails.page_name',
                    page_link: '$planPageDetails.page_link',
                    status: '$planPageDetails.status',
                    cost_per_post: '$planPageDetails.cost_per_post',
                    cost_per_story: '$planPageDetails.cost_per_story',
                    both_cost: '$planPageDetails.both_cost'
                }
            }
        ]);
        if (!vendorData) {
            return res.status(200).json({ data: [], message: 'No Reord Found...' });
        }
        return res.status(200).json({ data: vendorData, message: 'Data fetched successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'error while getting data' })
    }
}