exports.instaApis = {
  "/api/get_analytics": {
    get: {
      tags: [`Insta Api's`],
      description:
        "Get Analytics for insta post Based on some condition where posttype decision is greater than 1 and interpretor decision is equal to 1.",
      responses: {
        "Positive 200": {
          description: "Fetching operation success.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  campaignId: {
                    max_id: 354,
                    max_count: 12,
                    min_id: 54,
                    min_count: 1,
                  },
                  brandId: {
                    max_id: 123,
                    max_count: 16,
                    min_id: 12,
                    min_count: 1,
                  },
                },
              },
            },
          },
        },
        200: {
          description:
            "There is data not full fill condition and also there is chance that data not available in db.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  status: 200,
                  message: "No record found.",
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
                  message: "Error getting analytics.",
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/get_dynamic_key_value": {
    post: {
      tags: [`Insta Api's`],
      description:
        "Get data based on provided key value for insta post and flag  2 for all data fetch and flag 1 for count. Note: Please fetch max data like 200 documents otherwise documentation freez",
      parameters: [
        {
          in: "query",
          name: "page",
          schema: {
            type: "integer",
          },
          description: "Page number for pagination",
        },
        {
          in: "query",
          name: "perPage",
          schema: {
            type: "integer",
          },
          description: "Per page data for pagination",
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                request_key: {
                  type: "string",
                },
                request_value: {
                  type: "integer",
                },
                flag: {
                  type: "integer",
                },
              },
            },
            example: {
              request_key: "posttype_decision",
              request_value: 1,
              flag: 1,
            },
          },
        },
        required: true,
      },
      responses: {
        "Flag1 200": {
          description: "Fetching operation success For flag 1.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  count: 69257,
                },
              },
            },
          },
        },
        "Flag2 200": {
          description: "Fetching operation success For flag 2.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: [
                  {
                    selector_date: null,
                    interpretor_date: null,
                    auditor_date: null,
                    _id: "65235fe53b2912a12bacd0f3",
                    postType: "REEL",
                    creatorName: "justengineerslife",
                    allComments: 0,
                    brand_id: 0,
                    pastComment: 0,
                    allLike: 2,
                    campaign_id: 0,
                    pastLike: 0,
                    allView: 156,
                    agency_id: 0,
                    pastView: 0,
                    title: "Ache log❤️",
                    postedOn: "2023-10-09 01:36:08",
                    postUrl: "https://www.instagram.com/p/CyKOrxDJFTF/",
                    postImage:
                      "https://s3.ap-south-1.amazonaws.com/nudges//tmp/CyKOrxDJFTF.jpg",
                    shortCode: "CyKOrxDJFTF",
                    posttype_decision: 1,
                    selector_name: 228,
                    interpretor_name: 0,
                    auditor_name: 0,
                    auditor_decision: 0,
                    interpretor_decision: 0,
                    selector_decision: 2,
                    dateCol: "2023-10-09T02:05:25.113Z",
                    __v: 0,
                    hashTag: "",
                    mentions: "",
                  },
                ],
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
                  status: 500,
                  error: "error.message",
                  sms: "error getting posts from name",
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/get_dynamic_key_value_instas": {
    post: {
      tags: [`Insta Api's`],
      description:
        "Get data based on provided key value for insta Story and flag  2 for all data fetch and flag 1 for count. Note: Please fetch max data like 200 documents otherwise documentation freez",
      parameters: [
        {
          in: "query",
          name: "page",
          schema: {
            type: "integer",
          },
          description: "Page number for pagination",
        },
        {
          in: "query",
          name: "perPage",
          schema: {
            type: "integer",
          },
          description: "Per page data for pagination",
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                request_key: {
                  type: "string",
                },
                request_value: {
                  type: "integer",
                },
                flag: {
                  type: "integer",
                },
              },
            },
            example: {
              request_key: "posttype_decision",
              request_value: 1,
              flag: 1,
            },
          },
        },
        required: true,
      },
      responses: {
        "Flag1 200": {
          description: "Fetching operation success For flag 1.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  count: 14390,
                },
              },
            },
          },
        },
        "Flag2 200": {
          description: "Fetching operation success For flag 2.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: [
                  {
                    music: [],
                    interpretor_date: null,
                    auditor_date: null,
                    _id: "654369f15456df140db841cf",
                    mediaCont: 7,
                    expiredAt: "2023-11-02T17:55:45.000Z",
                    savedOn: "2023-11-01T10:19:19.000Z",
                    shortcode: "CzGY3-7t2lm",
                    creatorName: "ghantaa",
                    links: [],
                    hashtags: [],
                    mentions: [
                      {
                        pk: 1966440268,
                        pk_id: "1966440268",
                        full_name: "Shaadi.com",
                        is_private: false,
                        strong_id__: "1966440268",
                        username: "shaadi.com",
                        is_verified: true,
                        profile_pic_id: "3064710661635761730_1966440268",
                        profile_pic_url:
                          "https://instagram.fbkk8-4.fna.fbcdn.net/v/t51.2885-19/337317537_1166144007398934_6515970380635919092_n.jpg?stp=dst-jpg_e0_s150x150&_nc_ht=instagram.fbkk8-4.fna.fbcdn.net&_nc_cat=1&_nc_ohc=fMHCIC6GmRMAX-Etwsq&edm=ALCvFkgBAAAA&ccb=7-5&oh=00_AfCgaG_SUA4kP2eupx00Z5AyBG8TtYkmpoSK8acx2ivcwg&oe=6547B6C1&_nc_sid=6d62aa",
                      },
                      {
                        pk: 187369428,
                        pk_id: "187369428",
                        full_name: "Anupam Mittal",
                        is_private: false,
                        strong_id__: "187369428",
                        username: "anupammittal.me",
                        is_verified: true,
                        profile_pic_id: "3026324624658546452_187369428",
                        profile_pic_url:
                          "https://instagram.fbkk8-4.fna.fbcdn.net/v/t51.2885-19/327470419_736634638096076_6367581679495680296_n.jpg?stp=dst-jpg_e0_s150x150&_nc_ht=instagram.fbkk8-4.fna.fbcdn.net&_nc_cat=1&_nc_ohc=l80nfggk6XkAX-j4VG3&edm=ALCvFkgBAAAA&ccb=7-5&oh=00_AfA1_-qcpoFTPkPHJfeF-d60s3bqYbWnTwx8LZ6FVfxNmg&oe=65484438&_nc_sid=6d62aa",
                      },
                    ],
                    locations: [],
                    posttype_decision: 1,
                    selector_name: 181,
                    interpretor_name: 0,
                    auditor_name: 0,
                    auditor_decision: 0,
                    interpretor_decision: 0,
                    selector_decision: 1,
                    __v: 0,
                    selector_date: "2023-11-04T12:20:03.690Z",
                    image_url:
                      "https://s3.ap-south-1.amazonaws.com/nudges//tmp/CzGY3-7t2lm.jpg",
                    brand_id: 0,
                    campaign_id: 0,
                  },
                ],
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
                  status: 500,
                  error: "error.message",
                  sms: "error getting stories from name",
                },
              },
            },
          },
        },
      },
    },
  },
};
