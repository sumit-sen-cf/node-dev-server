
exports.projectxCategoryApis = {
  "/api/projectxCategory": {
    post: {
      tags: [`Projectx Category`],
      description: "Add a Projectx Category.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                category_name: {
                  type: "string",
                },
                brand_id: {
                  type: "integer",
                },
              },
            },
            example: {
              category_name: "example",
              brand_id: 1,
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: "Projectx Category data created success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  data: {
                    brand_id: 343,
                    category_name: "example",
                    _id: "6538e9058d99874f4b998c5a",
                    category_id: 199,
                    __v: 0,
                  },
                  message: "projectxcategory created success",
                },
              },
            },
          },
        },
        "Err 500": {
          description: "Error while adding Projectx Category to database",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: false,
                  data: {},
                  message: "Something went wrong..",
                },
              },
            },
          },
        },
        500: {
          description: "Error adding projectxcategory to database",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  error: "err.message",
                  message: "Error adding projectxcategory to database",
                },
              },
            },
          },
        },
      },
    },
    put: {
      tags: [`Projectx Category`],
      description:
        "Edit a Projectx category with the specified ID. Note if you not want to update any specific field in that case you have to remove that target field from request body.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                  required: true,
                },
                category_name: {
                  type: "string",
                },
                brand_id: {
                  type: "integer",
                },
              },
            },
            example: {
              category_name: "example",
              dept_id: 1,
              id: 1,
            },
          },
        },
      },
      responses: {
        "Positive 200": {
          description: "Updation successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: true,
                  data: {
                    _id: "6538e9058d99874f4b998c5a",
                    brand_id: 343,
                    category_name: "exampleupdate",
                    category_id: 199,
                    __v: 0,
                  },
                },
              },
            },
          },
        },
        200: {
          description: "Validation error for category name unique",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  status: false,
                  message: "Category name must be unique",
                  data: {},
                },
              },
            },
          },
        },
        "Err 200": {
          description: "Category not found with provided ID.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: false,
                  message: "projectx category not found",
                },
              },
            },
          },
        },
        500: {
          description: "Error adding projectxcategory to database",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  error: "err.message",
                  message:
                    "Error updating the projectxcategory in the database",
                },
              },
            },
          },
        },
      },
    },
    get: {
      tags: [`Projectx Category`],
      description: "Get all Projectx Categories.",
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
                      _id: "652fe3ea834d9fa8e1487c4d",
                      brand_id: 0,
                      category_name: "Chipss",
                      category_id: 184,
                      __v: 0,
                    },
                    {
                      _id: "65312578d89678e2701c5c4b",
                      brand_id: 3,
                      category_name: "testcategoryname11",
                      category_id: 189,
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
                  success: true,
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
                  message: "Error getting all projectxCategory",
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/projectxCategory/{id}": {
    get: {
      tags: [`Projectx Category`],
      description: "Get Single Projectx Category.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Projectx Category for find.",
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
                    _id: "65291bb41e9825a282dd0668",
                    brand_id: 1,
                    category_name: "Entertainment",
                    category_id: 170,
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
                  message: "Error getting projectxCategorySchema details.",
                },
              },
            },
          },
        },
      },
    },
    delete: {
      tags: [`Projectx Category`],
      description: "Delete Projectx category.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Projectx category to delete",
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
                  message: `Projectx category with ID 1 deleted successfully`,
                },
              },
            },
          },
        },
        200: {
          description: "Error while finding data for Projectx category id.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: true,
                  message: `Projectx category with ID 1 not found`,
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
                    "An error occurred while deleting the projectxcategory",
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
