const commitementSchema = {
  type: "object",
  description: "Write description",
  //   required: ["dept_id"],
  properties: {
    cmtId: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the Commitment.",
    },
    cmtValue: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Value for the commetment.",
    },
    cmtName: {
      type: "string",
      format: "string",
      example: "test cmt name",
      description: "Commitment name for the document.",
    },
  },
};
module.exports = commitementSchema;
