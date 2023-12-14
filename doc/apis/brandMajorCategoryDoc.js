exports.brandMajorCategoryApis = {
  "/api/brandMajorCategory": {
    post: {
      tags: [`Brand Major Category`],
      description: "Add a Brand Major Category data.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                brandMajorCategory_name: {
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
              brandMajorCategory_name: "Funny1",
              brand_id: 2,
              created_by: 1,
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: "Brand Major Category data created success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  data: {
                    brandMajorCategory_name: "Funny1",
                    brand_id: 2,
                    created_by: 1,
                    _id: "654c7e63bd20f99a67ceba58",
                    created_date: "2023-11-09T06:38:27.605Z",
                    brandMajorCategory_id: 1,
                    __v: 0,
                  },
                  message: "brandmajorcategory created success",
                },
              },
            },
          },
        },
        500: {
          description: "Error adding Brand Major Category to database",
        },
      },
    },
    put: {
      tags: [`Brand Major Category`],
      description: "Edit a Brand Major Category with the specified ID.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                brandMajorCategory_id: {
                  type: "integer",
                  required: true,
                },
                brandMajorCategory_name: {
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
              brandMajorCategory_id: 1,
              brand_id: 2,
              brandMajorCategory_name: "Test2",
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
                    _id: "654cb8facf8d193264679d6e",
                    brandMajorCategory_name: "Test2",
                    brand_id: 2,
                    created_by: 1,
                    created_date: "2023-11-09T10:48:26.176Z",
                    brandMajorCategory_id: 2,
                    __v: 0,
                  },
                },
              },
            },
          },
        },

        200: {
          description:
            "when your brandMajorCategory_id not match any data in db",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: false,
                  message: "Brand Major Category not found",
                },
              },
            },
          },
        },
        500: {
          description: "Error updating Brand Major Category to database",
        },
      },
    },
    get: {
      tags: [`Brand Major Category`],
      description: "Get all Brand Major Categories.",
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
                      _id: "652395d03b2912a12bacd86f",
                      brandMajorCategory_name: "Brands",
                      brand_id: 1,
                      created_by: 1,
                      created_date: "2023-10-09T05:55:28.274Z",
                      brandMajorCategory_id: 1,
                      __v: 0,
                    },
                    {
                      _id: "6523b4f63b2912a12bace1b2",
                      brandMajorCategory_name: "Normal",
                      brand_id: 1,
                      created_by: 1,
                      created_date: "2023-10-09T08:08:22.506Z",
                      brandMajorCategory_id: 2,
                      __v: 0,
                    },
                    {
                      _id: "6523b50f3b2912a12bace1bb",
                      brandMajorCategory_name: "Negative",
                      brand_id: 1,
                      created_by: 1,
                      created_date: "2023-10-09T08:08:47.842Z",
                      brandMajorCategory_id: 3,
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
                  message: "Error getting all Brand Major Categories.",
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/brandMajorCategory/{id}": {
    get: {
      tags: [`Brand Major Category`],
      description: "Get Single Brand Major Category.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Brand Major Category for find.",
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
                    _id: "6523b51b3b2912a12bace1be",
                    brandMajorCategory_name: "NBFRS",
                    brand_id: 1,
                    created_by: 1,
                    created_date: "2023-10-09T08:08:59.598Z",
                    brandMajorCategory_id: 4,
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
                  message: "Error getting brandMajorCategory details",
                },
              },
            },
          },
        },
      },
    },
    delete: {
      tags: [`Brand Major Category`],
      description: "Delete Brand Major Category.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Brand Major Category to delete",
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
                  message: `Brand Major Category with ID 1 deleted successfully`,
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
                  message: `Brand Major Category with ID 1 not found`,
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
                    "An error occurred while deleting the Brand Major Category.",
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
