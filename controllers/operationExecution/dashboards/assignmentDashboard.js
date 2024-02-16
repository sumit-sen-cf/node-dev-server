const appError = require("../../../helper/appError");
const catchAsync = require("../../../helper/catchAsync");

const AssignmentModel = require('../../../models/operationExecution/assignmentModel')
const AssignmentCommitModel = require('../../../models/operationExecution/assignmentCommitModel')

exports.AssignmentDashCampaign = catchAsync(async (req, res, next) => {
    const { campaignId } = req.body

    // const assignmentId = await AssignmentCommitModel.find({}).select({ass_id:1});

    const result = await AssignmentModel.aggregate([

        //stage 1:matching as per the campaign Id
        {
            $match: {
                campaignId
            }
        },
        {
            $facet: {
                all_assignments:[
                    {
                        $group:{
                            _id:null,
                            count:{$sum:1},
                            assignments:{$push:"$$ROOT"}
                        }
                    }
                ],
                by_category_wise_page_model: [
                    {
                        $group: {
                            _id: "$cat_name",
                            count: { $sum: 1 },
                            page: { $push: '$$ROOT' }
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total_categories: { $sum: 1 },
                            cat: { $push: '$$ROOT' }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                        }
                    }

                ],

                executor_wise_PreAssignments: [
                    {
                        $unwind: '$preAssignedTo',

                    },

                    {
                        $group: {
                            _id: '$preAssignedTo',
                            preAssignmentCount: {
                                $sum: 1
                            },
                            PreAssignedPages: {
                                $push: "$$ROOT"
                            }
                        },

                    },
                    {
                        $group: {
                            _id: null,
                            total_executors: { $sum: 1 },

                            expert_assignments: { $push: "$$ROOT" }
                        }
                    },

                ],

                executor_wise_assignments: [
                    {
                        $lookup: {
                            from: "expertisemodels",
                           let:{item:"$ass_to"},
                           pipeline:[
                            {$match:{
                                $expr:{$eq:['$_id',"$$item"]}
                            }}
                           ],
                            as: "expertDetail",
                        }
                    },
                  
                    {
                        $match: {
                            $or: [
                                {
                                    ass_status: "executed"
                                },
                                {
                                    ass_status: "verified"
                                },
                                {
                                    ass_status: "rejected"
                                },
                                {
                                    ass_status: "assigned"
                                },
                            ]
                        }
                   
                    },
                 
                    {
                        $group: {
                            _id:null,
                            // _id: '$expertDetail.exp_name',
                            // count: { $sum: 1 },
                            assignedPages: { $push: "$$ROOT" }

                        }
                    }
                ],
                executed_assignments: [
                    {
                        $match: {
                            isExecuted: true,ass_status:"executed"
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                            pages: { $push: "$$ROOT" }
                        }
                    }
                ],
                execution_pending_assignments: [
                    {
                        $match: {
                            $and: [
                                {
                                    isExecuted: false
                                }, {
                                    ass_status: "assigned"
                                }
                            ]
                        }

                    },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                            pages: { $push: "$$ROOT" }
                        }
                    }
                ],
                verified_assignments: [
                    {
                        $match: {
                            ass_status: "verified",
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                            pages: { $push: "$$ROOT" }
                        }
                    }
                ],

                rejected_assignments: [
                    {
                        $match: {
                            ass_status: "rejected",
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                            pages: { $push: "$$ROOT" }
                        }
                    }
                ],
                pending_assignments: [
                    {
                        $match: {
                            ass_status: 'unassigned',
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                            pages: { $push: "$$ROOT" }
                        }
                    }
                ],
                post_verified:[
                   { 
                    $lookup:{
                        from:"assignmentcommitmodels",
                        localField:"ass_id",
                        foreignField:"ass_id" ,
                        as:"commits"
                    }
                },{
                    $unwind:"$commits"
                },{
                    $match:{
                        $or:[{
                            "commits.verification_status":"verified",
                            "commits.commitType":'post'
                        }]
                    }
                },{
                    $group:{
                        _id:null,
                        count:{$sum:1},
                        post:{$push:"$$ROOT"}
                    }
                }
                ],
                story_verified:[
                   { 
                    $lookup:{
                        from:"assignmentcommitmodels",
                        localField:"ass_id",
                        foreignField:"ass_id" ,
                        as:"commits"
                    }
                },{
                    $unwind:"$commits"
                },{
                    $match:{
                        $or:[{
                            "commits.verification_status":"verified",
                            "commits.commitType":'story'
                        }]
                    }
                },{
                    $group:{
                        _id:null,
                        count:{$sum:1}
                    }
                }
                ],
                aggregatedData:[
                    {
                        $group:{
                            _id: { campaignId: "$campaignId" },
                            total_number_of_post:{$sum:{$toInt:'$postPerPage'}},
                            total_number_of_story:{$sum:{$toInt:'$storyPerPage'}},
                            total_no_of_assgnments: { $sum: 1 },
                            total_assignments_accepted:{
                                $sum:{
                                    $cond:[{ $eq: ["$ass_status", "assigned"] }, 1, 0],
                                }
                            },
                            total_no_of_replacement: {
                                $sum: {
                                  $cond: [{ $eq: ["$replacement_status", "replaced"] }, 1, 0],
                                },
                              },
                            total_no_of_execution:{
                                $sum:{$cond:  [
                                    { $eq: ["$isExecuted", true] },
                                    1,
                                    0,
                                  ],}
                            },
                            total_number_of_assignment_varification:{
                                $sum:{$cond:  [
                                    { $eq: ["$ass_status", 'verified'] },
                                    1,
                                    0,
                                  ],}
                            }
    
                                                      
                        }
                    },
                //     { 
                //         $lookup:{
                //             from:"assignmentcommitmodels",
                //             localField:"ass_id",
                //             foreignField:"ass_id" ,
                //             as:"commits"
                //         }
                //     },{
                //         $unwind:"$commits"
                //     },{
                //         $match:{
                //             $or:[{
                //                 "commits.verification_status":"verified",
                //                 "commits.commitType":'story'
                //             }]
                //         }
                //     },
                //    {
                //     $group:{
                //         _id:"$_id",
                //         total_story_verigie:{$sum:1},
                //         total_number_of_post: { $first: "$total_number_of_post" },
                //         total_number_of_story: { $first: "$total_number_of_story" },
                //         total_no_of_page: { $first: "$total_no_of_page" },
                //         total_no_of_replacement: { $first: "$total_no_of_replacement" },
                //         total_no_of_execution: { $first: "$total_no_of_execution" },
                //         total_number_of_assignment_varification: { $first: "$total_number_of_assignment_varification" },
                //     }
                //    },
                //     { 
                //         $lookup:{
                //             from:"assignmentcommitmodels",
                //             localField:"ass_id",
                //             foreignField:"ass_id" ,
                //             as:"commits"
                //         }
                //     },{
                //         $unwind:"$commits"
                //     },{
                //         $match:{
                //             $or:[{
                //                 "commits.verification_status":"verified",
                //                 "commits.commitType":'story'
                //             }]
                //         }
                //     },
                //    {
                //     $group:{
                //         _id:"$_id",
                //         total_story_verigie:{$sum:1},
                //         total_number_of_post: { $first: "$total_number_of_post" },
                //         total_number_of_story: { $first: "$total_number_of_story" },
                //         total_no_of_page: { $first: "$total_no_of_page" },
                //         total_no_of_replacement: { $first: "$total_no_of_replacement" },
                //         total_no_of_execution: { $first: "$total_no_of_execution" },
                //         total_number_of_assignment_varification: { $first: "$total_number_of_assignment_varification" },
                //     }
                //    },
                    {
                        $project:{
                            total_number_of_post:1,
                            total_number_of_story:1,
                            total_no_of_assgnments:1,
                            total_assignments_accepted:1,
                            total_no_of_execution:1,
                            assignment_accepted_percentage:{
                                $multiply: [
                                    {
                                      $divide: [
                                        "$total_assignments_accepted",
                                        "$total_no_of_assgnments",
                                      ],
                                    },
                                    100,
                                  ],
                            },
                            execution_remaining:{
                                $subtract: [
                                    "$total_no_of_assgnments",
                                    { $ifNull: ["$total_no_of_execution", 0] },
                                  ],
                            },
                            assignment_executed_percentage:{
                                $multiply: [
                                    {
                                      $divide: [
                                        "$total_no_of_execution",
                                        "$total_no_of_assgnments",
                                      ],
                                    },
                                    100,
                                  ],
                            },
                    
                            total_no_of_replacement:1,
                            total_number_of_assignment_varification:1,

                            
                            assignment_verified_percentage:{
                                $multiply: [
                                    {
                                      $divide: [
                                        "$total_number_of_assignment_varification",
                                        "$total_no_of_assgnments",
                                      ],
                                    },
                                    100,
                                  ],
                            },
                            
                          
                        }
                    }
                ]
            }
        },
        {
            $project: {
                category_wise_page_model: "$by_category_wise_page_model",
                executor_wise_PreAssignments: "$executor_wise_PreAssignments",
                all_assignments: "$all_assignments",
                
                executor_wise_assignments: "$executor_wise_assignments",
                unassigned_pages: "$unassigned_pages",
                executed_assignments: "$executed_assignments",
                execution_pending_assignments: "$execution_pending_assignments",
                verified_assignments: "$verified_assignments",
                rejected_assignments: "$rejected_assignments",
                pending_assignments: "$pending_assignments",
                post_verified: "$post_verified",
                story_verified: "$story_verified",
                aggregatedData: { $arrayElemAt: ["$aggregatedData", 0] },
                
            }
        }
    ])

    resObj = {
        ...result[0].aggregatedData,
        category_wise_page_model: result[0].category_wise_page_model,
        executor_wise_assignments: result[0].executor_wise_assignments,
        executor_wise_PreAssignments: result[0].executor_wise_PreAssignments,
        unassigned_pages: result[0].unassigned_pages,
        executed_assignments: result[0].executed_assignments,
        execution_pending_assignments: result[0].execution_pending_assignments,
        verified_assignments: result[0].verified_assignments,
        rejected_assignments: result[0].rejected_assignments,
        unAssigned_assignments: result[0].pending_assignments,
        post_verified: result[0].post_verified,
        story_verified: result[0].story_verified,
        all_assignments: result[0].all_assignments,
        
    }
    res.status(200).json({
        result: resObj
    })
})