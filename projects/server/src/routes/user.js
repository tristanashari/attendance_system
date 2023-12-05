const routerUser = require("express").Router()
const userController = require("../controller/user")

routerUser.get("/employees", userController.getAllUsers)

module.exports = routerUser