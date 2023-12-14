const platformSchema = {
  type: "object",
  description: "Schema for platformModel.",
  required : ["name"],
  properties: {
    id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the platformModel.",
    },
    name: {
      type: "string",
      format: "string",
      example: "manojsdfUser",
      description: "Name for the document.",
    },
    remark: {
      type: "string",
      format: "string",
      example: "remark",
      description: "Remark for the document.",
    },
    Dept_id: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "Department id which is linking department data to this document.",
    },
    created_by: {
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
    created_at: {
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
module.exports = platformSchema;
