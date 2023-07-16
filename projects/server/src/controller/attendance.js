const db = require("../../models")
const dayjs = require("dayjs")

const clockIn = async(req,res) => {
    const userId = req.user.id
    const clockIn = req.query.clockIn

    try{
    const userData = await db.Attendance.findOne({where: {
        userId: userId,
        date: dayjs(),
    }})

    if(!userData) {
        return res.status(400).send({
            message:"Attendance log not found"
        })
    }

    userData.clockIn = clockIn
    userData.status = "Half Day Salary Cut"
    await userData.save()
    
    res.status(200).send({
        message:"You have clocked In",
        data: userData
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
        userData.status = "Present"
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

const getAttendance = async(req,res) => {
    const currentDate = dayjs();
    const oneMonthPrior = currentDate.subtract(1, "month").format("YYYY-MM-DD");
    const pagination = {
        page: Number(req.query.page) || 1,
        perPage: 10,
        startDate: req.query.startDate ? req.query.startDate = dayjs(req.query.startDate).format("YYYY-MM-DD") : oneMonthPrior,
        endDate: req.query.endDate ? req.query.endDate = dayjs(req.query.endDate).format("YYYY-MM-DD") : currentDate.format("YYYY-MM-DD"),
        status: req.query.status || undefined,
        sortBy: req.query.sortBy || "desc",
      };

    const userId = req.user.id
    try{
        const where = {
            userId: userId,
            date: {
                [db.Sequelize.Op.between]: [pagination.startDate, pagination.endDate]
            }
          };
          if (pagination.status) {
            where.status = {
              [db.Sequelize.Op.like]: `%${pagination.status}%`,
            };
          }
      
          const order = [];
          for (const sort in pagination.sortBy) {
            order.push([sort, pagination.sortBy[sort]]);
          }
      
        const attendanceData = await db.Attendance.findAll({
            where,
            limit: pagination.perPage,
            offset: (pagination.page - 1) * pagination.perPage,
            order,
        })

        const totalLogs = await db.Attendance.count({ where });

        if(!attendanceData){
            return res.status(400).send({
                message: "Attendance Log Not Found"
            })
        }
        res.status(200).send({
            message: "Here is your attendance log",
            pagination: {
                ...pagination,
                totalData: totalLogs,
              },
            data: attendanceData,
        })

    }catch(error){
        res.status(500).send({
            message: "server error",
            error: error.message
        })
    }
}

const getAllAttendance = async(req,res) => {
    const currentDate = dayjs();
    const endDate = currentDate.format("YYYY-MM-DD")
    const startDate = currentDate.subtract(1, "year").format("YYYY-MM-DD");

    const userId = req.user.id
    try{
        const attendanceData = await db.Attendance.findAll({where: {
            userId: userId,
            date: {
                [db.Sequelize.Op.between]: [startDate, endDate]
            }
        }  
        })

        if(!attendanceData){
            return res.status(400).send({
                message: "Attendance Log Not Found"
            })
        }
        res.status(200).send({
            message: "Here is your attendance log",
            data: attendanceData,
        })

    }catch(error){
        res.status(500).send({
            message: "server error",
            error: error.message
        })
    }
}
module.exports = {
    clockIn, clockOut, getAttendance, getAllAttendance
}