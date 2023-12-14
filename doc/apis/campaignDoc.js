exports.campaignApis = {
  "/api/campaign": {
    post: {
      tags: [`Campaign`],
      description: "Add a Campaign data.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                campaign_name: {
                  type: "string",
                },
                hash_tag: {
                  type: "string",
                },
                user_id: {
                  type: "integer",
                },
                agency_id: {
                  type: "integer",
                },
                brand_id: {
                  type: "integer",
                },
              },
            },
            example: {
              campaign_name: "test campaign name",
              hash_tag: "test hash tag",
              user_id: 1,
              agency_id: 1,
              brand_id: 1,
              created_by: 1,
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: "Campaign data created success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  data: {
                    campaign_name: "test campaign name",
                    hash_tag: "test hash tag",
                    user_id: 1,
                    agency_id: 1,
                    brand_id: 1,
                    _id: "654cd80896279d46f251d940",
                    created_date: "2023-11-09T13:00:56.061Z",
                    campaign_id: 2,
                    __v: 0,
                  },
                  status: 200,
                },
              },
            },
          },
        },
        500: {
          description: "Error adding Campaign to database",
        },
      },
    },
    put: {
      tags: [`Campaign`],
      description: "Edit a Campaign with the specified ID.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                campaign_id: {
                  type: "integer",
                  required: true,
                },
                campaign_name: {
                  type: "string",
                },
                hash_tag: {
                  type: "string",
                },
                user_id: {
                  type: "integer",
                },
                brand_id: {
                  type: "integer",
                },
                agency_id: {
                  type: "integer",
                },
                updated_by: {
                  type: "integer",
                },
              },
            },
            example: {
              campaign_id: 1,
              brand_id: 2,
              campaign_name: "update test campaign name",
              hash_tag: "update test hash tag",
              user_id: 1,
              agency_id: 1,
              updated_by: 1,
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
          description: "when your campaign_id not match any data in db",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: false,
                  message: "Campaign not found",
                },
              },
            },
          },
        },
        500: {
          description: "Error updating Campaign to database",
        },
      },
    },
    get: {
      tags: [`Campaign`],
      description: "Get all Campaigns.",
      responses: {
        "Positive 200": {
          description: "Fetching operation success.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: true,
                  data: [
                    {
                      _id: "654cd80896279d46f251d940",
                      campaign_name: "test campaign name",
                      hash_tag: "test hash tag",
                      user_id: 1,
                      agency_id: 1,
                      brand_id: 1,
                      created_date: "2023-11-09T13:00:56.061Z",
                      campaign_id: 2,
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
                  message: "Error getting all Campaigns.",
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/campaign/{id}": {
    get: {
      tags: [`Campaign`],
      description: "Get Single Campaign.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Campaign for find.",
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
                    _id: "654cd80896279d46f251d940",
                    campaign_name: "test campaign name",
                    hash_tag: "test hash tag",
                    user_id: 1,
                    agency_id: 1,
                    brand_id: 1,
                    created_date: "2023-11-09T13:00:56.061Z",
                    campaign_id: 2,
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
                  message: "Error getting campaign details",
                },
              },
            },
          },
        },
      },
    },
    delete: {
      tags: [`Campaign`],
      description: "Delete Campaign.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Campaign to delete",
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
                  message: `Campaign with ID 1 deleted successfully`,
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
                  message: `Campaign with ID 1 not found`,
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
                  message: "An error occurred while deleting the Campaign.",
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
