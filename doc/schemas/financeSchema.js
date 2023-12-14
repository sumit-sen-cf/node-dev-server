const financeSchema = {
  type: "object",
  description: "Write description",
  //   required: ["dept_id"], // assuming these fields are required
  properties: {
    id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the Finance.",
    },
    status_: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Number value which handle status for finance.",
    },
    attendence_id: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "Used for linking data from attendence to finance based on attendence_id.",
    },
    reason: {
      type: "string",
      format: "string",
      example: "campaign name",
      description: "Reason data for this finance document.",
    },
    remark: {
      type: "string",
      format: "string",
      example: "test Remarks",
      description: "Remarks for the finance.",
    },
    screenshot: {
      type: "string",
      format: "string",
      example: "test screenshot",
      description: "Screenshot for the finance.",
    },
    reference_no: {
      type: "integer",
      format: "int",
      example: 123,
      description:
        "User id which is used for identify who is update the document.",
    },
    date: {
      type: "date",
      format: "date",
      example: "2023-11-07T07:43:02.837+00:00",
      description: "Date from front end side for finance.",
    },
    pay_date: {
      type: "date",
      format: "date",
      example: "2023-11-07T07:43:02.837+00:00",
      description:
        "Updation date which is used for identify the docment at what time updated exactly.",
    },
  },
};
module.exports = financeSchema;
