const serverless = require("serverless-http");
const app = require("./src/app"); // adjust path if needed

module.exports.handler = serverless(app);