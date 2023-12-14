exports.projectxSubCategoryApis = {
  "/api/projectxSubCategory": {
    post: {
      tags: [`Projectx Sub Category`],
      description: "Add a Projectx Sub Category.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                sub_category_name: {
                  type: "string",
                },
                category_id: {
                  type: "integer",
                },
              },
            },
            example: {
              sub_category_name: "example",
              category_id: 1,
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: "Projectx Sub Category data created success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  data: {
                    category_id: 199,
                    sub_category_name: "subexample",
                    _id: "653903be121eaaba2436a34e",
                    sub_category_id: 563,
                    __v: 0,
                  },
                  message: "projectxsubcategory created success",
                },
              },
            },
          },
        },
        "Err1 200": {
          description: "Vlidation error sub category name must be unique.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: false,
                  data: {},
                  message: "Sub category name must be unique",
                },
              },
            },
          },
        },
        "Err2 200": {
          description:
            "Validation error Sub category and Category combination  must be unique.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: false,
                  data: {},
                  message:
                    "Sub category and Category combination  must be unique",
                },
              },
            },
          },
        },
        "Err 500": {
          description: "Error adding projectx sub category into database",
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
          description: "Internal Server Error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  error: "err.message",
                  message: "Error adding projectxsubcategory to database",
                },
              },
            },
          },
        },
      },
    },
    put: {
      tags: [`Projectx Sub Category`],
      description:
        "Edit a Projectx Sub category with the specified ID. Note if you not want to update any specific field in that case you have to remove that target field from request body.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                sub_category_id: {
                  type: "integer",
                  required: true,
                },
                sub_category_name: {
                  type: "string",
                },
                category_id: {
                  type: "integer",
                },
              },
            },
            example: {
              sub_category_name: "example",
              category_id: 1,
              sub_category_id: 1,
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
                },
              },
            },
          },
        },
        "Err1 200": {
          description: "Vlidation error sub category name must be unique.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: false,
                  data: {},
                  message: "Sub category name must be unique",
                },
              },
            },
          },
        },
        "Err2 200": {
          description:
            "Validation error Sub category and Category combination  must be unique.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: false,
                  data: {},
                  message:
                    "Sub category and Category combination  must be unique",
                },
              },
            },
          },
        },
        "Err 200": {
          description: "Sub Category not found with provided ID.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: false,
                  message: "projectx sub category not found",
                },
              },
            },
          },
        },
        500: {
          description: "Internal Server Error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  error: "err.message",
                  message:
                    "Error updating the projectxsubcategory in the database",
                },
              },
            },
          },
        },
      },
    },
    get: {
      tags: [`Projectx Sub Category`],
      description: "Get all Projectx Sub Categories.",

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
                      _id: "652e3981834d9fa8e1479af6",
                      category_id: 170,
                      sub_category_name: "tejas",
                      sub_category_id: 536,
                      __v: 0,
                    },
                    {
                      _id: "6530e2eb834d9fa8e148e392",
                      category_id: 171,
                      sub_category_name: "chess",
                      sub_category_id: 545,
                      __v: 0,
                    },
                    {
                      _id: "6530e40e834d9fa8e148e41f",
                      category_id: 184,
                      sub_category_name: "Namkeen",
                      sub_category_id: 547,
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
                  message: "Error getting all projectxSubCategory",
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/projectxSubCategory/{id}": {
    get: {
      tags: [`Projectx Sub Category`],
      description: "Get Single Projectx Sub Category.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Projectx Sub Category for find.",
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
                    _id: "653903be121eaaba2436a34e",
                    category_id: 1,
                    sub_category_name: "updatedexample",
                    sub_category_id: 563,
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
                  message: "Error getting projectxSubCategory details.",
                },
              },
            },
          },
        },
      },
    },
    delete: {
      tags: [`Projectx Sub Category`],
      description: "Delete Projectx Sub category.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Projectx Sub category to delete",
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
                  message: `Projectx Sub category with ID 1 deleted successfully`,
                },
              },
            },
          },
        },
        200: {
          description: "Error while finding data for Projectx Sub category id.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: true,
                  message: `Projectx Sub category with ID 1 not found`,
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
                    "An error occurred while deleting the projectxsubcategory",
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
