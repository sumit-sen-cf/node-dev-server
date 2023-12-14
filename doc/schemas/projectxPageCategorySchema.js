const projectxPageCategorySchema = {
  type: "object",
  description: "Write description",
  required: ["sub_category_id", "category_id"],
  properties: {
    category_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the projectx page category.",
    },
    category_name: {
      type: "string",
      format: "string",
      example: "name",
      description: "Name for the Projectx Page Category name.",
    },
  },
};
module.exports = projectxPageCategorySchema;
