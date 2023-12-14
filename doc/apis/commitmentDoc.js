exports.commitmentApis = {
  "/api/add_commitment": {
    post: {
      tags: [`Commitment`],
      description: "Add a Commitment.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                cmtName: {
                  type: "string",
                },
                cmtValue: {
                  type: "integer",
                },
              },
            },
            example: {
              cmtName: "example",
              cmtValue: 1,
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: "Validation error.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  status: false,
                  data: {},
                  message: "Commitement name must be unique",
                },
              },
            },
          },
        },
        "Positive 200": {
          description: "Commitment data created success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: true,
                  message: "Commitment creat+ed successfully",
                  data: {
                    cmtName: "example",
                    cmtValue: 1,
                    _id: "654deebfc7d38df6989ed54d",
                    cmtId: 1,
                    __v: 0,
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Error adding Commitment to database",
        },
      },
    },
  },
  "/api/update_commitment": {
    put: {
      tags: [`Commitment`],
      description: "Edit a Commitment with the specified ID.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                cmtId: {
                  type: "integer",
                  required: true,
                },
                cmtName: {
                  type: "string",
                },
                cmtValue: {
                  type: "integer",
                },
              },
            },
            example: {
              cmtId: 1,
              cmtName: "example",
              cmtValue: 1,
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
                schema: {
                  type: "object",
                  example: {
                    success: true,
                    message: "Data update Successfully.",
                    data: {
                      _id: "654deebfc7d38df6989ed54d",
                      cmtName: "example",
                      cmtValue: 1,
                      cmtId: 1,
                      __v: 0,
                    },
                  },
                },
              },
            },
          },
        },
        200: {
          description: "Validation error.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  status: false,
                  data: {},
                  message: "Commitement name must be unique",
                },
              },
            },
          },
        },
        500: {
          description: "Error updating commitment to database",
        },
      },
    },
  },
  "/api/get_single_commitment/{id}": {
    get: {
      tags: [`Commitment`],
      description: "Get Single Commitment.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Commitment for find.",
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
                  success: true,
                  message: "Data Fetched Successfully.",
                  data: {
                    _id: "654deebfc7d38df6989ed54d",
                    cmtName: "example",
                    cmtValue: 1,
                    cmtId: 1,
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
                  message: "Error getting Commitment details",
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/get_all_commitments": {
    get: {
      tags: [`Commitment`],
      description: "Get all Commitments.",
      responses: {
        "Positive 200": {
          description: "Fetching operation success.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  success: true,
                  message: "Data Fetched Successfully.",
                  data: [
                    {
                      _id: "654deebfc7d38df6989ed54d",
                      cmtName: "example",
                      cmtValue: 1,
                      cmtId: 1,
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
                  message: "Error getting all billingheaderdata",
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/delete_commitment/{id}": {
    delete: {
      tags: [`Commitment`],
      description: "Delete Commitment.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Commitment to delete",
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
                  message: `Commitment with ID 1 deleted successfully`,
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
                  message: `Commitment with ID 1 not found`,
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
                  message: "An error occurred while deleting the Commitment",
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
