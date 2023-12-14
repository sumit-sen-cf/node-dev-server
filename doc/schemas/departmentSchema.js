const departmentSchema = {
  type: "object",
  description: "Write description",
//   required: ["sub_category_id", "category_id"], // assuming these fields are required
  properties: {
    dept_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the department.",
    },
    dept_name: {
      type: "string",
      format: "string",
      example: "test dept name",
      description: "Department name for the document.",
    },
    Remarks: {
      type: "string",
      format: "string",
      example: "test Remarks",
      description: "Remarks for the department.",
    },
    Created_by: {
      type: "integer",
      format: "int",
      example: 123,
      description:
        "User id which is used for identify who is create the document.",
    },
    Last_updated_by: {
      type: "integer",
      format: "int",
      example: 123,
      description:
        "User id which is used for identify who is update the document.",
    },
    Creation_date: {
      type: "date",
      format: "date",
      example: "2023-11-07T07:43:02.837+00:00",
      description:
        "Creation date which is used for identify the docment at what time created exactly.",
    },
    Last_updated_date: {
      type: "date",
      format: "date",
      example: "2023-11-07T07:43:02.837+00:00",
      description:
        "Updation date which is used for identify the docment at what time updated exactly.",
    },
  },
};
module.exports = departmentSchema;
