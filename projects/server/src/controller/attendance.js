const db = require("../../models")
const dayjs = require("dayjs")

const clockIn = async(req,res) => {
    const userId = req.user.id
    const clockIn = req.query.clockIn

    try{
    const newAttendance = await db.Attendance.create({
        userId: userId,
        clockIn: clockIn,
        clockOut: "",
        date: dayjs(),
        status: "halfDayDeduction"
    })
    
    res.status(200).send({
        message:"You have clocked In",
        data: newAttendance
    })
    }catch(error){
        res.status(500).send({
            message: "server error",
            error: error.message
        })
    }
}

const clockOut = async(req,res) => {
    const userId = req.user.id
    const clockOut = req.query.clockOut

    try{
        const userData = await db.Attendance.findOne({where:
        {
            userId: userId,
            date: dayjs()
        }})

        if(!userData) {
            return res.status(400).send({
                message:"Attendance log not found"
            })
        }

        userData.clockOut = clockOut
        userData.status = "complete"
        await userData.save()

        res.status(200).send({
            message:"You have clocked out",
            data: userData
        })
    }catch(error){
        res.status(500).send({
            message: "server error",
            error: error.message
        })
    }
}

module.exports = {
    clockIn, clockOut
}