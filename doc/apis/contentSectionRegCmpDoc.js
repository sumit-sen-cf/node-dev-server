const constant = require("../../common/constant");

exports.contentSectionRegApis = {
  "/api/contentSectionReg": {
    post: {
      tags: [`Content Section for Register Campaign`],
      description: "Add a Content section register campaign.",
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                content_sec_file: {
                  type: "file",
                  format: "binary",
                  description:
                    "This is file for content section register campaign moduile.",
                },
                cmpAdminDemoFile: {
                  type: "file",
                  format: "binary",
                  description:
                    "This is file for content section register campaign moduile.",
                },
                content_brief: {
                  type: "string",
                  format: "string",
                  description:
                    "Provide content_brief for the content register section module.",
                  example: "test content_brief",
                },
                campaign_brief: {
                  type: "string",
                  format: "string",
                  description:
                    "Provide campaign_brief for the content section register campaign module.",
                  example: "test campaign_brief",
                },
                register_campaign_id: {
                  type: "integer",
                  format: "integer",
                  description:
                    "Provide register_campaign_id which is used for linking register campaign module data to this document.",
                  example: 1,
                },
                content_type_id: {
                  type: "integer",
                  format: "integer",
                  description:
                    "Provide content_type_id which is used for link content type data to this document.",
                  example: 1,
                },
                assign_to: {
                  type: "integer",
                  format: "integer",
                  description:
                    "Provide assign_to ( User id ) which is used for link user data to this document and found which user to assign this document.",
                  example: 1,
                },
                status: {
                  type: "integer",
                  format: "integer",
                  description: "Provide status.",
                  example: 1,
                },
                stage: {
                  type: "integer",
                  format: "integer",
                  description: "Provide stage.",
                  example: 1,
                },
                est_static_vedio: {
                  type: "integer",
                  format: "integer",
                  description: "Provide est_static_vedio.",
                  example: 12,
                },
                campaign_dt: {
                  type: "string",
                  format: "string",
                  description: "Provide campaign_dt",
                  example: "2023-10-15T18:35:00.000Z",
                },
                creator_dt: {
                  type: "string",
                  format: "string",
                  description: "Provide creator_dt.",
                  example: "2023-10-15T18:35:00.000Z",
                },
                admin_remark: {
                  type: "string",
                  format: "string",
                  description: "Provide admin_remark.",
                  example: "test admin remark",
                },
                creator_remark: {
                  type: "string",
                  format: "string",
                  description: "Provide creator_remark.",
                  example: "test creator remark",
                },
                cmpAdminDemoLink: {
                  type: "string",
                  format: "string",
                  description: "Provide cmpAdminDemoLink.",
                  example: "test link",
                },
                endDate: {
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
          description:
            "Content Section for register module data created success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  data: {
                    register_campaign_id: 1,
                    content_type_id: 1,
                    content_brief: "test content_brief",
                    campaign_brief: "test campaign_brief",
                    campaign_dt: "2023-10-15T18:35:00.000Z",
                    creator_dt: "2023-10-15T18:35:00.000Z",
                    admin_remark: "test admin remark",
                    creator_remark: "test creator remark",
                    est_static_vedio: 12,
                    status: 1,
                    stage: 1,
                    assign_to: 1,
                    cmpAdminDemoLink: "test link",
                    cmpAdminDemoFile: "e7abc8cd4c0b8e16e95d5f8aea19e534",
                    endDate: "2012-12-11T18:30:00.000Z",
                    _id: "6553576bb47952f3c03afaac",
                    content_section_id: 2,
                    __v: 0,
                  },
                  status: 200,
                },
              },
            },
          },
        },
        500: {
          description: "Error adding Content section Register to database",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  error: "err.message",
                  message: "This ContentSectionReg cannot be created",
                },
              },
            },
          },
        },
      },
    },
    put: {
      tags: [`Content Section for Register Campaign`],
      description:
        "Edit a Content Section register campaign with the specified ID.",
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                content_section_id: {
                  type: "integer",
                  format: "integer",
                  description:
                    "content_section_id which is unique id used for update this document.",
                },
                content_sec_file: {
                  type: "file",
                  format: "binary",
                  description:
                    "This is file for content section register campaign moduile which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                cmpAdminDemoFile: {
                  type: "file",
                  format: "binary",
                  description:
                    "This is file for content section register campaign moduile which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                content_brief: {
                  type: "string",
                  format: "string",
                  description:
                    "Provide content_brief for the content register section module which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                campaign_brief: {
                  type: "string",
                  format: "string",
                  description:
                    "Provide campaign_brief for the content section register campaign module which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                register_campaign_id: {
                  type: "integer",
                  format: "integer",
                  description:
                    "Provide register_campaign_id which is used for linking register campaign module data to this document which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                content_type_id: {
                  type: "integer",
                  format: "integer",
                  description:
                    "Provide content_type_id which is used for link content type data to this document which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                assign_to: {
                  type: "integer",
                  format: "integer",
                  description:
                    "Provide assign_to ( User id ) which is used for link user data to this document and found which user to assign this document which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                status: {
                  type: "integer",
                  format: "integer",
                  description:
                    "Provide status which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                stage: {
                  type: "integer",
                  format: "integer",
                  description:
                    "Provide stage which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                est_static_vedio: {
                  type: "integer",
                  format: "integer",
                  description:
                    "Provide est_static_vedio which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                campaign_dt: {
                  type: "string",
                  format: "string",
                  description:
                    "Provide campaign_dt which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                creator_dt: {
                  type: "string",
                  format: "string",
                  description:
                    "Provide creator_dt which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                admin_remark: {
                  type: "string",
                  format: "string",
                  description:
                    "Provide admin_remark which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                creator_remark: {
                  type: "string",
                  format: "string",
                  description:
                    "Provide creator_remark which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                cmpAdminDemoLink: {
                  type: "string",
                  format: "string",
                  description:
                    "Provide cmpAdminDemoLink which is you want to update and, if you not want to update please 'Deselelct' the check.",
                },
                endDate: {
                  type: "string",
                  format: "date",
                  description:
                    "Provide Date which is you want to update and, if you not want to update please 'Deselelct' the check.",
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
                    _id: "6553573cb47952f3c03afaa9",
                    register_campaign_id: 12,
                    content_type_id: 1,
                    content_brief: "update2",
                    campaign_brief: "update",
                    campaign_dt: "2023-10-15T18:35:00.000Z",
                    creator_dt: "2023-10-15T18:35:00.000Z",
                    admin_remark: "test admin remark",
                    creator_remark: "test creator remark",
                    est_static_vedio: 12,
                    status: 1,
                    stage: 1,
                    assign_to: 1,
                    cmpAdminDemoLink: "test link",
                    cmpAdminDemoFile: "",
                    endDate: "2012-12-11T18:30:00.000Z",
                    content_section_id: 1,
                    __v: 0,
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Error updating Content register campaign to database",
        },
      },
    },
    get: {
      tags: [`Content Section for Register Campaign`],
      description: "Get all Content Section register campaign.",
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
                      _id: "652d2143cbfa4dea710f7872",
                      register_campaign_id: 144,
                      content_type_id: 42,
                      content_brief: "sgd",
                      campaign_brief: "this is banana chips ",
                      est_static_vedio: 5,
                      status: 23,
                      stage: 4,
                      cmpAdminDemoLink: "",
                      cmpAdminDemoFile: "e1deb84963f70eafbc8050fcf093a429",
                      content_section_id: 360,
                      admin_remark: "please do it right now",
                      assign_to: 246,
                      creator_dt: "Thu, 19 Oct 2023 11:55:00 GMT",
                      creator_remark: "",
                      files: [],
                      brand_id: 2912,
                      brnad_dt: "2023-10-18T22:50:00.000Z",
                      excel_path: "bc8099f8175bbb5edb89ed9264a54d85",
                      commitment: [
                        {
                          selectValue: 70,
                          textValue: "5",
                        },
                        {
                          selectValue: 61,
                          textValue: "5",
                        },
                      ],
                      detailing: "best banana chips",
                      exeCmpId: 44,
                      download_excel_file: `${constant.base_url}/uploads/bc8099f8175bbb5edb89ed9264a54d85`,
                      download_content_sec_file: "",
                      downloadCmpAdminDemoFile: `${constant.base_url}/uploads/e1deb84963f70eafbc8050fcf093a429`,
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
                  message:
                    "Error getting all Content section register campaign",
                },
              },
            },
          },
        },
      },
    },
  },
};
