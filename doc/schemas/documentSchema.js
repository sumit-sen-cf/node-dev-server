const documentSchema = {
  type: "object",
  description: "Schema for documentModel.",
  properties: {
    _id: {
      type: "string",
      format: "objectId",
      example: "652c1be6f855f97c54dda4d1",
      description: "Unique identifier for the documentModel.",
    },
    doc_type: {
      type: "string",
      format: "string",
      example: "manojsdfUser",
      description: "Doc type for the document.",
    },
    description: {
      type: "string",
      format: "string",
      example: "description",
      description: "Description for the document.",
    },
    priority: {
      type: "string",
      format: "string",
      example: "Medium",
      description: "Manage priority for this document.",
    },
    period: {
      type: "integer",
      format: "int",
      example: 0,
      description: "Store number of days in number.",
    },
  },
};
module.exports = documentSchema;
