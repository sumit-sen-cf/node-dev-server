const exeCampaignSchema = {
  type: "object",
  description: "Write description",
  //   required: ["dept_id"], // assuming these fields are required
  properties: {
    exeCmpId: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the Execution campaign.",
    },
    exeUserId: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "User id which is used for linking User data to the document.",
    },
    agencyId: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "Agency id which is used for linking Agency data to the document.",
    },
    brandId: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "Brand id which is used for linking Brand data to the document.",
    },
    exeCmpName: {
      type: "string",
      format: "string",
      example: "campaign name",
      description: "Execution Campaign name for the document.",
    },
    exeHashTag: {
      type: "string",
      format: "string",
      example: "hash tag",
      description: "Execution Hash tag for the execution campaign.",
    },
    exeRemark: {
      type: "string",
      format: "string",
      example: "test Remarks",
      description: "Remarks for the Execution campaign.",
    },
    updatedBy: {
      type: "integer",
      format: "int",
      example: 123,
      description:
        "User id which is used for identify who is update the document.",
    },
    createdAt: {
      type: "date",
      format: "date",
      example: "2023-11-07T07:43:02.837+00:00",
      description:
        "Creation date which is used for identify the docment at what time created exactly.",
    },
    updatedAt: {
      type: "date",
      format: "date",
      example: "2023-11-07T07:43:02.837+00:00",
      description:
        "Updation date which is used for identify the docment at what time updated exactly.",
    },
  },
};
module.exports = exeCampaignSchema;
