const campaginCategorySchema = {
  type: "object",
  description: "Write description",
  required: ["campaign_id"],
  properties: {
    campaignCategory_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the campaign category.",
    },
    campaign_id: {
      type: "integer",
      format: "int",
      example: 12,
      description:
        "Camapaign id which is used for linking Camapaign data to the document.",
    },
    campaignCategory_name: {
      type: "string",
      format: "string",
      example: "test category",
      description: "Name for the campaign category.",
    },
    created_by: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "User id which is used for identify who is create the document.",
    },
    created_date: {
      type: "date",
      format: "date",
      example: "2023-11-07T07:43:02.837+00:00",
      description:
        "Creation date which is used for identify the docment at what time created exactly.",
    },
  },
};
module.exports = campaginCategorySchema;
