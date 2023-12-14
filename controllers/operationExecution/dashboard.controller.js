const response = require("../../common/response");
const appError = require("../../helper/appError");
const catchAsync = require("../../helper/catchAsync");
const PhasePageModel = require("../../models/operationExecution/phasePageModel");

exports.phaseDashboard = catchAsync(async (req, res, next) => {
  let phase_id = req.body.phase_id;

  const result = await PhasePageModel.aggregate([
    { $match: { phase_id } },
    {
      $group: {
        _id: { phase_id, campaignId: "$campaignId" },
        total_no_of_post: { $sum: { $toInt: "$postPerPage" } },
        total_no_of_page: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "assignmentmodels",
        localField: "_id.phase_id",
        foreignField: "phase_id",
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
        // I menetion below fields again here because this fields not added by default in main response  so i follow this approach like mention fields which is group at upper level
        total_no_of_post: { $first: "$total_no_of_post" },
        total_no_of_page: { $first: "$total_no_of_page" },
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
    {
      $unwind: "$campaignPlanModelData",
    },
    {
      $group: {
        _id: "$_id",
        total_no_of_post_in_plan: {
          $sum: { $toInt: "$campaignPlanModelData.postPerPage" },
        },
        // I menetion below fields again here because this fields not added by default in main response  so i follow this approach like mention fields which is group at upper level
        total_no_of_post: { $first: "$total_no_of_post" },
        total_no_of_page: { $first: "$total_no_of_page" },
        verified_execution_total: { $first: "$verified_execution_total" },
        executed_execution_total: { $first: "$executed_execution_total" },
        total_executers: { $first: "$total_executers" },
        page_assigned: { $first: "$page_assigned" },
      },
    },

    {
      $project: {
        _id : 0,
        phase_id : "$_id.phase_id",
        campaignId: 1,
        verified_execution_total: 1,
        executed_execution_total: 1,
        total_executers: 1,
        page_assigned: 1,
        total_no_of_post: 1,
        total_no_of_page: 1,
        total_no_of_post_in_plan: 1,
        total_executers: { $size: "$total_executers" },
        phase_occupancy: {
          $multiply: [
            { $divide: ["$total_no_of_post", "$total_no_of_post_in_plan"] },
            100,
          ],
        },
      },
    },
  ]);

  if (result && result.length === 0) {
    return next(new appError(404, "No Record Found"));
  }
  return response.returnTrue(200,req,res,"Fetching operations perform Successfully",result[0])
});
// total no of page = document count for phase page model
// total no of post = sum of all document  for this postPerPage field
// Execution done "executed" =  for this field lookup from assModel and then check ass_status
// Execution verified "verified" = for this field same as like above and then check ass_status
// total executers = use assign  model and use ass_to key uniquely count
// page assigned = how many document exisits in ass_model
// overplan = get from based on campaignId from campaignplan model here campaignId is attach with plan and one campaign is only contaion one plan
// phase occupency = totoal no of post in phase / total no of post in plan [ sum of all fields for postPerPage which is get from based on this "overplan" ] * 100
// toatol replacement  = ""
