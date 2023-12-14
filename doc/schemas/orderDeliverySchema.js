const orderDeliverySchema = {
  type: "object",
  description: "Schema for OrderDeliveryModel.",
  properties: {
    Order_delivery_id: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Unique identifier for the OrderDeliveryModel.",
    },
    Product_name: {
      type: "string",
      format: "string",
      example: "oProdectName",
      description: "Product_name for the document.",
    },
    Order_quantity: {
      type: "integer",
      format: "int",
      example: 1,
      description: "Order_quantity for the document.",
    },
    Special_request: {
      type: "string",
      format: "string",
      example: "OrderSpecial request",
      description: "Special_request for the document.",
    },
    Sitting_name: {
      type: "string",
      format: "string",
      example: "OSitting Name",
      description: "Sitting_name for the document.",
    },
    Sitting_area: {
      type: "string",
      format: "string",
      example: "OSitiitngArea",
      description: "soft_name for the document.",
    },
    Message: {
      type: "string",
      format: "string",
      example: "Message",
      description: "Message for the document.",
    },
    Order_req_id: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "Order_req_id which is linking order req model data to this document.",
    },
    Status: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "Number value which is manage staus for this document.",
    },
    Request_delivered_by: {
      type: "integer",
      format: "int",
      example: 1,
      description:
        "User id which is linking User data to this document.",
    },

    Request_datetime: {
      type: "date",
      format: "date",
      example: "2023-11-03T07:08:51.702+00:00",
      description: "Request_datetime date for the document.",
    },
    Delivered_datetime: {
      type: "date",
      format: "date",
      example: "2023-11-03T07:08:51.702+00:00",
      description: "Delivered_datetime date for the document.",
    },
  },
};
module.exports = orderDeliverySchema;
