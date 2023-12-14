
exports.billingHeaderApis = {
  "/api/add_billingheader": {
    post: {
      tags: [`Billing Header`],
      description: "Add a Billing Header.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                billing_header_name: {
                  type: "string",
                },
                dept_id: {
                  type: "integer",
                },
              },
            },
            example: {
              billing_header_name: "example",
              dept_id: 1,
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: "Bilingheader data created success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  data: {
                    billing_header_name: "test",
                    dept_id: 11,
                    _id: "65366fc9c74638c1d008a2a9",
                    billingheader_id: 6,
                    __v: 0,
                  },
                  message: "billingheaderdata created success",
                },
              },
            },
          },
        },
        500: {
          description: "Error adding billingheaderdata to database",
        },
      },
    },
  },
  "/api/update_billingheader": {
    put: {
      tags: [`Billing Header`],
      description: "Edit a Billing Header with the specified ID.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                billingheader_id: {
                  type: "integer",
                  required: true,
                },
                billing_header_name: {
                  type: "string",
                },
                dept_id: {
                  type: "integer",
                },
              },
            },
            example: {
              billingheader_id: 1,
              billing_header_name: "example",
              dept_id: 1,
            },
          },
        },
      },
      responses: {
        "Positive 200": {
          description: "Data updated successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: true,
                  data: {
                    _id: "65367283ea0b2e7b9161d061",
                    billing_header_name: "update",
                    dept_id: 11,
                    billingheader_id: 16,
                    __v: 0,
                  },
                },
              },
            },
          },
        },
      
        200: {
          description: "when your billingheader_id not match any data in db",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: false,
                },
              },
            },
          },
        },
        500: {
          description: "Error updating billingheaderdata to database",
        },
      },
    },
  },

  "/api/get_single_billingheader/{id}": {
    get: {
      tags: [`Billing Header`],
      description: "Get Single Billing Header.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Billing header for find.",
          required: true,
          schema: {
            type: "integer",
            format: "int64",
          },
        },
      ],
      responses: {
        "Positive 200": {
          description: "Fetching operation success.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: [
                  {
                    _id: "6536727bea0b2e7b9161d05b",
                    billing_header_name: "example",
                    dept_id: 11,
                    billingheader_id: 14,
                    department_name: "final test",
                  },
                ],
              },
            },
          },
        },
        200: {
          description: "There is no data available.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: false,
                  data: {},
                  message: "No Record found",
                },
              },
            },
          },
        },
        500: {
          description: "Error message",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  error: "err.message",
                  message: "Error getting billingheader details",
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/get_all_billingheaders": {
    get: {
      tags: [`Billing Header`],
      description: "Get all Billing Headers.",
      responses: {
        "Positive 200": {
          description: "Fetching operation success.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: [
                  {
                    _id: "6536727bea0b2e7b9161d05b",
                    billing_header_name: "example",
                    dept_id: 11,
                    billingheader_id: 14,
                    department_name: "final test",
                  },
                  {
                    _id: "65367283ea0b2e7b9161d061",
                    billing_header_name: "update",
                    dept_id: 11,
                    billingheader_id: 16,
                    department_name: "final test",
                  },
                ],
              },
            },
          },
        },
        200: {
          description: "There is no data available.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: false,
                  data: [],
                  message: "No Record found",
                },
              },
            },
          },
        },
        500: {
          description: "Error message",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  error: "err.message",
                  message: "Error getting all billingheaderdata",
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/delete_billingheader/{id}": {
    delete: {
      tags: [`Billing Header`],
      description: "Delete Billing Header.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Billing header to delete",
          required: true,
          schema: {
            type: "integer",
            format: "int64",
          },
        },
      ],
      responses: {
        "Positive 200": {
          description: "Deletion operation success.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: true,
                  message: `billingheader with ID 1 deleted successfully`,
                },
              },
            },
          },
        },
        200: {
          description: "Error while finding data for perticular id.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: true,
                  message: `billingheader with ID 1 not found`,
                },
              },
            },
          },
        },
        500: {
          description: "Error message",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: false,
                  message: "An error occurred while deleting the billingheader",
                  error: "error.message",
                },
              },
            },
          },
        },
      },
    },
  },
};
