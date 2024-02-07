const response = require('../../common/response');
const appError = require('../../helper/appError');
const catchAsync = require('../../helper/catchAsync');
const AssignmentModel = require('../../models/operationExecution/assignmentModel')
const campaignPlanModel = require('../../models/operationExecution/campaignPlanModel');
const PhasePageModel = require('../../models/operationExecution/phasePageModel')
const ExpertiseModel = require('../../models/operationExecution/expertiseModel')
const PreAssignmentModel = require('../../models/operationExecution/preAssignmentModel');
const assignmentModel = require('../../models/operationExecution/assignmentModel');




exports.createPreAssignment = catchAsync(async (req, res, next) => {
    const phase_id = req.body.phase_id;
    const ass_by = req.body.ass_by;
    const phasePage = await PhasePageModel.find({ phase_id: phase_id });
    const expertees = await ExpertiseModel.find({});

    const preAssignmentPromises = [];

    for (const page of phasePage) {
        const { _id, ...rest } = page.toObject();
        let flag = 0
        const filteredExpert = expertees.filter(expert =>
            expert.area_of_expertise.category.includes(page.cat_name)
        );
        if (filteredExpert.length == 0) {
            const x = await PreAssignmentModel.create({
                ass_page: page._id,

                phase_id,
                campaignId: page.campaignId,
            });
            const data = {
                ass_by,
                ass_status: 'unassigned',
                ...rest,
                preAssignedTo: [],

            };
            await AssignmentModel.create(data);

        }
        for (const expert of filteredExpert) {
            const x = await PreAssignmentModel.create({
                ass_page: page._id,
                pre_ass_to: expert._id,
                phase_id,
                campaignId: page.campaignId,
            });

            const assignExpert = await PreAssignmentModel.findOne({ pre_ass_id: x.pre_ass_id });


            const data = {
                ass_by,
                ass_status: 'unassigned',
                ...rest,

                preAssignedTo: [assignExpert.pre_ass_to?.exp_name]
            };

            const assExist = await AssignmentModel.findOne({ p_id: page.p_id, phase_id });

            if (assExist) {

                if (!assExist.preAssignedTo.includes(assignExpert.pre_ass_to?.exp_name)) {
                    assExist.preAssignedTo.push(assignExpert.pre_ass_to?.exp_name);
                    await assExist.save();
                }
            } else {
                await AssignmentModel.create(data);
            }
        }
    }

    const preasss = await PreAssignmentModel.find({ phase_id: phase_id });
    const ass = await AssignmentModel.find({ phase_id: phase_id });

    res.status(200).json({
        length: preasss.length,
        data: preasss,
        ass: ass
    });
});

exports.preAssignmentUpdate = catchAsync(async (req, res, next) => {
    //first update the perticular preAssignment status 
    //if approved ,preassmodel-> status:'accepted',
    //assignmentModel -> assignedto->expertee ID ,exp_name

    //if rejected,preassmodel-> status:'rejected',reaseon:'abc'
    //assignmentModel ->rejected by->push in array expertee name

    //forceful assignment logic,
    //if rejeted by everyone then there should there should be an option in front.

    const { pre_ass_id, status, rejectedReason, phase_id, p_id } = req.body
    const assStatusCheck = await AssignmentModel.findOne({ phase_id, p_id })
    if (assStatusCheck.ass_status == "assigned") {
        res.status(404).json({
            message: `Already assigned to ${assStatusCheck.ass_to.exp_name}`
        })
    }
    const updatePreAss = await PreAssignmentModel.findOneAndUpdate({ pre_ass_id },
        {
            status,
            // rejectedReason
        }, {
        new: true
    })
    // const otherPreAssign=await PreAssignmentModel.find({phase_id: updatePreAss.ass_page.phase_id,p_id:updatePreAss.ass_page.p_id})
    // for(page of otherPreAssign){
    //     if(page.pre_ass_id!=pre_ass_id){

    //         const x=await PreAssignmentModel.findOneAndUpdate({})
    //     }
    // }
    let preAss
    let ass
    if (status == "accepted") {
        ass = await assignmentModel.findOneAndUpdate({ phase_id: updatePreAss.ass_page.phase_id, p_id: updatePreAss.ass_page.p_id },
            {
                ass_to: updatePreAss.pre_ass_to._id,
                ass_name: updatePreAss.pre_ass_to.exp_name,
                ass_status: 'assigned'
            },
            {
                new: true
            })
    }
    if (status == "rejected") {
        const x = await assignmentModel.findOne({ phase_id: updatePreAss?.ass_page.phase_id, p_id: updatePreAss?.ass_page.p_id })
        x.rejected_by.push(updatePreAss.pre_ass_to.exp_name)
        const newPreassTo = x.preAssignedTo.filter(exp => exp != updatePreAss.pre_ass_to.exp_name)
        x.preAssignedTo = newPreassTo
        ass = await x.save()
    }
    res.status(200).json({
        preAssignment: updatePreAss,
        assignment: ass
    })
})

exports.acceptAllPreAssignments = catchAsync(async (req, res, next) => {
    let assignedPages = []
    const { preAssignedPages, pre_ass_id } = req.body
    for (const pages of preAssignedPages) {
        const assStatusCheck = await AssignmentModel.findOne({ phase_id: pages.phase_id, p_id: pages.p_id })
        if (assStatusCheck?.ass_status == "assigned") {
            assignedPages.push(pages)
            continue
        }
        const updatePreAss = await PreAssignmentModel.findOneAndUpdate({ pre_ass_id: pages.pre_ass_id },
            {
                status: 'accepted',
                // rejectedReason
            }, {
            new: true
        })
        const ass = await assignmentModel.findOneAndUpdate({ phase_id: updatePreAss.ass_page.phase_id, p_id: updatePreAss.ass_page.p_id },
            {
                ass_to: updatePreAss.pre_ass_to._id,
                ass_name: updatePreAss.pre_ass_to.exp_name,
                ass_status: 'assigned'
            },
            {
                new: true
            })
    }
    res.status(200).json({
       
        assignedPages
    })
})

exports.getPreAssignmentForExpertee = catchAsync(async (req, res, next) => {
    const pre_ass_to = req.params.id
    const preAsss = await PreAssignmentModel.find()
    const preAss = preAsss.filter(page => page.pre_ass_to?.user_id == pre_ass_to)
    res.status(200).json({
        data: preAss
    })
})

exports.getSinglePreAss = catchAsync(async (req, res, next) => {
    // const {}
})





exports.getPreAssignmnetOnPhaseId = catchAsync(async (req, res, next) => {
    const phase_id = req.body.phase_id
    const result = await PreAssignmentModel.find({ phase_id })
    res.status(200).json({
        data: result
    })
})