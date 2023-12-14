const campaignSchema = {
  type: "object",
  description: "Write description",
  required: ["agency_id"],
  properties: {
    campaign_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the campaign",
    },
    brand_id: {
      type: "integer",
      format: "int",
      example: 13,
      description: "Brand id which is used for link brand data.",
    },
    campaign_name: {
      type: "string",
      example: "Campaign name",
      description: "Campaign name for the campaign data.",
    },
    hash_tag: {
      type: "string",
      example: "Hash tag's",
      description: "Hash tags for the campaign data.",
    },
    user_id: {
      type: "integer",
      format: "int",
      example: 134,
      description:
        "User id which is used for connnecting the user details for perticualar campaign data.",
    },
    agency_id: {
      type: "integer",
      format: "int",
      example: 15,
      description:
        "Agency id whcih is used for linking agency data to the campaign data.",
    },

    updated_by: {
      type: "integer",
      format: "int",
      example: 123,
      description:
        "User id which is used for identify who is update the document.",
    },
    created_date: {
      type: "date",
      format: "date",
      example: "2023-11-07T07:43:02.837+00:00",
      description:
        "Creation date which is used for identify the docment at what time created exactly.",
    },
    updated_date: {
      type: "date",
      format: "date",
      example: "2023-11-07T07:43:02.837+00:00",
      description:
        "Updation date which is used for identify the docment at what time updated exactly.",
    },
  },
};
module.exports = campaignSchema;
