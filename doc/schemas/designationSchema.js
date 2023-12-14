const designationSchema = {
  type: "object",
  description: "Write description",
  required: ["dept_id"], // assuming these fields are required
  properties: {
    desi_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the designation.",
    },
    dept_id: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "Department id which is used for linking Department data to the document.",
    },
    desi_name: {
      type: "string",
      format: "string",
      example: "test desingation name",
      description: "Designation name for the document.",
    },
    remark: {
      type: "string",
      format: "string",
      example: "test Remarks",
      description: "Remarks for the department.",
    },
    created_by: {
      type: "integer",
      format: "int",
      example: 123,
      description:
        "User id which is used for identify who is create the document.",
    },
    last_updated_by: {
      type: "integer",
      format: "int",
      example: 123,
      description:
        "User id which is used for identify who is update the document.",
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
module.exports = designationSchema;
