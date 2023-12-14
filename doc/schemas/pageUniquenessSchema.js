const pageUniquenessSchema = {
  type: "object",
  description: "Schema for pageUniquenessModel.",
  properties: {
    creator_name: {
      type: "string",
      format: "string",
      example: "creator_name",
      description: "Creator name for this document.",
    },

    user_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "User id which is linking user data to this document.",
    },

    status: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Number value for manage status for this document.",
    },
  },
};
module.exports = pageUniquenessSchema;
