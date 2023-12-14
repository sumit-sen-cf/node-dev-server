const responsibilitySchema = {
    type: "object",
    description: "Schema for responsibilityModel.",
    required : ["respo_name"],
    properties: {
      id: {
        type: "integer",
        format: "int",
        example: 1,
        description: "Unique identifier for the responsibilityModel.",
      },
      respo_name: {
        type: "string",
        format: "string",
        example: "name",
        description: "Responsibility name for the document.",
      },
      description: {
        type: "string",
        format: "string",
        example: "manojsdfUser",
        description: "Description for the document.",
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
      Last_updated_by: {
        type: "integer",
        format: "int",
        example: 1,
        description: "User id whio is update this document.",
      },
  
    },
  };
  module.exports = responsibilitySchema;
  