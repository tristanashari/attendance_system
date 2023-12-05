const db = require("../../models")
const transporter = require("../helpers/transporter")
const bcrypt = require("bcryptjs")
const dayjs = require("dayjs")
const jwt = require("jsonwebtoken")
const handlebars = require("handlebars")
const fs = require("fs")
const crypto = require("crypto")


const secretKey = process.env.JWT_SECRET_KEY

const addNewEmployee = async(req,res) => {
    const transaction = await db.sequelize.transaction()
    try{
    const {email, salary} = req.body
    
    const isEmailExist = await db.User.findOne({where: {email}})
    if(isEmailExist) {
        await transaction.rollback()
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
        transaction
    })

    await db.Salary.create({
        userId: newUser.id,
        salary: Number(salary)
    }, {
        transaction
    })

    await transaction.commit()

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

    return res.status(200).send({
        message: "New Employee Registered"
    })
    }catch(error){
        await transaction.rollback()
        return res.status(500).send({
            message: "server error",
            error: error.message
        })
    }
}

const setPassword = async(req,res) => {
    const {fullName, dateOfBirth, password, confirmPassword} = req.body
    const token = req.query.token
    const transaction = await db.sequelize.transaction() 

    try{
        const userData = await db.User.findOne({where: {
            setPasswordToken: token
        }})

        if(!userData){
            await transaction.rollback()
            return res.status(400).send({
                message: "No User Found"
            })
        }

        if(confirmPassword !== password){
            await transaction.rollback()
            return res.status(400).send({
                message: "Password doesn't match"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)

        if (fullName) {userData.fullName = fullName}
        if (dateOfBirth) {userData.dateOfBirth = dateOfBirth}
        if (hashPassword) {userData.password = hashPassword}
        userData.setPasswordToken = null
        
        await transaction.commit()
        await userData.save()

        return res.status(200).send({
            message:"Successfully set password"
        })
    }catch(error){
        await transaction.rollback()
        return res.status(500).send({
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
                message:"Login failed. Please input your registered email or password"
            })
        }

        const isValid = await bcrypt.compare(password, userData.password)
        if(!isValid){
            return res.status(400).send({
                message: "Login failed. Please input your registered email or password"
            })
        }

        const payload = { id: userData.id, role:userData.roleId}
        const token = jwt.sign(payload, secretKey, {
            expiresIn: "1h"
        })

        const loggedInUser = await db.User.findOne({
            where: {
                email: email
            },
            attributes: {
                exclude: [
                    "id",
                    "password",
                    "setPasswordToken",
                    "createdAt",
                    "updatedAt"
                ]
            }
        })

        return res.status(200).send({
            message: "You are logged in",
            data: loggedInUser,
            accessToken: token
        })
    }catch(error){
        return res.status(500).send({
            message: "server error",
            error: error.message
        })
    }
}

const keepLogin = async(req,res) => {
    const userId = req.user.id
    try{
        const userData = await db.User.findOne({
            where: {
                id: userId
            }
        })
        const payload = {
            id: userData.id,
            role: userData.roleId
        }
        const refreshToken = jwt.sign(payload, secretKey, {
            expiresIn: "30m"
        })

        return res.status(200).send({
            message: "This is your refresh token",
            userId: userId,
            refreshToken: refreshToken
        })
    }catch(error){
        return res.status(500).send({
            message: "Server Error",
            error: error.message
        })
    }
}

module.exports = {
    addNewEmployee, setPassword, login, keepLogin
}