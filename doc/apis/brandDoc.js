
exports.brandApis = {
  "/api/add_brand": {
    post: {
      tags: [`Brand`],
      description: "Add a Brand data.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                brand_name: {
                  type: "string",
                },
                category_id: {
                  type: "integer",
                },
                sub_category_id: {
                  type: "integer",
                },
                user_id: {
                  type: "integer",
                },
                igusername: {
                  type: "string",
                },
                whatsapp: {
                  type: "string",
                },
                major_category: {
                  type: "string",
                },
                website: {
                  type: "string",
                },
              },
            },
            example: {
              major_category: "Entertainment",
              brand_name: "Test",
              user_id: 2,
              whatsapp: "TestWhatsup",
              igusername: "Testigusername",
              sub_category_id: 1,
              category_id: 1,
              website: "test",
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  status: false,
                  data: {},
                  message: "Brand name must be unique",
                },
              },
            },
          },
        },
        "Positive 200": {
          description: "Brand data created success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  status: 200,
                  data: {
                    _id: "65366fc9c74638c1d008a2a9",
                    brand_name: "tiger",
                    category_id: 170,
                    sub_category_id: 517,
                    igusername: "user name",
                    whatsapp: "wts app",
                    website: "",
                    major_category: "Entertainment",
                    created_at: "2023-11-03T14:10:17.875Z",
                    brand_id: 3000,
                    __v: 0,
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Error adding Brand to database",
        },
      },
    },
  },
  "/api/edit_brand": {
    put: {
      tags: [`Brand`],
      description: "Edit a Brand with the specified ID.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                brand_id: {
                  type: "integer",
                  required: true,
                },
                brand_name: {
                  type: "string",
                },
                igusername: {
                  type: "string",
                },
                whatsapp: {
                  type: "string",
                },
                major_category: {
                  type: "string",
                },
                website: {
                  type: "string",
                },
                category_id: {
                  type: "integer",
                },
                user_id: {
                  type: "integer",
                },
                sub_category_id: {
                  type: "integer",
                },
              },
            },
            example: {
              brand_id: 1,
              major_category: 2,
              brand_name: "Test2",
              user_id: 1,
              status: "Inactive",
              whatsapp: "TestWhatsup",
              igusername: "Testigusername",
              sub_category_id: 1,
              category_id: 1,
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
                    _id: "654b447de5dafce2563e6524",
                    brand_name: "test2",
                    category_id: 1,
                    sub_category_id: 1,
                    igusername: "Testigusername",
                    whatsapp: "TestWhatsup",
                    website: "test",
                    major_category: "2",
                    user_id: 1,
                    created_at: "2023-11-08T08:19:09.566Z",
                    brand_id: 1,
                    __v: 0,
                    updated_at: "2023-11-08T08:36:49.955Z",
                  },
                },
              },
            },
          },
        },

        200: {
          description: "when your brand_id not match any data in db",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: false,
                  message: "Brand not found",
                },
              },
            },
          },
        },
        500: {
          description: "Error updating brand to database",
        },
      },
    },
  },
  "/api/get_brand/{id}": {
    get: {
      tags: [`Brand`],
      description: "Get Single Brand.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Brand for find.",
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
                    _id: "654b447de5dafce2563e6524",
                    brand_name: "test2",
                    category_id: 1,
                    sub_category_id: 1,
                    igusername: "Testigusername",
                    whatsapp: "TestWhatsup",
                    website: "test",
                    major_category: "2",
                    user_id: 1,
                    created_at: "2023-11-08T08:19:09.566Z",
                    brand_id: 1,
                    __v: 0,
                    updated_at: "2023-11-08T08:36:49.955Z",
                    projectx_category_name: "category_name",
                    projectx_subcategory_name: "sub_category_name",
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
                  message: "Error getting Brand details",
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/get_brands": {
    get: {
      tags: [`Brand`],
      description: "Get all Brands.",
      responses: {
        "Positive 200": {
          description: "Fetching operation success.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: [
                  {
                    _id: "654b447de5dafce2563e6524",
                    brand_name: "test2",
                    category_id: 1,
                    sub_category_id: 1,
                    igusername: "Testigusername",
                    whatsapp: "TestWhatsup",
                    website: "test",
                    major_category: "2",
                    user_id: 1,
                    created_at: "2023-11-08T08:19:09.566Z",
                    brand_id: 1,
                    __v: 0,
                    updated_at: "2023-11-08T08:36:49.955Z",
                    projectx_category_name: "category_name",
                    projectx_subcategory_name: "sub_category_name",
                  },
                  {
                    _id: "654b447de5dafce2563e6524",
                    brand_name: "test3",
                    category_id: 1,
                    sub_category_id: 1,
                    igusername: "Testigusername",
                    whatsapp: "TestWhatsup",
                    website: "test",
                    major_category: "2",
                    user_id: 1,
                    created_at: "2023-11-08T08:19:09.566Z",
                    brand_id: 2,
                    __v: 0,
                    updated_at: "2023-11-08T08:36:49.955Z",
                    projectx_category_name: "category_name",
                    projectx_subcategory_name: "sub_category_name",
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
                  message: "Error getting all Brands",
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/delete_brand/{id}": {
    delete: {
      tags: [`Brand`],
      description: "Delete Brand.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Brand to delete",
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
                  message: `Brand with ID 1 deleted successfully`,
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
                  message: `Brand with ID 1 not found`,
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
                  message: "An error occurred while deleting the Brand",
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
