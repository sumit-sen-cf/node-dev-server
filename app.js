const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes.js");
const vari = require("./variables.js");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocumantion = require("./doc/swaggerDoc.js");
const OpenAI = require("openai");
const { swaggerConfig } = require("./doc/swaggerConfig.js");
const errorController=require('./controllers/errorController.js')
const swaggerAccessManagement=require('./doc/customization_src/controller/swaggerAccessManagement.js');
const { checkDevAuthentication } = require("./doc/customization_src/middleware/swaggerMiddleware.js");
const path = require("path");
// const axios = require("axios");
require("./controllers/autoMail.js");
require("./controllers/assetAutoMail.js");
// const morgan = require("morgan");
// const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
// Logging the requests
// app.use(morgan("dev"));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'doc/customization_src/doc_templates/pages'));
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({limit: '50mb'}));

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 50000,
  }),
);
app.use(cors());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/api", routes);


/**
 * Sets up the backend and frontend routes for the documentation.
 * Also sets up the API documentation route with authentication.
 * @param {Object} app - The Express app object.
 * @param {Object} docBackendRouter - The router for backend routes.
 * @param {Object} docFrontendRouter - The router for frontend routes.
 * @param {string} token - The authentication token for the API documentation route.
 * @param {Function} checkDevAuthentication - The middleware function for checking developer authentication.
 * @param {Object} swaggerUi - The Swagger UI object.
 * @param {Object} swaggerDocumantion - The Swagger documentation object.
 * @param {Object} swaggerConfig - The configuration object for Swagger
 */
const docBackendRouter = require("./doc/customization_src/routes/backend_routes.js");
const docFrontendRouter = require("./doc/customization_src/routes/frontend_routes.js");
app.use("/", docBackendRouter);
app.use("/", docFrontendRouter);
app.use(
  "/api-docs/:token",
  checkDevAuthentication,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocumantion, swaggerConfig)
);

const openai = new OpenAI({
  apiKey: "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",
});

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  const completion = await openai.completions.create({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 4000,
  });
  res.status(200).send(completion.choices[0].text);
});

app.use(errorController)
// mongoose.set('debug', true);
mongoose
  .connect(vari.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "instaDB",
  })
  .then(() => {
    console.log(`DB connected : ${vari.MONGODB}`);
  })
  .catch((err) => {
    console.log(err);
  });

// Proxy Logic: Proxy endpoints

// Proxy Middleware
// const proxyMiddleware = createProxyMiddleware({
//   target: "http://34.93.221.166:3000",
//   // target: "https://www.instagram.com",
//   changeOrigin: true,
//   pathRewrite: {
//     "^/api": "http://34.93.221.166:3000/api/",
//   },
// });

// app.use("/api", proxyMiddleware);

// // Function to get Instagram user info using the proxy
// const getInstagramUserInfo = async () => {
//   try {
//     const usernames = ["rvcjinsta"];
//     const tokens = [
//       "Bf_s3sK7uCtH9-A1aWzwaQ",
//       "CuLminz3Dqs6l2dyWF1fTyzLJOjIcUv5",
//       "Au3ck3iVv5jCQCPDeGZP62",
//       "dgAYsDaT6_iXs9q6POPyaX",
//       "-DX7HWx5kfklxDIW0SWklw",
//     ];

//     for (let j = 0; j < tokens.length; j++) {
//       for (let i = 1; i <= 250; i++) {
//         const response = await axios.get(
//           // `/api/get_all_users`,
//           `http://localhost:${vari.PORT}/api/get_all_users`,
//           {
//             headers: {
//               "X-Csrftoken": tokens[j],
//               "X-Ig-App-Id": "936619743392459",
//             },
//           }
//         );

//         if (response.status !== 200) {
//           console.log(
//             usernames[i],
//             response.data.data?.user?.edge_owner_to_timeline_media
//           );
//         } else {
//           console.log(
//             i,
//             "i",
//             "token -->",
//             tokens[j],
//             response.data.data[0].user_name
//           );
//           // console.log(
//           //   i,
//           //   "i",
//           //   "token -->",
//           //   tokens[j],
//           //   response.data.data?.user?.edge_owner_to_timeline_media?.edges?.length
//           // );
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error accessing Instagram API:", error.message);
//   }
// };
// const proxyMiddleware = createProxyMiddleware({
//   target: "http://localhost:3000",
//   // target: "https://www.instagram.com",
//   changeOrigin: true,
//   pathRewrite: {
//     "^/api": "",
//   },
// });

// app.use("/checkdata", proxyMiddleware);

// // Function to get Instagram user info using the proxy
// const getInstagramUserInfo = async () => {
//   try {
   
//     const usernames = ["rvcjinsta"];
//     const tokens = [
//       "Bf_s3sK7uCtH9-A1aWzwaQ",
//       "CuLminz3Dqs6l2dyWF1fTyzLJOjIcUv5",
//       "Au3ck3iVv5jCQCPDeGZP62",
//       "dgAYsDaT6_iXs9q6POPyaX",
//       "-DX7HWx5kfklxDIW0SWklw",
//     ];

//     for (let j = 0; j < tokens.length; j++) {
//       for (let i = 1; i <= 250; i++) {
//         const response = await axios.get(
//           `/api/get_all_users`,
//           // `http://localhost:${vari.PORT}/api/v1/users/web_profile_info/?username=${'rvcjinsta'}`,
//           // `https://www.instagram.com/api/v1/users/web_profile_info/?username=${'rvcjinsta'}`,
//           // {
//           //   headers: {
//           //     "X-Csrftoken": tokens[j],
//           //     "X-Ig-App-Id": "936619743392459",
//           //   },
//           // }
//         );

//         if (response.status !== 200) {
//           console.log(
//             usernames[i],
//             response.data.data?.user?.edge_owner_to_timeline_media
//           );
//         } else {
//           console.log(
//             i,
//             "i",
//             "token -->",
//             tokens[j],
//             response.data.data?.user?.edge_owner_to_timeline_media?.edges?.length
//           );
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error accessing Instagram API:", error.message);
//   }
// };

//   // getInstagramUserInfo();

// //Testing api
// app.get("/checkdata",getInstagramUserInfo)
app.listen(vari.PORT, () => {
  console.log("server is running at " + vari.API_URL);
  
});
