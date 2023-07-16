const routerAttendance = require("express").Router()
const attendanceController = require("../controller/attendance")
const authMiddleware = require("../middleware/auth")

routerAttendance.post("/attendance-clockin", authMiddleware.verifyToken, attendanceController.clockIn)
routerAttendance.post("/attendance-clockout", authMiddleware.verifyToken, attendanceController.clockOut)

module.exports = routerAttendance