const response = require('../../common/response');
const appError = require('../../helper/appError');
const catchAsync = require('../../helper/catchAsync');
const AssignmentModel = require('../../models/operationExecution/assignmentModel')
const campaignPlanModel = require('../../models/operationExecution/campaignPlanModel');
const campaignPhaseModel = require('../../models/operationExecution/campaignPhaseModel')
const PhasePageModel = require('../../models/operationExecution/phasePageModel')
const PhaseCommitmentModel = require('../../models/operationExecution/phaseCommitmentModel')
const axios = require("axios");

exports.createAssignment = catchAsync(async (req, res, next) => {
    const { ass_to, ass_by, page, ass_status, ass_id } = req.body
    let { _id, ...rest } = page
    let status = ass_to ? ass_status : "unassigned"
    const data = {
        ass_by,
        ass_to,
        ass_status: status,
        ...rest
    }
    let result;
    if (!ass_id) {
        const assignment = await AssignmentModel.findOne({}, {}, { sort: { 'ass_id': -1 } });
        const lastAssId = assignment ? assignment.ass_id : 0;
        data.ass_id = lastAssId + 1;
        result = await AssignmentModel.create(data);
    } else {
        result = await AssignmentModel.findOneAndUpdate({ ass_id }, data, {
            upsert: true,
            new: true
        });
    }
    res.status(200).json({
        data: result
    })
})

exports.createAssignmentBulk = catchAsync(async (req, res, next) => {
    const { pages } = req.body
    const results = await Promise.all(
        pages.map(async page => {
            let { _id, ...rest } = page
            let status
            if (page.ass_to) {
                if (page.ass_status == 'unassigned') {
                    // console.log(page.page_name)
                    status = 'assigned'
                } else {
                    status = page.ass_status
                }
            } else status = 'unassigned'
            console.log(status)
            const data = {

                ...rest,
                ass_status: status,
            }

            let result;
            if (!page.ass_id) {

                const assignment = await AssignmentModel.findOne({}, {}, { sort: { 'ass_id': 0 } });
                const lastAssId = assignment ? assignment.ass_id : 0;
                data.ass_id = lastAssId + 1;
                result = await AssignmentModel.create(data);
                return { ...result }
            } else {

                result = await AssignmentModel.findOneAndUpdate({ ass_id: page.ass_id }, data, {
                    // upsert: true,
                    new: true
                });
                return { ...result }
            }
        })
    )
    res.status(200).json({
        data: results
    })
})

exports.getAllAssignmentToExpertee = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const results = await AssignmentModel.find()
    const result = results.filter(page => page.ass_to?.user_id == id)
    res.status(200).json({
        data: result
    })
})

exports.getAllAssignments = catchAsync(async (req, res, next) => {
    const results = await AssignmentModel.find()
    res.status(200).json({
        data: results
    })
})

exports.getSingleAssignment = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const result = await AssignmentModel.find({ ass_id: id })
    if (!result) {
        return next(new appError(404, "assignment not found"))
    }
    res.status(200).json({
        data: result
    })
})

exports.getAllGodamnAssignments = catchAsync(async (req, res, next) => {
    const result = await AssignmentModel.find()
    res.status(200).json({
        data: result
    })
})

exports.getAllAssignmentInPhase = catchAsync(async (req, res, next) => {
    const phase_id = req.params.id
    const result = await AssignmentModel.find({ phase_id: phase_id })
    if (!result) {
        res.status(200).json({
            data: []
        })
    }
    res.status(200).json({
        data: result
    })
})

exports.getAllAssignmentInCampaign = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const result = await AssignmentModel.find({ campaignId: id })
    res.status(200).json({
        data: result
    })
})

