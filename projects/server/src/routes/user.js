const routerUser = require("express").Router()
const userController = require("../controller/user")

routerUser.post("/auth/register-employee", userController.employeeRegistration)

module.exports = routerUser