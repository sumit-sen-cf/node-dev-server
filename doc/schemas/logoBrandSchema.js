const logoBrandSchema = {
  type: "object",
  description: "Schema for leadModel.",
  properties: {
    id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the leadModel.",
    },
    remark: {
      type: "string",
      format: "string",
      example: "remark",
      description: "Remark for the document.",
    },
    cat_name: {
      type: "string",
      format: "string",
      example: "cat_name",
      description: "cat_name for the document.",
    },
    created_by: {
      type: "integer",
      format: "int",
      example: 1,
      description: "User id whio is created this document.",
    },

    created_at: {
      type: "date",
      format: "date",
      example: "2023-11-03T07:08:51.702+00:00",
      description: "Creation date for the document.",
    },
  },
};
module.exports = logoBrandSchema;
