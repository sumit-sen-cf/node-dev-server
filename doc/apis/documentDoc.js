exports.documenentMastApis = {
  "/api/add_doc": {
    post: {
      tags: [`Document`],
      description: "Add a Document.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                period: {
                  type: "integer",
                },
                description: {
                  type: "string",
                },
                priority: {
                  type: "string",
                },
                doc_type: {
                  type: "string",
                },
              },
            },
            example: {
              description: "test",
              priority: "test",
              doc_type: "test",
              period: 1,
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: "Document data created success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: true,
                  message: "Data Created Successfully",
                  data: {
                    doc_type: "test",
                    description: "test",
                    priority: "test",
                    period: 1,
                    _id: "6557512d9c25a9ae2dd72b11",
                    __v: 0,
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Error adding Document data to database",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: false,
                  message: "DB ERROR",
                  data: {},
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/update_doc": {
    put: {
      tags: [`Document`],
      description: "Edit a Document data with the specified ID.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                _id: {
                  type: "string",
                  required: "string",
                },
                period: {
                  type: "integer",
                },
                description: {
                  type: "string",
                },
                priority: {
                  type: "string",
                },
                doc_type: {
                  type: "string",
                },
              },
            },
            example: {
              _id: "6557512d9c25a9ae2dd72b11",
              description: "update test",
              priority: "update priority",
              doc_type: "update doc_type",
              period: 2,
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
                  message: "Data Update Successfully",
                  data: {
                    _id: "6557512d9c25a9ae2dd72b11",
                    doc_type: "update doc_type",
                    description: "update test",
                    priority: "update priority",
                    period: 2,
                    __v: 0,
                  },
                },
              },
            },
          },
        },

        200: {
          description: "when your _id not match any data in db",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: false,
                  message: "No record found",
                },
              },
            },
          },
        },
        500: {
          description: "Error updating Document data to database",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: false,
                  message: "DB ERROR",
                  data: {},
                },
              },
            },
          },
        },
      },
    },
  },

  "/api/get_doc/{id}": {
    get: {
      tags: [`Document`],
      description: "Get Single Document.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Document for find.",
          required: true,
          schema: {
            type: "string",
            format: "string",
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
                example: {
                  success: true,
                  message: "Data Fetch Successfully",
                  data: {
                    _id: "6557512d9c25a9ae2dd72b11",
                    doc_type: "test",
                    description: "test",
                    priority: "test",
                    period: 1,
                    __v: 0,
                  },
                },
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
                  status: false,
                  message: "err.message",
                  data: {},
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/get_all_docs": {
    get: {
      tags: [`Document`],
      description: "Get all Documents.",
      responses: {
        "Positive 200": {
          description: "Fetching operation success.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: true,
                  message: "Data Fetch Successfully",
                  data: [
                    {
                      _id: "6557512d9c25a9ae2dd72b11",
                      doc_type: "test",
                      description: "test",
                      priority: "test",
                      period: 1,
                      __v: 0,
                    },
                  ],
                },
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
                  status: false,
                  message: "err.message",
                  data: {},
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/delete_doc/{id}": {
    delete: {
      tags: [`Document`],
      description: "Delete Document.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Document to delete",
          required: true,
          schema: {
            type: "string",
            format: "string",
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
                  message: `Document with ID 6557512d9c25a9ae2dd72b11 deleted successfully`,
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
                  message: `Document with ID 6557512d9c25a9ae2dd72b11 not found`,
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
                  message: "error.message",
                  data: {},
                },
              },
            },
          },
        },
      },
    },
  },
};
