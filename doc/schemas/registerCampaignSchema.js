const registerCampaignSchema = {
  type: "object",
  description: "Write description",
  required: ["brand_id", "exeCmpId"],
  properties: {
    register_campaign_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the register campaign.",
    },
    brand_id: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "Brand id which is used for linking Brand data to the document.",
    },
    exeCmpId: {
      type: "integer",
      format: "int",
      example: 13,
      description:
        "exeCmpId which is used for linking ContentSectionRegModel data to the document.",
    },
    stage: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Number for managment the stage.",
    },
    brnad_dt: {
      type: "date",
      format: "date",
      example: "2023-10-18T22:50:00.000+00:00",
      description: "brand date for the document.",
    },
    status: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Number for the status management in document.",
    },
    excel_path: {
      type: "string",
      example: "Excel file path",
      description: "Excel file path which is come from multer auto generated.",
    },
    detailing: {
      type: "string",
      example: "detailing text",
      description: "Detailing for the document.",
    },
    commitment: {
      type: "array",
      format: "array of object",
      description: "Add commitment(textValue) with their values.",
      example: [
        {
          selectValue: 70,
          textValue: "5",
        },
        {
          selectValue: 61,
          textValue: "5",
        },
      ],
    },
  },
};
// export default brandSchema
module.exports = registerCampaignSchema;
