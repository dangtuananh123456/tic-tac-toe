const express = require("express");
const { engine } =  require("express-handlebars")
const bodyParser = require("body-parser")
const path = require("path")
const route = require("./routes/route.js")
const cookieParser = require("cookie-parser")

const SocketHandler = require("./Socket/SocketHandler.js")

const app = express();
require("dotenv").config({path : '../.env'});
const server = require("http").createServer(app);
const io = require("socket.io")(server);



app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());   
app.use(cookieParser());
app.use(express.static("public"));

const PORT = process.env.PORT_SHOP_SERVER || 21408;

route(app);
SocketHandler(io);

server.listen(PORT, () => {
      console.log("Game Server is listening on Port -> ", PORT);
})