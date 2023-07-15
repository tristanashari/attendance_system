const routerUser = require("express").Router()
const userController = require("../controller/user")

routerUser.post("/auth/employee-registration", userController.employeeRegistration)
routerUser.post("/auth/set-password", userController.setPassword)
routerUser.post("/auth/login", userController.login)

module.exports = routerUser