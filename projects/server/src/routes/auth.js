const routerAuth = require("express").Router()
const authController = require("../controller/auth")
const authMiddleware = require("../middleware/auth")
const authValidator = require("../validation/auth")

routerAuth.post("/auth/employee-registration", authMiddleware.verifyToken, authMiddleware.verifyAdmin, authValidator.validateRegisterEmployee, authController.addNewEmployee)
routerAuth.post("/auth/set-password", authValidator.validateSetPassword, authController.setPassword)
routerAuth.post("/auth/login", authValidator.validateLogin, authController.login)
routerAuth.get("/auth/keep-login", authMiddleware.verifyToken, authController.keepLogin)

module.exports = routerAuth