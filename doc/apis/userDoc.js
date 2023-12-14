exports.userApis = {
  "/api/forgot_pass": {
    post: {
      tags: [`User`],
      description:
        "Forgot password api , with the help of this api you can get your password on your email.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                user_email_id: {
                  type: "string",
                },
              },
            },
            example: {
              user_email_id: "sourabh@creativefuel.io",
            },
          },
        },
        required: true,
      },
      responses: {
        "Positive 200": {
          description: "Successfully Sent email.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  message: "Successfully Sent email.",
                },
              },
            },
          },
        },
        200: {
          description: "Error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                    message: "User not found with this email id.",
                },
              },
            },
          },
        },
        500: {
          description: "Error Sending Mail",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  error: " err.message.",
                  message: "Error Sending Mail.",
                },
              },
            },
          },
        },
      },
    },
  },
};
