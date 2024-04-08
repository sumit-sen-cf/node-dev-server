const appError = require('../../helper/appError');
const catchAsync = require('../../helper/catchAsync');
const pageReplacementRecordModel = require('../../models/operationExecution/pageReplacementRecordModel')
const CampaignPlanModel = require('../../models/operationExecution/campaignPlanModel')
const CampaignPhaseModel = require('../../models/operationExecution/campaignPhaseModel')
const PhasePageModel = require('../../models/operationExecution/phasePageModel')
const AssignmentModel = require('../../models/operationExecution/assignmentModel')
const axios = require('axios')

exports.createReplacementPlan = catchAsync(async (req, res, next) => {
    //????validation check if request is already made


    //extracting data from the body
    const { planName,
        campaignId,

        replacement_request_by,
        pages,
        oldPage_id,
        newPage_id,
        campaignName,
        replacement_stage,
        phase_id,
        phaseName

    } = req.body

    //checking if request is already made fot the old page
    const validation = await pageReplacementRecordModel.findOne({
        campaignId,

        replacement_request_by,

        oldPage_id,
        newPage_id,
        campaignName
    })

    if (validation) {
        return next(new appError(404, "replacement request already made"))
    }

    //createing a data const for the replacement creation
    const dataReplacement =
    {
        replacement_stage,
        planName,
        campaignId,
        campaignName,
        replacement_request_by,
        newPage_id,
        oldPage_id,
    }

    const replacementRecord = await pageReplacementRecordModel.create(dataReplacement)
    // console.log("replacementRecord", replacementRecord)


    //creating the new pages respective of the stages.
    let newPages = []
    const phasePages = await PhasePageModel.find({ p_id: oldPage_id, campaignId })

    const allPhases = await CampaignPhaseModel.find({ campaignId: campaignId })

    pages.forEach(async page => {

        const newPageData = {
            planName,
            campaignId,
            replacement_status: 'active',
            campaignName,
            postRemaining: page.postPerPage,
            replacement_stage,
            replacement_id: replacementRecord._id,
            ...page

        }

        //if the request is made at the plan level , this is true for all the stages
        //doesnt mattter at which stage the request is made creating new page at plan levvel is always true

        const newPage = await CampaignPlanModel.create(newPageData)

        phasePages.forEach(async page => {
            const phasenewpage = await PhasePageModel.create({ ...newPageData, phase_id: page.phase_id, phaseName: page.phaseName })
        })



    });


    //updating the old page and changing its status to pending , again the if the request is made at plan level and 
    //phase level are observed and updating the page at respective level

    const oldPageUpdate = await CampaignPlanModel.findOneAndUpdate({ "p_id": oldPage_id, "campaignId": campaignId }, {
        replacement_status: 'pending',
        replacement_stage,
        replacement_id: replacementRecord._id,
    }, { new: true })

    // console.log("oldPageUpdate", oldPageUpdate);

    for (let i = 0; i < allPhases.length; i++) {
        //2. effect at phase level

        const pageExist = await PhasePageModel.findOneAndUpdate({ phase_id: allPhases[i].phase_id, p_id: oldPage_id },
            {
                replacement_status: "pending",
                replacement_stage,
                replacement_id: replacementRecord._id
            }, { new: true })

        //3. at assignment level

        // const assignmentExist = await AssignmentModel.findOneAndUpdate({ phase_id: allPhases[i].phase_id, p_id: oldPage_id },
        //     {
        //         replacement_status: "pending",
        //         replacement_stage,
        //         replacement_id: replacementRecord._id
        //     }, { new: true })

        // // }
        // console.log(assignmentExist)
    }

    res.status(200).json({
        data: {

            newPages, replacementRecord, oldPageUpdate
        }
    })




})

