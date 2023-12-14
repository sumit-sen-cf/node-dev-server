const mentionSchema = {
  type: "object",
  description: "Schema for mentionModel.",
  properties: {
    mentionId: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the mentionModel.",
    },
    mention: {
      type: "string",
      format: "string",
      example: "winbuzzofficial",
      description: "Mention for the document.",
    },

    status: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Number value for manage status for this document.",
    },

    createdBy: {
      type: "integer",
      format: "int",
      example: 1,
      description: "User id whio is created this document.",
    },

    createdAt: {
      type: "date",
      format: "date",
      example: "2023-11-03T07:08:51.702+00:00",
      description: "Creation date for the document.",
    },
  },
};
module.exports = mentionSchema;
