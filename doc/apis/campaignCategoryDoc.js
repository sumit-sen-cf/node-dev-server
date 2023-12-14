exports.campaignCategoryApis = {
  "/api/campaignCategory": {
    post: {
      tags: [`Campaign Category`],
      description: "Add a Campaign Category data.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              campaignCategory_name: {
                campaignCategory_name: {
                  type: "string",
                },
                campaign_id: {
                  type: "integer",
                },
                created_by: {
                  type: "integer",
                },
              },
            },
            example: {
              campaignCategory_name: "test campaign category name",
              campaign_id: 1,
              created_by: 1,
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: "Validation Error.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  data: {},
                  message:
                    "Provided campaign_id and existing campaignCategory_name should be unique.",
                },
              },
            },
          },
        },
        "Positive 200": {
          description: "Campaign Category data created success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  data: {
                    campaignCategory_name: "test campaign category name",
                    campaign_id: 1,
                    created_by: 1,
                    _id: "654dd5ec0f47dbf70a399752",
                    created_date: "2023-11-10T07:04:12.116Z",
                    campaignCategory_id: 1,
                    __v: 0,
                  },
                  message: "campaigncategory created success",
                },
              },
            },
          },
        },
        500: {
          description: "Error adding Campaign category to database",
        },
      },
    },
    put: {
      tags: [`Campaign Category`],
      description: "Edit a Campaign category with the specified ID.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                campaignCategory_id: {
                  type: "integer",
                  required: true,
                },
                campaignCategory_name: {
                  type: "string",
                },
                campaign_id: {
                  type: "integer",
                },
                created_by: {
                  type: "integer",
                },
              },
            },
            example: {
              campaignCategory_id: 1,
              brand_id: 2,
              campaignCategory_name: "update test campaign category name",
              campaign_id: 1,
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
                    _id: "654cd80896279d46f251d940",
                    campaign_name: "update test campaign name",
                    hash_tag: "update test hash tag",
                    user_id: 1,
                    agency_id: 1,
                    brand_id: 2,
                    created_date: "2023-11-09T13:00:56.061Z",
                    campaign_id: 2,
                    __v: 0,
                    updated_by: 1,
                    updated_date: "2023-11-09T13:11:46.329Z",
                  },
                },
              },
            },
          },
        },

        200: {
          description: "When your campaignCategory_id not match any data in db",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: false,
                  message: "Campaign category not found",
                },
              },
            },
          },
        },
        500: {
          description: "Error updating Campaign category to database",
        },
      },
    },
    get: {
      tags: [`Campaign Category`],
      description: "Get all Campaign categories.",
      responses: {
        "Positive 200": {
          description: "Fetching operation success.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: true,
                  data: {
                    _id: "654dd5ec0f47dbf70a399752",
                    campaignCategory_name: "update test campaign category name",
                    campaign_id: 1,
                    created_by: 1,
                    created_date: "2023-11-10T07:04:12.116Z",
                    campaignCategory_id: 1,
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
                  message: "Error getting all Campaign categories.",
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/campaignCategory/{id}": {
    get: {
      tags: [`Campaign Category`],
      description: "Get Single Campaign category.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Campaign category for find.",
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
                    _id: "654dd5ec0f47dbf70a399752",
                    campaignCategory_name: "test campaign category name",
                    campaign_id: 1,
                    created_by: 1,
                    created_date: "2023-11-10T07:04:12.116Z",
                    campaignCategory_id: 1,
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
                  message: "Error getting campaign category details",
                },
              },
            },
          },
        },
      },
    },
    delete: {
      tags: [`Campaign Category`],
      description: "Delete Campaign category.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Campaign category to delete",
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
                  message: `Campaign category with ID 1 deleted successfully`,
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
                  message: `Campaign category with ID 1 not found`,
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
                    "An error occurred while deleting the Campaign category.",
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
