const productPropsSchema = {
  type: "object",
  description: "Schema for productPropsModel.",
  properties: {
    id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the productPropsModel.",
    },
    prop_category: {
      type: "string",
      format: "string",
      example: "manojsdfUser",
      description: "Prop_category for the document.",
    },
    prop_name: {
      type: "string",
      format: "string",
      example: "name",
      description: "Prop_name for the document.",
    },
    product_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "product_id which is linking product data to this document.",
    },
    type_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "type_id which is linking type data to this document.",
    },
    created_by: {
      type: "integer",
      format: "int",
      example: 1,
      description: "User id whio is created this document.",
    },
    last_updated_by: {
      type: "integer",
      format: "int",
      example: 1,
      description: "User id whio is update this document.",
    },
    created_at: {
      type: "date",
      format: "date",
      example: "2023-11-03T07:08:51.702+00:00",
      description: "Creation date for the document.",
    },
    last_updated_at: {
      type: "date",
      format: "date",
      example: "2023-11-03T07:08:51.702+00:00",
      description: "Updation date for the document.",
    },
  },
};
module.exports = productPropsSchema;