exports.updateAssignment = catchAsync(async (req, res, next) => {
    const { campaignId, p_id, phase_id } = req.body
    const filter1 = { campaignId, p_id, phase_id };
    const filter2 = { campaignId, p_id };

    const options2 = {
        new: true, // Return the modified document rather than the original
    };

    const result = await AssignmentModel.findOneAndUpdate(filter1, req.body, options2);
    if (!result) {
        const data = new AssignmentModel({
            ...req.body
        });
        const savedData = await data.save();
        if (!savedData) {
            return next(new appError(200, "Something went wrong while creating AssignmentModel data."))
        }
    }

    const result2 = await campaignPlanModel.findOneAndUpdate(filter2, { ...req.body, updatedFrom: "Assignment" }, options2);
    if (!result2) {
        const data = new campaignPlanModel({
            ...req.body
        });
        const savedData = await data.save();
        if (!savedData) {
            return next(new appError(200, "Something went wrong while creating plan data."))
        }
    }
    const result3 = await PhasePageModel.findOneAndUpdate(filter1, { ...req.body, updatedFrom: "Assignment" }, options2);
    return response.returnTrue(200, req, res, "Updation Operation Successfully.")
})

exports.updateAssignmentStatus = catchAsync(async (req, res, next) => {
    const { ass_status, campaignId, ass_id } = req.body
    const response = await AssignmentModel.findOneAndUpdate({ ass_id, campaignId }, { ass_status: ass_status }, { new: true })
    res.status(200).json({ data: response })
})

exports.updatePostDetails = catchAsync(async (req, res, next) => {

    const response = await AssignmentModel.findOneAndUpdate({ ass_id: req.body.ass_id }, {
        post_like: req.body.post_like,
        post_comment: req.body.post_comment,
        post_views: req.body.post_views,
        last_link_hit_date: req.body.last_link_hit_date,
        post_date: req.body.post_date,
        post_type: req.body.post_type,
        post_captions: req.body.post_captions,
        post_media: req.body.post_media,
        post_link: req.body.post_link,
        story_like: req.body.story_like,
        story_comment: req.body.story_comment,
        story_views: req.body.story_views,
        story_last_link_hit_date: req.body.story_last_link_hit_date,
        story_date: req.body.story_date,
        story_captions: req.body.story_captions,
        story_media: req.body.story_media,
        story_link: req.body.story_link
    },
        {
            new: true
        });
    res.status(200).json({ data: response })
})

exports.getcampaignWiseCountsData = async (req, res) => {
    try {
        //get campaign id from the query
        let campaignId = req.params?.id

        //counts get from the 
        const assignmentModelData = await AssignmentModel.aggregate([{
            $match: {
                campaignId: campaignId
            }
        }, {
            $group: {
                _id: "$campaignId",
                totalPost_comment: { $sum: "$post_comment" },
                totalPost_like: { $sum: "$post_like" },
                totalPost_views: { $sum: "$post_views" },
            }
        }]);

        //succcess response send
        res.status(200).send({ data: assignmentModelData });
    } catch (error) {
        return res.send({
            error: error.message,
            status: 500,
            sms: "Error getting in campaign wise counts assignment get data",
        });
    }
};

exports.getAllAssignmentsFromPhaseId = catchAsync(async (req, res, next) => {
    const id = Number(req.params.phase_id);
    const result = await AssignmentModel.find({ phase_id: id });
    if (result.length == 0) {
        return res.status(404).json({ data: [], sms: 'no data found from this phase id' })
    }
    res.status(200).json({
        data: result
    })
})

exports.getAllPhasesByCampId = catchAsync(async (req, res, next) => {
    const id = req.params._id;
    const result = await campaignPhaseModel.find({ campaignId: id });
    // const result = await AssignmentModel.find({ phase_id: id });
    if (result.length == 0) {
        return res.status(404).json({ data: [], sms: 'no data found from this campaign id' })
    }
    res.status(200).json({
        data: result
    })
})

// exports.getCampCommits = catchAsync(async (req, res, next) => {
//     const id = req.params._id;
//     const result = await PhaseCommitmentModel.find({ campaignId: id });
//     const result1 = await AssignmentModel.find({ campaignId: id }).select({ campaignId: 1 });
//     const lengthData = result1.length;

