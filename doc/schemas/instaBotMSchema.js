const instaBotMSchema = {
  type: "object",
  description: "Schema for insta bot M module.",
  properties: {
    botMId: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the Insta Bot M.",
    },
    campaign_id: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "campaign_id which is used for linking Campaign data to the document.",
    },
    number: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Number data for the document.",
    },
    createdBy: {
      type: "integer",
      format: "int",
      example: 1,
      description: "User id whio is created this document.",
    },
    status: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Number for manage the status for this document.",
    },
    createdAt: {
      type: "date",
      format: "date",
      example: "2023-11-03T07:08:51.702+00:00",
      description: "Creation date for the document.",
    },
  },
};
module.exports = instaBotMSchema;
