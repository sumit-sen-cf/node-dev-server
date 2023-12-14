const brandSubCategorySchema = {
  type: "object",
  description: "Write description",
  required: ["brandCategory_id"],
  properties: {
    brandSubCategory_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the brand sub category.",
    },
    brandCategory_id: {
      type: "integer",
      format: "int",
      example: 12,
      description:
        "Brand category id which is used for linking Brand category data to the document.",
    },
    created_by: {
      type: "integer",
      format: "int",
      example: 123,
      description:
        "User id which is used for identify who is create the document.",
    },
    brandSubCategory_name: {
      type: "string",
      example: "Brand sub category name",
      description: "Name for the brand sub category.",
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
module.exports = brandSubCategorySchema;
