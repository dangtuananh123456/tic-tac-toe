

const UserController = require("../Controllers/UserController.js")
const Auth = require("../authentication/auth.js")


const route = (app) => {   
      
      app.post("/update-user", Auth, UserController.handleUpdateUser)

      app.post("/login", UserController.handleLogin)

      app.post("/register", UserController.handleRegister);
}


module.exports = route;