const folders = require("./components/tag");
const mainSchema = require("./components/mainSchema");
const apis = require("./components/allApiCollection");
const mainServers = require("./components/mainServers");

/**
 * Represents the Swagger documentation object.
 * @type {Object}
 * @property {string} openapi - The version of the OpenAPI specification used.
 * @property {Object} info - Information about the API.
 * @property {string} info.version - The version of the API.
 * @property {Object} info.contact - Contact information for the API.
 * @property {string} info.contact.email - The email address of the API contact.
 * @property {Array} servers - An array of server objects.
 * @property {Array} tags - An array of tag objects.
 * @property {Object} paths - The paths of the API.
 * @property {Object} components - The components of the API.
 *
 */
const swaggerDocumantion = {
  openapi: "3.0.0",
  info: {
    // title: "Jarvis Mongo API Hub",
    version: "1.0.0",
    // description:
    //   "Welcome to the Jarvis API! Your central spot for managing and retrieving data efficiently.",
    contact: {
      email: "apiteam@yourdomain.com",
    },
  },
  servers: [...mainServers],
  tags: [...folders], // Create tags for seprate api's folder wise
  paths: apis,
  components: {
    schemas: mainSchema,
  },
};

module.exports = swaggerDocumantion;
