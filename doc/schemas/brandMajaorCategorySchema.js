const brandMajorCategorySchema = {
  type: "object",
  description: "Write description",
  required: ["brand_id"],
  properties: {
    brandMajorCategory_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the brand major category.",
    },
    brandMajorCategory_name: {
      type: "string",
      format: "string",
      example: "test",
      description: "Brand major category name for the document.",
    },
    brand_id: {
      type: "integer",
      format: "int",
      example: 12,
      description:
        "Brand id which is used for linking Brand data to the document.",
    },
    created_by: {
      type: "integer",
      format: "int",
      example: 145,
      description:
        "User id which is used for identify who is create the document.",
    },
    created_date: {
      type: "date",
      format: "date",
      example: "2023-11-07T07:43:02.837+00:00",
      description:
        "Creation date which is used for identify the docment at what time created exactly.",
    },
  },
};
module.exports = brandMajorCategorySchema;
