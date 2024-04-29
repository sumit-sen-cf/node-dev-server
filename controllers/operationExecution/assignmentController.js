const response = require('../../common/response');
const appError = require('../../helper/appError');
const catchAsync = require('../../helper/catchAsync');
const AssignmentModel = require('../../models/operationExecution/assignmentModel')
const campaignPlanModel = require('../../models/operationExecution/campaignPlanModel');
const campaignPhaseModel = require('../../models/operationExecution/campaignPhaseModel')
const PhasePageModel = require('../../models/operationExecution/phasePageModel')

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
        post_link: req.body.post_link
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
    if(result.length == 0){
        return res.status(404).json({data:[],sms:'no data found from this phase id'})
    }
    res.status(200).json({
        data: result
    })
})

exports.getAllPhasesByCampId = catchAsync(async (req, res, next) => {
    const id = req.params._id;
    const result = await campaignPhaseModel.find({campaignId: id});
    // const result = await AssignmentModel.find({ phase_id: id });
    if(result.length == 0){
        return res.status(404).json({data:[],sms:'no data found from this campaign id'})
    }
    res.status(200).json({
        data: result
    })
})