const objMastSchema = {
    type: "object",
    description: "Schema for objectModel.",
    properties: {
        obj_id: {
        type: "integer",
        format: "int",
        example: 1,
        description: "Unique identifier for the objectModel.",
      },
      obj_name: {
        type: "string",
        format: "string",
        example: "Pantry User",
        description: "obj_name for the document.",
      },
      soft_name: {
        type: "string",
        format: "string",
        example: "Admin",
        description: "soft_name for the document.",
      },
      Dept_id: {
        type: "integer",
        format: "int",
        example: 1,
        description: "Department id which is linking department data to this document.",
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
      Creation_date: {
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
  module.exports = objMastSchema;
  