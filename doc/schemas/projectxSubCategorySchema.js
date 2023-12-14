const projectxSubCategorySchema = {
  type: "object",
  description: "Write description",
  required: ["category_id"],
  properties: {
    sub_category_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the projectx sub category.",
    },
    category_id: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "Project x category id which is used for linking Project x category data to the document.",
    },
    category_name: {
      type: "string",
      format: "string",
      example: "Category name",
      description: "Name for the Projectx Sub category.",
    },
  },
};
module.exports = projectxSubCategorySchema;
