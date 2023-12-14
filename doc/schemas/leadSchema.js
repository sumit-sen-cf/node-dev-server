const leadSchema = {
  type: "object",
  description: "Schema for leadModel.",
  properties: {
    leadsource_id: {
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
    leadsource_name: {
      type: "string",
      format: "string",
      example: "leadsource_name",
      description: "leadsource_name for the document.",
    },
    created_by: {
      type: "integer",
      format: "int",
      example: 1,
      description: "User id whio is created this document.",
    },
    Last_updated_by: {
      type: "integer",
      format: "int",
      example: 1,
      description: "User id whio is update this document.",
    },
    creation_date: {
      type: "date",
      format: "date",
      example: "2023-11-03T07:08:51.702+00:00",
      description: "Creation date for the document.",
    },
    Last_updated_date: {
      type: "date",
      format: "date",
      example: "2023-11-03T07:08:51.702+00:00",
      description: "Updation date for the document.",
    },
  },
};
module.exports = leadSchema;
