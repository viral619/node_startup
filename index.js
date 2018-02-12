const config = require("config");
const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const routes = require('./routes');

const PORT = config.get('port');
const app = express();

// Cors Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// SET View Engine and View folder Path 
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.json());
app.use(express.urlencoded());
app.use(expressValidator());
app.use(express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/public'));

// API & Web Routes
app.use("/api/v1/merchant", routes.merchant);
app.use("/api/v1/user", routes.user);
app.use("/api/v1", routes.route);
app.use("", routes.web);

// Retorn 404 Response in Json for APIs
app.use("/api/*", (req, res) => {
  res.status(404).json({message: "Page not Found."});
});

// 404 Page for Web 
app.use("*", (req, res) => {
  let data = {
    SITE_NAME: config.get('app_name'),
    BASE_URL: config.get('base_url')
  };
  return res.render("shared/404.html",data);
});

app.listen(PORT, () => {
  console.log(`Server Started @ http://localhost:${PORT}`);
});