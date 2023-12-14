const kraTransSchema = {
  type: "object",
  description: "Schema for kraTransModel.",
  properties: {
    kraTrans_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the kraTransModel.",
    },
    remark: {
      type: "string",
      format: "string",
      example: "remark",
      description: "Remark for the document.",
    },
    user_to_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "User id wich is used for linking user data to this document.",
    },
    user_from_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "User id whhich is used for linking user data to this document.",
    },
    job_responsibility_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "job_responsibility_id which is used to linking job responsibility data to this document.",
    },
    Created_by: {
      type: "integer",
      format: "int",
      example: 1,
      description: "User id whio is created this document.",
    },
    Last_updated_by: {
      type: "integer",
      format: "int",
      example: 1,
      description: "User id whio is update this document.",
    },
    Created_date: {
      type: "date",
      format: "date",
      example: "2023-11-03T07:08:51.702+00:00",
      description: "Creation date for the document.",
    },
    Last_updated_date: {
      type: "date",
      format: "date",
      example: "2023-11-03T07:08:51.702+00:00",
      description: "Updation date for the document.",
    },
  },
};
module.exports = kraTransSchema;
