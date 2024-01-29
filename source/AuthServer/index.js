const express = require("express");
const { engine } =  require("express-handlebars")
const bodyParser = require("body-parser")
const path = require("path")
var https = require('https');
var fs = require('fs');
const cors = require("cors")

const route = require("./Routes/route.js")

require("dotenv").config({path : "../.env"});

const app = express();

app.use(cors());

const PORT = process.env.PORT_AUTH_SERVER || 3003;
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());   
app.use(express.static("public"));

const options = { 
      key: fs.readFileSync("server.key"), 
      cert: fs.readFileSync("server.cert"), 
    }; 

route(app);

// Create an HTTPS service identical to the HTTP service.
https.createServer(options,app).listen(PORT, () => {
      console.log("Auth server is listening on port => ", PORT);
})
