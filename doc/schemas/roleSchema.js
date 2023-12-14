const roleSchema = {
  type: "object",
  description: "Schema for roleModel.",
  properties: {
    role_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the roleModel.",
    },
    Role_name: {
      type: "string",
      format: "string",
      example: "Admin",
      description: "Role name for the document.",
    },
    Remarks: {
      type: "string",
      format: "string",
      example: "remark",
      description: "Remark for the document.",
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
    Last_update_date: {
      type: "date",
      format: "date",
      example: "2023-11-03T07:08:51.702+00:00",
      description: "Updation date for the document.",
    },
  },
};
module.exports = roleSchema;
