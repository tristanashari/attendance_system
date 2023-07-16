const routerSalary = require("express").Router()
const salaryController = require("../controller/salary")
const authMiddleware = require("../middleware/auth")

routerSalary.get("/salary", authMiddleware.verifyToken, salaryController.getSalary)

module.exports = routerSalary