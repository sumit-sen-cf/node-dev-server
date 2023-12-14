const instaBrandSchema = {
  type: "object",
  description: "Schema for insta brand module.",
  properties: {
    instaBrandId: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the instaBrandSchema.",
    },
    instaBrandName: {
      type: "string",
      format: "string",
      example: "Cornitos",
      description: "instaBrandName for the document.",
    },
    brandCategoryName: {
      type: "string",
      format: "string",
      example: "FMCG",
      description: "brandCategoryName for the document.",
    },
    brandSubCategoryName: {
      type: "string",
      format: "string",
      example: "nacho chips",
      description: "brandSubCategoryName for the document.",
    },
    website: {
      type: "string",
      format: "string",
      example: "website",
      description: "website for the document.",
    },
    majorCategory: {
      type: "string",
      format: "string",
      example: "Normal",
      description: "majorCategory for the document.",
    },
    whatsApp: {
      type: "string",
      format: "string",
      example: "whatsApp",
      description: "whatsApp for the document.",
    },
    igUserName: {
      type: "string",
      format: "string",
      example: "dummy",
      description: "igUserName for the document.",
    },
    userId: {
      type: "integer",
      format: "int",
      example: 1,
      description: "User id for this document.",
    },
    brandCategoryId: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "brandCategoryId for linking brand categoru data to this document.",
    },
    brandSubCategoryId: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "brandSubCategoryId for linking brand sub categoru data to this document.",
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
module.exports = instaBrandSchema;
