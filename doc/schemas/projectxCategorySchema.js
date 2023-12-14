const projectxCategorySchema = {
  type: "object",
  description: "Write description",
  required: ["brand_id"], // assuming these fields are required
  properties: {
    category_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the projectx category.",
    },
    brand_id: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "Brand id which is used for linking Brand data to the document.",
    },
    category_name: {
      type: "string",
      format: "string",
      example: "test name",
      description: "Name for the Projectx Category name.",
    },
  },
};
module.exports = projectxCategorySchema;
