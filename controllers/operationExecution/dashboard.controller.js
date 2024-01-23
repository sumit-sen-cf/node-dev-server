const response = require("../../common/response");
const appError = require("../../helper/appError");
const catchAsync = require("../../helper/catchAsync");
const PhasePageModel = require("../../models/operationExecution/phasePageModel");
const campaignplanmodels = require('../../models/operationExecution/campaignPlanModel')

exports.phaseDashboard = catchAsync(async (req, res, next) => {
  let phase_id = req.body.phase_id;

  const result = await PhasePageModel.aggregate([
    // Stage 1: Match documents based on the provided phase_id
    { $match: { phase_id } },

    // Stage 2: Use $facet to perform multiple aggregations
    {
      $facet: {
        // Sub-pipeline 1: Count pages by category
        by_category_wise_page_model: [
          {
            $group: {
              _id: "$cat_name",
              count: { $sum: 1 },
            },
          },
        ],

        // Sub-pipeline 2: Count pages by platform
        by_plateform_wise_page_model: [
          {
            $group: {
              _id: "$platform",
              count: { $sum: 1 },
            },
          },
        ],

        // Sub-pipeline 3: Aggregating data for phase and campaign
        aggregatedData: [
          // Stage 1: Group by phase_id and campaignId to calculate total_no_of_post, total_no_of_page, and total_no_of_replacement
          {
            $group: {
              _id: { phase_id, campaignId: "$campaignId" },
              total_no_of_post: { $sum: { $toInt: "$postPerPage" } },
              total_no_of_page: { $sum: 1 },
              plan_id: { $first: "$plan_id" },
              total_no_of_replacement: {
                $sum: {
                  $cond: [{ $eq: ["$replacement_status", "replaced"] }, 1, 0],
                },
              },
            },
          },

          // Stage 2: Lookup assignment data based on phase_id
          {
            $lookup: {
              from: "assignmentmodels",
              localField: "_id.phase_id",
              foreignField: "phase_id",
              as: "assignmentModelData",
            },
          },

          // Stage 3: Unwind assignmentModelData array for further grouping
          {
            $unwind: "$assignmentModelData",
          },

          // Stage 4: Group again to calculate verified and executed execution totals, total executers, and page assigned
          {
            $group: {
              _id: "$_id",
              verified_execution_total: {
                $sum: {
                  $cond: [
                    { $eq: ["$assignmentModelData.ass_status", "verified"] },
                    1,
                    0,
                  ],
                },
              },
              executed_execution_total: {
                $sum: {
                  $cond: [
                    { $eq: ["$assignmentModelData.ass_status", "executed"] },
                    1,
                    0,
                  ],
                },
              },
              total_executers: { $addToSet: "$assignmentModelData.ass_to" },
              page_assigned: { $sum: 1 },
              total_no_of_post: { $first: "$total_no_of_post" },
              total_no_of_page: { $first: "$total_no_of_page" },
              total_no_of_replacement: { $first: "$total_no_of_replacement" },
              plan_id: { $first: "$plan_id" },
            },
          },

          // Stage 5: Lookup campaign plan data based on campaignId
          {
            $lookup: {
              from: "campaignplanmodels",
              localField: "_id.campaignId",
              foreignField: "campaignId",
              as: "campaignPlanModelData",
            },
          },

          // Stage 6: Unwind campaignPlanModelData array for further grouping
          {
            $unwind: "$campaignPlanModelData",
          },

          // Stage 7: Group again to calculate total_no_of_post_in_plan
          {
            $group: {
              // _id: null,
              _id: "$_id",
              total_no_of_post_in_plan: {
                $sum: { $toInt: "$campaignPlanModelData.postPerPage" },
              },
              total_no_of_post: { $first: "$total_no_of_post" },
              total_no_of_page: { $first: "$total_no_of_page" },
              total_no_of_replacement: { $first: "$total_no_of_replacement" },
              verified_execution_total: { $first: "$verified_execution_total" },
              executed_execution_total: { $first: "$executed_execution_total" },
              total_executers: { $first: "$total_executers" },
              page_assigned: { $first: "$page_assigned" },
              total_data_for_assignment_model: { $first: "$page_assigned" },
              plan_id: { $first: "$plan_id" },
            },
          },

          // Stage 8: Project the final fields for the output
          {
            $project: {
              _id: 0,
              phase_id: "$_id.phase_id",
              campaignId: "$_id.campaignId",
              verified_execution_total: 1,
              executed_execution_total: 1,
              plan_id: 1,
              total_executers: 1,
              page_assigned: 1,
              total_no_of_post: 1,
              total_no_of_page: 1,
              total_no_of_post_in_plan: 1,
              total_data_for_assignment_model: 1,
              total_executers: { $size: "$total_executers" },
              phase_occupancy: {
                $multiply: [
                  {
                    $divide: ["$total_no_of_post", "$total_no_of_post_in_plan"],
                  },
                  100,
                ],
              },
              execution_done_percentage: {
                $multiply: [
                  {
                    $divide: [
                      "$executed_execution_total",
                      "$total_data_for_assignment_model",
                    ],
                  },
                  100,
                ],
              },
              verified_percentage: {
                $multiply: [
                  {
                    $divide: [
                      "$verified_execution_total",
                      "$total_data_for_assignment_model",
                    ],
                  },
                  100,
                ],
              },
              total_no_of_replacement: 1,
              total_no_of_assign_pages: "$total_data_for_assignment_model",
              remaining_for_assignment: {
                $subtract: [
                  "$total_no_of_page",
                  { $ifNull: ["$total_no_of_assign_pages", 0] },
                ],
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        category_wise_page_count: "$by_category_wise_page_model",
        plateform_wise_page_count: "$by_plateform_wise_page_model",
        aggregatedData: { $arrayElemAt: ["$aggregatedData", 0] },
      },
    },
  ]);

  if (result && result.length === 0) {
    return next(new appError(404, "No Record Found"));
  }

  let resObj = {
    category_wise_page_count: result[0].category_wise_page_count,
    plateform_wise_page_count: result[0].plateform_wise_page_count,
    ...result[0].aggregatedData,
  };
  return response.returnTrue(
    200,
    req,
    res,
    "Fetching operations perform Successfully",
    resObj
  );
});

/*  Description 

total_no_of_post_in_plan  :  it is a sum of  "$campaignPlanModelData.postPerPage",
total_no_of_post  :  it is a sum of  "postPerPage" field from pagePhaseModel,
total_no_of_page  :  it is a count of all document whichi is exists in  pagePhaseModel,
total_no_of_replacement  :  it is a count of all document which replacement_status is "replaced" in  pagePhaseModel,
verified_execution_total  :  it is a count of all document which assignmentModelData.ass_status  is "verified" in assignment model after lookup from phase model based on phase id,
executed_execution_total  :  it is a count of all document which assignmentModelData.ass_status  is "executed" in assignment model after lookup from phase model based on phase id,
page_assigned  :  it is a count of all document  in assignment model after lookup from phase model based on phase id,
total_data_for_assignment_model  :  it is a count of all document  in assignment model after lookup from phase model based on phase id,
phase_id  :  phase_id from phasePageModel,
total_executers  :  find unique value from assignment model based on this field ass_to after lookup from phase page model based on phase id,
phase_occupancy  :   Calculate based on this phase_occupancy: {
           $multiply: [
         { $divide: ["$total_no_of_post", "$total_no_of_post_in_plan"] },
           100,
          ],
       },
execution_done_percentage :  Calculate based on this execution_done_percentage: {  
           $multiply: [
             { $divide: ["$executed_execution_total", "$total_data_for_assignment_model"] },
             100,
           ],
         },
verified_percentage :      Calculate based on this  verified_percentage: {   
           $multiply: [
             { $divide: ["$verified_execution_total", "$total_data_for_assignment_model"] },
             100,
           ],
total_no_of_assign_pages : Value same as total_data_for_assignment_model
remaining_for_assignment : Calculate based on this remaining_for_assignment: { 
          $subtract: ["$total_no_of_page", "$total_no_of_assign_pages"]
         },

*/

// Discussion with Nagesh
// total no of page = document count for phase page model
// total no of post = sum of all document  for this postPerPage field
// Execution done "executed" =  for this field lookup from assModel and then check ass_status
// Execution verified "verified" = for this field same as like above and then check ass_status
// total executers = use assign  model and use ass_to key uniquely count
// page assigned = how many document exisits in ass_model
// overplan = get from based on campaignId from campaignplan model here campaignId is attach with plan and one campaign is only contaion one plan
// phase occupency = totoal no of post in phase / total no of post in plan [ sum of all fields for postPerPage which is get from based on this "overplan" ] * 100
// total replacement  = ""


exports.planDashboard = catchAsync(async (req, res, next) => {
  const campaignId = req.body.campaignId;
  const result = await campaignplanmodels.aggregate([
    {
      $match: { campaignId }
    },
    {
      $facet: {
        // Sub-pipeline 1: Count pages by category
        by_category_wise_page_model: [
          {
            $group: {
              _id: "$cat_name",
              count: { $sum: 1 },
            },
          },
        ],

        // Sub-pipeline 2: Count pages by platform
        by_plateform_wise_page_model: [
          {
            $group: {
              _id: "$platform",
              count: { $sum: 1 },
            },
          },
        ],
        aggregatedData: [
          {
            $group: {
              _id: { campaignId: "$campaignId" },
              total_no_of_post: { $sum: { $toInt: "$postPerPage" } },
              total_no_of_page: { $sum: 1 },
              // plan_id: { $first: "$plan_id" },
              total_no_of_replacement: {
                $sum: {
                  $cond: [{ $eq: ["$replacement_status", "replaced"] }, 1, 0],
                },
              },
            },
          },
          {
            $lookup: {
              from: "assignmentmodels",
              localField: "_id.campaignId",
              foreignField: "campaignId",
              as: "assignmentModelData",
            },
          },
          {
            $unwind: "$assignmentModelData",
          },

          {
            $group: {
              _id: "$_id",
              verified_execution_total: {
                $sum: {
                  $cond: [
                    { $eq: ["$assignmentModelData.ass_status", "verified"] },
                    1,
                    0,
                  ],
                },
              },
              executed_execution_total: {
                $sum: {
                  $cond: [
                    { $eq: ["$assignmentModelData.ass_status", "executed"] },
                    1,
                    0,
                  ],
                },
              },
              total_executers: { $addToSet: "$assignmentModelData.ass_to" },
              page_assigned: { $sum: 1 },
              total_no_of_post: { $first: "$total_no_of_post" },
              total_no_of_page: { $first: "$total_no_of_page" },
              total_no_of_replacement: { $first: "$total_no_of_replacement" },
              // plan_id: { $first: "$plan_id" },
            },
          },
          {
            $lookup: {
              from: "campaignplanmodels",
              localField: "_id.campaignId",
              foreignField: "campaignId",
              as: "campaignPlanModelData",
            },
          },

          // Stage 6: Unwind campaignPlanModelData array for further grouping
          {
            $unwind: "$campaignPlanModelData",
          },

          {
            $group: {
              _id: "$_id",
              // _id: "$_id",
              total_no_of_post_in_plan: {
                $sum: { $toInt: "$campaignPlanModelData.postPerPage" },
              },
              total_no_of_post: { $first: "$total_no_of_post" },
              total_no_of_page: { $first: "$total_no_of_page" },
              total_no_of_replacement: { $first: "$total_no_of_replacement" },
              verified_execution_total: { $first: "$verified_execution_total" },
              executed_execution_total: { $first: "$executed_execution_total" },
              total_executers: { $first: "$total_executers" },
              page_assigned: { $first: "$page_assigned" },
              total_data_for_assignment_model: { $first: "$page_assigned" },
              // plan_id: { $first: "$plan_id" },
            },
          },

          {
            $project: {
              _id: 0,
              // phase_id: "$_id.phase_id",
              campaignId: "$_id.campaignId",
              verified_execution_total: 1,
              executed_execution_total: 1,
              // plan_id: 1,
              total_executers: 1,
              page_assigned: 1,
              total_no_of_post: 1,
              total_no_of_page: 1,
              total_no_of_post_in_plan: 1,
              total_data_for_assignment_model: 1,
              total_executers: { $size: "$total_executers" },

              execution_done_percentage: {
                $multiply: [
                  {
                    $divide: [
                      "$executed_execution_total",
                      "$total_data_for_assignment_model",
                    ],
                  },
                  100,
                ],
              },
              verified_percentage: {
                $multiply: [
                  {
                    $divide: [
                      "$verified_execution_total",
                      "$total_data_for_assignment_model",
                    ],
                  },
                  100,
                ],
              },
              total_no_of_replacement: 1,
              total_no_of_assign_pages: "$total_data_for_assignment_model",
              remaining_for_assignment: {
                $subtract: [
                  "$total_no_of_page",
                  { $ifNull: ["$total_no_of_assign_pages", 0] },
                ],
              },
            },
          },



        ]
      }
    },
    {
      $project: {
        category_wise_page_count: "$by_category_wise_page_model",
        plateform_wise_page_count: "$by_plateform_wise_page_model",
        aggregatedData: { $arrayElemAt: ["$aggregatedData", 0] },
      },
    },
  ])
  
  if (result && result.length === 0) {
    return next(new appError(404, "No Record Found"));
  }

  let resObj = {
    category_wise_page_count: result[0].category_wise_page_count,
    plateform_wise_page_count: result[0].plateform_wise_page_count,
    ...result[0].aggregatedData,
  };
  return response.returnTrue(
    200,
    req,
    res,
    "Fetching operations perform Successfully",
    resObj
  );
})