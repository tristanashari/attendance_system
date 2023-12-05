const db = require("../../models")
const dayjs = require("dayjs")

const clockIn = async(req,res) => {
    const userId = req.user.id
    const clockIn = req.query.clockIn
    const transaction = await db.sequelize.transaction()

    try{
    const userData = await db.Attendance.findOne({where: {
        userId: userId,
        date: dayjs(),
    }})

    if(!userData) {
        await transaction.rollback()
        return res.status(400).send({
            message:"Attendance log not found"
        })
    }

    userData.clockIn = clockIn
    userData.status = "Half Day Salary Cut"
    await transaction.commit()
    await userData.save()
    
    return res.status(200).send({
        message:"You have clocked In",
        data: userData
    })
    }catch(error){
        await transaction.rollback()
        return res.status(500).send({
            message: "server error",
            error: error.message
        })
    }
}

const clockOut = async(req,res) => {
    const userId = req.user.id
    const clockOut = req.query.clockOut
    const transaction = await db.sequelize.transaction()

    try{
        const userData = await db.Attendance.findOne({where:
        {
            userId: userId,
            date: dayjs()
        }})

        if(!userData) {
            await transaction.rollback()
            return res.status(400).send({
                message:"Attendance log not found"
            })
        }

        userData.clockOut = clockOut
        userData.status = "Present"
        await transaction.commit()
        await userData.save()

        return res.status(200).send({
            message:"You have clocked out",
            data: userData
        })
    }catch(error){
        await transaction.rollback()
        return res.status(500).send({
            message: "server error",
            error: error.message
        })
    }
}

const getAttendanceLog = async(req,res) => {
    const currentDate = dayjs();
    const oneMonthPrior = currentDate.subtract(1, "month").format("YYYY-MM-DD");
    const pagination = {
        page: Number(req.query.page) || 1,
        perPage: 12,
        startDate: req.query.startDate ? req.query.startDate = dayjs(req.query.startDate).format("YYYY-MM-DD") : oneMonthPrior,
        endDate: req.query.endDate ? req.query.endDate = dayjs(req.query.endDate).format("YYYY-MM-DD") : currentDate.format("YYYY-MM-DD"),
        status: req.query.status || undefined,
        sortBy: req.query.sortBy || "DESC",
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
          if (pagination.sortBy) {
            if (pagination.sortBy.toUpperCase() === "DESC") {
              order.push(["date", "DESC"]);
            } else {
              order.push(["date", "ASC"]);
            }
          }
      
        const attendanceData = await db.Attendance.findAndCountAll({
            where,
            order,
            limit: pagination.perPage,
            offset: (pagination.page - 1) * pagination.perPage,
        })

        const totalLogs = attendanceData.count
        pagination.totalData = totalLogs

        if(!attendanceData){
            return res.status(400).send({
                message: "Attendance Log Not Found"
            })
        }
        res.status(200).send({
            message: "Here is your attendance log",
            pagination,
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

const getTodayAttendances = async(req,res) => {
    const pagination = {
        page: Number(req.query.page) || 1,
        perPage: 12,
        search: req.query.search || "",
        status: req.query.filterStatus || "",
        sortBy: req.query.sort || "ASC"
    }
    const today = dayjs().format("YYYY-MM-DD")
    const startOfDay = dayjs(today).startOf("day").toISOString();
    const endOfDay = dayjs(today).endOf("day").toISOString();
    try{
        const where = {}
        const whereAttendance = {}
        const order = []

        if(pagination.search) {
            where["fullName"] = {
                [db.Sequelize.Op.like]: `%${pagination.search}%`
            }
        }
        if(pagination.status) {
            whereAttendance["status"] = pagination.status
        }
        if (pagination.sortBy) {
            if (pagination.sortBy.toUpperCase() === "DESC") {
              order.push(["fullName", "DESC"]);
            } else {
              order.push(["fullName", "ASC"]);
            }
          }
        const result = await db.User.findAndCountAll({
            where: {
                roleId: 2
            },
            attributes: {
                exclude: ["password", "setPasswordToken", "createdAt", "updatedAt"]
            },
            include:[
                {
                    model: db.Attendance,
                    where: {
                        date: {
                            [db.Sequelize.Op.between]: [startOfDay, endOfDay],   
                        },
                        ...whereAttendance
                    },
                }
            ],
            where,
            order,
            limit: pagination.perPage,
            offset: (pagination.page - 1) * pagination.perPage,
        })
        if(!result){
            return res.status(400).send({
                message: "No User Found"
            })
        }

        const totalCount = result.count
        pagination.totalData = totalCount

        return res.status(200).send({
            message: "Success get today's attendance",
            pagination,
            data: result
        })
    }catch(error){
        return res.status(500).send({
            message: "Server error",
            error: error.message
        })
    }
}

const getTodaysLog = async(req,res) => {
    const userId = req.user.id
    try{
        const todaysLog = await db.Attendance.findOne({
            where: {
                userId: userId,
                date: dayjs(),
            }
        })
        if(!todaysLog){
            return res.status(400).send({
                message: "Attendance Log Not Found"
            })
        }
        
        return res.status(200).send({
            message: "Today's Log",
            data: todaysLog
        })

    }catch(error){
        return res.status(500).send({
            message: "Server Error",
            error: error.message
        })
    }
}
module.exports = {
    clockIn, clockOut, getAttendanceLog, getAllAttendance, getTodayAttendances, getTodaysLog
}