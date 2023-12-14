const brandSchema = {
  type: "object",
  description: "Write description",
  required: ["sub_category_id", "category_id"], // assuming these fields are required
  properties: {
    brand_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the brand.",
    },
    category_id: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "Category id which is used for linking brand category data to the document.",
    },
    user_id: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "User id which is used for linking User data to the document.",
    },
    sub_category_id: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "Category id which is used for linking brand sub category data to the document.",
    },
    major_category: {
      type: "string",
      format: "string",
      example: "Entertainment",
      description: "Major category for the brand.",
    },
    brand_name: {
      type: "string",
      format: "string",
      example: "test brand",
      description: "Name for the brand.",
    },
    igusername: {
      type: "string",
      format: "string",
      example: "igusername",
      description: "igusername for the brand.",
    },
    whatsapp: {
      type: "string",
      format: "string",
      example: "link",
      description: "what's app link for the brand.",
    },
    website: {
      type: "string",
      format: "string",
      example: "link",
      description: "website link for the brand.",
    },
  },
};
// export default brandSchema
module.exports = brandSchema;
