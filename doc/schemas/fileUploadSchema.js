const fileUploadSchema = {
  type: "object",
  description:
    "This Schema is manage multiple file upload for contentSecReg model (Content section Register).",
  //   required: ["dept_id"], // assuming these fields are required
  properties: {
    fileId: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the file.",
    },
    contentSecRegId: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "contentSecRegId which is used for linking contentSecRegCmp data to the document.",
    },
    contentSecFile: {
      type: "string",
      format: "string",
      example: "path",
      description:
        "contentSecFile which is generated using multer for the document.",
    },
  },
};
module.exports = fileUploadSchema;
