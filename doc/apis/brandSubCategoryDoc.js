exports.brandSubCategoryApis = {
  "/api/brandSubCategory": {
    post: {
      tags: [`Brand Sub Category`],
      description: "Add a Brand Sub Category data.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                brandSubCategory_name: {
                  type: "string",
                },
                brandCategory_id: {
                  type: "integer",
                },
                created_by: {
                  type: "integer",
                },
              },
            },
            example: {
              brandSubCategory_name: "Funny1",
              brandCategory_id: 2,
              created_by: 1,
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: "Brand Sub Category data created success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  data: {
                    brandSubCategory_name: "funny1",
                    brandCategory_id: 2,
                    created_by: 1,
                    _id: "654cc9c86b876c474e979a3e",
                    created_date: "2023-11-09T12:00:08.415Z",
                    brandSubCategory_id: 1,
                    __v: 0,
                  },
                  message: "brandsubcategory created success",
                },
              },
            },
          },
        },
        500: {
          description: "Error adding Brand Sub Category to database",
        },
      },
    },
    put: {
      tags: [`Brand Sub Category`],
      description: "Edit a Brand Sub Category with the specified ID.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                brandSubCategory_id: {
                  type: "integer",
                  required: true,
                },
                brandSubCategory_name: {
                  type: "string",
                },

                brandCategory_id: {
                  type: "integer",
                },
                created_by: {
                  type: "integer",
                },
              },
            },
            example: {
              brandSubCategory_id: 1,
              brand_id: 2,
              brandSubCategory_name: "Test2",
              created_by: 1,
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
                    _id: "654cc9c86b876c474e979a3e",
                    brandSubCategory_name: "updatetest",
                    brandCategory_id: 2,
                    created_by: 1,
                    created_date: "2023-11-09T12:00:08.415Z",
                    brandSubCategory_id: 1,
                    __v: 0,
                  },
                },
              },
            },
          },
        },

        200: {
          description: "when your brandSubCategory_id not match any data in db",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: false,
                  message: "Brand Sub Category not found",
                },
              },
            },
          },
        },
        500: {
          description: "Error updating Brand Sub Category to database",
        },
      },
    },
    get: {
      tags: [`Brand Sub Category`],
      description: "Get all Brand Sub Categories.",
      responses: {
        "Positive 200": {
          description: "Fetching operation success.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  data: [
                    {
                      _id: "654cc9c86b876c474e979a3e",
                      brandSubCategory_name: "funny1",
                      brandCategory_id: 2,
                      created_by: 1,
                      created_date: "2023-11-09T12:00:08.415Z",
                      brandSubCategory_id: 1,
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
                  error: "err.message",
                  message: "Error getting all Brand Sub Categories.",
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/brandSubCategory/{id}": {
    get: {
      tags: [`Brand Sub Category`],
      description: "Get Single Brand Sub Category.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Brand Sub Category for find.",
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
                example: {
                  data: {
                    _id: "654cc9c86b876c474e979a3e",
                    brandSubCategory_name: "funny1",
                    brandCategory_id: 2,
                    created_by: 1,
                    created_date: "2023-11-09T12:00:08.415Z",
                    brandSubCategory_id: 1,
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
                  error: "err.message",
                  message: "Error getting brandSubCategory details",
                },
              },
            },
          },
        },
      },
    },
    delete: {
      tags: [`Brand Sub Category`],
      description: "Delete Brand Sub Category.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Brand Sub Category to delete",
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
                  message: `Brand Sub Category with ID 1 deleted successfully`,
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
                  message: `Brand Sub Category with ID 1 not found`,
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
                  message:
                    "An error occurred while deleting the Brand Sub Category.",
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
