const db = require("../../models")
const transporter = require("../helpers/transporter")
const bcrypt = require("bcryptjs")
const dayjs = require("dayjs")
const jwt = require("jsonwebtoken")
const handlebars = require("handlebars")
const fs = require("fs")
const crypto = require("crypto")


const secretKey = process.env.JWT_SECRET_KEY

const employeeRegistration = async(req,res) => {
    const t = await db.sequelize.transaction()
    try{
    const {email, salary} = req.body
    const isEmailExist = await db.User.findOne({where: {email}})

    if(isEmailExist) {
        await t.rollback()
        return res.status(400).send({
            message: "email already used"
        })
    }

    const setPasswordToken = crypto.randomBytes(16).toString("hex")

    const newUser = await db.User.create({
        roleId: 2,
        email: email,
        setPasswordToken
    }, {
        transaction: t
    })

    const data = await db.User.findOne({
        where: { email: email },
    });
  
    if (data) {
        await t.rollback();
        return res.status(400).send({
          message: "account already exist",
        });
    }

    await db.Salary.create({
        userId: newUser.id,
        salary: Number(salary)
    }, {
        transaction: t
    })

    await t.commit()

    const link = `${process.env.BASEPATH_FE}/set-password/${setPasswordToken}`
    const template = fs.readFileSync("./src/template/setpassword.html", "utf-8")
    const templateCompile = handlebars.compile(template)
    const registerEmail = templateCompile({link})

    await transporter.sendMail({
        from: "Attendee",
        to: email,
        subject: "Set Your Attendee Account Password",
        html: registerEmail
    })

    res.status(200).send({
        message: "New Employee Registered"
    })
    }catch(error){
        res.status(500).send({
            message: "server error",
            error: error.message
        })
    }
}

const setPassword = async(req,res) => {
    const {fullName, dateOfBirth, password} = req.body
    const token = req.query.token
    console.log(token)

    try{
        const userData = await db.User.findOne({where: {
            setPasswordToken: token
        }})

        if(!userData){
            return res.status(400).send({
                message: "invalid token"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)

        if (fullName) {userData.fullName = fullName}
        if (dateOfBirth) {userData.dateOfBirth = dayjs(dateOfBirth)}
        if (hashPassword) {userData.password = hashPassword}
        userData.setPasswordToken = null
        await userData.save()

        res.status(200).send({
            message:"Successfully set password"
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            message:"server error",
            error: error.message
        })
    }

}

const login = async(req,res) => {
    const {email, password} = req.body

    try{
        const userData = await db.User.findOne({
            where: {
                email: email
            }
        })

        if(!userData){
            return res.status(400).send({
                message:"Login failed. Email not found"
            })
        }

        const isValid = await bcrypt.compare(password, userData.password)
        if(!isValid){
            return res.status(400).send({
                message: "Login failed. Incorrect Password"
            })
        }

        const payload = { id: userData.id, role:userData.roleId}
        const token = jwt.sign(payload, secretKey, {
            expiresIn: "24h"
        })

        res.status(200).send({
            message: "You are logged in",
            data: userData,
            accessToken: token
        })
        

    }catch(error){
        res.status(500).send({
            message: "server error",
            error: error.message
        })
    }
}

module.exports = {
    employeeRegistration, setPassword, login
}