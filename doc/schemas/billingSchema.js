const billingSchema = {
  type: "object",
  description: "Write description",
  required: ["dept_id"],
  properties: {
    billingheader_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the billing header.",
    },
    dept_id: {
      type: "integer",
      format: "int",
      example: 10,
      description:
        "Department id which is used for linking department data to the document.",
    },
    billing_header_name: {
      type: "string",
      format: "string",
      example: "Biling header name",
      description: "Billing header name for the document.",
    },
  },
};
module.exports = billingSchema;
