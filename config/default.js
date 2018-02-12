require("dotenv").config();
const path = require("path");

const BASE_PATH = path.join(__dirname + "./../");
const PORT = process.env.PORT || 3000;
const BASE_URL = (process.env.APP_URL || "http://localhost")+":"+PORT;
const APP_NAME = process.env.APP_NAME || "Node Startup";

module.exports = {
  port: PORT,
  base_path: BASE_PATH,
  base_url: BASE_URL,
  app_name:APP_NAME,
  db: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_CONNECTION,
    port: process.env.DB_PORT
  }
};
