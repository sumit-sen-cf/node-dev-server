exports.brandCategoryApis = {
  "/api/brandCategory": {
    post: {
      tags: [`Brand Category`],
      description: "Add a Brand Category data.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                brandCategory_name: {
                  type: "string",
                },
                brand_id: {
                  type: "integer",
                },
                created_by: {
                  type: "integer",
                },
              },
            },
            example: {
              brandCategory_name: "Entertainment",
              brand_id: 2,
              created_by: 1,
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: "Brand Category data created success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  status: 200,
                  data: {
                    data: {
                      brandCategory_name: "Entertainment",
                      brand_id: 1,
                      created_by: 1,
                      _id: "654b608adc0535d84ce7b3ba",
                      created_date: "2023-11-08T10:18:50.098Z",
                      brandCategory_id: 1,
                      __v: 0,
                    },
                    message: "brandcategory created success",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Error adding Brand Category to database",
        },
      },
    },
    put: {
      tags: [`Brand Category`],
      description: "Edit a Brand Category with the specified ID.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                brandCategory_id: {
                  type: "integer",
                  required: true,
                },
                brandCategory_name: {
                  type: "string",
                },

                brand_id: {
                  type: "integer",
                },
                created_by: {
                  type: "integer",
                },
              },
            },
            example: {
              brandCategory_id: 1,
              brand_id: 2,
              brandCategory_name: "Test2",
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
                    _id: "654b608adc0535d84ce7b3ba",
                    brandCategory_name: "Test2",
                    brand_id: 2,
                    created_by: 1,
                    created_date: "2023-11-08T10:18:50.098Z",
                    brandCategory_id: 1,
                    __v: 0,
                  },
                },
              },
            },
          },
        },

        200: {
          description: "when your brandCategory_id not match any data in db",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: false,
                  message: "Brand Category not found",
                },
              },
            },
          },
        },
        500: {
          description: "Error updating brand category to database",
        },
      },
    },
    get: {
      tags: [`Brand Category`],
      description: "Get all Brand Categories.",
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
                      _id: "654b608adc0535d84ce7b3ba",
                      brandCategory_name: "Entertainment",
                      brand_id: 1,
                      created_by: 1,
                      created_date: "2023-11-08T10:18:50.098Z",
                      brandCategory_id: 1,
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
                  message: "Error getting all Brand Categories.",
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/brandCategory/{id}": {
    get: {
      tags: [`Brand Category`],
      description: "Get Single Brand Category.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Brand category for find.",
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
                    _id: "654b608adc0535d84ce7b3ba",
                    brandCategory_name: "Test2",
                    brand_id: 2,
                    created_by: 1,
                    created_date: "2023-11-08T10:18:50.098Z",
                    brandCategory_id: 1,
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
                  message: "Error getting brandCategory details",
                },
              },
            },
          },
        },
      },
    },
    delete: {
      tags: [`Brand Category`],
      description: "Delete Brand Category.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Brand Category to delete",
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
                  message: `Brand Category with ID 1 deleted successfully`,
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
                  message: `Brand Category with ID 1 not found`,
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
                  message: "An error occurred while deleting the Brand Category.",
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
