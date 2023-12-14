const hashTagSchema = {
  type: "object",
  description: "This Schema is hash tag's.",
  //   required: ["dept_id"], // assuming these fields are required
  properties: {
    hash_tag_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the Hash tag.",
    },
    campaign_id: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "campaign_id which is used for linking Campaign data to the document.",
    },
    hash_tag: {
      type: "string",
      format: "string",
      example: "cornythecrazycricketfan",
      description: "hash_tag for the document.",
    },
    tag: {
      type: "string",
      format: "string",
      example: "tag",
      description: "Tag for the document.",
    },
  },
};
module.exports = hashTagSchema;
