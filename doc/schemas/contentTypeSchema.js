const contentTypeSchema = {
  type: "object",
  description: "Write description",
  //   required: ["dept_id"],
  properties: {
    content_type_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the Content type.",
    },
    content_value: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Content value for the document.",
    },
    content_type: {
      type: "string",
      format: "string",
      example: "test content_type",
      description: "Content type for the document.",
    },
    remarks: {
      type: "string",
      format: "string",
      example: "test remarks",
      description: "Remarks for the document.",
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
    creation_date: {
      type: "date",
      format: "date",
      example: "2023-11-07T07:43:02.837+00:00",
      description:
        "Creation date which is used for identify the docment at what time created exactly.",
    },
    last_updated_date: {
      type: "date",
      format: "date",
      example: "2023-11-07T07:43:02.837+00:00",
      description:
        "Updation date which is used for identify the docment at what time updated exactly.",
    },
  },
};
module.exports = contentTypeSchema;