exports.replacementStatus = catchAsync(async (req, res, next) => {
    //getting the data from frontend
    const { status, replacementRecord, approved_by } = req.body

    const recordStatus = await pageReplacementRecordModel.findByIdAndUpdate(replacementRecord._id,
        {
            "replacement_status": status, "approved_by": approved_by, replacement_result_at: Date.now()


        }, { new: true })


    //updating old page status

    const oldPageUpdate = await CampaignPlanModel.findOneAndUpdate({ "p_id": replacementRecord.oldPage_id, "campaignId": replacementRecord.campaignId }, {
        replacement_status: status == 'approved' ? 'replaced' : 'inactive',

    }, { new: true })

    const allPhases = await CampaignPhaseModel.find({ campaignId: replacementRecord.campaignId })
    for (let i = 0; i < allPhases.length; i++) {


        //2. effect at phase level

        const pageExist = await PhasePageModel.findOneAndUpdate({ phase_id: allPhases[i].phase_id, p_id: replacementRecord.oldPage_id },
            {
                replacement_status: status == 'approved' ? 'replaced' : 'inactive',
                replacement_stage: replacementRecord.replacement_stage,
                replacement_id: replacementRecord._id
            }, { new: true })

        //3. at assignment level

        // const assignmentExist = await AssignmentModel.findOneAndUpdate({ phase_id: allPhases[i].phase_id, p_id: oldPage_id },
        //     {
        //         replacement_status: "pending",
        //         replacement_stage,
        //         replacement_id: replacementRecord._id
        //     }, { new: true })

        // // }
        // console.log(assignmentExist)
    }

    //updating newPage status
    //new pages will be obtained from the replacement records new pages

    replacementRecord.newPages.forEach(async page => {

        //updating new page at plan level 
        const newPage = await CampaignPlanModel.findOneAndUpdate({ campaignId: replacementRecord.campaignId, 'p_id': page.p_id },
            {
                replacement_status: status == 'approved' ? 'replacement' : 'rejected'
            })

        for (let i = 0; i < allPhases.length; i++) {


            //2. effect at phase level

            const pageExist = await PhasePageModel.findOneAndUpdate({ phase_id: allPhases[i].phase_id, p_id: page.p_id },
                {
                    replacement_status: status == 'approved' ? 'replacement' : 'rejected',

                }, { new: true })


        }

    })

    res.status(200).json({ data: recordStatus, oldPageUpdate })

})

exports.getSingleRecord = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const result = await pageReplacementRecordModel.findById(id)
    const oldpage = await axios.post("https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataListpid", { "p_id": result.oldPage_id },
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

    console.log(oldpage)
    const newPages = await Promise.all(
        result.newPage_id.map(async page => {

            const x = await axios.post("https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataListpid", { "p_id": page },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
            return { ...x.data.body[0] }
        })
    )

    res.status(200).json({
        data: { ...result.toObject(), newPages, old: oldpage.data.body[0] }
    })
    // res.status(200).json({
    //     data:result
    // })
})


// exports.getAllRecord = catchAsync(async (req, res, next) => {
//     const result = await pageReplacementRecordModel.find()
//     const newResult = await Promise.all(result.map(async record => {
//         const x = await axios.post("https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataListpid", { "p_id": record.oldPage_id },
//             {
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 }
//             })
//         return { ...record.toObject(), ...x.data.body[0] }
//     }))
//     console.log(newResult)
//     res.status(200).json({
//         data: newResult
//     })




// })

exports.getAllRecord = catchAsync(async (req, res, next) => {
    try {
        const result = await pageReplacementRecordModel.find();
        const newResult = await Promise.all(result.map(async record => {
            try {
                const response = await axios.post("https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataListpid", { "p_id": record.oldPage_id }, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    timeout: 5000
                });
                return { ...record.toObject(), ...response.data.body[0] };
            } catch (error) {
                console.error('Error fetching data for record:', record, error.message);
                return { ...record.toObject(), error: 'Failed to fetch data' };
            }
        }));
        // console.log(newResult);
        res.status(200).json({
            data: newResult
        });
    } catch (error) {
        console.error('Error in fetching records:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});


exports.createReplacementPhase = catchAsync(async (req, res, next) => {

})
