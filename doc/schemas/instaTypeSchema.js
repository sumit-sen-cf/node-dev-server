const instaTypeSchema = {
  type: "object",
  description: "Schema for insta Type module.",
  properties: {
    id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the instaTypeModel.",
    },
    name: {
      type: "string",
      format: "string",
      example: "linkinbio",
      description: "Name for the document.",
    },
    remark: {
      type: "string",
      format: "string",
      example: "remark",
      description: "Remark for the document.",
    },
    created_by: {
      type: "integer",
      format: "int",
      example: 1,
      description: "User id whio is created this document.",
    },
    last_updated_by: {
      type: "integer",
      format: "int",
      example: 1,
      description: "User id whio is update this document.",
    },
    created_at: {
      type: "date",
      format: "date",
      example: "2023-11-03T07:08:51.702+00:00",
      description: "Creation date for the document.",
    },
    last_updated_at: {
      type: "date",
      format: "date",
      example: "2023-11-03T07:08:51.702+00:00",
      description: "Updation date for the document.",
    },
  },
};
module.exports = instaTypeSchema;
