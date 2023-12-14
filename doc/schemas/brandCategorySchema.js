const brandCategorySchema = {
  type: "object",
  description: "Write description",
  required: ["brand_id"],
  properties: {
    brandCategory_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the brand category.",
    },
    brand_id: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "Brand id which is used for linking Brand data to the document.",
    },
    brandCategory_name: {
      type: "string",
      format: "string",
      example: "Brand category name",
      description: "Brand category name for document.",
    },
    created_by: {
      type: "integer",
      format: "int",
      example: 1,
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
module.exports = brandCategorySchema;
