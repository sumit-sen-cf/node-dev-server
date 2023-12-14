const announcementSchema = {
  type: "object",
  description: "Write description",
  required: ["dept_id", "desi_id"],
  properties: {
    id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the announcement.",
    },
    dept_id: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "Department id which is used for linking to department data.",
    },
    desi_id: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "Designation id which is used for linking to Designation data.",
    },
    onboard_status: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Number value which is used for status management.",
    },
    heading: {
      type: "string",
      format: "string",
      example: "Heading",
      description: "In heading field there is string for heading.",
    },
    sub_heading: {
      type: "string",
      format: "string",
      example: "Sub Heading",
      description: "There is sub heading data.",
    },
    content: {
      type: "string",
      format: "string",
      example: "Content",
      description: "Here content data provide.",
    },
    remark: {
      type: "string",
      format: "string",
      example: "Remark",
      description: "Remark data available.",
    },
    last_updated_by: {
      type: "integer",
      format: "int",
      example: 12,
      description:
        "User id which is used for identify who is update the document.",
    },
    created_by: {
      type: "integer",
      format: "int",
      example: 12,
      description:
        "User id which is used for identify who is create the document.",
    },
    created_at: {
      type: "date",
      format: "date",
      example: "2023-11-07T07:43:02.837+00:00",
      description:
        "Creation date which is used for identify the docment at what time created exactly.",
    },
    last_updated_at: {
      type: "date",
      format: "date",
      example: "2023-11-07T07:43:02.837+00:00",
      description:
        "Updation date which is used for identify the docment at what time updated exactly.",
    },
  },
};
module.exports = announcementSchema;
