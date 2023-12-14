const keywordSchema = {
    type: "object",
    description: "Schema for insta bot Y module.",
    properties: {
        keywordId: {
        type: "integer",
        format: "int",
        example: 1,
        description: "Unique identifier for the Keyword.",
      },
      keyword: {
        type: "string",
        format: "string",
        example: "explorepage",
        description: "Keyword for the document.",
      },
      createdBy: {
        type: "integer",
        format: "int",
        example: 1,
        description: "User id whio is created this document.",
      },
      updatedBy: {
        type: "integer",
        format: "int",
        example: 1,
        description: "User id whio is update this document.",
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
      updatedAt: {
        type: "date",
        format: "date",
        example: "2023-11-03T07:08:51.702+00:00",
        description: "Updation date for the document.",
      },
    },
  };
  module.exports = keywordSchema;
  