//     const resultnew = await AssignmentModel.aggregate([
//         {
//             $match: { campaignId: id }
//         },
//         {
//             $group: {
//                 _id: null,
//                 post_likes: { $sum: "$post_like" },
//                 post_comments: { $sum: "$post_comment" },
//                 post_views: { $sum: "$post_views" }
//             }
//         },
//         {
//             $project: {
//                 _id: 0,
//                 post_likes: 1,
//                 post_comments: 1,
//                 post_views: 1
//             }
//         }
//     ]);

//     const commitSum = {};
//     result.forEach(commitment => {
//         const { commitment: type, value } = commitment;
//         commitSum[type] = (commitSum[type] || 0) + parseInt(value)
//     })
//     res.status(200).json({ commitmentdata: commitSum, completedData: resultnew[0] })
// })


exports.getCampCommits = catchAsync(async (req, res, next) => {
    const id = req.params._id;
    const result = await PhaseCommitmentModel.find({ campaignId: id });
    const result1 = await AssignmentModel.find({ campaignId: id }).select({ campaignId: 1 });
    const lengthData = result1.length;

    const resultnew = await AssignmentModel.aggregate([
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

    const commitSum = {};
    result.forEach(commitment => {
        const { commitment: type, value } = commitment;
        commitSum[type] = (commitSum[type] || 0) + parseInt(value)
    })
    res.status(200).json({ commitmentdata: commitSum, completedData: resultnew[0], page_count: lengthData })
})


exports.getPhaseCommits = catchAsync(async (req, res, next) => {
    const id = req.params.phase_id;
    const result = await AssignmentModel.aggregate([
        {
            $match: { phase_id: id }
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
            message: "No data found for the provided phase_id."
        });
    }

    res.status(200).json({
        data: result[0]
    });
});

exports.getAllExePhasesByCampId = catchAsync(async (req, res, next) => {
    const id = req.params._id;
    const result = await AssignmentModel.find({ campaignId: id });
    // const result = await AssignmentModel.find({ phase_id: id });
    if (result.length == 0) {
        return res.status(404).json({ data: [], sms: 'no data found from this campaign id' })
    }
    res.status(200).json({
        data: result
    })
});

exports.getShiftPhases = catchAsync(async (req, res, next) => {
    const id = req.body._id;
    const { phaseId1, phaseId2 } = req.body;
    const result = await campaignPhaseModel.findOne({ campaignId: id, phase_id: phaseId1 });
    const update = await PhasePageModel.findOneAndUpdate({ campaignId: id, phase_id: phaseId1 }, {
        phase_id: phaseId2,
        phaseName: result.phaseName
    })

    const update1 = await AssignmentModel.findOneAndUpdate({ campaignId: id, phase_id: phaseId1 }, {
        phase_id: phaseId2,
        phaseName: result.phaseName
    })

    res.status(200).json({ data: update1 });
});

exports.replacePage = catchAsync(async (req, res, next) => {
    const id = req.body._id;
    
    const pageData = await axios.get(
        `https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList`
    );

    const matchPid = pageData.page.body.filter(option => option.p_id == req.body.p_id)[0];
    
    const result = await PhasePageModel.findOneAndUpdate({campaignId: id, phase_id: phaseId, p_id: req.body.p_id},{
        p_id: matchPid.p_id,
        page_name: matchPid.page_name,
        cat_name: matchPid.cat_name,
        platform: matchPid.platform,
        follower_count: matchPid.follower_count,
        page_link: matchPid.page_link
    })
    const result2 = await AssignmentModel.findOneAndUpdate({campaignId: id, phase_id: phaseId, p_id: req.body.p_id},{
        p_id: matchPid.p_id,
        page_name: matchPid.page_name,
        cat_name: matchPid.cat_name,
        platform: matchPid.platform,
        follower_count: matchPid.follower_count,
        page_link: matchPid.page_link
    })
    res.status(200).json({data: result})
})