const constant = require("../../common/constant");

// Examples Data
const allRegisterCmpData = {
  data: [
    {
      detailing: "",
      _id: "651c0fd366d6c606096cea1d",
      brand_id: 343,
      brnad_dt: "Tue, 10 Oct 2023 20:30:00 GMT",
      excel_path: "df06441b3479b32922098abc532825d8",
      commitment: [
        {
          selectValue: 79,
          textValue: "1000",
        },
      ],
      register_campaign_id: 54,
      __v: 0,
      download_excel_file: `${constant.base_url}/uploads/df06441b3479b32922098abc532825d8`,
    },
  ],
};

module.exports.registerCmpApis = {
  "/api/register_campaign": {
    post: {
      tags: [`Register Campaign`],
      description: "Edit a Register Campaign with the specified ID.",
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                excel_file: {
                  type: "file",
                  format: "binary",
                  description: "This is excel for register campaign",
                },
                brand_id: {
                  type: "string",
                  format: "integer",
                  description: "Provide Brand model identification id",
                },
                exeCmpId: {
                  type: "integer",
                  format: "integer",
                  description: "Provide exeCampaignModel identification id",
                },
                brnad_dt: {
                  type: "Date",
                  format: "Date",
                  description: "Provide Date",
                },
                detailing: {
                  type: "string",
                  format: "string",
                  description: "Provide detailing",
                },
                commitment: {
                  type: "string",
                  format: "string",
                  description: "Provide Array of object",
                },
                status: {
                  type: "integer",
                  format: "integer",
                  description: "Provide status",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Register Campaign Created successfully.",
          content: {
            "application/json": {
              example: {
                success: true,
                data: {
                  // Define the structure of the response data here
                },
              },
            },
          },
        },
        200: {
          description: "No Record Found",
          content: {
            "application/json": {
              example: {
                success: false,
                message: "No record found.",
              },
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              example: {
                error: "Internal server error",
                message: "Error updating Register Campaign details.",
              },
            },
          },
        },
      },
    },
    put: {
      tags: [`Register Campaign`],
      description:
        "Note: Please do not any empty field if you really want to update a field please fill field otherewise 'Deselelct' the check.",
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                excel_file: {
                  type: "file",
                  format: "binary",
                  description:
                    "This is excel for register campaign, if you not want to update please 'Deselelct' the check.",
                },
                brand_id: {
                  type: "string",
                  format: "integer",
                  description:
                    "Provide Brand model identification id, if you not want to update please 'Deselelct' the check.",
                },
                register_campaign_id: {
                  type: "string",
                  format: "integer",
                  description:
                    "Provide register campaign model id which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                exeCmpId: {
                  type: "integer",
                  format: "integer",
                  description:
                    "Provide exeCampaignModel identification id, if you not want to update please 'Deselelct' the check.",
                },
                brnad_dt: {
                  type: "Date",
                  format: "Date",
                  description:
                    "Provide Date, if you not want to update please 'Deselelct' the check.",
                },
                detailing: {
                  type: "string",
                  format: "string",
                  description:
                    "Provide detailing, if you not want to update please 'Deselelct' the check.",
                },
                commitment: {
                  type: "string",
                  format: "string",
                  description:
                    "Provide Array of object, if you not want to update please 'Deselelct' the check.",
                },
                status: {
                  type: "integer",
                  format: "integer",
                  description:
                    "Provide status, if you not want to update please 'Deselelct' the check.",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Register Campaign updated successfully.",
          content: {
            "application/json": {
              example: {
                success: true,
                data: {
                  // Define the structure of the response data here
                },
              },
            },
          },
        },
        200: {
          description: "No Record Found",
          content: {
            "application/json": {
              example: {
                success: false,
                message: "No record found.",
              },
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              example: {
                error: "Internal server error",
                message: "Error updating Register Campaign details.",
              },
            },
          },
        },
      },
    },
    get: {
      tags: [`Register Campaign`],
      description: "Get All Register Campaigns data",
      responses: {
        200: {
          description: "Ok",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: allRegisterCmpData,
              },
            },
          },
        },
        200: {
          //A 200 status code is used when the server successfully processes the request, but there is no content to return to the client.
          description: "No Records Found",
        },
        500: {
          description: "Error getting all Campaigns",
        },
      },
    },
  },
  "/api/register_campaign/{id}": {
    delete: {
      tags: [`Register Campaign`],
      description: "Delete Register Campaign",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of register campaign to delete",
          required: true,
          schema: {
            type: "integer",
            format: "int64",
          },
        },
      ],
      responses: {
        200: {
          description: "Register campaign with ID 1 deleted successfully",
        },
        200: {
          description: "Register campaign with ID 2 not found",
        },
        500: {
          description: "Error message",
        },
      },
    },
  },
};
