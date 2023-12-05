require("dotenv/config");
const express = require("express");
const cors = require("cors");
const { join } = require("path");
const cron = require("node-cron")
const db = require("../models")

const userRoutes = require("./routes/user")
const attendanceRoutes = require("./routes/attendance");
const salaryRoutes = require("./routes/salary")
const authRoutes = require("./routes/auth")
const dayjs = require("dayjs");

const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors());

app.use(express.json());

const createAttendanceLog = async() => {
  try{
    const users = await db.User.findAll({
      where: {
        roleId: 2
      }
    })
    const currentDate = dayjs()

    for(const user of users){
      await db.Attendance.create({
        userId: user.id,
        clockIn: "",
        clockOut: "",
        date: currentDate,
        status: "Full Day Salary Cut"
      })
    }
  } catch(error){
    console.log(error)
  }
}

cron.schedule('16 12 * * *', createAttendanceLog)

//#region API ROUTES
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", attendanceRoutes)
app.use("/api", salaryRoutes)
// ===========================
// NOTE : Add your routes here

app.get("/api", (req, res) => {
  res.send(`Hello, this is my API`);
});

app.get("/api/greetings", (req, res, next) => {
  res.status(200).json({
    message: "Hello, Student !",
  });
});

// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(500).send("Error !");
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
