const routerAttendance = require("express").Router()
const attendanceController = require("../controller/attendance")
const authMiddleware = require("../middleware/auth")

routerAttendance.post("/attendance-clockin", authMiddleware.verifyToken, attendanceController.clockIn)
routerAttendance.post("/attendance-clockout", authMiddleware.verifyToken, attendanceController.clockOut)
routerAttendance.get("/employees-attendances", authMiddleware.verifyToken, attendanceController.getTodayAttendances)
routerAttendance.get("/attendance-log", authMiddleware.verifyToken, attendanceController.getAttendanceLog)
routerAttendance.get("/one-year-attendance", authMiddleware.verifyToken, attendanceController.getAllAttendance)
routerAttendance.get("/todays-log", authMiddleware.verifyToken, attendanceController.getTodaysLog)

module.exports = routerAttendance