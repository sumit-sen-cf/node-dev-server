const contentManagementSchema = {
  type: "object",
  description: "Write description",
  required: ["page_name","content_name","status"],
  properties: {
    contentM_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the content management.",
    },
    category: {
      type: "integer",
      format: "int",
      example: 12,
      description:
        "Category id which is used for linking Category data to the document.",
    },
    status: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "Number which is used for status management for the document.",
    },
    page_name: {
      type: "string",
      format: "string",
      example: "test pagename",
      description: "Page name for the document.",
    },
    content_name: {
      type: "string",
      format: "string",
      example: "test content name",
      description: "Content name for the document.",
    },
    content: {
      type: "string",
      format: "string",
      example: "test content",
      description: "Content for the document.",
    },
    reason: {
      type: "string",
      format: "string",
      example: "test reason",
      description: "Reason for the document.",
    },
    caption: {
      type: "string",
      format: "string",
      example: "test caption",
      description: "Caption for the document.",
    },
    uploaded_by: {
      type: "date",
      format: "date",
      example: "2023-11-07T07:43:02.837+00:00",
      description:
        "Date which is used for identify the docment at what time uploaded exactly.",
    },
  },
};
module.exports = contentManagementSchema;
