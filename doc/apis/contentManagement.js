exports.contentManagementApis = {
  "/api/add_contentMgnt": {
    post: {
      tags: [`Content Management`],
      description: "Add a Content Management.",
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                content: {
                  type: "file",
                  format: "binary",
                  description: "This is file for content management.",
                },
                page_name: {
                  type: "string",
                  format: "string",
                  description: "Provide page name for the content management.",
                  example: "test page name",
                },
                content_name: {
                  type: "string",
                  format: "string",
                  description:
                    "Provide content_name for the content management.",
                  example: "test content name",
                },
                category: {
                  type: "integer",
                  format: "integer",
                  description: "Provide category.",
                  example: 1,
                },
                sub_category: {
                  type: "integer",
                  format: "integer",
                  description: "Provide sub category.",
                  example: 1,
                },
                reason: {
                  type: "string",
                  format: "string",
                  description: "Provide reason",
                  example: "test reason",
                },
                caption: {
                  type: "string",
                  format: "string",
                  description: "Provide caption.",
                  example: "test caption",
                },
                status: {
                  type: "string",
                  format: "string",
                  required: true,
                  description: "Provide status.",
                  example: "Active",
                },
                uploaded_by: {
                  type: "string",
                  format: "date",
                  description: "Provide Date",
                  example: "2012-12-11T18:30:00.000+00:00",
                },
              },
            },
          },
        },
        required: true,
      },
      responses: {
        "Positive 200": {
          description: "Content management data created success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  contentManagementv: {
                    page_name: "test",
                    content_name: "test",
                    category: 1,
                    sub_category: 1,
                    content: "339c75db1ac58a6dab1a9bcad1b420b0",
                    reason: "trds",
                    status: "terst",
                    caption: "test",
                    uploaded_by: "2012-12-11T18:30:00.000Z",
                    _id: "65532c7a2c6014f46be12278",
                    contentM_id: 3,
                    __v: 0,
                  },
                  status: 200,
                },
              },
            },
          },
        },
        500: {
          description: "Error adding Content management to database",
        },
      },
    },
  },
  "/api/update_contentMgnt": {
    put: {
      tags: [`Content Management`],
      description: "Edit a Content manangement with the specified ID.",
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                contentM_id: {
                  type: "integer",
                  format: "integer",
                  description:
                    "Provide Content management unique ID Must Required.",
                  required: true,
                },
                content: {
                  type: "file",
                  format: "binary",
                  description:
                    "Provide content file which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                page_name: {
                  type: "string",
                  format: "string",
                  description:
                    "Provide page name which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                content_name: {
                  type: "string",
                  format: "string",
                  description:
                    "Provide content_name for the content management.",
                },
                category: {
                  type: "integer",
                  format: "integer",
                  description:
                    "Provide category  which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                sub_category: {
                  type: "integer",
                  format: "integer",
                  description:
                    "Provide sub category  which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                reason: {
                  type: "string",
                  format: "string",
                  description:
                    "Provide reason  which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                caption: {
                  type: "string",
                  format: "string",
                  description:
                    "Provide caption  which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                status: {
                  type: "string",
                  format: "string",
                  required: true,
                  description:
                    "Provide status  which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                uploaded_by: {
                  type: "string",
                  format: "date",
                  description:
                    "Provide Date  which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
              },
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
                    _id: "6553402745c8d08d00640de9",
                    page_name: "update page name",
                    content_name: "test content name",
                    category: 1,
                    sub_category: 1,
                    content: "9dd79e82f338aa1cd1763a7df54796fb",
                    reason: "test reason",
                    status: "Active",
                    caption: "test caption",
                    uploaded_by: "2012-12-11T18:30:00.000Z",
                    contentM_id: 4,
                    __v: 0,
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Error updating Content management to database",
        },
      },
    },
  },
  "/api/get_single_contentMgnt/{id}": {
    get: {
      tags: [`Content Management`],
      description: "Get Single Content management.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Content management for find.",
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
                    _id: "6553402745c8d08d00640de9",
                    page_name: "update page name",
                    content_name: "test content name",
                    category: 1,
                    sub_category: 1,
                    content: "9dd79e82f338aa1cd1763a7df54796fb",
                    reason: "test reason",
                    status: "Active",
                    caption: "test caption",
                    uploaded_by: "2012-12-11T18:30:00.000Z",
                    contentM_id: 4,
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
                  message: "Error getting contentManagementModel details",
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/get_all_contentMgnts": {
    get: {
      tags: [`Content Management`],
      description: "Get all Content managements.",
      responses: {
        "Positive 200": {
          description: "Fetching operation success.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: [
                  {
                    _id: "65531faaf8b98492a2d9c493",
                    page_name: "test",
                    content_name: "test",
                    content: "82be6f311d243a8e117e42edba79dc85",
                    reason: "",
                    status: "1",
                    uploaded_by: "2023-11-14T07:20:10.905Z",
                    contentM_id: 1,
                    __v: 0,
                  },
                  {
                    _id: "65532c7a2c6014f46be12278",
                    page_name: "",
                    content_name: "",
                    category: null,
                    sub_category: null,
                    content: "339c75db1ac58a6dab1a9bcad1b420b0",
                    reason: "",
                    status: "",
                    caption: "",
                    uploaded_by: null,
                    contentM_id: 3,
                    __v: 0,
                  },
                  {
                    _id: "6553402745c8d08d00640de9",
                    page_name: "update page name",
                    content_name: "test content name",
                    category: 1,
                    sub_category: 1,
                    content: "9dd79e82f338aa1cd1763a7df54796fb",
                    reason: "test reason",
                    status: "Active",
                    caption: "test caption",
                    uploaded_by: "2012-12-11T18:30:00.000Z",
                    contentM_id: 4,
                    __v: 0,
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
                  message: "Error getting all Content managenement",
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/delete_contentMgnt/{id}": {
    delete: {
      tags: [`Content Management`],
      description: "Delete Content manangement.",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of Content managenement to delete",
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
                  message: `Content management with ID 1 deleted successfully`,
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
                  message: `Content management with ID 1 not found`,
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
                  message: "An error occurred while deleting the Content management.",
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
