const agencySchema = {
  type: "object",
  description: "Write description",
  //   required: ["dept_id"],
  properties: {
    agency_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the Agency.",
    },
    agency_name: {
      type: "string",
      format: "string",
      example: "Agency name",
      description: "Agency name for the agency data.",
    },
    created_at: {
      type: "date",
      format: "date",
      example: "2023-11-07T07:43:02.837+00:00",
      description:
        "Creation date which is used for identify the docment at what time created exactly.",
    },
    updated_at: {
      type: "date",
      format: "date",
      example: "2023-11-07T07:43:02.837+00:00",
      description:
        "Updation date which is used for identify the docment at what time updated exactly.",
    },
  },
};
module.exports = agencySchema;
